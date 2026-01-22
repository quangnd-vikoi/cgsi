# Data Initialization Pattern

## Overview

This document describes the data initialization architecture for critical user data (Profile & Trading Accounts) in the iTrade Portal application.

## Architecture Pattern

### Problem Statement
- **User Profile** data (name, email, mobile) is needed across multiple components
- **Trading Accounts** data (accountNo) is used everywhere in the app
- Need to fetch these critical data sets **once** when user enters the app
- Avoid duplicate API calls from multiple components
- Share data globally via Zustand stores

### Solution: DataInitializer Component

Similar to `NotificationPolling`, we use a **DataInitializer** component that:
1. Fetches critical data on app mount
2. Stores data in Zustand for global access
3. Prevents duplicate fetches with initialization flags

## Implementation

### 1. DataInitializer Component

**Location**: `components/DataInitializer.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { getUserProfile, getUserAccounts } from "@/lib/services/profileService";

/**
 * Fetches critical user data on app mount:
 * 1. User Profile (name, email, mobile, etc.)
 * 2. Trading Accounts (accountNo is used everywhere)
 */
export function DataInitializer() {
  const profile = useUserStore((state) => state.profile);
  const tradingAccountsInitialized = useTradingAccountStore((state) => state.isInitialized);

  // Fetch user profile on mount (if not already loaded)
  useEffect(() => {
    if (!profile) {
      getUserProfile(); // Auto-syncs to userStore
    }
  }, []);

  // Fetch trading accounts on mount (if not already loaded)
  useEffect(() => {
    if (!tradingAccountsInitialized) {
      fetchTradingAccounts();
    }
  }, []);

  return null; // No UI
}
```

### 2. Layout Integration

**Location**: `app/(with-layout)/layout.tsx`

```typescript
import { NotificationPolling } from "@/components/NotificationPolling";
import { DataInitializer } from "@/components/DataInitializer";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NotificationPolling />
      <DataInitializer />  {/* ← Initialize data on mount */}

      <header>
        <Header />
        <SheetManager />
      </header>

      <main>{children}</main>
    </div>
  );
}
```

### 3. Zustand Stores

#### userStore.ts

```typescript
interface UserState {
  profile: IUserProfile | null;
  email: string;
  mobile: string;

  setProfile: (profile: IUserProfile) => void;
  getProfile: () => IUserProfile | null;
  clearProfile: () => void;
}
```

**Key fields in IUserProfile:**
- `profileId`, `userId`, `name`
- `email`, `mobileNo`, `mobileNoForSms`
- `ic`, `homeNo`, `officeNo`

#### tradingAccountStore.ts

```typescript
interface TradingAccountStore {
  accounts: TradingAccount[];
  selectedAccount: TradingAccount | null;
  isInitialized: boolean;

  setAccounts: (accounts: TradingAccount[]) => void;
  setSelectedAccount: (account: TradingAccount | null) => void;
  getAccountById: (accountNo: string) => TradingAccount | undefined;
}
```

### 4. Profile Service Auto-Sync

**Location**: `lib/services/profileService.ts`

```typescript
export const getUserProfile = async (): Promise<APIResponse<UserProfileResponse>> => {
  const response = await fetchAPI<UserProfileResponse>(
    ENDPOINTS.profile(),
    { useAuth: true }
  );

  if (response.success && response.data) {
    const { setProfile } = useUserStore.getState();
    setProfile(response.data); // ← Auto-sync to store
  }

  return response;
};
```

**Key Point**: `getUserProfile()` automatically syncs data to `userStore`, so you don't need to manually call `setProfile()`.

## Component Usage Patterns

### Pattern 1: Read from Store (Most Common)

Components simply read data from Zustand stores:

```typescript
// Profile.tsx - Display user info
import { useUserStore } from "@/stores/userStore";

const ProfileInfo = () => {
  const profile = useUserStore((state) => state.profile);

  return (
    <div>
      <p>{profile?.name || profile?.userId}</p>
      <p>{profile?.email}</p>
      <p>{profile?.mobileNo}</p>
    </div>
  );
};
```

```typescript
// TradingAccounts.tsx - Display accounts list
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

const TradingAccounts = () => {
  const accounts = useTradingAccountStore((state) => state.accounts);
  const isInitialized = useTradingAccountStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {accounts.map(account => (
        <AccountCard key={account.accountNo} account={account} />
      ))}
    </div>
  );
};
```

### Pattern 2: Refresh After Update

Update forms should refresh profile data after successful submission:

```typescript
// update-mobile/page.tsx, update-email/page.tsx
import { refreshUserProfile } from "@/lib/services/profileService";

const handleSubmit = async () => {
  const response = await submitMobileUpdate(transactionId, otp);

  if (response.success) {
    await refreshUserProfile(); // ← Refresh store data
    setStep(3); // Show success
  }
};
```

## Data Flow Diagram

```
User enters app
    ↓
Layout mounts
    ↓
DataInitializer runs
    ↓
┌─────────────────────────────────────┐
│ Fetch User Profile                   │
│ GET /profile/api/v1/internal/profile │ → userStore.setProfile()
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Fetch Trading Accounts               │
│ GET /profile/api/v1/accounts         │ → tradingAccountStore.setAccounts()
└─────────────────────────────────────┘
    ↓
All components can now read from stores
    ↓
┌────────────────────────────────────┐
│ Profile.tsx                         │ ← useUserStore()
│ UserProfile.tsx                     │ ← useUserStore()
│ TradingAccounts.tsx                 │ ← useTradingAccountStore()
│ Portfolio pages                     │ ← useTradingAccountStore()
│ Market Data pages                   │ ← useTradingAccountStore()
│ Donation pages                      │ ← useTradingAccountStore()
└────────────────────────────────────┘
```

