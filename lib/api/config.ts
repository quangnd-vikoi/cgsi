// Main API base URL for iTrade Portal backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://stgitrade.cgsi.com.sg/portal/";

// Content API base URL for 3rd party content (announcements, campaigns, events, insights)
export const CONTENT_BASE_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || "https://www.cgsi.com.sg/cgsi/api/v1";

export const LANG = {
	EN: 1,
	CN: 2,
} as const;

export type Language = (typeof LANG)[keyof typeof LANG];

/**
 * Helper function to create endpoints with a specific base URL
 * @param baseUrl - The base URL to prepend to all endpoints
 * @param endpoints - Object containing endpoint functions that return paths
 * @returns New object with all endpoints prepended with base URL
 */
export function withBaseUrl<T extends Record<string, (...args: never[]) => string>>(
	baseUrl: string,
	endpoints: T
): T {
	return Object.entries(endpoints).reduce(
		(acc, [key, fn]) => {
			acc[key as keyof T] = ((...args: Parameters<typeof fn>) => `${baseUrl}${fn(...args)}`) as T[keyof T];
			return acc;
		},
		{} as T
	);
}
