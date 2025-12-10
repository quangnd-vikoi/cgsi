export const CGSI = {
	CAMPAIGNS: "https://www.cgsi.com.sg/campaigns/",
	EVENTS: "https://www.cgsi.com.sg/events/",
	CHANGE_PASSWORD: "https://itrade.cgsi.com.sg/app/trade.z",
	INVOICE: (token: string) => `https://itrade.cgsi.com.sg/app/subscription.iop.invoice.z?code=${token}`,
	TRADE: "https://sg.itradecgsi.com/gcCGSIPlus/tcplus/index.jsp",
	STOCK_FILTER: "https://www2.trkd-hs.com/cgsi/ui/home?lang=en",
	ISCREENER: "https://example.com/",
	INSIGHTS: "https://www.cgsi.com.sg/insights/?lang=EN",
	ONETIME_DONATION: "https://itrade.cgsi.com.sg/app/donation.z?a=ack",
	ESTATEMENT: "https://itrade.cgsi.com.sg/app/iTradeEstatement?systemId=8a839ebd87a6ff260187e4326dfb4d7e",
	HELP_CENTRE: "https://www.cgsi.com.sg/draft/help/faq-itrade#General",

	EVENT_BY_ID: (id: string): string => `https://www.cgsi.com.sg/events/${id}&lang=EN`,
	INSIGHT_BY_ID: (id: string): string => `https://www.cgsi.com.sg/insights/${id}&lang=EN`,
	PAYMENT: `https://s2bpay.sc.com/s2bpay/billcollect?encstr=TTJJU1BWiV0sXSzzbNj3uT0c1qdyoh4J3GfwgvFogKaXR7elZZq1U3tS+fQdQTQZhz+rkItFTA66TELMGK14oQ==`,
};

export const INTERNAL_ROUTES = {
	HOME: "/",
	PORFOLIO: "/portfolio",
	DISCOVER: "/discover",
	SECURITIES: "/securities",
	ALTERNATIVE: "/alternatives",
	MYAPPLICATION: "/my-applications",
	DONATIONS: "/donations",
	ACCOUNT_LINKAGES: (type: string, unlink?: boolean) =>
		`/account-linkages?tab=${type}${unlink ? "?action=unlink" : ""}`,
	UPDATE_MOBILE: "/update-mobile",
	UPDATE_EMAIL: "/update-email",
	UPDATE_SIGNATURE: "/update-signature",
	MARKET_DATA: "/market-data",
	MY_SUBSCRIPTIONS: "/my-subscriptions",
	SETTLE: "/portfolio/settle",
	CASH_TRANSACTION: "/portfolio/cash-transaction",
	SHARE_TRANSFER: "/portfolio/shares-transfer",
};
