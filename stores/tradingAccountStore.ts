import { create } from "zustand";

export interface TradingAccountDetails {
	cdp: string | null;
	cpfAccount: string | null;
	srsAccount: string | null;
	paymentMethod: string | null;
	representative: {
		name: string;
		department: string;
		repNo: string;
		phone: string;
		email: string;
	};
}

export interface TradingAccount {
	id: string;
	type: string;
	trName: string;
	details: TradingAccountDetails;
}

interface TradingAccountStore {
	accounts: TradingAccount[];
	selectedAccount: TradingAccount | null;
	setAccounts: (accounts: TradingAccount[]) => void;
	setSelectedAccount: (account: TradingAccount | null) => void;
	updateSelectedAccount: (updates: Partial<TradingAccount>) => void;
	getAccounts: () => TradingAccount[];
	getAccountById: (id: string) => TradingAccount | undefined;
}

export const useTradingAccountStore = create<TradingAccountStore>((set, get) => ({
	accounts: [
		{
			id: "0123451",
			type: "Cash Trading Account",
			trName: "Lim Yi Bin",
			details: {
				cdp: "1681-1234-5678",
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Lim Yi Bin",
					department: "Wealth Solutions",
					repNo: "TTK100025746",
					phone: "+65 6536 8810",
					email: "yibin.lim@cgsi.com",
				},
			},
		},
		{
			id: "0123452",
			type: "Margin Trading Account",
			trName: "Diyan Tan",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Diyan Tan",
					department: "Wealth Solutions",
					repNo: "TTK100025747",
					phone: "+65 6536 8820",
					email: "diyan.tan@cgsi.com",
				},
			},
		},
		{
			id: "0123453",
			type: "Shares Borrowing Account",
			trName: "Rayhan Abhisamajah",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Rayhan Abhisamajah",
					department: "Wealth Solutions",
					repNo: "TTK100025748",
					phone: "+65 6536 8830",
					email: "rayhan.a@cgsi.com",
				},
			},
		},
		{
			id: "0123454",
			type: "CUT Account",
			trName: "Lim Yi Bin",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Lim Yi Bin",
					department: "Wealth Solutions",
					repNo: "TTK100025746",
					phone: "+65 6536 8810",
					email: "yibin.lim@cgsi.com",
				},
			},
		},
		{
			id: "0123455",
			type: "iCash Account",
			trName: "Lim Yi Bin",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Lim Yi Bin",
					department: "Wealth Solutions",
					repNo: "TTK100025746",
					phone: "+65 6536 8810",
					email: "yibin.lim@cgsi.com",
				},
			},
		},
		{
			id: "0223451",
			type: "Cash Trading Account",
			trName: "Lim Yi Bin",
			details: {
				cdp: "1681-1234-5678",
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Lim Yi Bin",
					department: "Wealth Solutions",
					repNo: "TTK100025746",
					phone: "+65 6536 8810",
					email: "yibin.lim@cgsi.com",
				},
			},
		},
		{
			id: "0223452",
			type: "Margin Trading Account",
			trName: "Diyan Tan",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Diyan Tan",
					department: "Wealth Solutions",
					repNo: "TTK100025747",
					phone: "+65 6536 8820",
					email: "diyan.tan@cgsi.com",
				},
			},
		},
		{
			id: "01234531",
			type: "Shares Borrowing Account",
			trName: "Rayhan Abhisamajah",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Rayhan Abhisamajah",
					department: "Wealth Solutions",
					repNo: "TTK100025748",
					phone: "+65 6536 8830",
					email: "rayhan.a@cgsi.com",
				},
			},
		},
		{
			id: "0423455",
			type: "CUT Account",
			trName: "Lim Yi Bin",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Lim Yi Bin",
					department: "Wealth Solutions",
					repNo: "TTK100025746",
					phone: "+65 6536 8810",
					email: "yibin.lim@cgsi.com",
				},
			},
		},
		{
			id: "0123435",
			type: "iCash Account",
			trName: "Lim Yi Bin",
			details: {
				cdp: null,
				cpfAccount: null,
				srsAccount: null,
				paymentMethod: null,
				representative: {
					name: "Lim Yi Bin",
					department: "Wealth Solutions",
					repNo: "TTK100025746",
					phone: "+65 6536 8810",
					email: "yibin.lim@cgsi.com",
				},
			},
		},
	],
	selectedAccount: null,
	setAccounts: (accounts) => set({ accounts }),
	setSelectedAccount: (account) => set({ selectedAccount: account }),
	updateSelectedAccount: (updates) => {
		const { selectedAccount } = get();
		if (selectedAccount) {
			const updatedAccount = { ...selectedAccount, ...updates };
			set({ selectedAccount: updatedAccount });

			// Cập nhật cả trong danh sách accounts
			const updatedAccounts = get().accounts.map((acc) =>
				acc.id === updatedAccount.id ? updatedAccount : acc
			);
			set({ accounts: updatedAccounts });
		}
	},
	getAccounts: () => get().accounts,
	getAccountById: (id) => get().accounts.find((acc) => acc.id === id),
}));
