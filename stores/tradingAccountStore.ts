import { create } from "zustand";
import type { TradingAccount } from "@/types";

interface TradingAccountStore {
	accounts: TradingAccount[];
	selectedAccount: TradingAccount | null;
	isInitialized: boolean;
	setAccounts: (accounts: TradingAccount[]) => void;
	setSelectedAccount: (account: TradingAccount | null) => void;
	updateSelectedAccount: (updates: Partial<TradingAccount>) => void;
	getAccounts: () => TradingAccount[];
	getAccountById: (accountNo: string) => TradingAccount | undefined;
	setInitialized: (value: boolean) => void;
	resetStore: () => void;
}

export const useTradingAccountStore = create<TradingAccountStore>((set, get) => ({
	accounts: [],
	selectedAccount: null,
	isInitialized: false,
	setAccounts: (accounts) => set({ accounts, isInitialized: true }),
	setSelectedAccount: (account) => set({ selectedAccount: account }),
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
	setInitialized: (value) => set({ isInitialized: value }),
	resetStore: () =>
		set({
			accounts: [],
			selectedAccount: null,
			isInitialized: false,
		}),
}));
