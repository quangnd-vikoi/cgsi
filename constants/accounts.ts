import type { PortfolioType } from "@/types";

export const ASSET_CLASS_LABELS: Record<string, string> = {
	E: "Equities",
	W: "Warrants",
	B: "Bonds",
	C: "Cash Balance",
	O: "Others",
};

export const ACCOUNT_TYPE_LABELS: Record<PortfolioType, string> = {
	CTA: "CTA",
	MTA: "MTA",
	SBL: "SBL",
	CUT: "CUT",
	iCash: "iCash",
};

export const ACCOUNT_TYPE_PRIORITY: PortfolioType[] = ["CTA", "CUT", "iCash", "MTA", "SBL"];

const ACCOUNT_TYPE_ALIASES: Record<string, PortfolioType> = {
	CTA: "CTA",
	CASH: "CTA",
	"CASH ACCOUNT": "CTA",
	"CASH TRADING ACCOUNT": "CTA",
	INDIVI: "CTA",
	INDIVIDUAL: "CTA",
	MTA: "MTA",
	MARGIN: "MTA",
	"MARGIN ACCOUNT": "MTA",
	"MARGIN TRADING ACCOUNT": "MTA",
	SBL: "SBL",
	"SHARES BORROWING ACCOUNT": "SBL",
	"SHARES BORROWING AND LENDING": "SBL",
	"SHARES BORROWING & LENDING": "SBL",
	CUT: "CUT",
	"CUT ACCOUNT": "CUT",
	"CASH UPFRONT TRADING": "CUT",
	"CASH UPFRONT TRADING ACCOUNT": "CUT",
	ICASH: "iCash",
	"ICASH ACCOUNT": "iCash",
};

const toAccountTypeKey = (value: string) => value.trim().replace(/\s+/g, " ").toUpperCase();

export const normalizeAccountType = (value?: string | null): PortfolioType | undefined => {
	if (!value) return undefined;
	return ACCOUNT_TYPE_ALIASES[toAccountTypeKey(value)];
};

export const getAccountTypeTag = (value?: string | null): string => {
	if (!value) return "";
	return normalizeAccountType(value) ?? value.trim();
};

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
