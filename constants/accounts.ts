import type { PortfolioType } from "@/types";

export const ASSET_CLASS_LABELS: Record<string, string> = {
	E: "Equities",
	W: "Warrants",
	B: "Bonds",
	C: "Cash Balance",
	O: "Others",
};

export const ACCOUNT_TYPE_LABELS: Record<PortfolioType, string> = {
	CTA: "Cash Trading Account",
	MTA: "Margin Trading Account",
	SBL: "Shares Borrowing Account",
	CUT: "CUT Account",
	iCash: "iCash Account",
};

export const ACCOUNT_TYPE_PRIORITY: PortfolioType[] = ["CTA", "CUT", "iCash", "MTA", "SBL"];

/** Maps legacy currency symbol → ISO currency code (API returns legacy format) */
export const LEGACY_CURRENCY_TO_ISO: Record<string, string> = {
	"S$": "SGD",
	"M$": "MYR",
	"H$": "HKD",
	"HK$": "HKD",
	"US$": "USD",
	PES: "PHP",
	RP: "IDR",
	STL: "GBP",
	YEN: "JPY",
	BTS: "THB",
	"A$": "AUD",
	"NZ$": "NZD",
	RMB: "CNY",
};

/** Maps currency code → market code (temporary: API returns currency instead of market) */
export const CURRENCY_TO_MARKET: Record<string, string> = {
	SGD: "SG",
	MYR: "MY",
	HKD: "HK",
	USD: "US",
	THB: "TH",
	IDR: "ID",
	AUD: "AU",
	GBP: "UK",
	JPY: "JP",
	KRW: "KR",
	NOK: "NO",
	NZD: "NZ",
	PHP: "PH",
	TWD: "TW",
	ANG: "NL",
	CNH: "CN",
	CAD: "CA",
	FRF: "FR",
	SEK: "SE",
	USS: "US",
	DEM: "DK",
	USN: "US",
	VND: "VN",
};
