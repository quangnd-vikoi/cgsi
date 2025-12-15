/**
 * Authentication and authorization API endpoints (relative paths only)
 * Base URL will be automatically prepended when exported
 * Prepared for future SSO integration
 */
export const authEndpoints = {
	/**
	 * Get SSO Parameter for Corporate Action
	 * Returns SSO parameters for external corporate action access
	 */
	corporateAction: () => `/corporateAction`,

	// Future SSO endpoints will be added here:
	// token: () => `/sso/token`,
	// refresh: () => `/sso/token/refresh`,
} as const;
