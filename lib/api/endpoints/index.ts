import { contentEndpoints as rawContentEndpoints } from "./content";
import { notificationEndpoints as rawNotificationEndpoints } from "./notifications";
import { authEndpoints as rawAuthEndpoints } from "./auth";
import { API_BASE_URL, CONTENT_BASE_URL, withBaseUrl } from "../config";

export const contentEndpoints = withBaseUrl(CONTENT_BASE_URL, rawContentEndpoints);

export const notificationEndpoints = withBaseUrl(API_BASE_URL, rawNotificationEndpoints);

export const authEndpoints = withBaseUrl(API_BASE_URL, rawAuthEndpoints);

export const ENDPOINTS = {
	...contentEndpoints,
	...notificationEndpoints,
	...authEndpoints,
} as const;

export { LANG, API_BASE_URL, CONTENT_BASE_URL, type Language } from "../config";
