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

	/** GET /portfolio/api/v1/accountSummary/{accountNo} */
	accountSummary: (accountNo: string) => `/portfolio/api/v1/accountSummary/${accountNo}`,

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

	/** GET /portfolio/api/v1/trustBalance/{accountNo}/details/export */
	exportTrustBalanceDetails: (accountNo: string) =>
		`/portfolio/api/v1/trustBalance/${accountNo}/details/export`,

	/** GET /portfolio/api/v1/holdings/{accountNo}/export */
	exportHoldings: (accountNo: string) => `/portfolio/api/v1/holdings/${accountNo}/export`,

	/** GET /portfolio/api/v1/contracts/{accountNo}/export */
	exportContracts: (accountNo: string) => `/portfolio/api/v1/contracts/${accountNo}/export`,

	/** GET /portfolio/api/v1/contra/{accountNo}/export */
	exportContra: (accountNo: string) => `/portfolio/api/v1/contra/${accountNo}/export`,

	/** POST /portfolio/api/v1/deposit/paynow */
	depositPaynow: () => `/portfolio/api/v1/deposit/paynow`,

	/** GET /portfolio/api/v1/cdpTransfer */
	cdpTransfer: () => `/portfolio/api/v1/cdpTransfer`,

	/** POST /portfolio/api/v1/cdpTransfer */
	submitCdpTransfer: () => `/portfolio/api/v1/cdpTransfer`,

	/** GET /portfolio/api/v1/cdpTransfer/status */
	cdpTransferStatus: () => `/portfolio/api/v1/cdpTransfer/status`,

	/** GET /portfolio/accounts/search?searchAcct=&searchNric=&searchName=&pageSize=&pageIndex= */
	searchAccounts: (params: {
		searchAcct?: string;
		searchNric?: string;
		searchName?: string;
		pageSize?: number;
		pageIndex?: number;
	}) => {
		const qs = new URLSearchParams();
		if (params.searchAcct) qs.set("searchAcct", params.searchAcct);
		if (params.searchNric) qs.set("searchNric", params.searchNric);
		if (params.searchName) qs.set("searchName", params.searchName);
		if (params.pageSize !== undefined) qs.set("pageSize", String(params.pageSize));
		if (params.pageIndex !== undefined) qs.set("pageIndex", String(params.pageIndex));
		return `/portfolio/accounts/search?${qs.toString()}`;
	},
} as const;
