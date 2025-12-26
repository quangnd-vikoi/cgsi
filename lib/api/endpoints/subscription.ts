/**
 * Subscription API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Source: subscription-api-0.0.1-snapshot.json + ITrade-SubscriptionAPI.yaml
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 */
export const subscriptionEndpoints = {
	// ============================================================================
	// Market Data Subscription Endpoints (from YAML)
	// ============================================================================

	/**
	 * Get Subscriptions (Market Data Subscriptions)
	 *
	 * GET /subscription/api/v1/subscription
	 *
	 * Source: ITrade-SubscriptionAPI.yaml
	 *
	 * @returns SubscriptionResponse[] - Array of available market data subscriptions
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<SubscriptionResponse[]>(
	 *   ENDPOINTS.subscriptions(),
	 *   { useAuth: true }
	 * );
	 */
	subscriptions: () => `/subscription/api/v1/subscription`,

	/**
	 * Get User Subscriptions (User's Market Data Subscriptions)
	 *
	 * GET /subscription/api/v1/userSubscription
	 *
	 * Source: ITrade-SubscriptionAPI.yaml
	 *
	 * @returns UserSubscriptionResponse[] - Array of user's market data subscriptions
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserSubscriptionResponse[]>(
	 *   ENDPOINTS.userSubscriptions(),
	 *   { useAuth: true }
	 * );
	 */
	userSubscriptions: () => `/subscription/api/v1/userSubscription`,

	// ============================================================================
	// Product Subscription Endpoints (from JSON)
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
} as const;