## Benefits

### ✅ Single Source of Truth
- Profile and trading accounts stored in Zustand
- No duplicate API calls
- Consistent data across all components

### ✅ Automatic Initialization
- Data fetched as soon as user enters app
- No manual fetch needed in individual components
- Components can immediately access data from store

### ✅ Type-Safe
- Full TypeScript support
- Zustand provides type inference
- API responses validated via `IUserProfile` and `TradingAccount` types

### ✅ Performance
- Data cached in memory (Zustand)
- No prop drilling
- Minimal re-renders (Zustand selector optimization)

### ✅ Maintainable
- Clear separation: DataInitializer fetches, components consume
- Easy to add new initialization logic
- Follows established NotificationPolling pattern

## Best Practices

### DO ✅

1. **Read from store in components**
   ```typescript
   const profile = useUserStore((state) => state.profile);
   ```

2. **Refresh after updates**
   ```typescript
   await refreshUserProfile(); // After email/mobile update
   ```

3. **Check initialization state**
   ```typescript
   if (!isInitialized) return <Loading />;
   ```

4. **Use selector optimization**
   ```typescript
   const email = useUserStore((state) => state.profile?.email);
   // Only re-renders when email changes
   ```

### DON'T ❌

1. **Don't fetch in components** (data already loaded)
   ```typescript
   // ❌ BAD
   useEffect(() => {
     getUserProfile(); // Unnecessary!
   }, []);
   ```

2. **Don't prop drill profile data**
   ```typescript
   // ❌ BAD
   <Component profile={profile} />

   // ✅ GOOD
   // Component reads from useUserStore() directly
   ```

3. **Don't create duplicate stores**
   ```typescript
   // ❌ BAD
   const [profile, setProfile] = useState(null);

   // ✅ GOOD
   const profile = useUserStore((state) => state.profile);
   ```

## Troubleshooting

### Problem: Profile/Accounts not loading

**Check:**
1. Is `DataInitializer` imported in layout?
2. Are you authenticated? (APIs require Bearer token)
3. Check browser console for API errors
4. Verify API endpoints in Network tab

### Problem: Stale data after update

**Solution:**
```typescript
// Call refreshUserProfile() after successful update
await refreshUserProfile();
```

### Problem: Component shows old data

**Check:**
1. Are you reading from store?
   ```typescript
   const profile = useUserStore((state) => state.profile);
   ```
2. Not from local state?
   ```typescript
   const [profile] = useState(...); // ❌ Wrong!
   ```

## Related Files

**Core Implementation:**
- `components/DataInitializer.tsx` - Main initialization component
- `app/(with-layout)/layout.tsx` - Layout integration
- `stores/userStore.ts` - User profile store
- `stores/tradingAccountStore.ts` - Trading accounts store
- `lib/services/profileService.ts` - API service layer

**Usage Examples:**
- `app/(minimal)/sidebar/Profile.tsx` - Profile display
- `app/(minimal)/sidebar/UserProfile.tsx` - Profile form
- `app/(minimal)/sidebar/TradingAccounts.tsx` - Accounts list
- `app/(with-layout)/(detail)/update-mobile/page.tsx` - Mobile update
- `app/(with-layout)/(detail)/update-email/page.tsx` - Email update

**API Documentation:**
- `lib/api/endpoints/profile.ts` - Profile API endpoints
- `types/index.ts` - TypeScript interfaces
- `docs/flows/profile-api-implementation-plan.md` - API integration plan

## Migration from Hardcoded Data

### Before (Hardcoded)
```typescript
const Profile = () => {
  return (
    <div>
      <p>rayhanabhirama28</p>
      <p>rayhan.abhir@gmail.com</p>
      <p>+62 81234567899</p>
    </div>
  );
};
```

### After (Store-based)
```typescript
const Profile = () => {
  const profile = useUserStore((state) => state.profile);

  return (
    <div>
      <p>{profile?.userId || profile?.name}</p>
      <p>{profile?.email}</p>
      <p>{profile?.mobileNo}</p>
    </div>
  );
};
```

## Future Enhancements

### Possible Additions:
1. **Error handling**: Show error UI if initialization fails
2. **Retry logic**: Auto-retry failed requests
3. **Loading states**: Global loading indicator during initialization
4. **Cache invalidation**: Refresh data on tab focus/online events
5. **Optimistic updates**: Update UI before API confirms
6. **Offline support**: Cache data in localStorage/IndexedDB

### Example: Error Handling
```typescript
export function DataInitializer() {
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      if (!response.success) {
        setError(response.error);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  if (error) {
    return <ErrorBoundary message={error} />;
  }

  return null;
}
```

## Conclusion

The DataInitializer pattern provides a clean, efficient way to load critical user data once on app mount and share it globally via Zustand stores. This architecture:

- Eliminates duplicate API calls
- Provides consistent data across all components
- Maintains type safety with TypeScript
- Follows React best practices
- Scales well as the application grows

By centralizing data initialization, we ensure a better user experience with faster page loads and consistent state management throughout the application.
