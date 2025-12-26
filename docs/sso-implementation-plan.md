# SSO Integration Implementation Plan

## Overview

Implementation plan for integrating SSO (Single Sign-On) authentication system with the CGSI iTrade Portal based on the SSO Integration Guide.

**Status:** In Progress
**Last Updated:** 2025-12-17

---

## Implementation Checklist

### ✅ Completed Tasks

#### 1. Core Authentication Service (`lib/services/authService.ts`)
- [x] Token management interfaces (TokenResponse, TokenRequest, RefreshTokenRequest)
- [x] Storage helpers (storeTokens, clearTokens, getStoredAccessToken, etc.)
- [x] Exchange authorization code for tokens (`exchangeCode`)
- [x] Refresh access token logic (`refreshAccessToken`)
- [x] Token validation utilities (`isTokenExpired`, `shouldRefreshToken`)
- [x] Authentication status check (`isAuthenticated`)
- [x] Login/logout redirects (`redirectToLogin`, `logout`)
- [x] Browser environment checks

**File:** `lib/services/authService.ts:1-203`

#### 2. Authentication Endpoints (`lib/api/endpoints/auth.ts`)
- [x] Token exchange endpoint (`/sso/api/v1/token`)
- [x] Token refresh endpoint (`/sso/api/v1/token/refresh`)

**File:** `lib/api/endpoints/auth.ts:1-17`

#### 3. API Client Foundation (`lib/api/client.ts`)
- [x] Base fetch wrapper with error handling (`fetchAPI`)
- [x] Cached GET requests (`fetchWithCache`)
- [x] POST/PUT/DELETE helpers
- [x] Standardized response format (APIResponse)

**File:** `lib/api/client.ts:1-111`

#### 4. API Configuration (`lib/api/config.ts`)
- [x] API base URLs (iTrade Portal, Content API)
- [x] Language constants (EN, CN)
- [x] Base URL helper function (`withBaseUrl`)

**File:** `lib/api/config.ts:1-24`

---

### ❌ Pending Tasks

#### 5. Authentication Interceptor for API Client
**Priority:** HIGH
**Status:** Not Started

Update `lib/api/client.ts` to automatically include authentication headers and handle token refresh.

**Required Changes:**
- [ ] Create `fetchWithAuth` function that:
  - Checks if token should be refreshed before API call
  - Automatically adds `Authorization: Bearer <token>` header
  - Handles 401 responses by refreshing token and retrying
  - Redirects to login if refresh fails
- [ ] Update `postAPI`, `putAPI`, `deleteAPI` to use auth when needed
- [ ] Add option to bypass auth for public endpoints

**Implementation Reference:**
See SSO_INTEGRATION_GUIDE.md lines 462-518

**Estimated Effort:** 2-3 hours

---

#### 6. Authorization Callback Page
**Priority:** HIGH
**Status:** Not Started

Create the `/authorize` callback page to handle SSO redirects.

**Required:**
- [ ] Create `app/(with-layout)/authorize/page.tsx` or `app/authorize/page.tsx`
- [ ] Extract authorization code, timestamp, and state from URL params
- [ ] Validate state parameter (CSRF protection)
- [ ] Call `authService.exchangeCode()` to exchange code for tokens
- [ ] Handle success: redirect to intended page or home
- [ ] Handle errors: show error message with retry button
- [ ] Add loading state with spinner

**Implementation Reference:**
See SSO_INTEGRATION_GUIDE.md lines 522-601

**Estimated Effort:** 2-3 hours

---

#### 7. Protected Route Middleware
**Priority:** MEDIUM
**Status:** Not Started

Add authentication check for protected routes.

**Required:**
- [ ] Create middleware to check authentication status
- [ ] Redirect unauthenticated users to SSO login
- [ ] Store intended path for post-login redirect
- [ ] Handle public vs protected routes

**Location:** `middleware.ts` (root level)

**Estimated Effort:** 1-2 hours

---

#### 8. Update Existing API Calls
**Priority:** MEDIUM
**Status:** Not Started

Update existing API calls to use authentication.

**Files to Update:**
- [ ] `lib/api/endpoints/notifications.ts` - use `fetchWithAuth`
- [ ] `lib/api/endpoints/content.ts` - determine which need auth
- [ ] Any other API endpoint files

**Estimated Effort:** 1-2 hours

---

#### 9. Logout Functionality
**Priority:** MEDIUM
**Status:** Not Started

Integrate logout functionality into UI.

**Required:**
- [ ] Add logout button to Header or User menu
- [ ] Call `authService.logout()` on click
- [ ] Clear all session storage
- [ ] Redirect to old portal logout page

**Estimated Effort:** 1 hour

---

#### 10. Error Handling & User Feedback
**Priority:** MEDIUM
**Status:** Not Started

Improve error handling and user experience.

