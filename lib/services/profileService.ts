import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useUserStore } from "@/stores/userStore";
import type {
	UserProfileResponse,
	UserAccountResponse,
	TrInfoResponse,
	CreateBcanRequest,
	CreateBcanResponse,
	DonationPlanResponse,
	DonationSubmissionRequest,
	DonationSubmissionResponse,
	DonationCancelRequest,
	DonationCancelResponse,
	ContactUsClientServiceResponse,
	ContactUsCentralDealingDeskResponse,
	UserAcknowledgementListResponse,
	AcknowledgementDetailResponse,
} from "@/types";
import type { APIResponse } from "@/lib/api/types";

export const getUserProfile = async (): Promise<APIResponse<UserProfileResponse>> => {
	const response = await fetchAPI<UserProfileResponse>(ENDPOINTS.profile(), {
		useAuth: true,
	});

	if (response.success && response.data) {
		const { setProfile } = useUserStore.getState();
		setProfile(response.data);
	}

	return response;
};

export const getUserAccounts = async (): Promise<APIResponse<UserAccountResponse[]>> => {
	return await fetchAPI<UserAccountResponse[]>(ENDPOINTS.accounts(), {
		useAuth: true,
	});
};

export const getTradingRepInfo = async (): Promise<APIResponse<TrInfoResponse[]>> => {
	return await fetchAPI<TrInfoResponse[]>(ENDPOINTS.trInfo(), {
		useAuth: true,
	});
};

export const getTradingRepInfoByAccount = async (
	accountNo?: string
): Promise<APIResponse<TrInfoResponse[]>> => {
	return await fetchAPI<TrInfoResponse[]>(ENDPOINTS.trInfoByAccount(accountNo), {
		useAuth: true,
	});
};

export const createBcanRequest = async (
	accountNo: string
): Promise<APIResponse<CreateBcanResponse>> => {
	return await postAPI<CreateBcanResponse, CreateBcanRequest>(
		ENDPOINTS.createBcanRequest(),
		{ accountNo },
		{ useAuth: true }
	);
};

export const getDonationPlans = async (): Promise<APIResponse<DonationPlanResponse[]>> => {
	return await fetchAPI<DonationPlanResponse[]>(ENDPOINTS.donationPlans(), {
		useAuth: true,
	});
};

export const submitDonation = async (
	donationData: DonationSubmissionRequest
): Promise<APIResponse<DonationSubmissionResponse>> => {
	return await postAPI<DonationSubmissionResponse, DonationSubmissionRequest>(
		ENDPOINTS.submitDonation(),
		donationData,
		{ useAuth: true }
	);
};

export const cancelDonation = async (
	donationId: number
): Promise<APIResponse<DonationCancelResponse>> => {
	return await postAPI<DonationCancelResponse, DonationCancelRequest>(
		ENDPOINTS.cancelDonation(),
		{ id: donationId },
		{ useAuth: true }
	);
};

export const getClientServiceContact =
	async (): Promise<APIResponse<ContactUsClientServiceResponse>> => {
		return await fetchAPI<ContactUsClientServiceResponse>(ENDPOINTS.contactUsClientService());
	};

export const getCentralDealingDeskContact =
	async (): Promise<APIResponse<ContactUsCentralDealingDeskResponse>> => {
		return await fetchAPI<ContactUsCentralDealingDeskResponse>(
			ENDPOINTS.contactUsCentralDealingDesk()
		);
	};

export const refreshUserProfile = async (): Promise<void> => {
	await getUserProfile();
};

export const getUserEmail = async (): Promise<string | null> => {
	const { profile } = useUserStore.getState();

	if (profile?.email) {
		return profile.email;
	}

	const response = await getUserProfile();
	return response.data?.email || null;
};

export const getUserMobile = async (): Promise<string | null> => {
	const { profile } = useUserStore.getState();

	if (profile?.mobileNo) {
		return profile.mobileNo;
	}

	const response = await getUserProfile();
	return response.data?.mobileNo || null;
};

export const getAcknowledgementList =
	async (): Promise<APIResponse<UserAcknowledgementListResponse>> => {
		return await fetchAPI<UserAcknowledgementListResponse>(ENDPOINTS.acknowledgementList(), {
			useAuth: true,
		});
	};

export const getAcknowledgementDetail = async (
	id: string
): Promise<APIResponse<AcknowledgementDetailResponse>> => {
	return await fetchAPI<AcknowledgementDetailResponse>(ENDPOINTS.acknowledgementDetail(id), {
		useAuth: true,
	});
};

export const profileService = {
	getUserProfile,
	getUserAccounts,
	getTradingRepInfo,
	getTradingRepInfoByAccount,
	createBcanRequest,
	getDonationPlans,
	submitDonation,
	cancelDonation,
	getClientServiceContact,
	getCentralDealingDeskContact,
	refreshUserProfile,
	getUserEmail,
	getUserMobile,
	getAcknowledgementList,
	getAcknowledgementDetail,
};
