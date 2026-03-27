import type { TradingAccount } from "@/types";

// ============================================================================
// User Type Enum & Constants
// ============================================================================

export enum USER_TYPE {
	RETAIL_INDIVIDUAL = "RETAIL_INDIVIDUAL",
	RETAIL_JOINT = "RETAIL_JOINT",
	CORP = "CORP",
	TR = "TR",
	DEMO = "DEMO",
}

/** Raw userCategory values from /profile/api/v1/userInfo */
export const USER_CATEGORY = {
	DEMO: "2",
	RETAIL: "4",
	TR: "8",
} as const;

/** accountTypeCodeNova values from /profile/api/v1/accounts */
export const ACCOUNT_CATEGORY = {
	CORP: "CORP",
	JOINT: "JOINT",
	INDIV: "INDIV",
} as const;

// ============================================================================
// Convenience Groups
// ============================================================================

/** Retail individual + joint (excludes CORP, TR, DEMO) */
export const RETAIL = [USER_TYPE.RETAIL_INDIVIDUAL, USER_TYPE.RETAIL_JOINT] as const;

/** Retail + Corporate (excludes TR and DEMO) */
export const RETAIL_CORP = [...RETAIL, USER_TYPE.CORP] as const;

/** Everyone except DEMO */
export const ALL_EXCEPT_DEMO = [
	USER_TYPE.RETAIL_INDIVIDUAL,
	USER_TYPE.RETAIL_JOINT,
	USER_TYPE.CORP,
	USER_TYPE.TR,
] as const;

// ============================================================================
// User Type Derivation
// ============================================================================

/**
 * Derives USER_TYPE from userCategory + trading accounts.
 * Pure function — testable and reusable outside React.
 */
export function deriveUserType(
	userCategory: string | undefined,
	accounts: TradingAccount[]
): USER_TYPE | null {
	if (!userCategory) return null;

	switch (userCategory) {
		case USER_CATEGORY.DEMO:
			return USER_TYPE.DEMO;
		case USER_CATEGORY.TR:
			return USER_TYPE.TR;
		case USER_CATEGORY.RETAIL: {
			const hasCorpAccount = accounts.some(
				(acc) => acc.accountTypeCodeNova === ACCOUNT_CATEGORY.CORP
			);
			if (hasCorpAccount) return USER_TYPE.CORP;

			const hasJointAccount = accounts.some(
				(acc) => acc.accountTypeCodeNova === ACCOUNT_CATEGORY.JOINT
			);
			if (hasJointAccount) return USER_TYPE.RETAIL_JOINT;

			return USER_TYPE.RETAIL_INDIVIDUAL;
		}
		default:
			return null;
	}
}

// ============================================================================
// Route Access Control
// ============================================================================

/**
 * Route → allowed user types mapping.
 * Routes not listed here default to null (all authenticated users allowed).
 * null value = all authenticated users allowed.
 */
export const ROUTE_ACCESS: Record<string, readonly USER_TYPE[] | null> = {
	"/portfolio": ALL_EXCEPT_DEMO,
	"/portfolio/cash-transaction": RETAIL_CORP,
	"/portfolio/settle": RETAIL_CORP,
	"/portfolio/shares-transfer": RETAIL_CORP,
	"/donations": RETAIL_CORP,
	"/market-data": RETAIL_CORP,
	"/update-mobile": RETAIL_CORP,
	"/update-email": RETAIL_CORP,
	"/update-signature": RETAIL_CORP,
};

// ============================================================================
// Feature Access Control (Phase 2 — data defined now, UI gating later)
// ============================================================================

export type Feature =
	| "notification_bell"
	| "header_portfolio_link"
	| "sidebar_market_data"
	| "sidebar_donations"
	| "sidebar_trading_accounts"
	| "sidebar_trading_declarations"
	| "sidebar_acknowledgements"
	| "sidebar_my_subscriptions"
	| "sidebar_corporate_action"
	| "sidebar_estatement"
	| "sidebar_update_mobile"
	| "sidebar_update_email"
	| "sidebar_update_signature"
	| "trading_decl_sip"
	| "trading_decl_w8ben"
	| "trading_decl_bcan"
	| "trading_decl_crs"
	| "trading_decl_ai"
	| "discover_stock_research"
	| "discover_research_articles"
	| "discover_donations"
	| "portfolio_contracts_contra";

export const FEATURE_ACCESS: Record<Feature, readonly USER_TYPE[] | null> = {
	notification_bell: RETAIL_CORP,
	header_portfolio_link: ALL_EXCEPT_DEMO,
	sidebar_market_data: RETAIL_CORP,
	sidebar_donations: RETAIL_CORP,
	sidebar_trading_accounts: ALL_EXCEPT_DEMO,
	sidebar_trading_declarations: RETAIL_CORP,
	sidebar_acknowledgements: ALL_EXCEPT_DEMO,
	sidebar_my_subscriptions: RETAIL_CORP,
	sidebar_corporate_action: RETAIL_CORP,
	sidebar_estatement: RETAIL_CORP,
	sidebar_update_mobile: RETAIL_CORP,
	sidebar_update_email: RETAIL_CORP,
	sidebar_update_signature: RETAIL_CORP,
	trading_decl_sip: RETAIL_CORP,
	trading_decl_w8ben: RETAIL,
	trading_decl_bcan: RETAIL,
	trading_decl_crs: RETAIL,
	trading_decl_ai: RETAIL,
	discover_stock_research: ALL_EXCEPT_DEMO,
	discover_research_articles: ALL_EXCEPT_DEMO,
	discover_donations: RETAIL_CORP,
	portfolio_contracts_contra: RETAIL_CORP,
};