**Required:**
- [ ] Add toast notifications for auth errors
- [ ] Handle network failures gracefully
- [ ] Show loading states during token refresh
- [ ] Add session timeout warning (optional)

**Estimated Effort:** 2 hours

---

#### 11. State Management for OAuth Flow
**Priority:** LOW
**Status:** Not Started

Implement CSRF protection with state parameter.

**Required:**
- [ ] Generate random state parameter before redirect
- [ ] Store state in sessionStorage
- [ ] Validate state on callback
- [ ] Store intended path for post-login redirect

**Estimated Effort:** 1 hour

---

#### 12. Testing & Validation
**Priority:** HIGH
**Status:** Not Started

End-to-end testing of SSO flow.

**Test Cases:**
- [ ] Manual test: Full login flow with test credentials
- [ ] Test: Authorization code exchange
- [ ] Test: API calls with access token
- [ ] Test: Token refresh on expiry
- [ ] Test: Logout flow
- [ ] Test: Invalid/expired authorization code handling
- [ ] Test: 401 error handling and retry logic
- [ ] Test: CSRF state validation

**Test Credentials:**
- User ID: `GRACE6388`
- Password: `Cgs#1234`
- Environment: Staging (https://stgitrade.cgsi.com.sg)

**Estimated Effort:** 3-4 hours

---

## Implementation Priority Order

### Phase 1: Core Authentication Flow (HIGH)
1. ✅ Authentication service (COMPLETED)
2. ❌ Authentication interceptor for API client
3. ❌ Authorization callback page
4. ❌ Testing basic flow

### Phase 2: Integration (MEDIUM)
5. ❌ Protected route middleware
6. ❌ Update existing API calls
7. ❌ Logout functionality

### Phase 3: Polish & Security (MEDIUM-LOW)
8. ❌ Error handling & user feedback
9. ❌ OAuth state management
10. ❌ Comprehensive testing

---

## Current Architecture

### File Structure
```
lib/
├── services/
│   └── authService.ts          ✅ DONE - Complete auth service
├── api/
│   ├── client.ts              ✅ DONE - Base API client (needs auth interceptor)
│   ├── config.ts              ✅ DONE - API configuration
│   ├── types.ts               ✅ DONE - Type definitions
│   └── endpoints/
│       ├── auth.ts            ✅ DONE - Auth endpoints
│       ├── notifications.ts   ⚠️  TODO - Add auth
│       └── content.ts         ⚠️  TODO - Review auth needs

app/
└── authorize/
    └── page.tsx               ❌ TODO - Create callback page

middleware.ts                  ❌ TODO - Create protected route check
```

### Authentication Flow
1. User redirected to SSO login → `https://stgitrade.cgsi.com.sg/app/user.login.z`
2. After 2FA, redirected back with code → `/authorize?code=xxx&state=xxx`
3. Callback page exchanges code for tokens → `authService.exchangeCode()`
4. Tokens stored in sessionStorage
5. API calls include `Authorization: Bearer <token>` header
6. Token auto-refreshes 5 minutes before expiry
7. On logout, tokens cleared and redirect to SSO logout

---

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://stgitrade.cgsi.com.sg/portal
NEXT_PUBLIC_SSO_CLIENT_ID=itrade
NEXT_PUBLIC_OLD_PORTAL_URL=https://stgitrade.cgsi.com.sg/app
```

**Status:** ❌ Not configured yet

---

## Known Issues & Considerations

### Security
- ⚠️ Currently using sessionStorage (OK for staging, consider httpOnly cookies for production)
- ⚠️ State parameter validation not yet implemented (CSRF protection)
- ⚠️ Need to review token storage security for production

### UX
- ⚠️ No loading state during authentication
- ⚠️ No error messages for failed auth
- ⚠️ No session timeout warning

### Technical Debt
- Consider using React Context or Zustand for auth state instead of direct sessionStorage access
- Add retry logic for network failures
- Implement request queuing during token refresh to avoid race conditions

---

## Next Steps (Immediate)

1. **Implement Authentication Interceptor** (2-3 hours)
   - Update `lib/api/client.ts` with `fetchWithAuth` function
   - Add automatic token refresh and retry logic

2. **Create Authorization Callback Page** (2-3 hours)
   - Create `app/authorize/page.tsx`
   - Handle code exchange and redirects

3. **Test Basic Flow** (1-2 hours)
   - Manual testing with test credentials
   - Verify token exchange and API calls work

4. **Add Protected Route Middleware** (1-2 hours)
   - Create `middleware.ts`
   - Protect authenticated routes

---

## Resources

- **SSO Integration Guide:** `docs/SSO_INTEGRATION_GUIDE.md`
- **Auth Service:** `lib/services/authService.ts`
- **API Client:** `lib/api/client.ts`
- **Test Login:** https://stgitrade.cgsi.com.sg/app/user.login.z
- **Test Credentials:** GRACE6388 / Cgs#1234
