/**
 * External SSO Service
 *
 * Handles all external SSO (Single Sign-On) related API calls.
 * Provides functions to get SSO parameters and redirect to external systems.
 *
 * All functions return APIResponse<T> with consistent error handling.
 */

import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	NtpSSOResponse,
	ResearchSSOResponse,
	StockFilterSSOResponse,
	CorpActionSSOResponse,
	EStatementSSOResponse,
	IScreenerSSOResponse,
	EW8SSOResponse,
	ECRSSSOResponse,
} from "@/types";

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Submit a SAML POST form to an external SSO endpoint
 * Used for Corporate Action SSO which requires SAML form submission
 * Opens in a new tab
 *
 * @param postUrl - Target URL for SAML form submission
 * @param samlResponse - SAML response token
 *
 * @example
 * submitSamlForm("https://external.com/sso", "SAML_TOKEN_HERE");
 */
export function submitSamlForm(postUrl: string, samlResponse: string): void {
	const form = document.createElement("form");
	form.method = "POST";
	form.action = postUrl;
	form.target = "_blank";

	const input = document.createElement("input");
	input.type = "hidden";
	input.name = "SAMLResponse";
	input.value = samlResponse;

	form.appendChild(input);
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

/**
 * Generic redirect helper for SSO endpoints that return redirectUrl
 * Opens in a new tab
 *
 * @param redirectUrl - Target URL to redirect to
 *
 * @example
 * redirectToSSO("https://external.com/portal");
 */
export function redirectToSSO(redirectUrl: string): void {
	window.open(redirectUrl, "_blank", "noopener,noreferrer");
}

// ============================================
// NTP (Next Trading Platform) SSO
// ============================================

/**
 * Get SSO parameters for NTP (Next Trading Platform)
 *
 * @returns NTP SSO parameters (postUrl, togaToken, assertion, etc.)
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getNTPSSO();
 * if (response.success && response.data) {
 *   const { postUrl, togaToken, assertion } = response.data;
 *   // Use these to create form and submit
 * }
 */
export const getNTPSSO = async (): Promise<APIResponse<NtpSSOResponse>> => {
	return await fetchAPI<NtpSSOResponse>(ENDPOINTS.ssoNTP(), {
		useAuth: true,
	});
};

/**
 * Get NTP SSO parameters and automatically redirect
 * This function fetches SSO params and handles the redirect automatically
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToNTP();
 * // User will be redirected to NTP
 */
export const redirectToNTP = async (): Promise<void> => {
	const response = await getNTPSSO();

	if (response.success && response.data) {
		// For NTP, we might need to create a form with multiple fields
		// Adjust this based on actual NTP SSO requirements
		const { postUrl, togaToken, assertion } = response.data;

		const form = document.createElement("form");
		form.method = "POST";
		form.action = postUrl;
		form.target = "_blank";

		// Add togaToken field
		const togaInput = document.createElement("input");
		togaInput.type = "hidden";
		togaInput.name = "togaToken";
		togaInput.value = togaToken;
		form.appendChild(togaInput);

		// Add assertion field
		const assertionInput = document.createElement("input");
		assertionInput.type = "hidden";
		assertionInput.name = "assertion";
		assertionInput.value = assertion;
		form.appendChild(assertionInput);

		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
};

// ============================================
// RESEARCH PORTAL SSO
// ============================================

/**
 * Get SSO parameters for Research Portal
 *
 * @returns Research Portal SSO redirect URL
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getResearchSSO();
 * if (response.success && response.data) {
 *   window.location.href = response.data.redirectUrl;
 * }
 */
export const getResearchSSO = async (): Promise<
	APIResponse<ResearchSSOResponse>
> => {
	return await fetchAPI<ResearchSSOResponse>(ENDPOINTS.ssoResearch(), {
		useAuth: true,
	});
};

/**
 * Get Research Portal SSO and automatically redirect
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToResearch();
 * // User will be redirected to Research Portal
 */
export const redirectToResearch = async (): Promise<void> => {
	const response = await getResearchSSO();

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// ============================================
// STOCK FILTER SSO
// ============================================

/**
 * Get SSO parameters for Stock Filter
 *
 * @returns Stock Filter SSO redirect URL
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getStockFilterSSO();
 * if (response.success && response.data) {
 *   window.location.href = response.data.redirectUrl;
 * }
 */
export const getStockFilterSSO = async (): Promise<
	APIResponse<StockFilterSSOResponse>
> => {
	return await fetchAPI<StockFilterSSOResponse>(ENDPOINTS.ssoStockFilter(), {
		useAuth: true,
	});
};

/**
 * Get Stock Filter SSO and automatically redirect
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToStockFilter();
 * // User will be redirected to Stock Filter
 */
export const redirectToStockFilter = async (): Promise<void> => {
	const response = await getStockFilterSSO();

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// ============================================
// CORPORATE ACTION SSO
// ============================================

/**
 * Get SSO parameters for Corporate Action
 *
 * @returns Corporate Action SSO parameters (postUrl and SAML response)
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getCorporateActionSSO();
 * if (response.success && response.data) {
 *   const { postUrl, samlResponse } = response.data;
 *   submitSamlForm(postUrl, samlResponse);
 * }
 */
export const getCorporateActionSSO = async (): Promise<
	APIResponse<CorpActionSSOResponse>
> => {
	return await fetchAPI<CorpActionSSOResponse>(
		ENDPOINTS.ssoCorporateAction(),
		{ useAuth: true }
	);
};

/**
 * Get Corporate Action SSO and automatically submit SAML form
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToCorporateAction();
 * // User will be redirected to Corporate Action via SAML
 */
export const redirectToCorporateAction = async (): Promise<void> => {
	const response = await getCorporateActionSSO();

	if (response.success && response.data) {
		submitSamlForm(response.data.postUrl, response.data.samlResponse);
	}
};

// ============================================
// ESTATEMENT SSO
// ============================================

/**
 * Get SSO parameters for eStatement (iTrade TruContent)
 *
 * @returns eStatement SSO redirect URL
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getEStatementSSO();
 * if (response.success && response.data) {
 *   window.location.href = response.data.redirectUrl;
 * }
 */
export const getEStatementSSO = async (): Promise<
	APIResponse<EStatementSSOResponse>
> => {
	return await fetchAPI<EStatementSSOResponse>(ENDPOINTS.ssoEStatement(), {
		useAuth: true,
	});
};

/**
 * Get eStatement SSO and automatically redirect
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToEStatement();
 * // User will be redirected to eStatement
 */
export const redirectToEStatement = async (): Promise<void> => {
	const response = await getEStatementSSO();

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// ============================================
// ISCREENER SSO (NEVER IMPLEMENTED)
// ============================================

/**
 * Get SSO parameters for iScreener
 *
 * ⚠️ WARNING: This endpoint is defined in spec but never implemented in iTrade Portal
 *
 * @returns iScreener SSO redirect URL
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getIScreenerSSO();
 * if (response.success && response.data) {
 *   window.location.href = response.data.redirectUrl;
 * }
 */
export const getIScreenerSSO = async (): Promise<
	APIResponse<IScreenerSSOResponse>
> => {
	return await fetchAPI<IScreenerSSOResponse>(ENDPOINTS.ssoIScreener(), {
		useAuth: true,
	});
};

/**
 * Get iScreener SSO and automatically redirect
 *
 * ⚠️ WARNING: This endpoint is defined in spec but never implemented in iTrade Portal
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToIScreener();
 * // User will be redirected to iScreener (if implemented)
 */
export const redirectToIScreener = async (): Promise<void> => {
	const response = await getIScreenerSSO();

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// ============================================
// EW8 SSO
// ============================================

/**
 * Get SSO parameters for EW8
 *
 * @returns EW8 SSO redirect URL
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getEW8SSO();
 * if (response.success && response.data) {
 *   window.location.href = response.data.redirectUrl;
 * }
 */
export const getEW8SSO = async (): Promise<APIResponse<EW8SSOResponse>> => {
	return await fetchAPI<EW8SSOResponse>(ENDPOINTS.ssoEW8(), {
		useAuth: true,
	});
};

/**
 * Get EW8 SSO and automatically redirect
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToEW8();
 * // User will be redirected to EW8
 */
export const redirectToEW8 = async (): Promise<void> => {
	const response = await getEW8SSO();

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// ============================================
// ECRS SSO
// ============================================

/**
 * Get SSO parameters for ECRS
 *
 * @returns ECRS SSO redirect URL
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getECRSSSO();
 * if (response.success && response.data) {
 *   window.location.href = response.data.redirectUrl;
 * }
 */
export const getECRSSSO = async (): Promise<APIResponse<ECRSSSOResponse>> => {
	return await fetchAPI<ECRSSSOResponse>(ENDPOINTS.ssoECRS(), {
		useAuth: true,
	});
};

/**
 * Get ECRS SSO and automatically redirect
 *
 * @requires Authentication - Bearer token
 *
 * @example
 * await redirectToECRS();
 * // User will be redirected to ECRS
 */
export const redirectToECRS = async (): Promise<void> => {
	const response = await getECRSSSO();

	if (response.success && response.data) {
		redirectToSSO(response.data.redirectUrl);
	}
};

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Service object containing all external SSO-related functions
 */
export const externalSSOService = {
	// Helper functions
	submitSamlForm,
	redirectToSSO,

	// NTP SSO
	getNTPSSO,
	redirectToNTP,

	// Research Portal SSO
	getResearchSSO,
	redirectToResearch,

	// Stock Filter SSO
	getStockFilterSSO,
	redirectToStockFilter,

	// Corporate Action SSO
	getCorporateActionSSO,
	redirectToCorporateAction,

	// eStatement SSO
	getEStatementSSO,
	redirectToEStatement,

	// iScreener SSO (never implemented)
	getIScreenerSSO,
	redirectToIScreener,

	// EW8 SSO
	getEW8SSO,
	redirectToEW8,

	// ECRS SSO
	getECRSSSO,
	redirectToECRS,
};

export default externalSSOService;
