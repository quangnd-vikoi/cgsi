import type { AccountType, PortfolioType } from "@/types";

export const ASSET_CLASS_LABELS: Record<string, string> = {
	E: "Equities",
	W: "Warrants",
	B: "Bonds",
	C: "Cash Balance",
	O: "Others",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
	CTA: "Cash Trading Account",
	MTA: "Margin Trading Account",
	SBL: "Shares Borrowing Account",
	CUT: "CUT Account",
	iCash: "iCash Account",
	INDV: "Individual Account",
	JOINT: "Joint Account",
	CORP: "Corporate Account",
};

export const ACCOUNT_TYPE_PRIORITY: PortfolioType[] = ["CTA", "CUT", "iCash", "MTA", "SBL"];
