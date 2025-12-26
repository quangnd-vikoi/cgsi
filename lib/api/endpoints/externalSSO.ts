/**
 * External SSO API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Source: iTrade-ExternalSSOAPI.yaml
 *
 * Description:
 * These endpoints provide SSO (Single Sign-On) parameters for accessing external systems:
 * - NTP (Next Trading Platform)
 * - Research Portal
 * - eStatement (iTrade TruContent)
 * - Corporate Action
 * - Stock Filter
 * - EW8
 * - ECRS
 * - iScreener (never implemented in iTrade Portal)
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 */
export const externalSSOEndpoints = {
	/**
	 * Get SSO Parameter for NTP (Next Trading Platform)
	 *
	 * GET /externalsso/api/v1/ntp
	 *
	 * @returns NtpSSOResponse - SSO parameters including postUrl, togaToken, assertion, etc.
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<NtpSSOResponse>(
	 *   ENDPOINTS.ssoNTP(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   // Use postUrl and form data to redirect to NTP
	 *   const { postUrl, togaToken, assertion } = response.data;
	 * }
	 */
	ssoNTP: () => `/externalsso/api/v1/ntp`,

	/**
	 * Get SSO Parameter for Research Portal
	 *
	 * GET /externalsso/api/v1/research
	 *
	 * @returns ResearchSSOResponse - SSO redirect URL for Research Portal
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ResearchSSOResponse>(
	 *   ENDPOINTS.ssoResearch(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   window.location.href = response.data.redirectUrl;
	 * }
	 */
	ssoResearch: () => `/externalsso/api/v1/research`,

	/**
	 * Get SSO Parameter for Stock Filter
	 *
	 * GET /externalsso/api/v1/stockFilter
	 *
	 * @returns StockFilterSSOResponse - SSO redirect URL for Stock Filter
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<StockFilterSSOResponse>(
	 *   ENDPOINTS.ssoStockFilter(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   window.location.href = response.data.redirectUrl;
	 * }
	 */
	ssoStockFilter: () => `/externalsso/api/v1/stockFilter`,

	/**
	 * Get SSO Parameter for Corporate Action
	 *
	 * GET /externalsso/api/v1/corporateAction
	 *
	 * @returns CorpActionSSOResponse - SSO parameters including postUrl and SAML response
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<CorpActionSSOResponse>(
	 *   ENDPOINTS.ssoCorporateAction(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   // Use postUrl and samlResponse to submit SAML form
	 *   const { postUrl, samlResponse } = response.data;
	 * }
	 */
	ssoCorporateAction: () => `/externalsso/api/v1/corporateAction`,

	/**
	 * Get SSO Parameter for eStatement (iTrade TruContent)
	 *
	 * GET /externalsso/api/v1/estatement
	 *
	 * @returns EStatementSSOResponse - SSO redirect URL for eStatement
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<EStatementSSOResponse>(
	 *   ENDPOINTS.ssoEStatement(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   window.location.href = response.data.redirectUrl;
	 * }
	 */
	ssoEStatement: () => `/externalsso/api/v1/estatement`,

	/**
	 * Get SSO Parameter for iScreener
	 *
	 * GET /externalsso/api/v1/iscreener
	 *
	 * ⚠️ NOTE: This endpoint is defined in spec but never implemented in iTrade Portal
	 *
	 * @returns IScreenerSSOResponse - SSO redirect URL for iScreener
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<IScreenerSSOResponse>(
	 *   ENDPOINTS.ssoIScreener(),
	 *   { useAuth: true }
	 * );
	 */
	ssoIScreener: () => `/externalsso/api/v1/iscreener`,

	/**
	 * Get SSO Parameter for EW8
	 *
	 * GET /externalsso/api/v1/ew8
	 *
	 * @returns EW8SSOResponse - SSO redirect URL for EW8
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<EW8SSOResponse>(
	 *   ENDPOINTS.ssoEW8(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   window.location.href = response.data.redirectUrl;
	 * }
	 */
	ssoEW8: () => `/externalsso/api/v1/ew8`,

	/**
	 * Get SSO Parameter for ECRS
	 *
	 * GET /externalsso/api/v1/ecrs
	 *
	 * @returns ECRSSSOResponse - SSO redirect URL for ECRS
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ECRSSSOResponse>(
	 *   ENDPOINTS.ssoECRS(),
	 *   { useAuth: true }
	 * );
	 * if (response.success && response.data) {
	 *   window.location.href = response.data.redirectUrl;
	 * }
	 */
	ssoECRS: () => `/externalsso/api/v1/ecrs`,
} as const;
