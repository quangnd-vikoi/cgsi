# Implementation Plan: Profile API v2 & External SSO Enhancements

**Status:** Ready for Implementation
**Created:** 2026-01-06
**Follows Pattern:** CGSI iTrade Portal API Architecture

---

## 📋 Overview

This plan outlines the implementation of **NEW v2 API endpoints** for:
1. **Profile API** - 10 new endpoints (Trading Info, Update Info, Acknowledgements, Internal APIs)
2. **External SSO API** - Service layer enhancements (endpoints already defined)
3. **Subscription API** - 1 new internal endpoint

All implementations follow existing codebase patterns from `lib/api/` and `lib/services/`.

---

## 🎯 Implementation Checklist

### Phase 1: Type Definitions (types/index.ts)
- [ ] Add **Trading Info Types** (SIP, W8BEN, CRS, BCAN)
- [ ] Add **Update Info Types** (Signature, Mobile OTP, Email OTP)
- [ ] Add **Acknowledgement Types** (List, Details)
- [ ] Add **Internal Account Types** (extended UserAccountResponse)
- [ ] Add **Subscription Count Types**

### Phase 2: Profile API Endpoints (lib/api/endpoints/profile.ts)
- [ ] Add `tradingInfo()` - GET trading info
- [ ] Add `uploadSignature()` - POST signature upload
- [ ] Add `updateMobileOtp()` - POST mobile OTP request
- [ ] Add `updateMobileSubmit()` - POST mobile OTP submit
- [ ] Add `updateEmailOtp()` - POST email OTP request
- [ ] Add `updateEmailSubmit()` - POST email OTP submit
- [ ] Add `internalAccounts()` - GET internal accounts
- [ ] Add `internalAccount(accountNo)` - GET internal account by number
- [ ] Add `acknowledgementsList()` - GET acknowledgements
- [ ] Add `acknowledgementDetails(id)` - GET acknowledgement details

### Phase 3: External SSO Service (lib/services/ssoService.ts)
- [ ] Add `getStockFilterSSO()` - Stock Filter SSO
- [ ] Add `getResearchSSO()` - Research Portal SSO
- [ ] Add `getEW8SSO()` - EW8 SSO
- [ ] Add `getEStatementSSO()` - eStatement SSO
- [ ] Add `getECRSSSO()` - ECRS SSO
- [ ] Update `submitSamlForm()` - Enhanced SAML form submission
- [ ] Add helper `redirectToSSO(redirectUrl)` - Generic redirect

### Phase 4: Profile Service (lib/services/profileService.ts)
- [ ] Add `getTradingInfo()` - Get trading info
- [ ] Add `uploadSignature(file, metadata)` - Upload signature
- [ ] Add `requestMobileOtp(mobileNumber)` - Request mobile OTP
- [ ] Add `submitMobileOtp(transactionId, otp)` - Submit mobile OTP
- [ ] Add `requestEmailOtp(email)` - Request email OTP
- [ ] Add `submitEmailOtp(transactionId, otp)` - Submit email OTP
- [ ] Add `getInternalAccounts()` - Get internal accounts
- [ ] Add `getInternalAccount(accountNo)` - Get account by number
- [ ] Add `getAcknowledgements()` - Get acknowledgements list
- [ ] Add `getAcknowledgementDetails(id)` - Get acknowledgement details

### Phase 5: Subscription Service (lib/services/subscriptionService.ts)
- [ ] Add subscription endpoints (if needed)
- [ ] Add `getUserSubscriptionCount(type)` - Get subscription count by type

### Phase 6: Testing & Validation
- [ ] Test all new endpoints with Postman collection
- [ ] Validate response formats match types
- [ ] Test authentication flow with Bearer tokens
- [ ] Test file upload for signature endpoint
- [ ] Test OTP flow (request → submit)

---

## 📁 File Structure

```
lib/
├── api/
│   ├── endpoints/
│   │   ├── profile.ts           ← UPDATE (add 10 new endpoints)
│   │   ├── externalSSO.ts       ← VERIFY (already has v2 endpoints)
│   │   └── subscription.ts      ← UPDATE (add 1 new internal endpoint)
│   ├── client.ts                ← NO CHANGE (already supports multipart)
│   ├── config.ts                ← NO CHANGE
│   └── types.ts                 ← NO CHANGE
├── services/
│   ├── profileService.ts        ← UPDATE (add new service methods)
│   ├── ssoService.ts            ← UPDATE (enhance with all SSO methods)
│   └── subscriptionService.ts   ← UPDATE (add count method)
└── types/
    └── index.ts                 ← UPDATE (add new type definitions)
```

