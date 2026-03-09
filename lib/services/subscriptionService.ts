import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	UserProductSubsListResponse,
	UserProductSubscriptionSubmissionRequest,
	UserProductSubscriptionDetailResponse,
	ProductionSubscriptionListResponse,
	ProductSubscriptionDetailResponse,
	IMarketSubscriptionCatalog,
	ISubscriptionAgreement,
	ISubscriptionAgreementContent,
	IMarketSubscriptionSubmitRequest,
	IMarketSubscriptionSubmitResponse,
	IUserMarketSubscription,
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

export const getMarketDataCatalog = async (): Promise<
	APIResponse<IMarketSubscriptionCatalog>
> => {
	return await fetchAPI<IMarketSubscriptionCatalog>(
		ENDPOINTS.marketDataCatalog(),
		{
			useAuth: true,
		}
	);
};

export const getMarketDataAgreements = async (
	ids: string[]
): Promise<APIResponse<ISubscriptionAgreement[]>> => {
	return await fetchAPI<ISubscriptionAgreement[]>(
		ENDPOINTS.marketDataAgreements(ids),
		{
			useAuth: true,
		}
	);
};

export const getMarketDataAgreementContent = async (
	agreementId: string
): Promise<APIResponse<ISubscriptionAgreementContent>> => {
	return await fetchAPI<ISubscriptionAgreementContent>(
		ENDPOINTS.marketDataAgreementContent(agreementId),
		{
			useAuth: true,
		}
	);
};

export const submitMarketDataSubscription = async (
	body: IMarketSubscriptionSubmitRequest
): Promise<APIResponse<IMarketSubscriptionSubmitResponse>> => {
	return await postAPI<
		IMarketSubscriptionSubmitResponse,
		IMarketSubscriptionSubmitRequest
	>(ENDPOINTS.submitMarketDataSubscription(), body, {
		useAuth: true,
	});
};

export const getMyMarketDataSubscriptions = async (): Promise<
	APIResponse<IUserMarketSubscription[]>
> => {
	return await fetchAPI<IUserMarketSubscription[]>(
		ENDPOINTS.myMarketDataSubscriptions(),
		{
			useAuth: true,
		}
	);
};

export const unsubscribeMarketData = async (
	subscriptionId: string
): Promise<APIResponse<{ isSuccess: boolean }>> => {
	return await postAPI<{ isSuccess: boolean }, { subscriptionId: string }>(
		ENDPOINTS.unsubscribeMarketData(),
		{ subscriptionId },
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
	getMarketDataAgreements,
	submitMarketDataSubscription,
	getMyMarketDataSubscriptions,
	unsubscribeMarketData,
	getUserSubscriptionDetails,
	getProductDetails,
	getMarketDataCatalog,
	getAllUserSubscriptions,
	canSubscribe,
};

export default subscriptionService;
