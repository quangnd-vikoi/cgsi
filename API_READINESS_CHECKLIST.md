# CGSI iTrade Portal - API Readiness Checklist

**Generated:** 2025-12-27
**Base URL (API):** `https://stgitrade.cgsi.com.sg/portal`
**Base URL (Content):** `https://www.cgsi.com.sg/cgsi/api/v1`

## Summary

Total endpoints defined: **42 endpoints** across 6 API categories

---

## 1. Auth APIs ✅ (2 endpoints)

| Endpoint | Method | Path | Status | Notes |
|----------|--------|------|--------|-------|
| Get Access Token | POST | `/sso/api/v1/token` | ✅ Ready | Exchange authorization code |
| Refresh Token | POST | `/sso/api/v1/token/refresh` | ✅ Ready | Refresh access token |

**Authentication Required:** No (these provide tokens)

---

## 2. Profile APIs ✅ (10 endpoints)

| Endpoint | Method | Path | Auth Required | Status |
|----------|--------|------|---------------|--------|
| Get TR Info | GET | `/profile/api/v1/trInfo` | ✅ Yes | ✅ Ready |
| Get TR Info by Account | GET | `/profile/api/v1/internal/trInfo` | ✅ Yes | ✅ Ready |
| Get User Profile | GET | `/profile/api/v1/internal/profile` | ✅ Yes | ✅ Ready |
| Get User Accounts | GET | `/profile/api/v1/accounts` | ✅ Yes | ✅ Ready |
| Create BCAN Request | POST | `/profile/api/v1/tradingInfo/bcan/request` | ✅ Yes | ✅ Ready |
| Get Donation Plans | GET | `/profile/api/v1/donation/plan` | ✅ Yes | ✅ Ready |
| Submit Donation | POST | `/profile/api/v1/donation/submission` | ✅ Yes | ✅ Ready |
| Cancel Donation | POST | `/profile/api/v1/donation/cancel` | ✅ Yes | ✅ Ready |
| Get Client Service Contact | GET | `/profile/api/v1/contactUs/clientService` | ❌ No | ✅ Ready |
| Get Central Dealing Desk Contact | GET | `/profile/api/v1/contactUs/centralDealingDesk` | ❌ No | ✅ Ready |

**Notes:**
- Contact Us endpoints are public (no authentication)
- All others require Bearer token

---

## 3. Subscription APIs ✅ (7 endpoints)

### Market Data Subscriptions (2 endpoints)

| Endpoint | Method | Path | Auth Required | Status |
|----------|--------|------|---------------|--------|
| Get Market Data Subscriptions | GET | `/subscription/api/v1/subscription` | ✅ Yes | ✅ Ready |
| Get User Market Data Subscriptions | GET | `/subscription/api/v1/userSubscription` | ✅ Yes | ✅ Ready |

### Product Subscriptions (5 endpoints)

| Endpoint | Method | Path | Auth Required | Status |
|----------|--------|------|---------------|--------|
| Get My Product Subscriptions | GET | `/subscription/api/v1/product/mySubscription` | ✅ Yes | ✅ Ready |
| Submit Product Subscription | POST | `/subscription/api/v1/product/mySubscription` | ✅ Yes | ✅ Ready |
| Get Product Subscriptions by Type | GET | `/subscription/api/v1/product/{productType}` | ✅ Yes | ✅ Ready |
| Get My Subscription Details | GET | `/subscription/api/v1/product/mySubscription/{id}` | ✅ Yes | ✅ Ready |
| Get Product Subscription Details | GET | `/subscription/api/v1/product/details/{productCode}` | ✅ Yes | ✅ Ready |

**Sources:**
- Market Data: `ITrade-SubscriptionAPI.yaml`
- Product Subscriptions: `subscription-api-0.0.1-snapshot.json`

---

## 4. Notification APIs ✅ (3 endpoints)

| Endpoint | Method | Path | Auth Required | Status |
|----------|--------|------|---------------|--------|
| Get Notification List (Paginated) | GET | `/notification/api/v1/list` | ✅ Yes | ✅ Ready |
| Get Latest Notifications | GET | `/notification/api/v1/latest` | ✅ Yes | ✅ Ready |
| Mark Notifications as Read | POST | `/notification/api/v1/markAsRead` | ✅ Yes | ✅ Ready |

