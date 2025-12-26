# Profile API Implementation Plan

## Overview
This document outlines the implementation plan for integrating the Profile APIs (version 0.0.1-SNAPSHOT) into the CGSI iTrade Portal Next.js application.

**API Base URLs:**
- UAT: `https://stgitrade.cgsi.com.sg/portal`
- DEV: `https://sititrade.cgsi.com.sg/portal`
- Local: `http://localhost:20002`

**Authentication:**
- All authenticated endpoints require `Bearer Token` in Authorization header

---

## Implementation Steps

### 1. TypeScript Type Definitions
Create type definitions for all API request/response schemas.

**File:** `types/profile-api.ts`

**Types to Define:**
- `CreateBcanRequest` / `CreateBcanResponse`
- `DonationSubmissionRequest` / `DonationSubmissionResponse`
- `DonationCancelRequest` / `DonationCancelResponse`
- `DonationPlanResponse`
- `TrInfoResponse` (Trading Representative Info)
- `UserProfileResponse`
- `UserAccountResponse`
- `ContactUsClientServiceResponse`
- `ContactUsCentralDealingDeskResponse`

---

### 2. API Configuration Updates
Update API configuration to support Profile API endpoints.

**File:** `lib/apiConfig.ts`

**Changes:**
- Add Profile API base path constant
- Create endpoint builders for:
  - Trading Info (BCAN)
  - Donations (submission, cancellation, plan retrieval)
  - Trading Representative Info
  - User Profile
  - User Accounts
  - Contact Us endpoints

---

### 3. API Integration Functions
Create wrapper functions for Profile API calls using the existing `fetchWrapper` pattern.

**File:** `lib/profileAPI.ts` (new file)

**Functions to Implement:**

**User Profile & Accounts:**
- `getUserProfile(profileId: string)` - Get user profile information
- `getUserAccounts(profileId: string)` - Get user trading accounts
- `getTradingRepInfo(profileId: string)` - Get trading representative information

**BCAN Management:**
- `createBcanRequest(profileId: string, accountNo: string)` - Create BCAN request

**Donation Management:**
- `submitDonation(profileId: string, data: DonationSubmissionRequest)` - Submit donation
- `cancelDonation(profileId: string, donationId: number)` - Cancel donation
- `getDonationPlan(profileId: string)` - Get active donation plans

**Contact Information:**
- `getClientServiceContact()` - Get client service contact info (no auth required)
- `getCentralDealingDeskContact()` - Get central dealing desk contact info (no auth required)

**Internal Endpoints:**
- `getInternalTrInfo(accountNo?: string)` - Internal TR info (no auth)
- `getInternalProfile(profileId: string)` - Internal profile (no auth)

**Implementation Notes:**
- Use existing `fetchAPI`, `postAPI` from `fetchWrapper.ts`
- Use Bearer token from auth context/store
- Implement proper error handling and response normalization

---

### 4. State Management
Evaluate and implement state management for profile-related data.

**Potential New Stores:**

**`stores/profileStore.ts`** (optional):
- User profile state
- Selected profile ID
- Profile loading/error states

**Updates to Existing Stores:**

**`stores/userStore.ts`:**
- Add profile ID field
- Add profile data fields (name, IC, mobile, etc.)
- Add method to sync with API response

**`stores/tradingAccountStore.ts`:**
- Update to sync with `getUserAccounts` API response
- Map API response format to existing `TradingAccount` interface
- Replace mock data with real API data

---

### 5. Authentication Context
Ensure authentication headers are properly managed.

**File:** Create `contexts/AuthContext.tsx` or use existing auth mechanism

**Requirements:**
- Store and provide Bearer token
- Store and provide Profile ID
- Inject headers into API calls automatically
- Handle token refresh if needed
- Handle authentication errors

---

### 6. Component Integration

**6.1 User Profile Integration**
**Pages/Components to Update:**
- User profile sidebar (`app/(minimal)/sidebar/profile/`)
- Header component (user info display)

**Changes:**
- Fetch user profile on app load
- Display real user data instead of hardcoded values
- Update user store with API response

**6.2 Trading Accounts Integration**
**Pages/Components to Update:**
- Portfolio page (`app/(with-layout)/portfolio/`)
- Account selection components

**Changes:**
- Replace mock data in `tradingAccountStore` with API data
- Fetch accounts on app load or when accessing portfolio
- Map API response fields to existing interface:
  - `accountNo`, `accountType`, `trName`, `cdp`, `cpf`, `srs`, etc.

**6.3 Donation Integration**
**Pages/Components to Update:**
- Donations page (`app/(with-layout)/(detail)/donations/`)
- Donation submission forms
- Donation plan display

**Changes:**
- Implement donation submission flow
- Display active donation plans
- Handle donation cancellation
- Add success/error feedback with toast notifications

**6.4 BCAN Request Integration**
**Pages/Components to Update:**
- Trading info page or account settings

**Changes:**
- Add BCAN request functionality
- Display BCAN request status
- Handle success/error states

**6.5 Contact Us Integration**
**Pages/Components to Update:**
- Contact Us page or footer
- Help/Support sections

**Changes:**
- Fetch and display client service contact info
- Fetch and display central dealing desk contact info
- Display operating hours, phone numbers, email, address

**6.6 Trading Representative Info**
**Pages/Components to Update:**
- Account details view
- Trading account cards

**Changes:**
- Display TR name, contact, email for each account
- Fetch TR info when viewing account details

---

### 7. Error Handling & Loading States
Implement consistent error handling and loading states.

