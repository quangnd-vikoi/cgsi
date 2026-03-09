/**
 * Subscription API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Source: api-doc-v4/subscription-api-1.0.0.json
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 */
export const subscriptionEndpoints = {
	// ============================================================================
	// Product Subscription Endpoints
	// ============================================================================
	/**
	 * Get User Product Subscriptions
	 *
	 * GET /subscription/api/v1/product/mySubscription
	 *
	 * @returns UserProductSubsListResponse - Array of user's product subscriptions
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserProductSubsListResponse>(
	 *   ENDPOINTS.mySubscriptions(),
	 *   { useAuth: true }
	 * );
	 */
	mySubscriptions: () => `/subscription/api/v1/product/mySubscription`,

	/**
	 * Submit User Product Subscription
	 *
	 * POST /subscription/api/v1/product/mySubscription
	 *
	 * @param body - UserProductSubscriptionSubmissionRequest with subscription details
	 * @returns UserProductSubscriptionDetailResponse - Submitted subscription details
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await postAPI<
	 *   UserProductSubscriptionDetailResponse,
	 *   UserProductSubscriptionSubmissionRequest
	 * >(
	 *   ENDPOINTS.submitSubscription(),
	 *   {
	 *     productCode: "40288a00889fb62901889fbacc111111",
	 *     accountNo: "0000001",
	 *     totalUnit: 1,
	 *     paymentCurrency: "SGD",
	 *     paymentMode: "PayNow"
	 *   },
	 *   { useAuth: true }
	 * );
	 */
	submitSubscription: () => `/subscription/api/v1/product/mySubscription`,

	/**
	 * Get Product Subscriptions by Type
	 *
	 * GET /subscription/api/v1/product/{productType}
	 *
	 * @param productType - Product type to filter subscriptions
	 * @returns ProductionSubscriptionListResponse - Array of product subscriptions for the type
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ProductionSubscriptionListResponse>(
	 *   ENDPOINTS.productSubscriptionsByType("IPO"),
	 *   { useAuth: true }
	 * );
	 */
	productSubscriptionsByType: (productType: string) =>
		`/subscription/api/v1/product/${productType}`,

	/**
	 * Get User Product Subscription Details
	 *
	 * GET /subscription/api/v1/product/mySubscription/{subscriptionId}
	 *
	 * @param subscriptionId - Subscription ID to get details for
	 * @returns UserProductSubscriptionDetailResponse - Detailed subscription information
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserProductSubscriptionDetailResponse>(
	 *   ENDPOINTS.mySubscriptionDetails("abc123"),
	 *   { useAuth: true }
	 * );
	 */
	mySubscriptionDetails: (subscriptionId: string) =>
		`/subscription/api/v1/product/mySubscription/${subscriptionId}`,

	/**
	 * Get Product Subscription Details
	 *
	 * GET /subscription/api/v1/product/details/{productCode}
	 *
	 * @param productCode - Product code to get details for
	 * @returns ProductSubscriptionDetailResponse - Detailed product subscription information
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ProductSubscriptionDetailResponse>(
	 *   ENDPOINTS.productSubscriptionDetails("40288a00889fb62901889fbacc111111"),
	 *   { useAuth: true }
	 * );
	 */
	productSubscriptionDetails: (productCode: string) =>
		`/subscription/api/v1/product/details/${productCode}`,

	// ============================================================================
	// Market Data Subscription Endpoints
	// ============================================================================
	/**
	 * Get Available Market Data Subscription Catalog
	 *
	 * GET /subscription/api/v1/marketData/subscription
	 *
	 * @returns IMarketSubscriptionCatalog - { research[], marketData[] } groups
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	marketDataCatalog: () => `/subscription/api/v1/marketData/subscription`,

	/**
	 * Get Subscription Agreement Titles
	 *
	 * GET /subscription/api/v1/marketData/subscription/agreement?ids=001,002
	 *
	 * @param ids - array of subscription IDs
	 * @returns ISubscriptionAgreement[] - agreement list per subscription
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	marketDataAgreements: (ids: string[]) =>
		`/subscription/api/v1/marketData/subscription/agreement?ids=${ids.join(",")}`,

	/**
	 * Get Agreement HTML Content
	 *
	 * GET /subscription/api/v1/marketData/subscription/agreement/content?agreementId=
	 *
	 * @param agreementId - single agreement ID
	 * @returns ISubscriptionAgreementContent - { htmlContent, url }
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	marketDataAgreementContent: (agreementId: string) =>
		`/subscription/api/v1/marketData/subscription/agreement/content?agreementId=${agreementId}`,

	/**
	 * Submit Market Data Subscription
	 *
	 * POST /subscription/api/v1/marketData/mySubscription
	 *
	 * @param body - IMarketSubscriptionSubmitRequest
	 * @returns IMarketSubscriptionSubmitResponse - { isSuccess: boolean }
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	submitMarketDataSubscription: () =>
		`/subscription/api/v1/marketData/mySubscription`,

	/**
	 * Get User's Active Market Data Subscriptions
	 *
	 * GET /subscription/api/v1/marketData/mySubscription
	 *
	 * @returns IUserMarketSubscription[]
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	myMarketDataSubscriptions: () =>
		`/subscription/api/v1/marketData/mySubscription`,

	/**
	 * Unsubscribe from Market Data
	 *
	 * POST /subscription/api/v1/marketData/mySubscription/unsubscribe
	 *
	 * @param body - { subscriptionId: string }
	 * @returns { isSuccess: boolean }
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	unsubscribeMarketData: () =>
		`/subscription/api/v1/marketData/mySubscription/unsubscribe`,
} as const;
