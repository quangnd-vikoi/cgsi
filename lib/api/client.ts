import { API_BASE_URL } from "./config";
import type { APIResponse, StandardAPIResponse, DirectAPIResponse } from "./types";
import { getAccessToken, shouldRefreshToken, refreshAccessToken } from "@/lib/services/authService";
import { useAuthStore } from "@/stores/authStore";

// Extended fetch options with auth support
interface FetchOptions extends RequestInit {
	useAuth?: boolean; // Flag to include auth headers (default: false)
	_isRetry?: boolean; // Internal flag to prevent infinite retry loops
}

// ============================================
// TOKEN REFRESH MANAGEMENT
// ============================================

/**
 * Global promise to ensure only one token refresh happens at a time
 * Prevents race conditions when multiple requests trigger refresh simultaneously
 */
let refreshPromise: Promise<void> | null = null;

/**
 * Wait for valid tokens to be set (used when OAuth code is in URL)
 * Subscribes to auth store and resolves when tokens are available.
 * This prevents race conditions where API calls try to refresh tokens
 * while the OAuth code exchange is still in progress.
 *
 * IMPORTANT: Always waits for NEW tokens from code exchange.
 * Even if current tokens are valid, we need fresh tokens because
 * the user explicitly initiated a new login flow.
 *
 * Includes a timeout to prevent hanging forever if code exchange fails.
 */
function waitForValidTokens(): Promise<void> {
	const TIMEOUT_MS = 30000; // 30 seconds timeout

	return new Promise((resolve, reject) => {
		// Capture current tokenExpiry to detect when NEW tokens are set
		const initialTokenExpiry = useAuthStore.getState().tokenExpiry;

		// Set up timeout to prevent hanging forever if code exchange fails
		const timeoutId = setTimeout(() => {
			unsubscribe();
			reject(new Error("Timeout waiting for OAuth code exchange to complete"));
		}, TIMEOUT_MS);

		// Subscribe to auth store - resolve when NEW tokens are set by exchangeCode()
		// We check that tokenExpiry changed (not just valid) to ensure we get fresh tokens
		const unsubscribe = useAuthStore.subscribe((state) => {
			const hasValidToken = state.accessToken && state.tokenExpiry && Date.now() < state.tokenExpiry;
			const isNewToken = state.tokenExpiry !== initialTokenExpiry;

			if (hasValidToken && isNewToken) {
				clearTimeout(timeoutId);
				unsubscribe();
				resolve();
			}
		});
	});
}

/**
 * Ensures the access token is valid before making an API request
 * - If OAuth code is in URL, waits for code exchange to complete (don't refresh)
 * - Checks if token should be refreshed (within 5 minutes of expiry)
 * - If already refreshing, waits for existing refresh to complete
 * - Prevents multiple simultaneous refresh requests
 * @param force - If true, forces a refresh regardless of time-based check (used for 401 responses)
 */
async function ensureValidToken(force: boolean = false): Promise<void> {
	// If OAuth code in URL, wait for code exchange to set tokens (don't refresh)
	// This prevents race conditions where refresh overwrites tokens from code exchange
	if (typeof window !== "undefined") {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("code")) {
			await waitForValidTokens();
			return;
		}
	}

	// Check if token needs refresh (skip check if force is true)
	if (!force && !shouldRefreshToken()) {
		return;
	}

	// If already refreshing, wait for it to complete
	if (refreshPromise) {
		return refreshPromise;
	}

	// Start new refresh process
	refreshPromise = refreshAccessToken()
		.catch((error) => {
			throw error; // Re-throw to propagate the error
		})
		.finally(() => {
			// Clear the promise once refresh is complete (success or failure)
			refreshPromise = null;
		});

	return refreshPromise;
}

/**
 * Fetch wrapper for API with standardized response format
 * @param url - API endpoint
 * @param options - Fetch options (with optional useAuth flag)
 * @returns Normalized response
 */
