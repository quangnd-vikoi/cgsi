import { create } from "zustand";
import type { TradingAccount } from "@/types";
import { ACCOUNT_TYPE_PRIORITY } from "@/constants/accounts";

interface TradingAccountStore {
	accounts: TradingAccount[];
	selectedAccount: TradingAccount | null;
	isInitialized: boolean;
	isTRClientAccount: boolean;
	setAccounts: (accounts: TradingAccount[]) => void;
	setSelectedAccount: (account: TradingAccount | null) => void;
	updateSelectedAccount: (updates: Partial<TradingAccount>) => void;
	setTRClientAccount: (account: TradingAccount) => void;
	clearTRClientAccount: () => void;
	getAccounts: () => TradingAccount[];
	getAccountById: (accountNo: string) => TradingAccount | undefined;
	getDefaultAccountNo: () => string | null;
	isSubCDP: () => boolean;
	setInitialized: (value: boolean) => void;
	resetStore: () => void;
}

export const useTradingAccountStore = create<TradingAccountStore>((set, get) => ({
	accounts: [],
	selectedAccount: null,
	isInitialized: false,
	isTRClientAccount: false,
	setAccounts: (accounts) => set({ accounts, isInitialized: true }),
	setSelectedAccount: (account) => set({ selectedAccount: account, isTRClientAccount: false }),
	setTRClientAccount: (account) => set({ selectedAccount: account, isTRClientAccount: true }),
	clearTRClientAccount: () => {
		const defaultNo = get().getDefaultAccountNo();
		const defaultAccount = defaultNo ? get().getAccountById(defaultNo) : null;
		set({ selectedAccount: defaultAccount ?? null, isTRClientAccount: false });
	},
	updateSelectedAccount: (updates) => {
		const { selectedAccount } = get();
		if (selectedAccount) {
			const updatedAccount = { ...selectedAccount, ...updates };
			set({ selectedAccount: updatedAccount });

			// Update in accounts list as well
			const updatedAccounts = get().accounts.map((acc) =>
				acc.accountNo === updatedAccount.accountNo ? updatedAccount : acc
			);
			set({ accounts: updatedAccounts });
		}
	},
	getAccounts: () => get().accounts,
	getAccountById: (accountNo) => get().accounts.find((acc) => acc.accountNo === accountNo),

	// Get default account number with priority logic
	// Priority: CTA > CUT > iCash > MTA > SBL
	// If only 1 account, select it regardless of type
	getDefaultAccountNo: () => {
		const accounts = get().accounts;

		if (!accounts || accounts.length === 0) {
			return null;
		}

		// Only 1 account → select it
		if (accounts.length === 1) {
			return accounts[0].accountNo;
		}

		// Multiple accounts → select by priority
		for (const type of ACCOUNT_TYPE_PRIORITY) {
			const found = accounts.find((acc) => acc.accountType === type);
			if (found) {
				return found.accountNo;
			}
		}

		// Fallback: return first account
		return accounts[0].accountNo;
	},

	isSubCDP: () => get().selectedAccount?.cdp?.startsWith("217") ?? false,

	setInitialized: (value) => set({ isInitialized: value }),
	resetStore: () =>
		set({
			accounts: [],
			selectedAccount: null,
			isInitialized: false,
			isTRClientAccount: false,
		}),
}));
