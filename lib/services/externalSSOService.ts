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
 * Opens in a new tab
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
 */
export function redirectToSSO(redirectUrl: string): void {
	window.open(redirectUrl, "_blank", "noopener,noreferrer");
}

// ============================================
// SSO FACTORY — creates get/redirect pairs for
// simple redirect-url-based SSO endpoints
// ============================================

function createRedirectSSO<T extends { redirectUrl: string }>(endpoint: string) {
	const get = async (): Promise<APIResponse<T>> => {
		return await fetchAPI<T>(endpoint, { useAuth: true });
	};

	const redirect = async (): Promise<void> => {
		const response = await get();
		if (response.success && response.data) {
			redirectToSSO(response.data.redirectUrl);
		}
	};

	return { get, redirect } as const;
}

// ============================================
// REDIRECT-BASED SSO SERVICES
// ============================================

const research = createRedirectSSO<ResearchSSOResponse>(ENDPOINTS.ssoResearch());
const stockFilter = createRedirectSSO<StockFilterSSOResponse>(ENDPOINTS.ssoStockFilter());
const eStatement = createRedirectSSO<EStatementSSOResponse>(ENDPOINTS.ssoEStatement());
/** ⚠️ This endpoint is defined in spec but never implemented in iTrade Portal */
const iScreener = createRedirectSSO<IScreenerSSOResponse>(ENDPOINTS.ssoIScreener());
const ew8 = createRedirectSSO<EW8SSOResponse>(ENDPOINTS.ssoEW8());
const ecrs = createRedirectSSO<ECRSSSOResponse>(ENDPOINTS.ssoECRS());

// Named exports for redirect-based SSOs
export const getResearchSSO = research.get;
export const redirectToResearch = research.redirect;

export const getStockFilterSSO = stockFilter.get;
export const redirectToStockFilter = stockFilter.redirect;

export const getEStatementSSO = eStatement.get;
export const redirectToEStatement = eStatement.redirect;

export const getIScreenerSSO = iScreener.get;
export const redirectToIScreener = iScreener.redirect;

export const getEW8SSO = ew8.get;
export const redirectToEW8 = ew8.redirect;

export const getECRSSSO = ecrs.get;
export const redirectToECRS = ecrs.redirect;

// ============================================
// NTP SSO (custom form submission)
// ============================================

export const getNTPSSO = async (): Promise<APIResponse<NtpSSOResponse>> => {
	return await fetchAPI<NtpSSOResponse>(ENDPOINTS.ssoNTP(), { useAuth: true });
};

export const redirectToNTP = async (): Promise<void> => {
	const response = await getNTPSSO();

	if (response.success && response.data) {
		const { postUrl, act, token, assertion, transactionId, page } = response.data;

		const form = document.createElement("form");
		form.method = "POST";
		form.action = postUrl;
		form.target = "_blank";
		form.name = "ssoLogin"

		const fields: Record<string, string> = {
			Act: act,
			TogaToken: token,
			assertion,
			transactionID: transactionId,
			page,
		};

		for (const [name, value] of Object.entries(fields)) {
			const input = document.createElement("input");
			input.type = "hidden";
			input.name = name;
			input.value = value;
			form.appendChild(input);
		}

		document.body.appendChild(form);

		console.log(form)
		form.submit();
		document.body.removeChild(form);
	}
};

// ============================================
// CORPORATE ACTION SSO (SAML form)
// ============================================

export const getCorporateActionSSO = async (): Promise<APIResponse<CorpActionSSOResponse>> => {
	return await fetchAPI<CorpActionSSOResponse>(ENDPOINTS.ssoCorporateAction(), { useAuth: true });
};

export const redirectToCorporateAction = async (): Promise<void> => {
	const response = await getCorporateActionSSO();

	if (response.success && response.data) {
		submitSamlForm(response.data.postUrl, response.data.samlResponse);
	}
};

// ============================================
// DEFAULT EXPORT
// ============================================

export const externalSSOService = {
	submitSamlForm,
	redirectToSSO,
	getNTPSSO,
	redirectToNTP,
	getResearchSSO,
	redirectToResearch,
	getStockFilterSSO,
	redirectToStockFilter,
	getCorporateActionSSO,
	redirectToCorporateAction,
	getEStatementSSO,
	redirectToEStatement,
	getIScreenerSSO,
	redirectToIScreener,
	getEW8SSO,
	redirectToEW8,
	getECRSSSO,
	redirectToECRS,
};

export default externalSSOService;
