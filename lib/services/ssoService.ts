/**
 * SSO Service (Legacy)
 *
 * This file is kept for backward compatibility.
 * All new code should use externalSSOService.ts instead.
 *
 * @deprecated Use externalSSOService instead
 */

export {
	externalSSOService as ssoService,
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
} from "./externalSSOService";

// Backward compatible alias
export { getCorporateActionSSO as getCorporateActionURL } from "./externalSSOService";