**Query Parameters:**
- **List:** `pageSize` (default: 10), `pageIndex` (default: 0)
- **Latest:** `pastMins` (default: 5) - for polling/real-time updates

---

## 5. External SSO APIs ✅ (8 endpoints)

| Endpoint | Method | Path | Auth Required | Status | Notes |
|----------|--------|------|---------------|--------|-------|
| SSO - NTP | GET | `/externalsso/api/v1/ntp` | ✅ Yes | ✅ Ready | Next Trading Platform |
| SSO - Research | GET | `/externalsso/api/v1/research` | ✅ Yes | ✅ Ready | Research Portal |
| SSO - eStatement | GET | `/externalsso/api/v1/estatement` | ✅ Yes | ✅ Ready | iTrade TruContent |
| SSO - Corporate Action | GET | `/externalsso/api/v1/corporateAction` | ✅ Yes | ✅ Ready | Corporate Action |
| SSO - Stock Filter | GET | `/externalsso/api/v1/stockFilter` | ✅ Yes | ✅ Ready | Stock Filter |
| SSO - EW8 | GET | `/externalsso/api/v1/ew8` | ✅ Yes | ✅ Ready | EW8 |
| SSO - ECRS | GET | `/externalsso/api/v1/ecrs` | ✅ Yes | ✅ Ready | ECRS |
| SSO - iScreener | GET | `/externalsso/api/v1/iscreener` | ✅ Yes | ⚠️ Not Implemented | Defined but never implemented |

**Source:** `iTrade-ExternalSSOAPI.yaml`

**⚠️ Warning:** iScreener endpoint exists in API spec but is NOT implemented in the actual iTrade Portal

---

## 6. Content APIs (Public) ✅ (5 endpoints)

| Endpoint | Method | Path | Auth Required | Status |
|----------|--------|------|---------------|--------|
| Get Announcements | GET | `/GetAnnouncement` | ❌ No | ✅ Ready |
| Get Notices | GET | `/GetNotices` | ❌ No | ✅ Ready |
| Get Campaigns | GET | `/GetCampaign` | ❌ No | ✅ Ready |
| Get Events | GET | `/GetEvent` | ❌ No | ✅ Ready |
| Get Research & Insights | GET | `/GetResearchAndInsight` | ❌ No | ✅ Ready |

**Base URL:** `https://www.cgsi.com.sg/cgsi/api/v1` (Different from main API)

**Query Parameters:**
- **All:** `lang` (1=EN, 2=CN)
- **Campaigns/Events/Insights:** `sort`, `order` (asc|desc)

**References:**
- Announcements/Notices: https://www.cgsi.com.sg/notices?lang=EN
- Campaigns: https://www.cgsi.com.sg/campaigns/?lang=EN
- Events: https://www.cgsi.com.sg/events/?lang=EN
- Insights: https://www.cgsi.com.sg/insights/?lang=EN

---

## Implementation Files

### Endpoint Definitions
- `lib/api/endpoints/auth.ts` - Auth endpoints
- `lib/api/endpoints/profile.ts` - Profile endpoints
- `lib/api/endpoints/subscription.ts` - Subscription endpoints
- `lib/api/endpoints/notifications.ts` - Notification endpoints
- `lib/api/endpoints/externalSSO.ts` - External SSO endpoints
- `lib/api/endpoints/content.ts` - Content endpoints
- `lib/api/endpoints/index.ts` - Aggregated exports

### Service Layer
- `lib/services/authService.ts` - Auth service implementation
- `lib/services/profileService.ts` - Profile service implementation
- `lib/services/ssoService.ts` - SSO service implementation (NEW - untracked)
- `lib/services/subscriptionService.ts` - Subscription service (NEW - untracked)

### Configuration
- `lib/api/config.ts` - API base URLs and language constants
- `lib/api/client.ts` - API client wrapper
- `lib/api/types.ts` - TypeScript type definitions

---

## Testing Checklist

### Prerequisites
1. ✅ Get valid Bearer token from `/sso/api/v1/token`
2. ✅ Import Postman collection: `CGSI_iTrade_Portal_APIs.postman_collection.json`
3. ✅ Set environment variables:
   - `base_url` = `https://stgitrade.cgsi.com.sg/portal`
   - `content_base_url` = `https://www.cgsi.com.sg/cgsi/api/v1`
   - `bearer_token` = `<your_access_token>`

### Testing Priority

