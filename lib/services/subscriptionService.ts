/**
 * Subscription Service
 *
 * Handles all subscription-related API calls including:
 * - Market data subscriptions
 * - Product subscriptions (IPO, IOP, AI)
 * - User subscription management
 *
 * All functions return APIResponse<T> with consistent error handling.
 */

import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	SubscriptionResponse,
	UserSubscriptionResponse,
	UserProductSubsListResponse,
	UserProductSubscriptionSubmissionRequest,
	UserProductSubscriptionDetailResponse,
	ProductionSubscriptionListResponse,
	ProductSubscriptionDetailResponse,
} from "@/types";

// ============================================
// MARKET DATA SUBSCRIPTIONS
// ============================================

/**
 * Get available market data subscriptions
 *
 * @returns Array of market data subscriptions available for purchase
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getMarketDataSubscriptions();
 * if (response.success && response.data) {
 *   console.log('Available subscriptions:', response.data);
 * }
 */
export const getMarketDataSubscriptions = async (): Promise<
	APIResponse<SubscriptionResponse[]>
> => {
	return await fetchAPI<SubscriptionResponse[]>(ENDPOINTS.subscriptions(), {
		useAuth: true,
	});
};

/**
 * Get user's market data subscriptions
 *
 * @returns Array of user's active market data subscriptions
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getUserMarketDataSubscriptions();
 * if (response.success && response.data) {
 *   console.log('My subscriptions:', response.data);
 * }
 */
export const getUserMarketDataSubscriptions = async (): Promise<
	APIResponse<UserSubscriptionResponse[]>
> => {
	return await fetchAPI<UserSubscriptionResponse[]>(
		ENDPOINTS.userSubscriptions(),
		{
			useAuth: true,
		}
	);
};

// ============================================
// PRODUCT SUBSCRIPTIONS (IPO/IOP/AI)
// ============================================

/**
 * Get user's product subscriptions (IPO, IOP, AI)
 *
 * @returns List of user's product subscriptions
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getUserProductSubscriptions();
 * if (response.success && response.data) {
 *   console.log('My product subscriptions:', response.data.userProductSubs);
 * }
 */
export const getUserProductSubscriptions = async (): Promise<
	APIResponse<UserProductSubsListResponse>
> => {
	return await fetchAPI<UserProductSubsListResponse>(
		ENDPOINTS.mySubscriptions(),
		{
			useAuth: true,
		}
	);
};

/**
 * Submit a product subscription application
 *
 * @param subscriptionData - Subscription submission details
 * @returns Submitted subscription details
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await submitProductSubscription({
 *   productCode: "abc123",
 *   accountNo: "1234567",
 *   totalUnit: 100,
 *   paymentCurrency: "SGD",
 *   paymentMode: "PayNow"
 * });
 */
export const submitProductSubscription = async (
	subscriptionData: UserProductSubscriptionSubmissionRequest
): Promise<APIResponse<UserProductSubscriptionDetailResponse>> => {
	return await postAPI<
		UserProductSubscriptionDetailResponse,
		UserProductSubscriptionSubmissionRequest
	>(ENDPOINTS.submitSubscription(), subscriptionData, {
		useAuth: true,
	});
};

/**
 * Get product subscriptions by type
 *
 * @param productType - Product type (e.g., "IPO", "IOP", "AI")
 * @returns List of product subscriptions for the specified type
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getProductSubscriptionsByType("IPO");
 * if (response.success && response.data) {
 *   console.log('IPO subscriptions:', response.data);
 * }
 */
export const getProductSubscriptionsByType = async (
	productType: string
): Promise<APIResponse<ProductionSubscriptionListResponse>> => {
	return await fetchAPI<ProductionSubscriptionListResponse>(
		ENDPOINTS.productSubscriptionsByType(productType),
		{
			useAuth: true,
		}
	);
};

/**
 * Get user's product subscription details
 *
 * @param subscriptionId - Subscription ID
 * @returns Detailed subscription information
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getUserSubscriptionDetails("sub123");
 * if (response.success && response.data) {
 *   console.log('Subscription details:', response.data);
 * }
 */
export const getUserSubscriptionDetails = async (
	subscriptionId: string
): Promise<APIResponse<UserProductSubscriptionDetailResponse>> => {
	return await fetchAPI<UserProductSubscriptionDetailResponse>(
		ENDPOINTS.mySubscriptionDetails(subscriptionId),
		{
			useAuth: true,
		}
	);
};

/**
 * Get product subscription details by product code
 *
 * @param productCode - Product code
 * @returns Detailed product subscription information
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getProductDetails("prod123");
 * if (response.success && response.data) {
 *   console.log('Product details:', response.data);
 * }
 */
export const getProductDetails = async (
	productCode: string
): Promise<APIResponse<ProductSubscriptionDetailResponse>> => {
	return await fetchAPI<ProductSubscriptionDetailResponse>(
		ENDPOINTS.productSubscriptionDetails(productCode),
		{
			useAuth: true,
		}
	);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get combined subscriptions (market data + product subscriptions)
 *
 * Useful for "My Subscriptions" page that needs to display both types.
 * Uses Promise.allSettled to handle partial failures gracefully.
 *
 * @returns Object containing both market data and product subscription responses
 *
 * @example
 * const result = await getAllUserSubscriptions();
 * if (result.marketData?.success) {
 *   console.log('Market data subs:', result.marketData.data);
 * }
 * if (result.productSubs?.success) {
 *   console.log('Product subs:', result.productSubs.data.userProductSubs);
 * }
 */
export const getAllUserSubscriptions = async () => {
	const [marketDataRes, productSubsRes] = await Promise.allSettled([
		getUserMarketDataSubscriptions(),
		getUserProductSubscriptions(),
	]);

	return {
		marketData:
			marketDataRes.status === "fulfilled" ? marketDataRes.value : null,
		productSubs:
			productSubsRes.status === "fulfilled" ? productSubsRes.value : null,
	};
};

/**
 * Check if user can subscribe to a specific market data product
 *
 * Checks if user already has an active subscription for the given subscription ID.
 *
 * @param subscriptionId - Subscription ID to check
 * @returns Boolean indicating if subscription is allowed
 *
 * @example
 * const canUserSubscribe = await canSubscribe("sub123");
 * if (canUserSubscribe) {
 *   // Show subscribe button
 * } else {
 *   // Show "Already subscribed" message
 * }
 */
export const canSubscribe = async (
	subscriptionId: string
): Promise<boolean> => {
	const response = await getUserMarketDataSubscriptions();
	if (!response.success || !response.data) return true;

	// Check if user already has this subscription
	const hasSubscription = response.data.some(
		(sub) => sub.subscriptionId === subscriptionId
	);
	return !hasSubscription;
};

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Subscription service object containing all subscription-related functions
 */
export const subscriptionService = {
	// Market data subscriptions
	getMarketDataSubscriptions,
	getUserMarketDataSubscriptions,

	// Product subscriptions
	getUserProductSubscriptions,
	submitProductSubscription,
	getProductSubscriptionsByType,
	getUserSubscriptionDetails,
	getProductDetails,

	// Helper functions
	getAllUserSubscriptions,
	canSubscribe,
};

export default subscriptionService;
