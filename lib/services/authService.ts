import { postAPI } from "@/lib/api/client";
import { authEndpoints } from "@/lib/api/endpoints";
import { useAuthStore } from "@/stores/authStore";

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

const CLIENT_ID = "itrade";
const LOGIN_URL = "https://stgitrade.cgsi.com.sg/app/user.login.z";
const LOGOUT_URL = "https://stgitrade.cgsi.com.sg/app/logout.z";

const isBrowser = (): boolean => typeof window !== "undefined";

export const exchangeCode = async (code: string, redirectUri: string): Promise<void> => {
	const response = await postAPI<TokenResponse, TokenRequest>(authEndpoints.token(), {
		code,
		clientId: CLIENT_ID,
		redirectUri,
	});

	if (!response.data) {
		throw new Error("Failed to exchange code - no response data");
	}

	const { setTokens } = useAuthStore.getState();
	setTokens(
		response.data.accessToken,
		response.data.refreshToken,
		response.data.expiresIn,
		response.data.idToken
	);
};

export const refreshAccessToken = async (): Promise<void> => {
	const { getRefreshToken, setTokens, clearTokens } = useAuthStore.getState();
	const refreshToken = getRefreshToken();

	if (!refreshToken) {
		if (isBrowser()) {
			sessionStorage.setItem("auth_error", "Your session has expired. Please log in again.");
		}
		redirectToLogin();
		throw new Error("No refresh token available");
	}

	const response = await postAPI<TokenResponse, RefreshTokenRequest>(authEndpoints.refresh(), {
		refreshToken,
		clientId: CLIENT_ID,
	});

	if (!response.success || !response.data) {
		clearTokens();
		if (isBrowser()) {
			sessionStorage.setItem("auth_error", "Your session has expired. Please log in again.");
		}
		redirectToLogin();
		throw new Error(response.error || "Failed to refresh token - no response data");
	}

	if (!response.data.accessToken || !response.data.refreshToken) {
		throw new Error("Invalid token response - missing required fields");
	}

	setTokens(
		response.data.accessToken,
		response.data.refreshToken,
		response.data.expiresIn,
		response.data.idToken
	);
};

export const getAccessToken = (): string | null => {
	return useAuthStore.getState().getAccessToken();
};

export const isTokenExpired = (): boolean => {
	return useAuthStore.getState().isTokenExpired();
};

export const shouldRefreshToken = (): boolean => {
	return useAuthStore.getState().shouldRefreshToken();
};

export const isAuthenticated = (): boolean => {
	const { getAccessToken, isTokenExpired } = useAuthStore.getState();
	const token = getAccessToken();
	return !!token && !isTokenExpired();
};

export const clearTokens = (): void => {
	useAuthStore.getState().clearTokens();
};

export const redirectToLogin = (): void => {
	if (!isBrowser()) return;
	window.location.href = LOGIN_URL;
};

export const logout = (): void => {
	clearTokens();
	if (isBrowser()) {
		window.location.href = LOGOUT_URL;
	}
};

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
