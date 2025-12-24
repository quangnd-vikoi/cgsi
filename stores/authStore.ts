import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Decode JWT token to extract payload
 * Returns null if decoding fails
 */
const decodeJWT = (token: string): Record<string, unknown> | null => {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;

		const payload = parts[1];
		const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
		return JSON.parse(decoded);
	} catch {
		return null;
	}
};

/**
 * Extract profileId from idToken JWT
 */
const extractProfileId = (idToken: string): string | null => {
	const payload = decodeJWT(idToken);
	if (!payload) return null;

	// The profileId might be under different keys in the JWT
	// Common keys: sub, profileId, profile_id
	return (payload.profileId as string) || (payload.profile_id as string) || (payload.sub as string) || null;
};

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	tokenExpiry: number | null;
	profileId: string | null;
	idToken: string | null;

	// Actions
	setTokens: (
		accessToken: string,
		refreshToken: string,
		expiresIn: number,
		idToken: string,
		profileId: string
	) => void;
	clearTokens: () => void;
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	getProfileId: () => string | null;
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
			profileId: null,
			idToken: null,

			setTokens: (accessToken, refreshToken, expiresIn, idToken, profileId) => {
				const expiry = Date.now() + expiresIn * 1000;

				// If profileId not provided, try to extract from idToken
				const finalProfileId = profileId || extractProfileId(idToken);

				set({
					accessToken,
					refreshToken,
					tokenExpiry: expiry,
					idToken,
					profileId: finalProfileId,
				});
			},

			clearTokens: () => {
				set({
					accessToken: null,
					refreshToken: null,
					tokenExpiry: null,
					profileId: null,
					idToken: null,
				});
			},

			getAccessToken: () => get().accessToken,

			getRefreshToken: () => get().refreshToken,

			getProfileId: () => get().profileId,

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
