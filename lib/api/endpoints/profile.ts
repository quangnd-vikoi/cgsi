/**
 * Profile API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 *
 * Authentication:
 * - Most endpoints require Bearer token (useAuth: true)
 * - Public endpoints require no authentication
 */
export const profileEndpoints = {
	/**
	 * Get Trading Representative Info for authenticated user
	 *
	 * GET /profile/api/v1/trInfo
	 *
	 * @returns TrInfoResponse[] - Array of trading representative information
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<TrInfoResponse[]>(
	 *   ENDPOINTS.trInfo(),
	 *   { useAuth: true }
	 * );
	 */
	trInfo: () => `/profile/api/v1/trInfo`,

	/**
	 * Get Trading Representative Info by Account Number (Internal)
	 *
	 * GET /profile/api/v1/internal/trInfo?accountNo={accountNo}
	 *
	 * @param accountNo - Optional account number to filter by
	 * @returns TrInfoResponse[] - Array of trading representative information
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<TrInfoResponse[]>(
	 *   ENDPOINTS.trInfoByAccount("1234567"),
	 *   { useAuth: true }
	 * );
	 */
	trInfoByAccount: (accountNo?: string) =>
		`/profile/api/v1/internal/trInfo${accountNo ? `?accountNo=${accountNo}` : ""}`,

	/**
	 * Get User Profile (Internal)
	 *
	 * GET /profile/api/v1/internal/profile
	 *
	 * @returns UserProfileResponse - User profile information including contact details
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserProfileResponse>(
	 *   ENDPOINTS.profile(),
	 *   { useAuth: true }
	 * );
	 */
	profile: () => `/profile/api/v1/internal/profile`,

	/**
	 * Get User Trading Accounts
	 *
	 * GET /profile/api/v1/accounts
	 *
	 * @returns UserAccountResponse[] - Array of user's trading accounts
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserAccountResponse[]>(
	 *   ENDPOINTS.accounts(),
	 *   { useAuth: true }
	 * );
	 */
	accounts: () => `/profile/api/v1/accounts`,

	/**
	 * Get User Trading Info (Trading Declarations)
	 *
	 * GET /profile/api/v1/tradingInfo
	 *
	 * @returns TradingInfoResponse - Trading declarations status (SIP, W8-BEN, CRS, BCAN)
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<TradingInfoResponse>(
	 *   ENDPOINTS.tradingInfo(),
	 *   { useAuth: true }
	 * );
	 */
	tradingInfo: () => `/profile/api/v1/tradingInfo`,

	/**
	 * Create BCAN Request
	 *
	 * POST /profile/api/v1/tradingInfo/bcan/request
	 *
	 * @param body - CreateBcanRequest with accountNo
	 * @returns CreateBcanResponse - Success status of BCAN request creation
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<CreateBcanResponse, CreateBcanRequest>(
	 *   ENDPOINTS.createBcanRequest(),
	 *   { accountNo: "1234567890" },
	 *   { useAuth: true }
	 * );
	 */
	createBcanRequest: () => `/profile/api/v1/tradingInfo/bcan/request`,

	/**
	 * Get Donation Plans
	 *
	 * GET /profile/api/v1/donation/plan
	 *
	 * @returns DonationPlanResponse[] - Array of donation plans
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<DonationPlanResponse[]>(
	 *   ENDPOINTS.donationPlans(),
	 *   { useAuth: true }
	 * );
	 */
	donationPlans: () => `/profile/api/v1/donation/plan`,

	/**
	 * Submit Donation
	 *
	 * POST /profile/api/v1/donation/submission
	 *
	 * @param body - DonationSubmissionRequest with donation details
	 * @returns DonationSubmissionResponse - Success status of donation submission
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<DonationSubmissionResponse, DonationSubmissionRequest>(
	 *   ENDPOINTS.submitDonation(),
	 *   {
	 *     accountNo: "1234567",
	 *     amount: 100,
	 *     currency: "SGD",
	 *     paymentMethod: "PLAN",
	 *     paymentMode: "DONATE",
	 *     months: 12
	 *   },
	 *   { useAuth: true }
	 * );
	 */
	submitDonation: () => `/profile/api/v1/donation/submission`,

	/**
	 * Cancel Donation
	 *
	 * POST /profile/api/v1/donation/cancel
	 *
	 * @param body - DonationCancelRequest with donation ID
	 * @returns DonationCancelResponse - Success status of donation cancellation
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<DonationCancelResponse, DonationCancelRequest>(
	 *   ENDPOINTS.cancelDonation(),
	 *   { id: 123 },
	 *   { useAuth: true }
	 * );
	 */
	cancelDonation: () => `/profile/api/v1/donation/cancel`,

	/**
	 * Get Client Service Contact Information (Public)
	 *
	 * GET /profile/api/v1/contactUs/clientService
	 *
	 * @returns ContactUsClientServiceResponse - Client service contact details
	 * @requires No authentication
	 *
	 * @example
	 * const response = await fetchAPI<ContactUsClientServiceResponse>(
	 *   ENDPOINTS.contactUsClientService()
	 * );
	 */
	contactUsClientService: () => `/profile/api/v1/contactUs/clientService`,

	/**
	 * Get Central Dealing Desk Contact Information (Public)
	 *
	 * GET /profile/api/v1/contactUs/centralDealingDesk
	 *
	 * @returns ContactUsCentralDealingDeskResponse - Central dealing desk contact details
	 * @requires No authentication
	 *
	 * @example
	 * const response = await fetchAPI<ContactUsCentralDealingDeskResponse>(
	 *   ENDPOINTS.contactUsCentralDealingDesk()
	 * );
	 */
	contactUsCentralDealingDesk: () => `/profile/api/v1/contactUs/centralDealingDesk`,

	/**
	 * Get User Acknowledgement List
	 *
	 * GET /profile/api/v1/acknowledgement/user/list
	 *
	 * @returns UserAcknowledgementListResponse - User's accepted acknowledgements grouped by type
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserAcknowledgementListResponse>(
	 *   ENDPOINTS.acknowledgementList(),
	 *   { useAuth: true }
	 * );
	 */
	acknowledgementList: () => `/profile/api/v1/acknowledgement/user/list`,

	/**
	 * Get User Acknowledgement Detail
	 *
	 * GET /profile/api/v1/acknowledgement/user/details/{id}
	 *
	 * @param id - Agreement ID
	 * @returns AcknowledgementDetailResponse - Detailed acknowledgement information
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<AcknowledgementDetailResponse>(
	 *   ENDPOINTS.acknowledgementDetail("8a1ba0813b3b8b4b013b4eb83b170e9e"),
	 *   { useAuth: true }
	 * );
	 */
	acknowledgementDetail: (id: string) => `/profile/api/v1/acknowledgement/user/details/${id}`,

	// ============================================================================
	// Update Info Endpoints
	// ============================================================================

	/**
	 * Send OTP to New Mobile Number
	 *
	 * POST /profile/api/v1/update/mobile/otp
	 *
	 * @param body - MobileOtpRequest with mobileNumber
	 * @returns MobileOtpResponse - Transaction ID for verification
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<MobileOtpResponse, MobileOtpRequest>(
	 *   ENDPOINTS.updateMobileOtp(),
	 *   { mobileNumber: "+65-12345678" },
	 *   { useAuth: true }
	 * );
	 */
	updateMobileOtp: () => `/profile/api/v1/update/mobile/otp`,

	/**
	 * Submit Mobile Number Update
	 *
	 * POST /profile/api/v1/update/mobile/submit
	 *
	 * @param body - UpdateSubmitRequest with transactionId and otp
	 * @returns UpdateSubmitResponse - Success status
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<UpdateSubmitResponse, UpdateSubmitRequest>(
	 *   ENDPOINTS.updateMobileSubmit(),
	 *   { transactionId: "...", otp: "123456" },
	 *   { useAuth: true }
	 * );
	 */
	updateMobileSubmit: () => `/profile/api/v1/update/mobile/submit`,

	/**
	 * Send OTP to New Email Address
	 *
	 * POST /profile/api/v1/update/email/otp
	 *
	 * @param body - EmailOtpRequest with email
	 * @returns EmailOtpResponse - Transaction ID for verification
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<EmailOtpResponse, EmailOtpRequest>(
	 *   ENDPOINTS.updateEmailOtp(),
	 *   { email: "new@example.com" },
	 *   { useAuth: true }
	 * );
	 */
	updateEmailOtp: () => `/profile/api/v1/update/email/otp`,

	/**
	 * Submit Email Address Update
	 *
	 * POST /profile/api/v1/update/email/submit
	 *
	 * @param body - UpdateSubmitRequest with transactionId and otp
	 * @returns UpdateSubmitResponse - Success status
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<UpdateSubmitResponse, UpdateSubmitRequest>(
	 *   ENDPOINTS.updateEmailSubmit(),
	 *   { transactionId: "...", otp: "123456" },
	 *   { useAuth: true }
	 * );
	 */
	updateEmailSubmit: () => `/profile/api/v1/update/email/submit`,

	/**
	 * Upload Signature File
	 *
	 * POST /profile/api/v1/update/signature/upload
	 *
	 * @param body - FormData with file (binary) and metadata (string)
	 * @returns SignatureUploadResponse - Transaction ID for submission
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const formData = new FormData();
	 * formData.append("file", file);
	 * formData.append("metadata", JSON.stringify({ type: "signature" }));
	 * const response = await postFormData<SignatureUploadResponse>(
	 *   ENDPOINTS.updateSignatureUpload(),
	 *   formData,
	 *   { useAuth: true }
	 * );
	 */
	updateSignatureUpload: () => `/profile/api/v1/update/signature/upload`,

	/**
	 * Submit Signature Update
	 *
	 * POST /profile/api/v1/update/singnature/submit
	 * Note: Typo in spec ("singnature" instead of "signature")
	 *
	 * @param body - SignatureSubmitRequest with transactionId
	 * @returns SignatureSubmitResponse - Success status
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<SignatureSubmitResponse, SignatureSubmitRequest>(
	 *   ENDPOINTS.updateSignatureSubmit(),
	 *   { transactionId: "..." },
	 *   { useAuth: true }
	 * );
	 */
	updateSignatureSubmit: () => `/profile/api/v1/update/singnature/submit`,
} as const;