---

## 🔧 Implementation Details

### 1. Type Definitions (types/index.ts)

Add the following type definitions:

```typescript
// ============================================================================
// Profile API - Trading Info Types (NEW in v2)
// ============================================================================

export interface SipInfo {
	toDisplay: boolean;
	isPassed: boolean;
	dueForSubmission: boolean;
	lastSubmissionID?: string;
}

export interface W8BenInfo {
	toDisplay: boolean;
	isJointAcct: boolean;
	expireDate?: string; // ISO date string
}

export interface CrsInfo {
	certified: boolean;
	isJointAcct: boolean;
	validationDate?: string; // ISO date string
}

export interface BcanInfo {
	toDisplay: boolean;
	requestStatus?: string;
}

export interface UserTradingInfoResponse {
	sip?: SipInfo;
	w8ben?: W8BenInfo;
	crs?: CrsInfo;
	bcan?: BcanInfo;
}

// ============================================================================
// Profile API - Update Info Types (NEW in v2)
// ============================================================================

// Signature Upload
export interface UploadSignatureRequest {
	file: File;
	metadata: string; // JSON string
}

export interface UploadSignatureResponse {
	isSuccess: boolean;
}

// Mobile Update OTP
export interface UpdateMobileOtpRequest {
	mobileNumber: string; // pattern: ^(?=.{1,16}$)\+?\d{1,4}-\d+$
}

export interface UpdateMobileOtpResponse {
	transactionId: string;
}

export interface OtpSubmitRequest {
	transactionId: string;
	otp: string; // pattern: ^\d{6}$
}

export interface OtpSubmitResponse {
	isSuccess: boolean;
}

// Email Update OTP
export interface UpdateEmailOtpRequest {
	email: string; // maxLength: 64
}

export interface UpdateEmailOtpResponse {
	transactionId: string;
}

// ============================================================================
// Profile API - Acknowledgement Types (NEW in v2)
// ============================================================================

export interface AgreementInfo {
	agreementId: string;
	title: string;
	versionNo: number;
	acceptedOn: string; // ISO date-time string
}

export interface UserAcknowledgementResponse {
	textBase: AgreementInfo[];
	onlineBase: AgreementInfo[];
	interactiveBase: AgreementInfo[];
	pdfBase: AgreementInfo[];
}

export interface UserAcknowledgementDetailResponse {
	title: string;
	versionNo: number;
	acceptedOn: string; // ISO date-time string
	htmlContent?: string;
	url?: string;
}

// ============================================================================
// Profile API - Internal Account Types (NEW in v2)
// ============================================================================

// Extend existing UserAccountResponse with v2 fields
export interface UserAccountResponseV2 extends IUserAccount {
	trCode?: string; // NEW in v2
	accountTypeCodeNova?: string; // NEW in v2
}

// ============================================================================
// Subscription API - Internal Types (NEW in v2)
// ============================================================================

export type SubscriptionType =
	| "SMS"
	| "EMAIL"
	| "US_AMEX"
	| "US_NASDAQ"
	| "US_NYSE"
	| "HK_RT"
	| "SG_MD"
	| "BM_MD"
	| "HK_MD"
	| "US_MD"
	| "AFX"
	| "REUTERS"
	| "HSIMI"
	| "RESEARCH"
	| "BURSA_RT"
	| "US_NYSE_ARCA"
	| "TH_RT"
	| "AUTO_CHART_LIST"
	| "NEW_RESEARCH";

export interface UserSubscriptionCountResponse {
	count: number;
}
```

---

### 2. Profile API Endpoints (lib/api/endpoints/profile.ts)

Add these endpoint definitions following existing pattern:

