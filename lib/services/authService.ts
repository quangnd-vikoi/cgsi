import { postAPI } from "@/lib/api/client";
import { authEndpoints } from "@/lib/api/endpoints";
import { useAuthStore } from "@/stores/authStore";

// ============================================
// TYPES
// ============================================

export interface TokenResponse {
	idToken: string;
	accessToken: string;
	expiresIn: number;
	tokenType: string;
	refreshToken: string;
}

interface TokenRequest {
	code: string;
	clientId: string;
	redirectUri: string;
}

interface RefreshTokenRequest {
	refreshToken: string;
	clientId: string;
}

// ============================================
// CONSTANTS
// ============================================

const CLIENT_ID = "itrade";
const LOGIN_URL = "https://stgitrade.cgsi.com.sg/app/user.login.z";
const LOGOUT_URL = "https://stgitrade.cgsi.com.sg/app/logout.z";

// ============================================
// STORAGE HELPERS (Private utilities)
// ============================================

/**
 * Check if running in browser environment
 */
const isBrowser = (): boolean => typeof window !== "undefined";

// ============================================
// PUBLIC API
// ============================================

/**
 * Exchange authorization code for tokens from SSO
 * @param code - Authorization code from SSO redirect
 * @param redirectUri - Redirect URI registered with SSO
 * Note: This API is called without authentication (no token yet)
 * The response doesn't follow standard format - just verify we got data
 */
export const exchangeCode = async (code: string, redirectUri: string): Promise<void> => {
	const response = await postAPI<TokenResponse, TokenRequest>(authEndpoints.token(), {
		code,
		clientId: CLIENT_ID,
		redirectUri,
	});
	// For token exchange, just check if we have a response with token data
	if (!response.data) {
		throw new Error("Failed to exchange code - no response data");
	}

	// Store tokens in Zustand store (persisted to localStorage)
	const { setTokens } = useAuthStore.getState();
	setTokens(
		response.data.accessToken,
		response.data.refreshToken,
		response.data.expiresIn,
		response.data.idToken
	);
};

/**
 * Refresh access token using refresh token
 * Note: This API is called with refresh token (no access token yet)
 * The response doesn't follow standard format - just verify we got data
 */
export const refreshAccessToken = async (): Promise<void> => {
	const { getRefreshToken, setTokens, clearTokens } = useAuthStore.getState();
	const refreshToken = getRefreshToken();

	if (!refreshToken) {
		redirectToLogin();
		throw new Error("No refresh token available");
	}

	const response = await postAPI<TokenResponse, RefreshTokenRequest>(authEndpoints.refresh(), {
		refreshToken,
		clientId: CLIENT_ID,
	});

	// For token refresh, just check if we have a response with token data
	if (!response.data) {
		clearTokens();
		redirectToLogin();
		throw new Error("Failed to refresh token - no response data");
	}

	// Store new tokens in Zustand store (persisted to localStorage)
	setTokens(
		response.data.accessToken,
		response.data.refreshToken,
		response.data.expiresIn,
		response.data.idToken
	);
};

/**
 * Get current access token
 */
export const getAccessToken = (): string | null => {
	return useAuthStore.getState().getAccessToken();
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
	return useAuthStore.getState().isTokenExpired();
};

/**
 * Check if token should be refreshed (within 5 minutes of expiry)
 */
export const shouldRefreshToken = (): boolean => {
	return useAuthStore.getState().shouldRefreshToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
	const { getAccessToken, isTokenExpired } = useAuthStore.getState();
	const token = getAccessToken();
	return !!token && !isTokenExpired();
};

/**
 * Clear all tokens from store
 */
export const clearTokens = (): void => {
	useAuthStore.getState().clearTokens();
};

/**
 * Redirect to login page (old portal)
 */
export const redirectToLogin = (): void => {
	if (!isBrowser()) return;
	window.location.href = LOGIN_URL;
};

/**
 * Logout user and redirect to logout page (old portal)
 */
export const logout = (): void => {
	clearTokens();
	if (isBrowser()) {
		window.location.href = LOGOUT_URL;
	}
};

// ============================================
// DEFAULT EXPORT (backward compatibility)
// ============================================

export const authService = {
	exchangeCode,
	refreshToken: refreshAccessToken,
	getAccessToken,
	isTokenExpired,
	shouldRefreshToken,
	isAuthenticated,
	clearTokens,
	redirectToLogin,
	logout,
};
