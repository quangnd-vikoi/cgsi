# CGSI iTrade Portal - Complete API List

**Generated:** 2025-12-27
**Source:** All YAML and JSON files in `docs/swagger/`
**Note:** ✅ = Implemented in codebase, ❌ = Not implemented

---

## Legend

- **✅ Implemented** - API endpoint exists in `lib/api/endpoints/`
- **❌ Not Implemented** - API endpoint defined in spec but not in codebase
- **🔒 Auth Required** - Requires Bearer token
- **🔓 Public** - No authentication required
- **🔧 Internal** - Internal API (not exposed to frontend)

---

## 1. Authentication & SSO APIs

### Base Path: `/sso/api/v1`

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ✅ | POST | `/token` | 🔓 | JSON + YAML | Get access token by authorization code |
| ✅ | POST | `/token/refresh` | 🔓 | JSON + YAML | Refresh access token |
| ❌ | GET | `/token/info` | 🔒 | YAML only | Get token information from claims |
| ❌ | POST | `/internal/validate-token` | 🔧 | JSON only | Internal token validation |

**Implementation:** `lib/api/endpoints/auth.ts`
**Status:** 2/4 endpoints implemented (50%)

---

## 2. Profile APIs

### Base Path: `/profile/api/v1`

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/userInfo` | 🔒 | YAML only | Get user information |
| ✅ | GET | `/trInfo` | 🔒 | JSON + YAML | Get TR (Trading Representative) info |
| ✅ | GET | `/internal/trInfo` | 🔧 | JSON only | Get TR info by account number (internal) |
| ✅ | GET | `/internal/profile` | 🔧 | JSON only | Get user profile (internal) |
| ✅ | GET | `/accounts` | 🔒 | JSON + YAML | Get user trading accounts |
| ❌ | GET | `/tradingInfo` | 🔒 | YAML only | Get user trading information |
| ✅ | POST | `/tradingInfo/bcan/request` | 🔒 | JSON + YAML | Create BCAN request |
| ✅ | GET | `/donation/plan` | 🔒 | JSON + YAML | Get donation plans |
| ✅ | POST | `/donation/submission` | 🔒 | JSON + YAML | Submit donation |
| ✅ | POST | `/donation/cancel` | 🔒 | JSON + YAML | Cancel donation |
| ✅ | GET | `/contactUs/clientService` | 🔓 | JSON only | Get client service contact info |
| ✅ | GET | `/contactUs/centralDealingDesk` | 🔓 | JSON only | Get central dealing desk contact info |

**Implementation:** `lib/api/endpoints/profile.ts`
**Status:** 10/12 basic endpoints implemented (83%)

### Profile - SIP (Sophisticated Investor Program) APIs

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/tradingInfo/sip/products` | 🔒 | YAML only | Get SIP product list |
| ❌ | GET | `/tradingInfo/sip/submission/{submissionId}` | 🔒 | YAML only | Get SIP submission data |
| ❌ | POST | `/tradingInfo/sip/submission` | 🔒 | YAML only | Post SIP submission data |

**Status:** 0/3 SIP endpoints implemented (0%)

### Profile - Update Info APIs

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | POST | `/update/mobile/otp` | 🔒 | YAML only | Send SMS OTP to new mobile number |
| ❌ | POST | `/update/mobile/submit` | 🔒 | YAML only | Submit update mobile number |
| ❌ | POST | `/update/email/otp` | 🔒 | YAML only | Send OTP to new email |
| ❌ | POST | `/update/email/submit` | 🔒 | YAML only | Submit update email |
| ❌ | POST | `/update/signature/upload` | 🔒 | YAML only | Upload new signature documents |
| ❌ | POST | `/update/singnature/submit` | 🔒 | YAML only | Submit update signature (typo in spec: "singnature") |

**Status:** 0/6 update endpoints implemented (0%)

