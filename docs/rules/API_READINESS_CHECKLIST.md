# CGSI iTrade Portal - API Readiness Checklist

> **For complete API details, see [API-Complete-List.md](./API-Complete-List.md)**

**Last Updated:** 2025-12-27
**Total Endpoints:** 42 across 6 API categories

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

#### 5. External SSO APIs (7/8 usable)
- [x] SSO - NTP (Next Trading Platform)
- [x] SSO - Research Portal
- [x] SSO - eStatement (iTrade TruContent)
- [x] SSO - Corporate Action
- [x] SSO - Stock Filter
- [x] SSO - EW8
- [x] SSO - ECRS
- [ ] SSO - iScreener (⚠️ **Not Implemented** - exists in spec only)

#### 6. Content APIs - Public (5/5)
- [x] Get Announcements
- [x] Get Notices
- [x] Get Campaigns
- [x] Get Events
- [x] Get Research & Insights

**Note:** Content APIs use different base URL: `https://www.cgsi.com.sg/cgsi/api/v1`

---

## Known Issues

1. **iScreener SSO** - Defined in API spec but NOT implemented
2. **Content APIs** - Use different base URL: `https://www.cgsi.com.sg/cgsi/api/v1`
3. **Contact Us** - Public endpoints (no auth required)

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
