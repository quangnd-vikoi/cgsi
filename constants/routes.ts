export const ENDPOINT = {
	CGSI_CAMPAIGNS: "https://www.cgsi.com.sg/campaigns/",
	CGSI_EVENTS: "https://www.cgsi.com.sg/events/",
	CGSI_CHANGE_PASSWORD: "https://itrade.cgsi.com.sg/app/trade.z",
	CGSI_INVOICE: (token: string) =>
		`https://itrade.cgsi.com.sg/app/subscription.iop.invoice.z?code=${token}`,
	CGSI_TRADE: "https://sg.itradecgsi.com/gcCGSIPlus/tcplus/index.jsp",
};

export const INTERNAL_ROUTES = {
	HOME: "/",
	PORFOLIO: "/porfolio",
	DISCOVER: "/discover",
	SECURITIES: "/securities",
	ALTERNATIVE: "/alternatives",
	MYAPPLICATION: "/my-applications",
};
