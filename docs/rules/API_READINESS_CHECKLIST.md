# CGSI iTrade Portal - API Readiness Checklist

> **For complete API details, see [API-Complete-List.md](./API-Complete-List.md)**

**Last Updated:** 2026-01-14
**Total Endpoints:** 44 across 7 API categories

---

## API Implementation Status

### ✅ Fully Implemented & Ready

#### 1. Auth APIs (2/2)
- [x] Get Access Token (POST `/sso/api/v1/token`)
- [x] Refresh Token (POST `/sso/api/v1/token/refresh`)

#### 2. Profile APIs (10/10)
- [x] Get TR Info
- [x] Get TR Info by Account
- [x] Get User Profile
- [x] Get User Accounts
- [x] Create BCAN Request
- [x] Get Donation Plans
- [x] Submit Donation
- [x] Cancel Donation
- [x] Get Client Service Contact (Public)
- [x] Get Central Dealing Desk Contact (Public)

#### Acknowledgement APIs (2/2)
- [x] Get User Acknowledgement List → **UI: Profile sidebar "Acknowledgements"**
- [x] Get User Acknowledgement Detail → **UI: Detail dialog in Acknowledgements**

#### 3. Subscription APIs (7/7)
**Market Data:**
- [x] Get Market Data Subscriptions
- [x] Get User Market Data Subscriptions

**Product Subscriptions:**
- [x] Get My Product Subscriptions
- [x] Submit Product Subscription
- [x] Get Product Subscriptions by Type
- [x] Get My Subscription Details
- [x] Get Product Subscription Details

#### 4. Notification APIs (3/3)
- [x] Get Notification List (Paginated)
- [x] Get Latest Notifications
- [x] Mark Notifications as Read

#### 5. External SSO APIs (8/8 implemented, 7/8 in UI)
- [x] SSO - NTP (Next Trading Platform) → **UI: Header "Trade Now" button**
- [x] SSO - Research Portal → ⚠️ Service ready, not in UI
- [x] SSO - eStatement (iTrade TruContent) → **UI: Profile sidebar "eStatements"**
- [x] SSO - Corporate Action → **UI: Profile sidebar "Corporate Actions"**
- [x] SSO - Stock Filter → **UI: Discover page Stock Research card**
- [x] SSO - EW8 → **UI: Trading Declarations W8-BEN "Renew"**
- [x] SSO - ECRS → **UI: Trading Declarations CRS "Renew"**
- [x] SSO - iScreener → **UI: Discover page Stock Research card** (⚠️ Backend never implemented)

#### 6. Content APIs - Public (5/5)
- [x] Get Announcements
- [x] Get Notices
- [x] Get Campaigns
- [x] Get Events
- [x] Get Research & Insights

**Note:** Content APIs use different base URL: `https://www.cgsi.com.sg/cgsi/api/v1`

---

## Known Issues

1. **iScreener SSO** - Frontend integrated but backend endpoint never implemented (may return 404)
2. **Content APIs** - Use different base URL: `https://www.cgsi.com.sg/cgsi/api/v1`
3. **Contact Us** - Public endpoints (no auth required)
4. **Research Portal SSO** - Service implemented but not integrated in UI

---

## UI Integration Status

### External SSO - Fully Integrated (7/8)
| System | Location | Component | Status |
|--------|----------|-----------|--------|
| NTP | Header | `components/Header.tsx` | ✅ Integrated |
| Corporate Action | Profile Sidebar | `app/(minimal)/sidebar/Profile.tsx` | ✅ Integrated |
| eStatement | Profile Sidebar | `app/(minimal)/sidebar/Profile.tsx` | ✅ Integrated |
| EW8 | Trading Declarations | `app/(minimal)/sidebar/TradingDeclartions.tsx` | ✅ Integrated |
| ECRS | Trading Declarations | `app/(minimal)/sidebar/TradingDeclartions.tsx` | ✅ Integrated |
| iScreener | Discover Page | `app/(with-layout)/discover/_components/StockResearch.tsx` | ✅ Integrated |
| Stock Filter | Discover Page | `app/(with-layout)/discover/_components/StockResearch.tsx` | ✅ Integrated |
| Research | - | - | ⚠️ Not in UI |

**Service:** `lib/services/externalSSOService.ts`
**Documentation:** `docs/flows/externalsso-api-implementation-plan.md`

---

## Testing Guide

**Prerequisites:**
- Postman collection: `CGSI_iTrade_Portal_APIs.postman_collection.json`
- Bearer token from `/sso/api/v1/token`
- Test credentials: GRACE6388 / Cgs#1234

**Test Priority:**
1. Auth & Profile APIs (High)
2. Subscription & Notification APIs (High)
3. External SSO & Content APIs (Medium)

**External SSO UI Testing:**
1. Click Header "Trade Now" → NTP SSO
2. Profile sidebar → "Corporate Actions" → Corporate Action SSO
3. Profile sidebar → "eStatements" → eStatement SSO
4. Profile sidebar → Trading Declarations → W8-BEN "Renew" → EW8 SSO
5. Profile sidebar → Trading Declarations → CRS "Renew" → ECRS SSO
6. Discover page → "iScreener" card → iScreener SSO (may fail if backend not ready)
7. Discover page → "Stock Filter" card → Stock Filter SSO