```typescript
export const profileEndpoints = {
	// ... existing endpoints ...

	/**
	 * Get User Trading Information (SIP, W8BEN, CRS, BCAN)
	 * GET /profile/api/v1/tradingInfo
	 * @requires Authentication
	 * NEW in v2
	 */
	tradingInfo: () => `/profile/api/v1/tradingInfo`,

	/**
	 * Upload Signature (multipart/form-data)
	 * POST /profile/api/v1/update/signature/upload
	 * @requires Authentication
	 * NEW in v2
	 */
	uploadSignature: () => `/profile/api/v1/update/signature/upload`,

	/**
	 * Request OTP for Mobile Number Update
	 * POST /profile/api/v1/update/mobile/otp
	 * @requires Authentication
	 * NEW in v2
	 */
	updateMobileOtp: () => `/profile/api/v1/update/mobile/otp`,

	/**
	 * Submit OTP to Update Mobile Number
	 * POST /profile/api/v1/update/mobile/submit
	 * @requires Authentication
	 * NEW in v2
	 */
	updateMobileSubmit: () => `/profile/api/v1/update/mobile/submit`,

	/**
	 * Request OTP for Email Update
	 * POST /profile/api/v1/update/email/otp
	 * @requires Authentication
	 * NEW in v2
	 */
	updateEmailOtp: () => `/profile/api/v1/update/email/otp`,

	/**
	 * Submit OTP to Update Email
	 * POST /profile/api/v1/update/email/submit
	 * @requires Authentication
	 * NEW in v2
	 */
	updateEmailSubmit: () => `/profile/api/v1/update/email/submit`,

	/**
	 * Get User Trading Accounts (Internal API)
	 * GET /profile/api/v1/internal/accounts
	 * @requires Authentication
	 * NEW in v2
	 */
	internalAccounts: () => `/profile/api/v1/internal/accounts`,

	/**
	 * Get User Account by Account Number (Internal API)
	 * GET /profile/api/v1/internal/account?accountNo={accountNo}
	 * @requires Authentication
	 * NEW in v2
	 */
	internalAccount: (accountNo: string) =>
		`/profile/api/v1/internal/account?accountNo=${accountNo}`,

	/**
	 * Get User Acknowledgements
	 * GET /profile/api/v1/acknowledgement/user/list
	 * @requires Authentication
	 * NEW in v2
	 */
	acknowledgementsList: () => `/profile/api/v1/acknowledgement/user/list`,

	/**
	 * Get User Acknowledgement Details by ID
	 * GET /profile/api/v1/acknowledgement/user/details/{id}
	 * @requires Authentication
	 * NEW in v2
	 */
	acknowledgementDetails: (id: string) =>
		`/profile/api/v1/acknowledgement/user/details/${id}`,
} as const;
```

---

### 3. Profile Service Methods (lib/services/profileService.ts)

Add these service methods:

```typescript
// ============================================
// Trading Info Operations (NEW in v2)
// ============================================

/**
 * Get user trading information (SIP, W8BEN, CRS, BCAN)
 * @returns Trading information data
 * @requires Authentication
 */
export const getTradingInfo = async (): Promise<APIResponse<UserTradingInfoResponse>> => {
	return await fetchAPI<UserTradingInfoResponse>(ENDPOINTS.tradingInfo(), {
		useAuth: true,
	});
};

// ============================================
// Update Info Operations (NEW in v2)
// ============================================

/**
 * Upload signature file
 * @param file - Signature file to upload
 * @param metadata - Metadata JSON string
 * @returns Upload success status
 * @requires Authentication
 */
export const uploadSignature = async (
	file: File,
	metadata: string = '{"description":"Signature upload"}'
): Promise<APIResponse<UploadSignatureResponse>> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("metadata", metadata);

	const response = await fetch(
		`${API_BASE_URL}${ENDPOINTS.uploadSignature()}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
			},
			body: formData,
		}
	);

	if (!response.ok) {
		return {
			success: false,
			error: `Upload failed: ${response.status}`,
			statusCode: response.status,
			data: null,
		};
	}

	const data = await response.json();
	return {
		success: true,
		data,
		statusCode: response.status,
		error: null,
	};
};

/**
 * Request OTP for mobile number update
 * @param mobileNumber - Mobile number (format: +65-12345678)
 * @returns Transaction ID for OTP verification
 * @requires Authentication
 */
export const requestMobileOtp = async (
	mobileNumber: string
): Promise<APIResponse<UpdateMobileOtpResponse>> => {
	return await postAPI<UpdateMobileOtpResponse, UpdateMobileOtpRequest>(
		ENDPOINTS.updateMobileOtp(),
		{ mobileNumber },
		{ useAuth: true }
	);
};

/**
 * Submit OTP to update mobile number
 * @param transactionId - Transaction ID from OTP request
 * @param otp - 6-digit OTP code
 * @returns Success status
 * @requires Authentication
 */
