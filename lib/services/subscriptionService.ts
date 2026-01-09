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

export const getAllUserSubscriptions = async () => {
	const productSubsRes = await getUserProductSubscriptions();

	return {
		marketData: null,
		productSubs: productSubsRes,
	};
};

export const canSubscribe = async (): Promise<boolean> => {
	return true;
};

export const subscriptionService = {
	getUserProductSubscriptions,
	submitProductSubscription,
	getProductSubscriptionsByType,
	getUserSubscriptionDetails,
	getProductDetails,
	getAllUserSubscriptions,
	canSubscribe,
};

export default subscriptionService;
