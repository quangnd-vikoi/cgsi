import type { TradingAccount } from "@/types";

export const USER_TYPE = {
	RETAIL_INDIVIDUAL: "RETAIL_INDIVIDUAL",
	RETAIL_JOINT: "RETAIL_JOINT",
	CORP: "CORP",
	TR: "TR",
	DEMO: "DEMO",
} as const;

export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export function deriveUserType(
	userCategory: string | undefined,
	accounts: TradingAccount[]
): UserType | null {
	if (userCategory === "2") return USER_TYPE.DEMO;
	if (userCategory === "8") return USER_TYPE.TR;
	if (userCategory === "4") {
		if (accounts.some((a) => a.accountType === "CORP")) return USER_TYPE.CORP;
		if (accounts.some((a) => a.accountType === "JOINT")) return USER_TYPE.RETAIL_JOINT;
		if (accounts.some((a) => a.accountType === "INDV")) return USER_TYPE.RETAIL_INDIVIDUAL;
	}
	return null;
}
