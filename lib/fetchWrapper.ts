import { API_BASE_URL } from "./apiConfig";

export interface StandardAPIResponse<T> {
	status: "SUCCESS" | "ERROR";
	statuscode: string;
	article?: T;
	data?: T;
	message?: string;
}

export interface APIResponse<T> {
	success: boolean;
	data: T | null;
	error: string | null;
	statusCode: number;
}

/**
 * Fetch wrapper for API with standardized response format
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns Normalized response
 */
export async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<APIResponse<T>> {
	try {
		const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
		const res = await fetch(fullUrl, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		const json: StandardAPIResponse<T> = await res.json();

		// Check HTTP status
		if (!res.ok) {
			return {
				success: false,
				error: json.message || `HTTP Error: ${res.status}`,
				statusCode: res.status,
				data: null,
			};
		}

		// Check API status from response body
		if (json.status !== "SUCCESS" || json.statuscode !== "200") {
			return {
				success: false,
				error: json.message || "API returned error status",
				statusCode: parseInt(json.statuscode) || res.status,
				data: null,
			};
		}

		// Success case - flexible data extraction
		const data = (json.article || json.data || json) as T;

		return {
			success: true,
			data,
			statusCode: parseInt(json.statuscode),
			error: null,
		};
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
export async function fetchWithCache<T>(url: string, revalidate: number = 3600): Promise<APIResponse<T>> {
	return fetchAPI<T>(url, {
		next: { revalidate },
	});
}

/**
 * Helper for POST requests
 */
export async function postAPI<T, B = unknown>(
	url: string,
	body: B,
	options: RequestInit = {}
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
	options: RequestInit = {}
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
export async function deleteAPI<T>(url: string, options: RequestInit = {}): Promise<APIResponse<T>> {
	return fetchAPI<T>(url, {
		method: "DELETE",
		...options,
	});
}
