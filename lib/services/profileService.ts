import { fetchAPI, postAPI, postFormData } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useUserStore } from "@/stores/userStore";
import type {
	UserProfileResponse,
	UserAccountResponse,
	TrInfoResponse,
	TradingInfoResponse,
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
	MobileOtpRequest,
	MobileOtpResponse,
	EmailOtpRequest,
	EmailOtpResponse,
	UpdateSubmitRequest,
	UpdateSubmitResponse,
	SignatureUploadResponse,
	SignatureSubmitRequest,
	SignatureSubmitResponse,
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

export const getTradingInfo = async (): Promise<APIResponse<TradingInfoResponse>> => {
	return await fetchAPI<TradingInfoResponse>(ENDPOINTS.tradingInfo(), {
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

// ============================================================================
// Update Info Service Functions
// ============================================================================

export const sendMobileOtp = async (
	mobileNumber: string
): Promise<APIResponse<MobileOtpResponse>> => {
	return await postAPI<MobileOtpResponse, MobileOtpRequest>(
		ENDPOINTS.updateMobileOtp(),
		{ mobileNumber },
		{ useAuth: true }
	);
};

export const submitMobileUpdate = async (
	transactionId: string,
	otp: string
): Promise<APIResponse<UpdateSubmitResponse>> => {
	return await postAPI<UpdateSubmitResponse, UpdateSubmitRequest>(
		ENDPOINTS.updateMobileSubmit(),
		{ transactionId, otp },
		{ useAuth: true }
	);
};

export const sendEmailOtp = async (email: string): Promise<APIResponse<EmailOtpResponse>> => {
	return await postAPI<EmailOtpResponse, EmailOtpRequest>(
		ENDPOINTS.updateEmailOtp(),
		{ email },
		{ useAuth: true }
	);
};

export const submitEmailUpdate = async (
	transactionId: string,
	otp: string
): Promise<APIResponse<UpdateSubmitResponse>> => {
	return await postAPI<UpdateSubmitResponse, UpdateSubmitRequest>(
		ENDPOINTS.updateEmailSubmit(),
		{ transactionId, otp },
		{ useAuth: true }
	);
};

export const uploadSignature = async (
	file: File,
	metadata?: string
): Promise<APIResponse<SignatureUploadResponse>> => {
	const formData = new FormData();
	formData.append("file", file);
	if (metadata) {
		formData.append("metadata", metadata);
	}
	return await postFormData<SignatureUploadResponse>(ENDPOINTS.updateSignatureUpload(), formData, {
		useAuth: true,
	});
};

export const submitSignatureUpdate = async (
	transactionId: string
): Promise<APIResponse<SignatureSubmitResponse>> => {
	return await postAPI<SignatureSubmitResponse, SignatureSubmitRequest>(
		ENDPOINTS.updateSignatureSubmit(),
		{ transactionId },
		{ useAuth: true }
	);
};

export const profileService = {
	getUserProfile,
	getUserAccounts,
	getTradingRepInfo,
	getTradingRepInfoByAccount,
	getTradingInfo,
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
	sendMobileOtp,
	submitMobileUpdate,
	sendEmailOtp,
	submitEmailUpdate,
	uploadSignature,
	submitSignatureUpdate,
};
