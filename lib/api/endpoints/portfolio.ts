/**
 * Portfolio API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Source: docs/swagger/api-doc-v4/iTrade-PortfolioAPI.yaml
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 */
export const portfolioEndpoints = {
	/** GET /portfolio/api/v1/fx — FX exchange rates */
	fxRates: () => `/portfolio/api/v1/fx`,

	/** GET /portfolio/api/v1/trustBalance/{accountNo} */
	trustBalance: (accountNo: string) => `/portfolio/api/v1/trustBalance/${accountNo}`,

	/** GET /portfolio/api/v1/trustBalance/{accountNo}/details?pageSize=&pageIndex= */
	trustBalanceDetails: (accountNo: string, pageSize = 20, pageIndex = 0) =>
		`/portfolio/api/v1/trustBalance/${accountNo}/details?pageSize=${pageSize}&pageIndex=${pageIndex}`,

	/** GET /portfolio/api/v1/holdings/{accountNo}?pageSize=&pageIndex= */
	holdings: (accountNo: string, pageSize = 20, pageIndex = 0) =>
		`/portfolio/api/v1/holdings/${accountNo}?pageSize=${pageSize}&pageIndex=${pageIndex}`,

	/** GET /portfolio/api/v1/contracts/{accountNo}?marketCode=&pageSize=&pageIndex= */
	contracts: (accountNo: string, marketCode?: string, pageSize = 20, pageIndex = 0) => {
		const params = new URLSearchParams({ pageSize: String(pageSize), pageIndex: String(pageIndex) });
		if (marketCode) params.set("marketCode", marketCode);
		return `/portfolio/api/v1/contracts/${accountNo}?${params}`;
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

	/** GET /portfolio/api/v1/cdpTransfer */
	cdpTransfer: () => `/portfolio/api/v1/cdpTransfer`,

	/** POST /portfolio/api/v1/cdpTransfer */
	submitCdpTransfer: () => `/portfolio/api/v1/cdpTransfer`,

	/** GET /portfolio/api/v1/cdpTransfer/status */
	cdpTransferStatus: () => `/portfolio/api/v1/cdpTransfer/status`,
} as const;
