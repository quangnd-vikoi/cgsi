/**
 * Authentication and authorization API endpoints (relative paths only)
 * Base URL will be automatically prepended when exported
 * Prepared for future SSO integration
 */
export const authEndpoints = {
	/**
	 * Exchange authorization code for access and refresh tokens
	 */
	token: () => `/sso/api/v1/token`,

	/**
	 * Refresh access token using refresh token
	 */
	refresh: () => `/sso/api/v1/token/refresh`,
} as const;