#### High Priority (Core Features)
- [ ] **Auth APIs** - Token generation and refresh
- [ ] **Profile APIs** - User profile, accounts, TR info
- [ ] **Subscription APIs** - Market data and product subscriptions
- [ ] **Notification APIs** - List, latest, mark as read

#### Medium Priority (External Integrations)
- [ ] **External SSO APIs** - All SSO endpoints (except iScreener)
- [ ] **Content APIs** - Public content endpoints

#### Low Priority
- [ ] **SSO iScreener** - Not implemented, expected to fail

### Test Scenarios

#### 1. Authentication Flow
```
1. POST /sso/api/v1/token (with authorization code)
2. Save access_token and refresh_token
3. POST /sso/api/v1/token/refresh (when token expires)
```

#### 2. Profile Data Flow
```
1. GET /profile/api/v1/accounts (get user accounts)
2. GET /profile/api/v1/trInfo (get TR info)
3. GET /profile/api/v1/internal/profile (get user profile)
```

#### 3. Subscription Flow
```
1. GET /subscription/api/v1/subscription (available subscriptions)
2. GET /subscription/api/v1/userSubscription (user's subscriptions)
3. GET /subscription/api/v1/product/{type} (products by type)
4. POST /subscription/api/v1/product/mySubscription (submit subscription)
```

#### 4. Notification Flow
```
1. GET /notification/api/v1/list?pageSize=10&pageIndex=0
2. GET /notification/api/v1/latest?pastMins=5
3. POST /notification/api/v1/markAsRead (with notification IDs)
```

#### 5. External SSO Flow
```
1. GET /externalsso/api/v1/ntp (get NTP SSO params)
2. GET /externalsso/api/v1/research (get Research SSO URL)
3. Use returned parameters to redirect to external systems
```

#### 6. Public Content (No Auth)
```
1. GET /GetAnnouncement?lang=1
2. GET /GetNotices?lang=1
3. GET /GetCampaign?sort=Campaign_StartDate&order=desc&lang=1
```

---

## Known Issues & Notes

### ⚠️ Important Notes

1. **iScreener SSO Endpoint** - Defined in spec but NOT implemented in actual portal
2. **Content APIs** - Use different base URL (`cgsi.com.sg`) vs main APIs (`stgitrade.cgsi.com.sg`)
3. **Contact Us Endpoints** - Public endpoints, no authentication required
4. **New Services** - Two new service files are untracked in git:
   - `lib/services/ssoService.ts`
   - `lib/services/subscriptionService.ts`

### Missing from Portfolio APIs

The current implementation does **NOT** have dedicated portfolio APIs. Portfolio data likely comes from:
- **Profile APIs** - Account information (`/profile/api/v1/accounts`)
- **Subscription APIs** - User subscriptions and products

If you need dedicated portfolio/holdings APIs, they may need to be added separately.

---

## Next Steps

1. ✅ **Import Postman Collection** - Load `CGSI_iTrade_Portal_APIs.postman_collection.json` into Postman
2. 🔐 **Get Authentication Token** - Use auth endpoint to get Bearer token
3. 🧪 **Test High Priority APIs** - Start with Profile and Subscription APIs
4. 📝 **Document Findings** - Record any API issues or unexpected responses
5. 🚨 **Report Issues** - Document any endpoints that return errors

---

## Quick Start Guide

### Step 1: Import to Postman
1. Open Postman
2. Click **Import** button
3. Select `CGSI_iTrade_Portal_APIs.postman_collection.json`
4. Collection will be imported with all 42 endpoints organized by category

### Step 2: Set Environment Variables
1. Create new environment in Postman
2. Add variables:
   ```
   base_url = https://stgitrade.cgsi.com.sg/portal
   content_base_url = https://www.cgsi.com.sg/cgsi/api/v1
   bearer_token = <your_token_here>
   ```

### Step 3: Get Bearer Token
1. Use external auth flow to get authorization code
2. Call `POST /sso/api/v1/token` with the code
3. Copy `access_token` from response
4. Set as `bearer_token` environment variable

### Step 4: Test Endpoints
1. Start with public endpoints (Content APIs, Contact Us)
2. Test authenticated endpoints with Bearer token
3. Verify request/response format matches expectations

---

**Status Legend:**
- ✅ Ready - Endpoint defined and implemented
- ⚠️ Not Implemented - Defined but not actually implemented
- ❌ Missing - Not defined in current implementation
