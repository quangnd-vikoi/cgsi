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
} from "@/types";
import type { APIResponse } from "@/lib/api/types";

// ============================================
// PUBLIC API - Profile Operations
// ============================================

/**
 * Get user profile and automatically update userStore
 * @returns User profile data
 * @requires Authentication
 */
export const getUserProfile = async (): Promise<APIResponse<UserProfileResponse>> => {
	const response = await fetchAPI<UserProfileResponse>(ENDPOINTS.profile(), {
		useAuth: true,
	});

	// Automatically update userStore with profile data
	if (response.success && response.data) {
		const { setProfile } = useUserStore.getState();
		setProfile(response.data);
	}

	return response;
};

/**
 * Get user trading accounts
 * @returns Array of user accounts
 * @requires Authentication
 */
export const getUserAccounts = async (): Promise<APIResponse<UserAccountResponse[]>> => {
	return await fetchAPI<UserAccountResponse[]>(ENDPOINTS.accounts(), {
		useAuth: true,
	});
};

/**
 * Get trading representative information for authenticated user
 * @returns Array of trading representative info
 * @requires Authentication
 */
export const getTradingRepInfo = async (): Promise<APIResponse<TrInfoResponse[]>> => {
	return await fetchAPI<TrInfoResponse[]>(ENDPOINTS.trInfo(), {
		useAuth: true,
	});
};

/**
 * Get trading representative information by account number (Internal)
 * @param accountNo - Optional account number to filter by
 * @returns Array of trading representative info
 * @requires Authentication
 */
export const getTradingRepInfoByAccount = async (
	accountNo?: string
): Promise<APIResponse<TrInfoResponse[]>> => {
	return await fetchAPI<TrInfoResponse[]>(ENDPOINTS.trInfoByAccount(accountNo), {
		useAuth: true,
	});
};

// ============================================
// PUBLIC API - BCAN Operations
// ============================================

/**
 * Create BCAN request for a trading account
 * @param accountNo - Account number for BCAN request
 * @returns Success status
 * @requires Authentication
 */
export const createBcanRequest = async (
	accountNo: string
): Promise<APIResponse<CreateBcanResponse>> => {
	return await postAPI<CreateBcanResponse, CreateBcanRequest>(
		ENDPOINTS.createBcanRequest(),
		{ accountNo },
		{ useAuth: true }
	);
};

// ============================================
// PUBLIC API - Donation Operations
// ============================================

/**
 * Get available donation plans
 * @returns Array of donation plans
 * @requires Authentication
 */
export const getDonationPlans = async (): Promise<APIResponse<DonationPlanResponse[]>> => {
	return await fetchAPI<DonationPlanResponse[]>(ENDPOINTS.donationPlans(), {
		useAuth: true,
	});
};

/**
 * Submit a new donation
 * @param donationData - Donation submission details
 * @returns Success status
 * @requires Authentication
 */
export const submitDonation = async (
	donationData: DonationSubmissionRequest
): Promise<APIResponse<DonationSubmissionResponse>> => {
	return await postAPI<DonationSubmissionResponse, DonationSubmissionRequest>(
		ENDPOINTS.submitDonation(),
		donationData,
		{ useAuth: true }
	);
};

/**
 * Cancel an existing donation
 * @param donationId - ID of donation to cancel
 * @returns Success status
 * @requires Authentication
 */
export const cancelDonation = async (
	donationId: number
): Promise<APIResponse<DonationCancelResponse>> => {
	return await postAPI<DonationCancelResponse, DonationCancelRequest>(
		ENDPOINTS.cancelDonation(),
		{ id: donationId },
		{ useAuth: true }
	);
};

// ============================================
// PUBLIC API - Contact Information (Public endpoints)
// ============================================

/**
 * Get client service contact information
 * @returns Client service contact details
 * @requires No authentication (public endpoint)
 */
export const getClientServiceContact =
	async (): Promise<APIResponse<ContactUsClientServiceResponse>> => {
		return await fetchAPI<ContactUsClientServiceResponse>(ENDPOINTS.contactUsClientService());
	};

/**
 * Get central dealing desk contact information
 * @returns Central dealing desk contact details
 * @requires No authentication (public endpoint)
 */
export const getCentralDealingDeskContact =
	async (): Promise<APIResponse<ContactUsCentralDealingDeskResponse>> => {
		return await fetchAPI<ContactUsCentralDealingDeskResponse>(
			ENDPOINTS.contactUsCentralDealingDesk()
		);
	};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Refresh user profile data in store
 * Convenience method to update profile without returning data
 * @returns Promise that resolves when profile is updated
 */
export const refreshUserProfile = async (): Promise<void> => {
	await getUserProfile();
};

/**
 * Get user email from profile
 * First tries to get from store, falls back to API if needed
 * @returns User email or null
 */
export const getUserEmail = async (): Promise<string | null> => {
	const { profile } = useUserStore.getState();

	if (profile?.email) {
		return profile.email;
	}

	// Fetch from API if not in store
	const response = await getUserProfile();
	return response.data?.email || null;
};

/**
 * Get user mobile number from profile
 * First tries to get from store, falls back to API if needed
 * @returns User mobile number or null
 */
export const getUserMobile = async (): Promise<string | null> => {
	const { profile } = useUserStore.getState();

	if (profile?.mobileNo) {
		return profile.mobileNo;
	}

	// Fetch from API if not in store
	const response = await getUserProfile();
	return response.data?.mobileNo || null;
};

// ============================================
// DEFAULT EXPORT (backward compatibility)
// ============================================

export const profileService = {
	// Profile operations
	getUserProfile,
	getUserAccounts,
	getTradingRepInfo,
	getTradingRepInfoByAccount,

	// BCAN operations
	createBcanRequest,

	// Donation operations
	getDonationPlans,
	submitDonation,
	cancelDonation,

	// Contact information (public)
	getClientServiceContact,
	getCentralDealingDeskContact,

	// Helper functions
	refreshUserProfile,
	getUserEmail,
	getUserMobile,
};
