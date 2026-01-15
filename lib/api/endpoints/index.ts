import { contentEndpoints as rawContentEndpoints } from "./content";
import { notificationEndpoints as rawNotificationEndpoints } from "./notifications";
import { authEndpoints as rawAuthEndpoints } from "./auth";
import { profileEndpoints as rawProfileEndpoints } from "./profile";
import { subscriptionEndpoints as rawSubscriptionEndpoints } from "./subscription";
import { externalSSOEndpoints as rawExternalSSOEndpoints } from "./externalSSO";
import { API_BASE_URL, CONTENT_BASE_URL, withBaseUrl } from "../config";

export const contentEndpoints = withBaseUrl(CONTENT_BASE_URL, rawContentEndpoints);

export const notificationEndpoints = withBaseUrl(API_BASE_URL, rawNotificationEndpoints);

export const authEndpoints = withBaseUrl(API_BASE_URL, rawAuthEndpoints);

export const profileEndpoints = withBaseUrl(API_BASE_URL, rawProfileEndpoints);

export const subscriptionEndpoints = withBaseUrl(API_BASE_URL, rawSubscriptionEndpoints);

export const externalSSOEndpoints = withBaseUrl(API_BASE_URL, rawExternalSSOEndpoints);

export const ENDPOINTS = {
	...contentEndpoints,
	...notificationEndpoints,
	...authEndpoints,
	...profileEndpoints,
	...subscriptionEndpoints,
	...externalSSOEndpoints,
} as const;

export { LANG, API_BASE_URL, CONTENT_BASE_URL, type Language } from "../config";