export const submitMobileOtp = async (
	transactionId: string,
	otp: string
): Promise<APIResponse<OtpSubmitResponse>> => {
	return await postAPI<OtpSubmitResponse, OtpSubmitRequest>(
		ENDPOINTS.updateMobileSubmit(),
		{ transactionId, otp },
		{ useAuth: true }
	);
};

/**
 * Request OTP for email update
 * @param email - Email address
 * @returns Transaction ID for OTP verification
 * @requires Authentication
 */
export const requestEmailOtp = async (
	email: string
): Promise<APIResponse<UpdateEmailOtpResponse>> => {
	return await postAPI<UpdateEmailOtpResponse, UpdateEmailOtpRequest>(
		ENDPOINTS.updateEmailOtp(),
		{ email },
		{ useAuth: true }
	);
};

/**
 * Submit OTP to update email
 * @param transactionId - Transaction ID from OTP request
 * @param otp - 6-digit OTP code
 * @returns Success status
 * @requires Authentication
 */
export const submitEmailOtp = async (
	transactionId: string,
	otp: string
): Promise<APIResponse<OtpSubmitResponse>> => {
	return await postAPI<OtpSubmitResponse, OtpSubmitRequest>(
		ENDPOINTS.updateEmailSubmit(),
		{ transactionId, otp },
		{ useAuth: true }
	);
};

// ============================================
// Internal Account Operations (NEW in v2)
// ============================================

/**
 * Get user trading accounts (Internal API)
 * @returns Array of user accounts with extended fields
 * @requires Authentication
 */
export const getInternalAccounts = async (): Promise<
	APIResponse<UserAccountResponseV2[]>
> => {
	return await fetchAPI<UserAccountResponseV2[]>(ENDPOINTS.internalAccounts(), {
		useAuth: true,
	});
};

/**
 * Get user account by account number (Internal API)
 * @param accountNo - Account number
 * @returns Account details with extended fields
 * @requires Authentication
 */
export const getInternalAccount = async (
	accountNo: string
): Promise<APIResponse<UserAccountResponseV2>> => {
	return await fetchAPI<UserAccountResponseV2>(
		ENDPOINTS.internalAccount(accountNo),
		{ useAuth: true }
	);
};

// ============================================
// Acknowledgement Operations (NEW in v2)
// ============================================

/**
 * Get user acknowledgements (textBase, onlineBase, interactiveBase, pdfBase)
 * @returns Acknowledgement lists organized by type
 * @requires Authentication
 */
export const getAcknowledgements = async (): Promise<
	APIResponse<UserAcknowledgementResponse>
> => {
	return await fetchAPI<UserAcknowledgementResponse>(
		ENDPOINTS.acknowledgementsList(),
		{ useAuth: true }
	);
};

/**
 * Get acknowledgement details by ID
 * @param id - Agreement ID
 * @returns Acknowledgement details including content/URL
 * @requires Authentication
 */
export const getAcknowledgementDetails = async (
	id: string
): Promise<APIResponse<UserAcknowledgementDetailResponse>> => {
	return await fetchAPI<UserAcknowledgementDetailResponse>(
		ENDPOINTS.acknowledgementDetails(id),
		{ useAuth: true }
	);
};

// Update the default export with new methods
export const profileService = {
	// ... existing methods ...

	// Trading info (NEW in v2)
	getTradingInfo,

	// Update info operations (NEW in v2)
	uploadSignature,
	requestMobileOtp,
	submitMobileOtp,
	requestEmailOtp,
	submitEmailOtp,

	// Internal account operations (NEW in v2)
	getInternalAccounts,
	getInternalAccount,

	// Acknowledgement operations (NEW in v2)
	getAcknowledgements,
	getAcknowledgementDetails,
};
```

---

### 4. External SSO Service Enhancements (lib/services/ssoService.ts)

Complete the SSO service with all endpoints:

```typescript
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
	CorpActionSSOResponse,
	ResearchSSOResponse,
	StockFilterSSOResponse,
	EW8SSOResponse,
	EStatementSSOResponse,
	ECRSSSOResponse,
} from "@/types";
import type { APIResponse } from "@/lib/api/types";

/**
 * Submit a SAML POST form to an external SSO endpoint
 */
export function submitSamlForm(postUrl: string, samlResponse: string): void {
	const form = document.createElement("form");
	form.method = "POST";
	form.action = postUrl;

	const input = document.createElement("input");
	input.type = "hidden";
	input.name = "SAMLResponse";
	input.value = samlResponse;

	form.appendChild(input);
	document.body.appendChild(form);
	form.submit();
}

