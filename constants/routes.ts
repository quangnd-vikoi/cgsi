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
};

export const INTERNAL_ROUTES = {
	HOME: "/",
	PORFOLIO: "/porfolio",
	DISCOVER: "/discover",
	SECURITIES: "/securities",
	ALTERNATIVE: "/alternatives",
	MYAPPLICATION: "/my-applications",
	DONATIONS: "/donations",
};