export async function fetchAPI<T>(url: string, options: FetchOptions = {}): Promise<APIResponse<T>> {
	try {
		const { useAuth = false, _isRetry = false, ...restOptions } = options;

		const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(restOptions.headers as Record<string, string>),
		};

		// Ensure token is valid before making authenticated requests
		if (useAuth) {
			await ensureValidToken();

			const token = getAccessToken();
			if (token) {
				// Explicitly remove any old Authorization header and set the new one
				delete headers["Authorization"];
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		const res = await fetch(fullUrl, {
			...restOptions,
			headers,
		});

		// Handle empty responses (204 No Content, etc.)
		if (res.status === 204 || res.headers.get("content-length") === "0") {
			return {
				success: true,
				data: null,
				statusCode: res.status,
				error: null,
			};
		}

		// Handle 401 Unauthorized - attempt token refresh and retry ONCE
		// IMPORTANT: Check this BEFORE parsing JSON to avoid consuming the response body
		if (res.status === 401 && useAuth && !_isRetry) {
			// Force refresh on 401 (token might be invalidated server-side before time-based expiry)
			try {
				await ensureValidToken(true);
				// Retry the request once with the new token
				return fetchAPI<T>(url, { ...options, _isRetry: true });
			} catch {
				// Refresh failed - redirect to login will be handled by authService
				return {
					success: false,
					error: "Authentication failed - unable to refresh token",
					statusCode: 401,
					data: null,
				};
			}
		}

		const json: StandardAPIResponse<T> | DirectAPIResponse<T> = await res.json();

		// Check HTTP status
		if (!res.ok) {
			let errorMsg = `HTTP Error: ${res.status}`;
			if ("message" in json && typeof json.message === "string") {
				errorMsg = json.message;
			} else if ("error" in json && typeof json.error === "string") {
				errorMsg = json.error;
			}
			return {
				success: false,
				error: errorMsg,
				statusCode: res.status,
				data: null,
			};
		}

		// Check if this is a StandardAPIResponse (has status/statuscode fields)
		const isStandardResponse = "status" in json && "statuscode" in json;

		if (isStandardResponse) {
			// Standard API response format
			const standardJson = json as StandardAPIResponse<T>;

			if (standardJson.status !== "SUCCESS" || standardJson.statuscode !== "200") {
				return {
					success: false,
					error: standardJson.message || "API returned error status",
					statusCode: parseInt(standardJson.statuscode) || res.status,
					data: null,
				};
			}

			// Success case - flexible data extraction
			const data = (standardJson.article || standardJson.data || json) as T;

			return {
				success: true,
				data,
				statusCode: parseInt(standardJson.statuscode),
				error: null,
			};
		} else {
			// Direct response format (like auth endpoints)
			const directJson = json as DirectAPIResponse<T>;

			// If there's an explicit error field, it's an error
			if ("error" in directJson && directJson.error) {
				return {
					success: false,
					error: directJson.error as string,
					statusCode: res.status,
					data: null,
				};
			}

			// HTTP OK + no error field = success with direct data
			return {
				success: true,
				data: json as T,
				statusCode: res.status,
				error: null,
			};
		}
	} catch (error) {
		// Network or parsing errors
		return {
			success: false,
			error: error instanceof Error ? error.message : "Network error",
			statusCode: 500,
			data: null,
		};
	}
}

/**
 * Helper for GET requests with Next.js caching
 */
export async function fetchWithCache<T>(
	url: string,
	revalidate: number = 3600,
	options: FetchOptions = {}
): Promise<APIResponse<T>> {
	return fetchAPI<T>(url, {
		...options,
		next: { revalidate },
	});
}

/**
 * Helper for POST requests
 * Automatically handles both StandardAPIResponse and direct response formats
 */
export async function postAPI<T, B = unknown>(
	url: string,
	body: B,
	options: FetchOptions = {}
): Promise<APIResponse<T>> {
	return fetchAPI<T>(url, {
		method: "POST",
		body: JSON.stringify(body),
		...options,
	});
}

/**
 * Helper for PUT requests
 */
export async function putAPI<T, B = unknown>(
	url: string,
	body: B,
	options: FetchOptions = {}
): Promise<APIResponse<T>> {
	return fetchAPI<T>(url, {
		method: "PUT",
		body: JSON.stringify(body),
		...options,
	});
}

/**
 * Helper for DELETE requests
 */
export async function deleteAPI<T>(url: string, options: FetchOptions = {}): Promise<APIResponse<T>> {
	return fetchAPI<T>(url, {
		method: "DELETE",
		...options,
	});
}

/**
 * Helper for POST requests with FormData (multipart/form-data)
 * Used for file uploads like signature upload
 */
export async function postFormData<T>(
	url: string,
	formData: FormData,
	options: Omit<FetchOptions, "body"> = {}
): Promise<APIResponse<T>> {
	try {
		const { useAuth = false, _isRetry = false, ...restOptions } = options;

		const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

		const headers: Record<string, string> = {
			// Note: Do NOT set Content-Type for FormData - browser will set it with boundary
			...(restOptions.headers as Record<string, string>),
		};

		// Ensure token is valid before making authenticated requests
		if (useAuth) {
			await ensureValidToken();

			const token = getAccessToken();
			if (token) {
				delete headers["Authorization"];
				headers["Authorization"] = `Bearer ${token}`;
			}
		}

		const res = await fetch(fullUrl, {
			method: "POST",
			body: formData,
			...restOptions,
			headers,
		});

		// Handle empty responses
		if (res.status === 204 || res.headers.get("content-length") === "0") {
			return {
				success: true,
				data: null,
				statusCode: res.status,
				error: null,
			};
		}

		// Handle 401 Unauthorized - attempt token refresh and retry ONCE
		if (res.status === 401 && useAuth && !_isRetry) {
			// Force refresh on 401 (token might be invalidated server-side before time-based expiry)
			try {
				await ensureValidToken(true);
				return postFormData<T>(url, formData, { ...options, _isRetry: true });
			} catch {
				return {
					success: false,
					error: "Authentication failed - unable to refresh token",
					statusCode: 401,
					data: null,
				};
			}
		}

		const json: StandardAPIResponse<T> | DirectAPIResponse<T> = await res.json();

		if (!res.ok) {
			let errorMsg = `HTTP Error: ${res.status}`;
			if ("message" in json && typeof json.message === "string") {
				errorMsg = json.message;
			} else if ("error" in json && typeof json.error === "string") {
				errorMsg = json.error;
			}
			return {
				success: false,
				error: errorMsg,
				statusCode: res.status,
				data: null,
			};
		}

		const isStandardResponse = "status" in json && "statuscode" in json;

		if (isStandardResponse) {
			const standardJson = json as StandardAPIResponse<T>;

			if (standardJson.status !== "SUCCESS" || standardJson.statuscode !== "200") {
				return {
					success: false,
					error: standardJson.message || "API returned error status",
					statusCode: parseInt(standardJson.statuscode) || res.status,
					data: null,
				};
			}

			const data = (standardJson.article || standardJson.data || json) as T;

			return {
				success: true,
				data,
				statusCode: parseInt(standardJson.statuscode),
				error: null,
			};
		} else {
			const directJson = json as DirectAPIResponse<T>;

			if ("error" in directJson && directJson.error) {
				return {
					success: false,
					error: directJson.error as string,
					statusCode: res.status,
					data: null,
				};
			}

			return {
				success: true,
				data: json as T,
				statusCode: res.status,
				error: null,
			};
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Network error",
			statusCode: 500,
			data: null,
		};
	}
}