/**
 * Generic redirect helper for SSO endpoints that return redirectUrl
 */
export function redirectToSSO(redirectUrl: string): void {
	window.location.href = redirectUrl;
}

// ============================================
// SSO Operations
// ============================================

/**
 * Get Corporate Action SSO URL and submit SAML form
 * @requires Authentication
 */
export const getCorporateActionSSO = async (): Promise<void> => {
	const response = await fetchAPI<CorpActionSSOResponse>(
		ENDPOINTS.ssoCorporateAction(),
		{ useAuth: true }
	);

	if (response.success && response.data) {
		submitSamlForm(response.data.postUrl, response.data.samlResponse);
	}
};

/**
 * Get Research Portal SSO URL and redirect
 * @requires Authentication
 */
export const getResearchSSO = async (): Promise<void> => {
	const response = await fetchAPI<ResearchSSOResponse>(
		ENDPOINTS.ssoResearch(),
		{ useAuth: true }
	);

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

/**
 * Get Stock Filter SSO URL and redirect
 * @requires Authentication
 */
export const getStockFilterSSO = async (): Promise<void> => {
	const response = await fetchAPI<StockFilterSSOResponse>(
		ENDPOINTS.ssoStockFilter(),
		{ useAuth: true }
	);

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

/**
 * Get EW8 SSO URL and redirect
 * @requires Authentication
 */
export const getEW8SSO = async (): Promise<void> => {
	const response = await fetchAPI<EW8SSOResponse>(ENDPOINTS.ssoEW8(), {
		useAuth: true,
	});

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

/**
 * Get eStatement SSO URL and redirect
 * @requires Authentication
 */
export const getEStatementSSO = async (): Promise<void> => {
	const response = await fetchAPI<EStatementSSOResponse>(
		ENDPOINTS.ssoEStatement(),
		{ useAuth: true }
	);

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

/**
 * Get ECRS SSO URL and redirect
 * @requires Authentication
 */
export const getECRSSSO = async (): Promise<void> => {
	const response = await fetchAPI<ECRSSSOResponse>(ENDPOINTS.ssoECRS(), {
		useAuth: true,
	});

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// Export all methods
export const ssoService = {
	// SAML helpers
	submitSamlForm,
	redirectToSSO,

	// SSO operations
	getCorporateActionSSO,
	getResearchSSO,
	getStockFilterSSO,
	getEW8SSO,
	getEStatementSSO,
	getECRSSSO,
};
```

---

### 5. Subscription Service Enhancement (lib/services/subscriptionService.ts)

Add the new internal endpoint:

```typescript
// Add to existing subscription endpoints
export const subscriptionEndpoints = {
	// ... existing endpoints ...

	/**
	 * Get User Subscription Count by Type (Internal API)
	 * GET /subscription/api/v1/internal/userSubscription/{subscriptionType}/count
	 * @requires Authentication
	 * NEW in v2
	 */
	userSubscriptionCount: (subscriptionType: SubscriptionType) =>
		`/subscription/api/v1/internal/userSubscription/${subscriptionType}/count`,
} as const;

// Add to service methods
/**
 * Get user subscription count by type
 * @param subscriptionType - Type of subscription to count
 * @returns Subscription count
 * @requires Authentication
 */
export const getUserSubscriptionCount = async (
	subscriptionType: SubscriptionType
): Promise<APIResponse<UserSubscriptionCountResponse>> => {
	return await fetchAPI<UserSubscriptionCountResponse>(
		ENDPOINTS.userSubscriptionCount(subscriptionType),
		{ useAuth: true }
	);
};
```

---

## 🧪 Testing Plan

### 1. Profile API - Trading Info
```bash
# Test trading info endpoint
GET /profile/api/v1/tradingInfo
Authorization: Bearer {token}

# Expected response:
{
  "sip": { "toDisplay": true, "isPassed": false, "dueForSubmission": true },
  "w8ben": { "toDisplay": true, "isJointAcct": false },
  "crs": { "certified": true, "isJointAcct": false },
  "bcan": { "toDisplay": true, "requestStatus": "PENDING" }
}
```

### 2. Profile API - Update Mobile (OTP Flow)
```bash
# Step 1: Request OTP
POST /profile/api/v1/update/mobile/otp
Authorization: Bearer {token}
Content-Type: application/json

{
  "mobileNumber": "+65-12345678"
}

# Expected response:
{
  "transactionId": "txn-abc123"
}

# Step 2: Submit OTP
POST /profile/api/v1/update/mobile/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "transactionId": "txn-abc123",
  "otp": "123456"
}

# Expected response:
{
  "isSuccess": true
}
```

### 3. Profile API - Signature Upload
```bash
# Test signature upload
POST /profile/api/v1/update/signature/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary file]
metadata: {"description":"Signature upload"}

# Expected response:
{
  "isSuccess": true
}
```

### 4. External SSO - Stock Filter
```bash
# Test Stock Filter SSO
GET /externalsso/api/v1/stockFilter
Authorization: Bearer {token}

# Expected response:
{
  "redirectUrl": "https://stockfilter.example.com/sso?token=xyz..."
}
```

---

## 🎨 Usage Examples

### Example 1: Update Mobile Number Flow
```typescript
import { requestMobileOtp, submitMobileOtp } from '@/lib/services/profileService';

async function updateMobileNumber(newMobile: string) {
  // Step 1: Request OTP
  const otpResponse = await requestMobileOtp(newMobile);

  if (!otpResponse.success || !otpResponse.data) {
    console.error('Failed to request OTP');
    return;
  }

  const { transactionId } = otpResponse.data;

  // Step 2: Get OTP from user (via UI input)
  const userOtp = await promptUserForOtp();

  // Step 3: Submit OTP
  const submitResponse = await submitMobileOtp(transactionId, userOtp);

  if (submitResponse.success && submitResponse.data?.isSuccess) {
    console.log('Mobile number updated successfully!');
  }
}
```

### Example 2: SSO to Research Portal
```typescript
import { getResearchSSO } from '@/lib/services/ssoService';

async function openResearchPortal() {
  // This will automatically redirect to research portal
  await getResearchSSO();
}
```

### Example 3: Get Trading Info
```typescript
import { getTradingInfo } from '@/lib/services/profileService';

async function displayTradingInfo() {
  const response = await getTradingInfo();

  if (response.success && response.data) {
    const { sip, w8ben, crs, bcan } = response.data;

    if (sip?.dueForSubmission) {
      alert('Please submit your SIP form');
    }

    if (w8ben?.toDisplay) {
      console.log('W8BEN expires on:', w8ben.expireDate);
    }
  }
}
```

---

## 📝 Notes & Considerations

### Authentication
- All new endpoints require Bearer token (`useAuth: true`)
- Use existing `getAccessToken()` from authService
- Token refresh is handled automatically in `lib/api/client.ts`

### File Upload
- Signature upload uses `multipart/form-data`
- Cannot use standard `postAPI()` helper
- Must use custom `fetch()` with FormData

### OTP Flow
- Two-step process: request → submit
- Transaction ID links the two steps
- OTP is 6-digit numeric string
- Mobile format: `+{country}-{number}` (e.g., `+65-12345678`)

### Error Handling
- All service methods return `APIResponse<T>` with `success` flag
- Check `response.success` before accessing `response.data`
- Error messages in `response.error`

### Type Safety
- All new types exported from `types/index.ts`
- Use proper type parameters with generics
- Leverage TypeScript for compile-time safety

---

## ✅ Acceptance Criteria

### Phase 1: Types
- [ ] All new types compile without errors
- [ ] Types match API documentation exactly
- [ ] Proper JSDoc comments on all types

### Phase 2: Endpoints
- [ ] All 10 new Profile endpoints defined
- [ ] All endpoints follow existing pattern
- [ ] JSDoc comments match endpoint behavior

### Phase 3: Services
- [ ] All service methods implemented
- [ ] Proper error handling in place
- [ ] Helper methods for common operations

### Phase 4: Testing
- [ ] All endpoints tested with Postman
- [ ] OTP flow tested end-to-end
- [ ] File upload tested successfully
- [ ] SSO redirects work correctly

---

## 🚀 Deployment

### Pre-Deployment
1. Run TypeScript compiler: `npm run build`
2. Fix any type errors
3. Test all endpoints in staging environment
4. Update API documentation

### Post-Deployment
1. Monitor error logs for new endpoints
2. Verify authentication flow works
3. Test file upload limits and validation
4. Confirm SSO redirects are secure

---

**Implementation Time Estimate:** 4-6 hours
**Testing Time Estimate:** 2-3 hours
**Total:** ~8 hours

---

**End of Implementation Plan**