### Profile - Acknowledgement APIs

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/acknowledgement/user/list` | 🔒 | YAML only | Get user accepted acknowledgement list |
| ❌ | GET | `/acknowledgement/user/details/{id}` | 🔒 | YAML only | Get user accepted acknowledgement detail |

**Status:** 0/2 acknowledgement endpoints implemented (0%)

---

## 3. Subscription APIs

### Base Path: `/subscription/api/v1`

### Market Data Subscriptions

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ✅ | GET | `/subscription` | 🔒 | YAML only | Get available market data subscriptions |
| ✅ | GET | `/userSubscription` | 🔒 | YAML only | Get user's market data subscriptions |

**Status:** 2/2 market data endpoints implemented (100%)

### Product Subscriptions (IPO, Bonds, etc.)

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ✅ | GET | `/product/mySubscription` | 🔒 | JSON + YAML | Get user product subscriptions |
| ✅ | POST | `/product/mySubscription` | 🔒 | JSON + YAML | Submit user product subscription |
| ✅ | GET | `/product/{productType}` | 🔒 | JSON + YAML | Get product subscriptions by type (IPO, IOP, AI) |
| ✅ | GET | `/product/mySubscription/{subscriptionId}` | 🔒 | JSON + YAML | Get user product subscription details |
| ✅ | GET | `/product/details/{productCode}` | 🔒 | JSON + YAML | Get product subscription details |

**Implementation:** `lib/api/endpoints/subscription.ts`
**Status:** 7/7 subscription endpoints implemented (100%)

---

## 4. Notification APIs

### Base Path: `/notification/api/v1`

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ✅ | GET | `/list` | 🔒 | JSON + YAML | Get paginated user notifications (pageSize, pageIndex) |
| ✅ | GET | `/latest` | 🔒 | JSON + YAML | Get latest user notifications (pastMins) |
| ✅ | POST | `/markAsRead` | 🔒 | JSON + YAML | Mark user notifications as read |
| ❌ | POST | `/admin/email/send` | 🔒 | YAML only | Send email notification (admin) |
| ❌ | POST | `/internal/email/send` | 🔧 | JSON only | Send email notification (internal) |

**Implementation:** `lib/api/endpoints/notifications.ts`
**Status:** 3/5 notification endpoints implemented (60%)

**Note:** JSON and YAML have different paths for email sending:
- JSON: `/internal/email/send` (internal API)
- YAML: `/admin/email/send` (admin API)

---

## 5. Portfolio APIs ❌ NOT IMPLEMENTED

### Base Path: `/portfolio/api/v1`

**⚠️ WARNING: None of these endpoints are implemented in the codebase**

### Account Summary

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/accountSummary` | 🔒 | YAML only | Get all account information |

### Trust Balance

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/trustBalance` | 🔒 | YAML only | Get all account trust balance summary |
| ❌ | GET | `/trustBalance/{accountNo}/details/{currency}` | 🔒 | YAML only | Get trust balance detail by account & currency (paginated) |

### Custody Holdings

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/custody/{accountNo}` | 🔒 | YAML only | Get custody holding by account number (paginated) |

### Margin / Collateral Financing

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/margin/{accountNo}` | 🔒 | YAML only | Get collateral financing summary by account |
| ❌ | GET | `/margin/{accountNo}/details` | 🔒 | YAML only | Get collateral financing detail (paginated) |

### Contracts

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/contracts/{accountNo}` | 🔒 | YAML only | Get contracts by account (paginated, optional marketCode) |
| ❌ | GET | `/contracts/{accountNo}/pastdue` | 🔒 | YAML only | Get contracts past due (share awaiting) |

### Contra

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ❌ | GET | `/contra/{accountNo}` | 🔒 | YAML only | Get contra by account (paginated, optional marketCode) |
| ❌ | GET | `/contra/{accountNo}/details/{statementNo}` | 🔒 | YAML only | Get contra details by account and statement number |

**Source:** `docs/swagger/iTrade-PortfolioAPI.yaml`
**Status:** 0/10 portfolio endpoints implemented (0%)

---

## 6. External SSO APIs

### Base Path: `/externalsso/api/v1`

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ✅ | GET | `/ntp` | 🔒 | YAML only | Get SSO params for NTP (Next Trading Platform) |
| ✅ | GET | `/research` | 🔒 | YAML only | Get SSO params for Research Portal |
| ✅ | GET | `/estatement` | 🔒 | YAML only | Get SSO params for eStatement |
| ✅ | GET | `/corporateAction` | 🔒 | YAML only | Get SSO params for Corporate Action |
| ✅ | GET | `/stockFilter` | 🔒 | YAML only | Get SSO params for Stock Filter |
| ✅ | GET | `/ew8` | 🔒 | YAML only | Get SSO params for EW8 |
| ✅ | GET | `/ecrs` | 🔒 | YAML only | Get SSO params for ECRS |
| ✅ | GET | `/iscreener` | 🔒 | YAML only | Get SSO params for iScreener (⚠️ Never implemented) |

**Implementation:** `lib/api/endpoints/externalSSO.ts`
**Source:** `docs/swagger/iTrade-ExternalSSOAPI.yaml`
**Status:** 8/8 endpoints implemented (100%) - but iScreener noted as never implemented in portal

---

## 7. Content APIs (Public)

### Base Path: `https://www.cgsi.com.sg/cgsi/api/v1` (Different base URL)

| Status | Method | Endpoint | Auth | Source | Notes |
|--------|--------|----------|------|--------|-------|
| ✅ | GET | `/GetAnnouncement` | 🔓 | Code only | Get announcements (lang param) |
| ✅ | GET | `/GetNotices` | 🔓 | Code only | Get notices (lang param) |
| ✅ | GET | `/GetCampaign` | 🔓 | Code only | Get campaigns/promos (lang, sort, order) |
| ✅ | GET | `/GetEvent` | 🔓 | Code only | Get events (lang, sort, order) |
| ✅ | GET | `/GetResearchAndInsight` | 🔓 | Code only | Get research & insights (lang, sort, order) |