**Standards:**
- Use existing `fetchWrapper` error normalization
- Display user-friendly error messages via toast
- Implement loading skeletons for data fetching
- Handle network failures gracefully
- Implement retry logic where appropriate

---

### 8. Environment Configuration
Set up environment variables for API endpoints.

**File:** `.env.local` (create if not exists)

**Variables:**
```
NEXT_PUBLIC_PROFILE_API_URL=https://stgitrade.cgsi.com.sg/portal
```

**Usage:**
- Default to UAT environment
- Override in local/dev/prod environments as needed

---

### 9. Testing Strategy

**API Integration Testing:**
- Test all API endpoints with mock responses
- Validate request/response type safety
- Test error scenarios (401, 404, 500, network errors)
- Test header injection (Bearer token)

**Component Testing:**
- Test components with loading states
- Test components with error states
- Test components with successful data
- Test user interactions (submit donation, cancel donation, etc.)

**Integration Testing:**
- Test full user flows (e.g., view profile → edit → save)
- Test donation submission flow
- Test account switching with real data

---

### 10. Migration from Mock Data

**Current State:**
- `tradingAccountStore` uses hardcoded mock data
- User info is static or minimal

**Migration Steps:**
1. Create feature flag or environment variable to toggle between mock/real data
2. Implement API integration alongside mock data
3. Test thoroughly with real API
4. Gradually replace mock data with API calls
5. Remove mock data once verified

---

### 11. Documentation

**Updates Required:**
- Update `CLAUDE.md` with Profile API integration patterns
- Document authentication flow
- Document API error handling patterns
- Add examples of using Profile API functions
- Document environment variables

---

## Implementation Phases

### Phase 1: Foundation (Priority: High)
- Create TypeScript type definitions
- Update API configuration
- Create `profileAPI.ts` wrapper functions
- Set up authentication context/mechanism
- Configure environment variables

### Phase 2: Core Features (Priority: High)
- Integrate user profile API
- Integrate user accounts API
- Update `tradingAccountStore` with real data
- Update user profile display components

### Phase 3: Donation Features (Priority: Medium)
- Integrate donation submission
- Integrate donation plan retrieval
- Integrate donation cancellation
- Update donations page with real data

### Phase 4: Additional Features (Priority: Medium)
- Integrate Trading Representative info
- Integrate Contact Us endpoints
- Integrate BCAN request functionality

### Phase 5: Polish & Testing (Priority: High)
- Comprehensive error handling
- Loading state improvements
- Toast notification refinements
- End-to-end testing
- Performance optimization

---

## Questions to Clarify

### Authentication & Authorization
1. **Where is the Bearer token currently stored?**
   - Is there an existing authentication system/context?
   - How is the user logged in and token obtained?
   - How should token refresh be handled?


3. **What happens when authentication fails (401)?**
   - Should the user be redirected to login?
   - Should we show an error message?
   - Is there a token refresh mechanism?

### User Accounts Data Mapping
4. **How should API account types map to existing account types?**
   - API returns `accountType` as string
   - Current store uses: "Cash Account", "Margin Account", "Shares Borrowing", "CUT", "iCash"
   - Are these mappings 1:1 or do we need transformation logic?

5. **What fields from `UserAccountResponse` should populate `TradingAccount` interface?**
   - API provides: `accountNo`, `accountType`, `trName`, `eps`, `giro`, `cdp`, `cpf`, `srs`, `accreditedInvestor`
   - Current interface has additional fields (subCdp, paymentDetails, etc.)
   - Should we keep the extended interface or simplify?

### Donation Feature
6. **What are the valid values for donation payment methods?**
   - API pattern: `^(?i)(PLAN|LS_ACCSET)$`
   - What do "PLAN" and "LS_ACCSET" represent in the UI?
   - Should these be displayed to users or handled automatically?

7. **What is the user flow for donation submission?**
   - Is there a form for users to enter donation details?
   - Should we validate amount ranges?
   - What happens after successful submission?

8. **How should active donation plans be displayed?**
   - Should they appear on a dashboard?
   - Can users have multiple active plans?
   - What actions can users take on existing plans?

### BCAN Request
9. **What is BCAN and when should users request it?**
   - Is this a user-initiated action?
   - Where in the UI should this feature be placed?
   - What feedback should be shown after request submission?

### Contact Information
10. **Where should Contact Us information be displayed?**
    - Should it replace existing hardcoded contact info?
    - Should it appear in footer, dedicated page, or both?
    - Should we cache this data or fetch on every page load?

### Trading Representative Info
11. **How should TR (Trading Representative) info be displayed?**
    - Should it appear in account details?
    - Should it be shown in portfolio view?
    - Is TR info specific to each account or shared across accounts?

### Environment & Deployment
12. **Which environment should be used for development?**
    - Local, DEV, or UAT?
    - Are there different credentials for each environment?
    - How should we switch between environments?

13. **Is there API documentation for the login/authentication endpoint?**
    - How do users obtain the Bearer token?
    - Is there a separate authentication API spec?

### Data Synchronization
14. **When should we fetch user profile and accounts?**
    - On app initialization?
    - On every page load?
    - Should we implement caching/revalidation?

15. **How should we handle data updates?**
    - Should we poll for updates?
    - Is there a webhook/real-time update mechanism?
    - How often should we refresh account data?

### Error Handling
16. **What error messages should be shown to users?**
    - Should we display API error messages directly?
    - Should we have custom user-friendly messages?
    - Which errors should be silent vs. displayed?

### Feature Flags
17. **Should we implement feature flags for gradual rollout?**
    - Toggle between mock data and real API
    - Enable/disable specific features (donations, BCAN, etc.)
    - A/B testing capabilities?
