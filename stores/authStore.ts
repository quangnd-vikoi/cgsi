import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	tokenExpiry: number | null;
	idToken: string | null;

	// Actions
	setTokens: (
		accessToken: string,
		refreshToken: string,
		expiresIn: number,
		idToken: string
	) => void;
	clearTokens: () => void;
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	isTokenExpired: () => boolean;
	shouldRefreshToken: () => boolean;
}

const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			accessToken: null,
			refreshToken: null,
			tokenExpiry: null,
			idToken: null,

			setTokens: (accessToken, refreshToken, expiresIn, idToken) => {
				const expiry = Date.now() + expiresIn * 1000;

				set({
					accessToken,
					refreshToken,
					tokenExpiry: expiry,
					idToken,
				});
			},

			clearTokens: () => {
				set({
					accessToken: null,
					refreshToken: null,
					tokenExpiry: null,
					idToken: null,
				});
			},

			getAccessToken: () => get().accessToken,

			getRefreshToken: () => get().refreshToken,

			isTokenExpired: () => {
				const { tokenExpiry } = get();
				if (!tokenExpiry) return true;
				return Date.now() >= tokenExpiry;
			},

			shouldRefreshToken: () => {
				const { tokenExpiry } = get();
				if (!tokenExpiry) return true;
				return Date.now() >= tokenExpiry - REFRESH_BUFFER_MS;
			},
		}),
		{
			name: "auth-storage", // localStorage key
			storage: createJSONStorage(() => localStorage),
		}
	)
);