**Implementation:** `lib/api/endpoints/content.ts`
**Status:** 5/5 content endpoints implemented (100%)

---

## Summary Statistics

| Category | Implemented | Total | Percentage |
|----------|-------------|-------|------------|
| **Authentication & SSO** | 2 | 4 | 50% |
| **Profile (Basic)** | 10 | 12 | 83% |
| **Profile (SIP)** | 0 | 3 | 0% |
| **Profile (Update Info)** | 0 | 6 | 0% |
| **Profile (Acknowledgement)** | 0 | 2 | 0% |
| **Subscription** | 7 | 7 | 100% |
| **Notification** | 3 | 5 | 60% |
| **Portfolio** | 0 | 10 | 0% ⚠️ |
| **External SSO** | 8 | 8 | 100% |
| **Content (Public)** | 5 | 5 | 100% |
| **TOTAL** | **35** | **62** | **56%** |

---

## Priority Recommendations

### High Priority (Missing Core Features)

1. **Portfolio APIs (0/10)** ⚠️ CRITICAL
   - Account summary
   - Trust balance
   - Custody holdings
   - Margin/collateral
   - Contracts & contra
   - **Impact:** Users cannot view their portfolio data

2. **Profile Update APIs (0/6)**
   - Mobile number update
   - Email update
   - Signature upload
   - **Impact:** Users cannot update their contact information

3. **SIP APIs (0/3)**
   - Sophisticated Investor Program management
   - **Impact:** Advanced users cannot manage SIP status

### Medium Priority

4. **SSO Token Info (0/1)**
   - `/token/info` endpoint
   - **Impact:** Cannot retrieve token claims information

5. **Internal Email Notification (0/2)**
   - Email sending endpoints
   - **Impact:** Cannot send system notifications via email

6. **Profile Acknowledgement (0/2)**
   - User acknowledgement management
   - **Impact:** Cannot track user agreement acceptance

### Low Priority

7. **Internal Token Validation (0/1)**
   - Internal-only validation endpoint
   - May be handled differently in production

---

## File Sources

### JSON Files (Newer - Preferred)
- ✅ `subscription-api-0.0.1-snapshot.json`
- ✅ `profile-api-0.0.1-snapshot.json`
- ✅ `sso-api-0.0.1-snapshot.json`
- ✅ `notification-api-0.0.1-snapshot.json`

### YAML Files
- ✅ `ITrade-SubscriptionAPI.yaml` (Market data endpoints)
- ✅ `iTrade-ProfileAPI.yaml` (Extended profile endpoints)
- ✅ `iTrade-SSOAPI.yaml` (Token info endpoint)
- ✅ `iTrade-NotificationAPI.yaml` (Admin email endpoint)
- ⚠️ `iTrade-PortfolioAPI.yaml` (NOT implemented - 10 endpoints missing)
- ✅ `iTrade-ExternalSSOAPI.yaml` (All implemented)

---

## Implementation Files

### Current Implementation
```
lib/api/endpoints/
├── auth.ts           ✅ 2/4 endpoints (50%)
├── profile.ts        ✅ 10/21 endpoints (48%)
├── subscription.ts   ✅ 7/7 endpoints (100%)
├── notifications.ts  ✅ 3/5 endpoints (60%)
├── externalSSO.ts    ✅ 8/8 endpoints (100%)
├── content.ts        ✅ 5/5 endpoints (100%)
└── index.ts          Aggregator
```

### Missing Implementation
```
lib/api/endpoints/
└── portfolio.ts      ❌ NOT CREATED (0/10 endpoints)
```

---

## Next Steps

1. **Create Portfolio Endpoints** (`lib/api/endpoints/portfolio.ts`)
   - Implement all 10 portfolio API endpoints
   - Add to exports in `index.ts`

2. **Extend Profile Endpoints** (`lib/api/endpoints/profile.ts`)
   - Add SIP endpoints (3)
   - Add update info endpoints (6)
   - Add acknowledgement endpoints (2)

3. **Complete SSO Endpoints** (`lib/api/endpoints/auth.ts`)
   - Add `/token/info` endpoint
   - Add `/internal/validate-token` endpoint (if needed)

4. **Extend Notification Endpoints** (`lib/api/endpoints/notifications.ts`)
   - Add email sending endpoints

5. **Update Types** (`lib/api/types.ts`)
   - Add TypeScript types for all new endpoints
   - Ensure response types match spec

6. **Testing**
   - Test all new endpoints with Postman collection
   - Verify authentication requirements
   - Test pagination for portfolio endpoints

---

**Document Maintained By:** Development Team
**Last Updated:** 2025-12-27
**Review Frequency:** When API specs are updated
