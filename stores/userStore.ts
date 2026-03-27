import { create } from "zustand";
import type { IUserProfile } from "@/types";
import { deriveUserType, type USER_TYPE } from "@/constants/accessControl";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

interface UserState {
	// Profile data from API
	profile: IUserProfile | null;

	// Legacy properties (kept for backward compatibility)
	email: string;
	mobile: string;

	// Profile management methods
	setProfile: (profile: IUserProfile) => void;
	getProfile: () => IUserProfile | null;
	clearProfile: () => void;

	// Derived user type from profile + accounts
	getUserType: () => USER_TYPE | null;

	// Legacy methods (kept for backward compatibility)
	getEmail: () => string;
	getMobile: () => string;
	updateEmail: (email: string) => void;
	updateMobile: (mobile: string) => void;
	updateUser: (email: string, mobile: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
	// Profile state
	profile: null,

	// Legacy state (mock data for backward compatibility)
	email: "rayhan.abhir@gmail.com",
	mobile: "+6591234567",

	// Profile management methods
	setProfile: (profile) =>
		set({
			profile,
			// Sync with legacy properties
			email: profile.email || get().email,
			mobile: profile.mobileNo || get().mobile,
		}),

	getProfile: () => get().profile,

	clearProfile: () => set({ profile: null }),

	// Derive user type from profile.userCategoryId + trading accounts
	getUserType: () => {
		const profile = get().profile;
		if (!profile?.userCategoryId) return null;
		const accounts = useTradingAccountStore.getState().accounts;
		return deriveUserType(profile.userCategoryId, accounts);
	},

	// Legacy methods (now use profile if available)
	getEmail: () => get().profile?.email || get().email,
	getMobile: () => get().profile?.mobileNo || get().mobile,

	updateEmail: (email) => set({ email }),
	updateMobile: (mobile) => set({ mobile }),
	updateUser: (email, mobile) => set({ email, mobile }),
}));
