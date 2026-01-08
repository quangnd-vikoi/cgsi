# Portfolio API Implementation Guide

> **Implementation guide for Portfolio API endpoints following CGSI iTrade Portal conventions**
>
> This document provides step-by-step instructions for integrating Portfolio APIs using the established three-layer architecture pattern.

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Implementation Steps](#implementation-steps)
3. [Endpoint Definitions](#endpoint-definitions)
4. [TypeScript Types](#typescript-types)
5. [Service Layer](#service-layer)
6. [Component Integration](#component-integration)
7. [State Management](#state-management)
8. [Testing Checklist](#testing-checklist)

---

## API Overview

**Base URL:** `https://stgitrade.cgsi.com.sg/portal` (configurable via `API_BASE_URL`)

**Base Path:** `/portfolio/api/v1`

**Authentication:** All endpoints require Bearer token in Authorization header

**Source:** `iTrade-PortfolioAPI.yaml`

### Available Endpoints

| Category | Endpoint | Method | Auth | Status |
|----------|----------|--------|------|--------|
| **Account Summary** | `/accountSummary` | GET | 🔒 | ❌ Not Implemented |
| **Trust Balance** | `/trustBalance` | GET | 🔒 | ❌ Not Implemented |
| **Trust Balance Details** | `/trustBalance/{accountNo}/details/{currency}` | GET | 🔒 | ❌ Not Implemented |
| **Custody** | `/custody/{accountNo}` | GET | 🔒 | ❌ Not Implemented |
| **Margin Summary** | `/margin/{accountNo}` | GET | 🔒 | ❌ Not Implemented |
| **Margin Details** | `/margin/{accountNo}/details` | GET | 🔒 | ❌ Not Implemented |
| **Contracts** | `/contracts/{accountNo}` | GET | 🔒 | ❌ Not Implemented |
| **Contracts Past Due** | `/contracts/{accountNo}/pastdue` | GET | 🔒 | ❌ Not Implemented |
| **Contra** | `/contra/{accountNo}` | GET | 🔒 | ❌ Not Implemented |
| **Contra Details** | `/contra/{accountNo}/details/{statementNo}` | GET | 🔒 | ❌ Not Implemented |

**Implementation Status:** 0/10 endpoints implemented (0%)

**⚠️ CRITICAL:** This is the most important missing API domain - users cannot view their portfolio data without these endpoints.

---

## Implementation Steps

### Step 1: Define Endpoint Paths

**File:** `/lib/api/endpoints/portfolio.ts` (**NEW FILE TO CREATE**)

**Create New Endpoints File:**

```typescript
/**
 * Portfolio API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Base Path: /portfolio/api/v1
 * Source: iTrade-PortfolioAPI.yaml
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 *
 * Features:
 * - Account summary and balances
 * - Custody holdings
 * - Margin/Collateral financing
 * - Contracts and contra statements
 * - Pagination support for list endpoints
 */
export const portfolioEndpoints = {
	// ============================================================================
	// Account Summary
	// ============================================================================

	/**
	 * Get Account Summary
	 *
	 * GET /portfolio/api/v1/accountSummary
	 *
	 * @returns AccountSummaryResponse[] - Array of account summaries
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<AccountSummaryResponse[]>(
	 *   ENDPOINTS.getAccountSummary(),
	 *   { useAuth: true }
	 * );
	 */
	getAccountSummary: () => `/portfolio/api/v1/accountSummary`,

	// ============================================================================
	// Trust Balance
	// ============================================================================

	/**
	 * Get Trust Balance Summary
	 *
	 * GET /portfolio/api/v1/trustBalance
	 *
	 * @returns TrustBalancesResponse[] - Array of trust balances by account
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<TrustBalancesResponse[]>(
	 *   ENDPOINTS.getTrustBalance(),
	 *   { useAuth: true }
	 * );
	 */
	getTrustBalance: () => `/portfolio/api/v1/trustBalance`,

	/**
	 * Get Trust Balance Details
	 *
	 * GET /portfolio/api/v1/trustBalance/{accountNo}/details/{currency}
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param currency - Currency code (e.g., "SGD", "USD")
	 * @param pageSize - Optional page size for pagination
	 * @param pageIndex - Optional page index for pagination
	 * @returns TrustBalanceDetailsResponse - Paginated trust balance details
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<TrustBalanceDetailsResponse>(
	 *   ENDPOINTS.getTrustBalanceDetails("0000001", "SGD") + "?pageSize=10&pageIndex=0",
	 *   { useAuth: true }
	 * );
	 */
	getTrustBalanceDetails: (accountNo: string, currency: string) =>
		`/portfolio/api/v1/trustBalance/${accountNo}/details/${currency}`,

	// ============================================================================
	// Custody Holdings
	// ============================================================================

	/**
	 * Get Custody Holdings
	 *
	 * GET /portfolio/api/v1/custody/{accountNo}
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param pageSize - Optional page size for pagination
	 * @param pageIndex - Optional page index for pagination
	 * @returns CustodyResponse - Paginated custody holdings
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<CustodyResponse>(
	 *   ENDPOINTS.getCustody("0000001") + "?pageSize=20&pageIndex=0",
	 *   { useAuth: true }
	 * );
	 */
	getCustody: (accountNo: string) => `/portfolio/api/v1/custody/${accountNo}`,

	// ============================================================================
	// Margin / Collateral Financing
	// ============================================================================

	/**
	 * Get Collateral Financing Summary
	 *
	 * GET /portfolio/api/v1/margin/{accountNo}
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @returns CollateralFinancingResponse - Margin account summary
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<CollateralFinancingResponse>(
	 *   ENDPOINTS.getMarginSummary("0000001"),
	 *   { useAuth: true }
	 * );
	 */
	getMarginSummary: (accountNo: string) =>
		`/portfolio/api/v1/margin/${accountNo}`,

	/**
	 * Get Collateral Financing Details
	 *
	 * GET /portfolio/api/v1/margin/{accountNo}/details
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param pageSize - Optional page size for pagination
	 * @param pageIndex - Optional page index for pagination
	 * @returns CollateralFinancingDetailsResponse - Paginated margin details
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<CollateralFinancingDetailsResponse>(
	 *   ENDPOINTS.getMarginDetails("0000001") + "?pageSize=10&pageIndex=0",
	 *   { useAuth: true }
	 * );
	 */
	getMarginDetails: (accountNo: string) =>
		`/portfolio/api/v1/margin/${accountNo}/details`,

	// ============================================================================
	// Contracts
	// ============================================================================

	/**
	 * Get Contracts
	 *
	 * GET /portfolio/api/v1/contracts/{accountNo}
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param marketCode - Optional market code filter (e.g., "SGX", "HKEX")
	 * @param pageSize - Optional page size for pagination
	 * @param pageIndex - Optional page index for pagination
	 * @returns ContractsResponse - Paginated contract list
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ContractsResponse>(
	 *   ENDPOINTS.getContracts("0000001") + "?marketCode=SGX&pageSize=20&pageIndex=0",
	 *   { useAuth: true }
	 * );
	 */
	getContracts: (accountNo: string) =>
		`/portfolio/api/v1/contracts/${accountNo}`,

	/**
	 * Get Contracts Past Due (Share Awaiting)
	 *
	 * GET /portfolio/api/v1/contracts/{accountNo}/pastdue
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param marketCode - Optional market code filter
	 * @param pageSize - Optional page size for pagination
	 * @param pageIndex - Optional page index for pagination
	 * @returns ContractsPastDueResponse - Paginated past due contracts
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ContractsPastDueResponse>(
	 *   ENDPOINTS.getContractsPastDue("0000001"),
	 *   { useAuth: true }
	 * );
	 */
	getContractsPastDue: (accountNo: string) =>
		`/portfolio/api/v1/contracts/${accountNo}/pastdue`,

	// ============================================================================
	// Contra
	// ============================================================================

	/**
	 * Get Contra Statements
	 *
	 * GET /portfolio/api/v1/contra/{accountNo}
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param marketCode - Optional market code filter
	 * @param pageSize - Optional page size for pagination
	 * @param pageIndex - Optional page index for pagination
	 * @returns ContraResponse - Paginated contra statements
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ContraResponse>(
	 *   ENDPOINTS.getContra("0000001") + "?pageSize=20&pageIndex=0",
	 *   { useAuth: true }
	 * );
	 */
	getContra: (accountNo: string) => `/portfolio/api/v1/contra/${accountNo}`,

	/**
	 * Get Contra Details
	 *
	 * GET /portfolio/api/v1/contra/{accountNo}/details/{statementNo}
	 *
	 * @param accountNo - Account number (e.g., "0000001")
	 * @param statementNo - Statement number (e.g., "2503984")
	 * @returns ContraDetailsResponse - Contra statement details
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<ContraDetailsResponse>(
	 *   ENDPOINTS.getContraDetails("0000001", "2503984"),
	 *   { useAuth: true }
	 * );
	 */
	getContraDetails: (accountNo: string, statementNo: string) =>
		`/portfolio/api/v1/contra/${accountNo}/details/${statementNo}`,
} as const;
```

**Export in index.ts:**

```typescript
// File: /lib/api/endpoints/index.ts
import { portfolioEndpoints } from "./portfolio";

export const ENDPOINTS = {
	// ... existing endpoints
	...portfolioEndpoints,
};
```

---

### Step 2: Define TypeScript Types

**File:** `/types/index.ts`

**Add Portfolio Types:**

```typescript
// ============================================
// Portfolio API Types
// ============================================

/**
 * Outstanding Contract Currency Value
 */
export interface OutstandingContract {
	currency: string;
	value: number;
}

/**
 * Account Summary Response
 * Returned from GET /portfolio/api/v1/accountSummary
 */
export interface AccountSummaryResponse {
	clientName: string;
	productType: string;
	accoutNumber: string; // Note: API has typo "accoutNumber"
	accountType: string;
	outstandingContracts: OutstandingContract[];
}

/**
 * Trust Balance Item
 */
export interface TrustBalance {
	currency: string;
	balance: number;
	lastUpdatedOn: string; // ISO 8601 date-time
}

/**
 * Trust Balances Response
 * Returned from GET /portfolio/api/v1/trustBalance
 */
export interface TrustBalancesResponse {
	accountNo: string;
	balances: TrustBalance[];
}

/**
 * Trust Balance Details Response (Paginated)
 * Returned from GET /portfolio/api/v1/trustBalance/{accountNo}/details/{currency}
 */
export interface TrustBalanceDetailsResponse {
	total: number;
	trustBalances: TrustBalance[];
}

/**
 * Custody Holding Item
 * Returned from GET /portfolio/api/v1/custody/{accountNo}
 */
export interface Custody {
	traderCode: string;
	marketCode: string;
	securityCode: string;
	securityName: string;
	availBalance: number;
	freeBalance: number;
	earmarkBalance: number;
	lastUpdatedOn: string; // ISO 8601 date-time
}

/**
 * Custody Response (Paginated)
 */
export interface CustodyResponse {
	total: number;
	trustBalances: Custody[]; // Note: API response uses "trustBalances" key
}

/**
 * Collateral Financing Summary
 * Returned from GET /portfolio/api/v1/margin/{accountNo}
 */
export interface CollateralFinancingResponse {
	accountNo: string;
	traderCode: string;
	creditLimit: number;
	ledgerBalance: number;
	ytdInterest: number;
	totalFinanced: number;
	totalCollateral: number;
	availableFinancing: number;
	margin: number;
	lastUpdatedOn: string; // ISO 8601 date-time
}

/**
 * Collateral Financing Detail Item
 */
export interface CollateralFinancingDetail {
	accountNo: string;
	securityCode: string;
	securityName: string;
	quantity: number;
	outstandingBuy: number;
	outstandingSell: number;
	balance: number;
	lastDonePrice: number;
	marketValue: number;
	lastUpdatedOn: string; // ISO 8601 date-time
}

/**
 * Collateral Financing Details Response (Paginated)
 * Returned from GET /portfolio/api/v1/margin/{accountNo}/details
 */
export interface CollateralFinancingDetailsResponse {
	total: number;
	collateralFinancingDetails: CollateralFinancingDetail[];
}

/**
 * Contract Item
 */
export interface Contract {
	accountNo: string;
	traderCode: string;
	tradeDate: string;
	contractNo: string;
	type: string; // BUY or SELL
	securityName: string;
	tradedCurrency: string;
	price: number;
	quantity: number;
	settlementCurrency: string;
	netAmount: number;
	settlementDueDate: string;
	channel: string;
	remark?: string;
	marketCode: string;
	baseNetAmt: number;
	lastUpdatedOn: string; // ISO 8601 date-time
}

/**
 * Contracts Response (Paginated)
 * Returned from GET /portfolio/api/v1/contracts/{accountNo}
 */
export interface ContractsResponse {
	total: number;
	contracts: Contract[];
}

/**
 * Contracts Past Due Response (Paginated)
 * Returned from GET /portfolio/api/v1/contracts/{accountNo}/pastdue
 */
export interface ContractsPastDueResponse {
	total: number;
	pastDue: Contract[];
}

/**
 * Contra Statement Item
 */
export interface Contra {
	accountNo: string;
	traderCode: string;
	statementDate: string;
	statementNo: string;
	securityName: string;
	type: string; // BUY or SELL
	settlementCurrency: string;
	settlementNetAmount: number;
	marketCode: string;
	baseNetAmt: number;
	lastUpdatedOn: string; // ISO 8601 date-time
}

/**
 * Contra Response (Paginated)
 * Returned from GET /portfolio/api/v1/contra/{accountNo}
 */
export interface ContraResponse {
	total: number;
	contra: Contra[];
}

/**
 * Contra Details Response
 * Returned from GET /portfolio/api/v1/contra/{accountNo}/details/{statementNo}
 */
export interface ContraDetailsResponse {
	total: number;
	contracts: Contra[]; // Note: API uses "contracts" key for contra details
}

/**
 * Pagination Parameters
 * Used for paginated endpoints
 */
export interface PaginationParams {
	pageSize?: number;
	pageIndex?: number;
}
```

**Key Points:**
- ✅ All types match exact API response structure
- ✅ Use `string` for date-time fields (ISO 8601)
- ✅ Note API quirks (typo "accoutNumber", inconsistent key names)
- ✅ Separate types for paginated responses
- ✅ `?` for optional fields

---

### Step 3: Create Service Layer

**File:** `/lib/services/portfolioService.ts` (**NEW FILE TO CREATE**)

**Create New Service File:**

```typescript
/**
 * Portfolio Service
 *
 * Handles all portfolio-related API calls including:
 * - Account summary
 * - Trust balances
 * - Custody holdings
 * - Margin/Collateral financing
 * - Contracts
 * - Contra statements
 *
 * All functions return APIResponse<T> with consistent error handling.
 */

import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	AccountSummaryResponse,
	TrustBalancesResponse,
	TrustBalanceDetailsResponse,
	CustodyResponse,
	CollateralFinancingResponse,
	CollateralFinancingDetailsResponse,
	ContractsResponse,
	ContractsPastDueResponse,
	ContraResponse,
	ContraDetailsResponse,
	PaginationParams,
} from "@/types";

// ============================================
// ACCOUNT SUMMARY
// ============================================

/**
 * Get account summary for all accounts
 *
 * @returns Array of account summaries with outstanding contracts
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getAccountSummary();
 * if (response.success && response.data) {
 *   console.log('Accounts:', response.data);
 * }
 */
export const getAccountSummary = async (): Promise<
	APIResponse<AccountSummaryResponse[]>
> => {
	return await fetchAPI<AccountSummaryResponse[]>(
		ENDPOINTS.getAccountSummary(),
		{ useAuth: true }
	);
};

// ============================================
// TRUST BALANCE
// ============================================

/**
 * Get trust balance summary for all accounts
 *
 * @returns Array of trust balances by account and currency
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getTrustBalance();
 * if (response.success && response.data) {
 *   response.data.forEach(account => {
 *     console.log(`Account ${account.accountNo}:`, account.balances);
 *   });
 * }
 */
export const getTrustBalance = async (): Promise<
	APIResponse<TrustBalancesResponse[]>
> => {
	return await fetchAPI<TrustBalancesResponse[]>(
		ENDPOINTS.getTrustBalance(),
		{ useAuth: true }
	);
};

/**
 * Get trust balance details for specific account and currency
 *
 * @param accountNo - Account number
 * @param currency - Currency code (e.g., "SGD", "USD")
 * @param pagination - Optional pagination parameters
 * @returns Paginated trust balance details
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getTrustBalanceDetails("0000001", "SGD", {
 *   pageSize: 10,
 *   pageIndex: 0
 * });
 */
export const getTrustBalanceDetails = async (
	accountNo: string,
	currency: string,
	pagination?: PaginationParams
): Promise<APIResponse<TrustBalanceDetailsResponse>> => {
	let url = ENDPOINTS.getTrustBalanceDetails(accountNo, currency);

	if (pagination) {
		const params = new URLSearchParams();
		if (pagination.pageSize) params.append("pageSize", pagination.pageSize.toString());
		if (pagination.pageIndex !== undefined) params.append("pageIndex", pagination.pageIndex.toString());
		url += `?${params.toString()}`;
	}

	return await fetchAPI<TrustBalanceDetailsResponse>(url, { useAuth: true });
};

// ============================================
// CUSTODY HOLDINGS
// ============================================

/**
 * Get custody holdings for an account
 *
 * @param accountNo - Account number
 * @param pagination - Optional pagination parameters
 * @returns Paginated custody holdings
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getCustodyHoldings("0000001", {
 *   pageSize: 20,
 *   pageIndex: 0
 * });
 * if (response.success && response.data) {
 *   console.log('Holdings:', response.data.trustBalances);
 * }
 */
export const getCustodyHoldings = async (
	accountNo: string,
	pagination?: PaginationParams
): Promise<APIResponse<CustodyResponse>> => {
	let url = ENDPOINTS.getCustody(accountNo);

	if (pagination) {
		const params = new URLSearchParams();
		if (pagination.pageSize) params.append("pageSize", pagination.pageSize.toString());
		if (pagination.pageIndex !== undefined) params.append("pageIndex", pagination.pageIndex.toString());
		url += `?${params.toString()}`;
	}

	return await fetchAPI<CustodyResponse>(url, { useAuth: true });
};

// ============================================
// MARGIN / COLLATERAL FINANCING
// ============================================

/**
 * Get collateral financing summary for margin account
 *
 * @param accountNo - Margin account number
 * @returns Collateral financing summary
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getMarginSummary("0000001");
 * if (response.success && response.data) {
 *   console.log('Credit Limit:', response.data.creditLimit);
 *   console.log('Available Financing:', response.data.availableFinancing);
 * }
 */
export const getMarginSummary = async (
	accountNo: string
): Promise<APIResponse<CollateralFinancingResponse>> => {
	return await fetchAPI<CollateralFinancingResponse>(
		ENDPOINTS.getMarginSummary(accountNo),
		{ useAuth: true }
	);
};

/**
 * Get collateral financing details for margin account
 *
 * @param accountNo - Margin account number
 * @param pagination - Optional pagination parameters
 * @returns Paginated collateral financing details
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getMarginDetails("0000001", {
 *   pageSize: 10,
 *   pageIndex: 0
 * });
 */
export const getMarginDetails = async (
	accountNo: string,
	pagination?: PaginationParams
): Promise<APIResponse<CollateralFinancingDetailsResponse>> => {
	let url = ENDPOINTS.getMarginDetails(accountNo);

	if (pagination) {
		const params = new URLSearchParams();
		if (pagination.pageSize) params.append("pageSize", pagination.pageSize.toString());
		if (pagination.pageIndex !== undefined) params.append("pageIndex", pagination.pageIndex.toString());
		url += `?${params.toString()}`;
	}

	return await fetchAPI<CollateralFinancingDetailsResponse>(url, {
		useAuth: true,
	});
};

// ============================================
// CONTRACTS
// ============================================

/**
 * Get contracts for an account
 *
 * @param accountNo - Account number
 * @param marketCode - Optional market code filter
 * @param pagination - Optional pagination parameters
 * @returns Paginated contracts
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getContracts("0000001", "SGX", {
 *   pageSize: 20,
 *   pageIndex: 0
 * });
 */
export const getContracts = async (
	accountNo: string,
	marketCode?: string,
	pagination?: PaginationParams
): Promise<APIResponse<ContractsResponse>> => {
	let url = ENDPOINTS.getContracts(accountNo);

	const params = new URLSearchParams();
	if (marketCode) params.append("marketCode", marketCode);
	if (pagination?.pageSize) params.append("pageSize", pagination.pageSize.toString());
	if (pagination?.pageIndex !== undefined) params.append("pageIndex", pagination.pageIndex.toString());

	if (params.toString()) {
		url += `?${params.toString()}`;
	}

	return await fetchAPI<ContractsResponse>(url, { useAuth: true });
};

/**
 * Get past due contracts (share awaiting) for an account
 *
 * @param accountNo - Account number
 * @param marketCode - Optional market code filter
 * @param pagination - Optional pagination parameters
 * @returns Paginated past due contracts
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getContractsPastDue("0000001");
 * if (response.success && response.data) {
 *   console.log('Past Due Contracts:', response.data.pastDue);
 * }
 */
export const getContractsPastDue = async (
	accountNo: string,
	marketCode?: string,
	pagination?: PaginationParams
): Promise<APIResponse<ContractsPastDueResponse>> => {
	let url = ENDPOINTS.getContractsPastDue(accountNo);

	const params = new URLSearchParams();
	if (marketCode) params.append("marketCode", marketCode);
	if (pagination?.pageSize) params.append("pageSize", pagination.pageSize.toString());
	if (pagination?.pageIndex !== undefined) params.append("pageIndex", pagination.pageIndex.toString());

	if (params.toString()) {
		url += `?${params.toString()}`;
	}

	return await fetchAPI<ContractsPastDueResponse>(url, { useAuth: true });
};

// ============================================
// CONTRA STATEMENTS
// ============================================

/**
 * Get contra statements for an account
 *
 * @param accountNo - Account number
 * @param marketCode - Optional market code filter
 * @param pagination - Optional pagination parameters
 * @returns Paginated contra statements
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getContraStatements("0000001", undefined, {
 *   pageSize: 20,
 *   pageIndex: 0
 * });
 */
export const getContraStatements = async (
	accountNo: string,
	marketCode?: string,
	pagination?: PaginationParams
): Promise<APIResponse<ContraResponse>> => {
	let url = ENDPOINTS.getContra(accountNo);

	const params = new URLSearchParams();
	if (marketCode) params.append("marketCode", marketCode);
	if (pagination?.pageSize) params.append("pageSize", pagination.pageSize.toString());
	if (pagination?.pageIndex !== undefined) params.append("pageIndex", pagination.pageIndex.toString());

	if (params.toString()) {
		url += `?${params.toString()}`;
	}

	return await fetchAPI<ContraResponse>(url, { useAuth: true });
};

/**
 * Get contra statement details
 *
 * @param accountNo - Account number
 * @param statementNo - Statement number
 * @returns Contra statement details
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getContraDetails("0000001", "2503984");
 * if (response.success && response.data) {
 *   console.log('Statement Details:', response.data.contracts);
 * }
 */
export const getContraDetails = async (
	accountNo: string,
	statementNo: string
): Promise<APIResponse<ContraDetailsResponse>> => {
	return await fetchAPI<ContraDetailsResponse>(
		ENDPOINTS.getContraDetails(accountNo, statementNo),
		{ useAuth: true }
	);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get complete portfolio data for an account
 *
 * Fetches account summary, trust balance, custody, and contracts in parallel
 *
 * @param accountNo - Account number
 * @returns Object containing all portfolio data
 *
 * @example
 * const portfolio = await getCompletePortfolio("0000001");
 * if (portfolio.trustBalance?.success) {
 *   console.log('Trust Balance:', portfolio.trustBalance.data);
 * }
 */
export const getCompletePortfolio = async (accountNo: string) => {
	const [summaryRes, trustBalanceRes, custodyRes, contractsRes] =
		await Promise.allSettled([
			getAccountSummary(),
			getTrustBalance(),
			getCustodyHoldings(accountNo, { pageSize: 100, pageIndex: 0 }),
			getContracts(accountNo, undefined, { pageSize: 100, pageIndex: 0 }),
		]);

	return {
		summary: summaryRes.status === "fulfilled" ? summaryRes.value : null,
		trustBalance: trustBalanceRes.status === "fulfilled" ? trustBalanceRes.value : null,
		custody: custodyRes.status === "fulfilled" ? custodyRes.value : null,
		contracts: contractsRes.status === "fulfilled" ? contractsRes.value : null,
	};
};

/**
 * Get total portfolio value across all currencies
 *
 * @returns Aggregated portfolio value by currency
 *
 * @example
 * const response = await getTotalPortfolioValue();
 * if (response.success && response.data) {
 *   response.data.forEach(balance => {
 *     console.log(`${balance.currency}: ${balance.total}`);
 *   });
 * }
 */
export const getTotalPortfolioValue = async (): Promise<
	APIResponse<{ currency: string; total: number }[]>
> => {
	const response = await getTrustBalance();

	if (response.success && response.data) {
		const totals: { [currency: string]: number } = {};

		response.data.forEach((account) => {
			account.balances.forEach((balance) => {
				if (!totals[balance.currency]) {
					totals[balance.currency] = 0;
				}
				totals[balance.currency] += balance.balance;
			});
		});

		const aggregated = Object.entries(totals).map(([currency, total]) => ({
			currency,
			total,
		}));

		return {
			success: true,
			data: aggregated,
			error: null,
			statusCode: 200,
		};
	}

	return response as any;
};

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Portfolio service object containing all portfolio-related functions
 */
export const portfolioService = {
	// Account summary
	getAccountSummary,

	// Trust balance
	getTrustBalance,
	getTrustBalanceDetails,

	// Custody
	getCustodyHoldings,

	// Margin / Collateral
	getMarginSummary,
	getMarginDetails,

	// Contracts
	getContracts,
	getContractsPastDue,

	// Contra
	getContraStatements,
	getContraDetails,

	// Helper functions
	getCompletePortfolio,
	getTotalPortfolioValue,
};

export default portfolioService;
```

---

### Step 4: Component Integration Examples

#### Example 1: Portfolio Dashboard

**File:** `app/(with-layout)/portfolio/page.tsx`

**Pattern:** Fetch complete portfolio on mount

```typescript
"use client";
import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '@/lib/services/portfolioService';
import { useTradingAccountStore } from '@/stores/tradingAccountStore';
import { ErrorState } from '@/components/ErrorState';
import type { TrustBalancesResponse, CustodyResponse } from '@/types';

export default function PortfolioPage() {
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);

	const [trustBalance, setTrustBalance] = useState<TrustBalancesResponse[]>([]);
	const [custody, setCustody] = useState<CustodyResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPortfolioData = useCallback(async () => {
		if (!selectedAccount?.accountNumber) {
			setError('Please select an account');
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const portfolio = await portfolioService.getCompletePortfolio(
				selectedAccount.accountNumber
			);

			// Handle trust balance
			if (portfolio.trustBalance?.success && portfolio.trustBalance.data) {
				setTrustBalance(portfolio.trustBalance.data);
			}

			// Handle custody
			if (portfolio.custody?.success && portfolio.custody.data) {
				setCustody(portfolio.custody.data);
			}

			// Check if all requests failed
			const allFailed = !portfolio.trustBalance?.success && !portfolio.custody?.success;
			if (allFailed) {
				setError('Failed to load portfolio data. Please try again.');
			}
		} catch (error) {
			setError('Network error. Please check your connection.');
		} finally {
			setLoading(false);
		}
	}, [selectedAccount]);

	useEffect(() => {
		fetchPortfolioData();
	}, [fetchPortfolioData]);

	// Loading state
	if (loading) {
		return (
			<div className="container-default pad">
				<h1 className="text-2xl font-bold mb-6">Portfolio</h1>
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="animate-pulse">
							<div className="h-32 bg-gray-200 rounded-lg"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="container-default pad">
				<ErrorState
					title="Failed to Load Portfolio"
					description={error}
					type="error"
				>
					<button onClick={fetchPortfolioData}>Retry</button>
				</ErrorState>
			</div>
		);
	}

	return (
		<div className="container-default pad">
			<h1 className="text-2xl font-bold mb-6">Portfolio</h1>

			{/* Trust Balance Section */}
			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Trust Balance</h2>
				{trustBalance.map((account) => (
					<div key={account.accountNo} className="border rounded-lg p-4 mb-4">
						<h3 className="font-medium mb-2">Account: {account.accountNo}</h3>
						<div className="grid grid-cols-2 gap-4">
							{account.balances.map((balance, idx) => (
								<div key={idx}>
									<p className="text-sm text-gray-600">{balance.currency}</p>
									<p className="text-lg font-semibold">
										{balance.balance.toLocaleString()}
									</p>
								</div>
							))}
						</div>
					</div>
				))}
			</section>

			{/* Custody Holdings Section */}
			{custody && (
				<section>
					<h2 className="text-xl font-semibold mb-4">
						Custody Holdings ({custody.total})
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left p-2">Security</th>
									<th className="text-right p-2">Avail Balance</th>
									<th className="text-right p-2">Free Balance</th>
									<th className="text-right p-2">Earmark</th>
								</tr>
							</thead>
							<tbody>
								{custody.trustBalances.map((holding, idx) => (
									<tr key={idx} className="border-b">
										<td className="p-2">
											<div>
												<p className="font-medium">{holding.securityName}</p>
												<p className="text-sm text-gray-600">
													{holding.securityCode}
												</p>
											</div>
										</td>
										<td className="text-right p-2">
											{holding.availBalance.toLocaleString()}
										</td>
										<td className="text-right p-2">
											{holding.freeBalance.toLocaleString()}
										</td>
										<td className="text-right p-2">
											{holding.earmarkBalance.toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}
		</div>
	);
}
```

#### Example 2: Margin Account Details

**File:** `app/(with-layout)/portfolio/_components/MarginDetails.tsx`

**Pattern:** Fetch margin data with details

```typescript
"use client";
import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '@/lib/services/portfolioService';
import type { CollateralFinancingResponse, CollateralFinancingDetailsResponse } from '@/types';

interface MarginDetailsProps {
	accountNo: string;
}

export function MarginDetails({ accountNo }: MarginDetailsProps) {
	const [summary, setSummary] = useState<CollateralFinancingResponse | null>(null);
	const [details, setDetails] = useState<CollateralFinancingDetailsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMarginData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const [summaryRes, detailsRes] = await Promise.all([
				portfolioService.getMarginSummary(accountNo),
				portfolioService.getMarginDetails(accountNo, {
					pageSize: 50,
					pageIndex: 0
				})
			]);

			if (summaryRes.success && summaryRes.data) {
				setSummary(summaryRes.data);
			} else {
				setError(summaryRes.error || 'Failed to load margin summary');
			}

			if (detailsRes.success && detailsRes.data) {
				setDetails(detailsRes.data);
			}
		} catch (error) {
			setError('Network error. Please try again.');
		} finally {
			setLoading(false);
		}
	}, [accountNo]);

	useEffect(() => {
		fetchMarginData();
	}, [fetchMarginData]);

	if (loading) {
		return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>;
	}

	if (error || !summary) {
		return <div className="text-red-500">{error || 'No data available'}</div>;
	}

	return (
		<div className="space-y-6">
			{/* Summary Card */}
			<div className="border rounded-lg p-6">
				<h3 className="text-lg font-semibold mb-4">Margin Summary</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<p className="text-sm text-gray-600">Credit Limit</p>
						<p className="text-xl font-bold">
							{summary.creditLimit.toLocaleString()}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Available Financing</p>
						<p className="text-xl font-bold text-green-600">
							{summary.availableFinancing.toLocaleString()}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Total Financed</p>
						<p className="text-xl font-bold">
							{summary.totalFinanced.toLocaleString()}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Total Collateral</p>
						<p className="text-xl font-bold">
							{summary.totalCollateral.toLocaleString()}
						</p>
					</div>
				</div>
			</div>

			{/* Details Table */}
			{details && details.collateralFinancingDetails.length > 0 && (
				<div className="border rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-4">
						Collateral Details ({details.total})
					</h3>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left p-2">Security</th>
									<th className="text-right p-2">Quantity</th>
									<th className="text-right p-2">Last Price</th>
									<th className="text-right p-2">Market Value</th>
								</tr>
							</thead>
							<tbody>
								{details.collateralFinancingDetails.map((item, idx) => (
									<tr key={idx} className="border-b">
										<td className="p-2">
											<div>
												<p className="font-medium">{item.securityName}</p>
												<p className="text-sm text-gray-600">{item.securityCode}</p>
											</div>
										</td>
										<td className="text-right p-2">
											{item.quantity.toLocaleString()}
										</td>
										<td className="text-right p-2">
											{item.lastDonePrice.toFixed(2)}
										</td>
										<td className="text-right p-2 font-semibold">
											{item.marketValue.toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
```

#### Example 3: Contracts Table with Pagination

**File:** `app/(with-layout)/portfolio/_components/ContractsTable.tsx`

**Pattern:** Paginated data with filters

```typescript
"use client";
import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '@/lib/services/portfolioService';
import type { ContractsResponse } from '@/types';

interface ContractsTableProps {
	accountNo: string;
}

export function ContractsTable({ accountNo }: ContractsTableProps) {
	const [contracts, setContracts] = useState<ContractsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Pagination state
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize] = useState(20);

	// Filter state
	const [marketFilter, setMarketFilter] = useState<string | undefined>();

	const fetchContracts = useCallback(async () => {
		setLoading(true);
		setError(null);

		const response = await portfolioService.getContracts(
			accountNo,
			marketFilter,
			{ pageSize, pageIndex }
		);

		if (response.success && response.data) {
			setContracts(response.data);
		} else {
			setError(response.error || 'Failed to load contracts');
		}

		setLoading(false);
	}, [accountNo, marketFilter, pageSize, pageIndex]);

	useEffect(() => {
		fetchContracts();
	}, [fetchContracts]);

	const handleNextPage = () => {
		if (contracts && (pageIndex + 1) * pageSize < contracts.total) {
			setPageIndex(pageIndex + 1);
		}
	};

	const handlePrevPage = () => {
		if (pageIndex > 0) {
			setPageIndex(pageIndex - 1);
		}
	};

	if (loading) {
		return <div className="animate-pulse h-96 bg-gray-200 rounded"></div>;
	}

	if (error || !contracts) {
		return <div className="text-red-500">{error || 'No contracts found'}</div>;
	}

	return (
		<div className="space-y-4">
			{/* Filter */}
			<div className="flex gap-2">
				<select
					value={marketFilter || ""}
					onChange={(e) => {
						setMarketFilter(e.target.value || undefined);
						setPageIndex(0);
					}}
					className="border rounded px-3 py-2"
				>
					<option value="">All Markets</option>
					<option value="SGX">SGX</option>
					<option value="HKEX">HKEX</option>
					<option value="BURSA">Bursa Malaysia</option>
					<option value="SET">SET Thailand</option>
				</select>
			</div>

			{/* Table */}
			<div className="overflow-x-auto border rounded-lg">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left p-3">Trade Date</th>
							<th className="text-left p-3">Security</th>
							<th className="text-center p-3">Type</th>
							<th className="text-right p-3">Quantity</th>
							<th className="text-right p-3">Price</th>
							<th className="text-right p-3">Net Amount</th>
							<th className="text-left p-3">Due Date</th>
						</tr>
					</thead>
					<tbody>
						{contracts.contracts.map((contract, idx) => (
							<tr key={idx} className="border-t">
								<td className="p-3">{contract.tradeDate}</td>
								<td className="p-3">
									<div>
										<p className="font-medium">{contract.securityName}</p>
										<p className="text-sm text-gray-600">{contract.marketCode}</p>
									</div>
								</td>
								<td className="text-center p-3">
									<span
										className={`px-2 py-1 rounded text-xs ${
											contract.type === 'BUY'
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'
										}`}
									>
										{contract.type}
									</span>
								</td>
								<td className="text-right p-3">
									{contract.quantity.toLocaleString()}
								</td>
								<td className="text-right p-3">
									{contract.price.toFixed(2)}
								</td>
								<td className="text-right p-3 font-semibold">
									{contract.settlementCurrency} {contract.netAmount.toLocaleString()}
								</td>
								<td className="p-3">{contract.settlementDueDate}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-600">
					Showing {pageIndex * pageSize + 1} to{' '}
					{Math.min((pageIndex + 1) * pageSize, contracts.total)} of{' '}
					{contracts.total} contracts
				</p>
				<div className="flex gap-2">
					<button
						onClick={handlePrevPage}
						disabled={pageIndex === 0}
						className="px-4 py-2 border rounded disabled:opacity-50"
					>
						Previous
					</button>
					<button
						onClick={handleNextPage}
						disabled={(pageIndex + 1) * pageSize >= contracts.total}
						className="px-4 py-2 border rounded disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
```

---

## State Management

### Portfolio Store (Optional)

**File:** `/stores/portfolioStore.ts` (**OPTIONAL - Only if caching needed**)

```typescript
import { create } from "zustand";
import { portfolioService } from "@/lib/services/portfolioService";
import type { TrustBalancesResponse, CustodyResponse } from "@/types";

interface PortfolioState {
	// Cached data
	trustBalance: TrustBalancesResponse[] | null;
	custody: CustodyResponse | null;

	// Loading states
	loading: boolean;
	error: string | null;

	// Last fetch time (for cache invalidation)
	lastFetchTime: number | null;

	// Actions
	fetchPortfolioData: (accountNo: string) => Promise<void>;
	clearPortfolioData: () => void;
	shouldRefresh: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
	trustBalance: null,
	custody: null,
	loading: false,
	error: null,
	lastFetchTime: null,

	fetchPortfolioData: async (accountNo: string) => {
		// Check if cache is still valid
		const state = get();
		if (state.lastFetchTime && !state.shouldRefresh()) {
			return; // Use cached data
		}

		set({ loading: true, error: null });

		try {
			const portfolio = await portfolioService.getCompletePortfolio(accountNo);

			set({
				trustBalance: portfolio.trustBalance?.data || null,
				custody: portfolio.custody?.data || null,
				loading: false,
				lastFetchTime: Date.now(),
			});
		} catch (error) {
			set({
				loading: false,
				error: 'Failed to load portfolio data',
			});
		}
	},

	clearPortfolioData: () =>
		set({
			trustBalance: null,
			custody: null,
			loading: false,
			error: null,
			lastFetchTime: null,
		}),

	shouldRefresh: () => {
		const state = get();
		if (!state.lastFetchTime) return true;
		return Date.now() - state.lastFetchTime > CACHE_DURATION;
	},
}));
```

**Note:** Only create this store if you need to cache portfolio data across multiple components. For most cases, component-level state is sufficient.

---

## Testing Checklist

### API Integration Tests

- [ ] **getAccountSummary** - Returns account summaries with outstanding contracts
- [ ] **getTrustBalance** - Returns trust balances by account and currency
- [ ] **getTrustBalanceDetails** - Returns paginated trust balance details
- [ ] **getCustodyHoldings** - Returns paginated custody holdings
- [ ] **getMarginSummary** - Returns collateral financing summary
- [ ] **getMarginDetails** - Returns paginated margin details
- [ ] **getContracts** - Returns paginated contracts with optional market filter
- [ ] **getContractsPastDue** - Returns past due contracts
- [ ] **getContraStatements** - Returns paginated contra statements
- [ ] **getContraDetails** - Returns contra statement details
- [ ] **Pagination** - All paginated endpoints respect pageSize and pageIndex

### Component Tests

- [ ] Portfolio dashboard loads with account data
- [ ] Trust balance displays correctly
- [ ] Custody holdings table renders
- [ ] Margin details show summary and breakdown
- [ ] Contracts table displays with pagination
- [ ] Market filter works on contracts
- [ ] Past due contracts highlighted
- [ ] Contra statements accessible
- [ ] Loading skeletons display during fetch
- [ ] Error states show with retry button

### Error Scenarios

- [ ] 401 Unauthorized - Redirects to login
- [ ] 404 No Accounts Linked - Shows empty state
- [ ] 422 Validation Error - Shows user-friendly message
- [ ] Network failure - Shows connection error with retry
- [ ] Empty data - Shows appropriate empty state
- [ ] Pagination beyond available pages - Disabled next button
- [ ] Invalid account number - Shows error message

### Performance Tests

- [ ] Pagination reduces initial load time
- [ ] Parallel requests load faster (Promise.allSettled)
- [ ] Cache prevents unnecessary refetches (if using store)
- [ ] Large tables render smoothly (virtualization if needed)
- [ ] Market filter doesn't cause full reload

---

## Summary

### Implementation Checklist

```
✅ Step 1: Create /lib/api/endpoints/portfolio.ts with all 10 endpoints
✅ Step 2: Add TypeScript types to /types/index.ts
✅ Step 3: Create /lib/services/portfolioService.ts with all service functions
✅ Step 4: Update portfolio page to use service layer
✅ Step 5: Create component examples (dashboard, margin, contracts)
✅ Step 6: Add pagination support to all list endpoints
✅ Step 7: Test all endpoints and error scenarios
✅ Step 8: Update documentation
```

### Core Principles

1. **Follow Three-Layer Architecture**: Components → Services → API Client
2. **Pagination by Default**: Use pageSize and pageIndex for all list endpoints
3. **Component State Preferred**: Only use Zustand store if caching needed
4. **Consistent Error Handling**: Always handle loading/error/success states
5. **Type Safety**: Define all Request/Response types with exact API structure
6. **JSDoc Documentation**: Document all service functions and endpoints

### Critical Files to Create

1. **`/lib/api/endpoints/portfolio.ts`** - NEW FILE - All 10 endpoint definitions
2. **`/lib/services/portfolioService.ts`** - NEW FILE - Service layer with 10+ functions
3. **`/lib/api/endpoints/index.ts`** - UPDATE - Export portfolio endpoints
4. **`/types/index.ts`** - UPDATE - Add 15+ portfolio types
5. **`/app/(with-layout)/portfolio/page.tsx`** - UPDATE - Integrate portfolio service

### Reference Files

- **API Spec:** `/docs/swagger/iTrade-PortfolioAPI.yaml`
- **API Integration Guide:** `/docs/API-INTEGRATION-GUIDE.md`
- **Example Service:** `/lib/services/subscriptionService.ts`
- **Example Component:** `/app/(minimal)/sidebar/MySubscriptions.tsx`

---

## Priority Notes

⚠️ **CRITICAL PRIORITY:** Portfolio APIs are the most important missing feature. Users cannot:
- View their account balances
- Check custody holdings
- Monitor margin positions
- Review contracts and trades
- Access contra statements

This should be implemented **before** other missing APIs (Profile SIP, Update Info, etc.)

**Recommended Implementation Order:**
1. Phase 1: Account Summary + Trust Balance (core portfolio view)
2. Phase 2: Custody Holdings + Contracts (trading data)
3. Phase 3: Margin/Collateral + Contra (advanced features)
4. Phase 4: Polish, error handling, pagination optimization

---

**Last Updated:** 2025-12-28
**Status:** 0/10 endpoints implemented (0%)
**Next Steps:** Create endpoints file and service layer, then integrate into portfolio page
