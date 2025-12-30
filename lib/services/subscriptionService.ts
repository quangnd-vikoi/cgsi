/**
 * Subscription Service
 *
 * Handles all subscription-related API calls for:
 * - Product subscriptions (IPO, IOP, AI)
 * - User subscription management
 *
 * NOTE: Market data subscription endpoints do NOT exist in the API.
 * Only PRODUCT subscriptions are supported.
 *
 * All functions return APIResponse<T> with consistent error handling.
 */

import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	UserProductSubsListResponse,
	UserProductSubscriptionSubmissionRequest,
	UserProductSubscriptionDetailResponse,
	ProductionSubscriptionListResponse,
	ProductSubscriptionDetailResponse,
} from "@/types";

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
 * Get user's product subscriptions
 *
 * NOTE: Market data subscription endpoints do not exist.
 * This function only returns product subscriptions.
 *
 * @returns Object containing product subscription response
 *
 * @example
 * const result = await getAllUserSubscriptions();
 * if (result.productSubs?.success) {
 *   console.log('Product subs:', result.productSubs.data.userProductSubs);
 * }
 */
export const getAllUserSubscriptions = async () => {
	const productSubsRes = await getUserProductSubscriptions();

	return {
		marketData: null, // Market data endpoints do not exist
		productSubs: productSubsRes,
	};
};

/**
 * Check if user can subscribe to a product
 *
 * NOTE: Market data subscription endpoints do not exist.
 * This function always returns true as we cannot check subscription status.
 *
 * @returns Always returns true
 *
 * @example
 * const canUserSubscribe = await canSubscribe();
 * if (canUserSubscribe) {
 *   // Show subscribe button
 * }
 */
export const canSubscribe = async (): Promise<boolean> => {
	// Market data subscription endpoints do not exist
	// Always return true as we cannot check subscription status
	return true;
};

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Subscription service object containing all subscription-related functions
 *
 * NOTE: Only PRODUCT subscription functions are available.
 * Market data subscription endpoints do NOT exist in the API.
 */
export const subscriptionService = {
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
