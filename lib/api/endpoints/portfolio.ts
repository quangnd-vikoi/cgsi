/**
 * Portfolio API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Source: docs/swagger/api-doc-v3/iTrade-PortfolioAPI.yaml
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 */
export const portfolioEndpoints = {
	/** GET /portfolio/api/v1/fx — FX exchange rates */
	fxRates: () => `/portfolio/api/v1/fx`,

	/** GET /portfolio/api/v1/accountSummary/{accountNo} */
	accountSummary: (accountNo: string) => `/portfolio/api/v1/accountSummary/${accountNo}`,

	/** GET /portfolio/api/v1/trustBalance/{accountNo} */
	trustBalance: (accountNo: string) => `/portfolio/api/v1/trustBalance/${accountNo}`,

	/** GET /portfolio/api/v1/trustBalance/{accountNo}/details/{currency}?pageSize=&pageIndex= */
	trustBalanceDetails: (accountNo: string, currency: string, pageSize = 20, pageIndex = 0) =>
		`/portfolio/api/v1/trustBalance/${accountNo}/details/${currency}?pageSize=${pageSize}&pageIndex=${pageIndex}`,

	/** GET /portfolio/api/v1/holdings/{accountNo}?pageSize=&pageIndex= */
	holdings: (accountNo: string, pageSize = 20, pageIndex = 0) =>
		`/portfolio/api/v1/holdings/${accountNo}?pageSize=${pageSize}&pageIndex=${pageIndex}`,

	/** GET /portfolio/api/v1/margin/{accountNo} — Collateral financing */
	margin: (accountNo: string) => `/portfolio/api/v1/margin/${accountNo}`,

	/** GET /portfolio/api/v1/contracts/{accountNo}?marketCode=&pageSize=&pageIndex= */
	contracts: (accountNo: string, marketCode?: string, pageSize = 20, pageIndex = 0) => {
		const params = new URLSearchParams({ pageSize: String(pageSize), pageIndex: String(pageIndex) });
		if (marketCode) params.set("marketCode", marketCode);
		return `/portfolio/api/v1/contracts/${accountNo}?${params}`;
	},

	/** GET /portfolio/api/v1/contracts/{accountNo}/pastdue?marketCode=&pageSize=&pageIndex= */
	contractsPastDue: (accountNo: string, marketCode?: string, pageSize = 20, pageIndex = 0) => {
		const params = new URLSearchParams({ pageSize: String(pageSize), pageIndex: String(pageIndex) });
		if (marketCode) params.set("marketCode", marketCode);
		return `/portfolio/api/v1/contracts/${accountNo}/pastdue?${params}`;
	},

	/** GET /portfolio/api/v1/contra/{accountNo}?marketCode=&pageSize=&pageIndex= */
	contra: (accountNo: string, marketCode?: string, pageSize = 20, pageIndex = 0) => {
		const params = new URLSearchParams({ pageSize: String(pageSize), pageIndex: String(pageIndex) });
		if (marketCode) params.set("marketCode", marketCode);
		return `/portfolio/api/v1/contra/${accountNo}?${params}`;
	},

	/** GET /portfolio/api/v1/contra/{accountNo}/details/{statementNo} */
	contraDetails: (accountNo: string, statementNo: string) =>
		`/portfolio/api/v1/contra/${accountNo}/details/${statementNo}`,

	/** GET /portfolio/api/v1/sbl/{accountNo}/borrowed?marketCode=&pageSize=&pageIndex= */
	sblBorrowed: (accountNo: string, marketCode?: string, pageSize = 20, pageIndex = 0) => {
		const params = new URLSearchParams({ pageSize: String(pageSize), pageIndex: String(pageIndex) });
		if (marketCode) params.set("marketCode", marketCode);
		return `/portfolio/api/v1/sbl/${accountNo}/borrowed?${params}`;
	},

	/** GET /portfolio/api/v1/sbl/{accountNo}/loaned?marketCode=&pageSize=&pageIndex= */
	sblLoaned: (accountNo: string, marketCode?: string, pageSize = 20, pageIndex = 0) => {
		const params = new URLSearchParams({ pageSize: String(pageSize), pageIndex: String(pageIndex) });
		if (marketCode) params.set("marketCode", marketCode);
		return `/portfolio/api/v1/sbl/${accountNo}/loaned?${params}`;
	},

	/** POST /portfolio/api/v1/deposit/paynow */
	depositPaynow: () => `/portfolio/api/v1/deposit/paynow`,

	/** GET /portfolio/api/v1/cdpTranfer — Note: typo matches API spec */
	cdpTransfer: () => `/portfolio/api/v1/cdpTranfer`,

	/** POST /portfolio/api/v1/cdpTranfer */
	submitCdpTransfer: () => `/portfolio/api/v1/cdpTranfer`,

	/** GET /portfolio/api/v1/cdpTranfer/status */
	cdpTransferStatus: () => `/portfolio/api/v1/cdpTranfer/status`,
} as const;
