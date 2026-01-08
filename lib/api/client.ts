import { API_BASE_URL } from "./config";
import type { APIResponse, StandardAPIResponse, DirectAPIResponse } from "./types";
import { getAccessToken, shouldRefreshToken, refreshAccessToken } from "@/lib/services/authService";

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
 * Ensures the access token is valid before making an API request
 * - Checks if token should be refreshed (within 5 minutes of expiry)
 * - If already refreshing, waits for existing refresh to complete
 * - Prevents multiple simultaneous refresh requests
 */
async function ensureValidToken(): Promise<void> {
	// Check if token needs refresh
	if (!shouldRefreshToken()) {
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
			// Always attempt refresh on 401 (token might be invalidated server-side)
			try {
				await ensureValidToken();
				// Retry the request once with the new token
				return fetchAPI<T>(url, { ...options, _isRetry: true });
			} catch (error) {
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
