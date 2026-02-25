import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { ChevronRight, Copy } from "lucide-react";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { useSheetStore } from "@/stores/sheetStore";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

const TradingAccounts = () => {
	const accounts = useTradingAccountStore((state) => state.accounts);
	const isInitialized = useTradingAccountStore((state) => state.isInitialized);
	const setSelectedAccount = useTradingAccountStore((state) => state.setSelectedAccount);
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	// Note: Data is fetched by DataInitializer on app mount
	// This component just reads from the store

	const handleDetailsClick = (accountNo: string) => {
		const account = accounts.find((acc) => acc.accountNo === accountNo);
		if (account) {
			setSelectedAccount(account);
		}

		setOpenSheet("trading_account_details");
	};

	// Show loading state while data is being initialized
	if (!isInitialized) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle title="Trading Accounts" backTo={"profile"} />
				<div className="flex-1 flex items-center justify-center">
					<div className="space-y-4 w-full p-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="p-4 border border-stroke-secondary rounded space-y-2">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-6 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (accounts.length === 0) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle title="Trading Accounts" backTo={"profile"} />
				<div className="flex-1 flex flex-col items-center justify-center">
					<ErrorState
						type="empty"
						title="No Trading Accounts"
						description="No trading accounts found for this profile."
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<CustomSheetTitle title="Trading Accounts" backTo={"profile"} />

			<div className="flex-1 overflow-y-auto pb-4 scrollbar-offset-laptop">
				{accounts.map((acc) => (
					<div
						key={acc.accountNo}
						className="p-4 border border-stroke-secondary rounded mt-6 cursor-pointer hover:border-cgs-blue hover:bg-theme-blue-100/50 transition-colors group"
						onClick={() => handleDetailsClick(acc.accountNo)}
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="text-xs font-normal">{acc.accountType || "Trading Account"}</p>
								<div className="flex gap-2 items-center mt-1">
									<p className="text-lg font-semibold">{acc.accountNo}</p>
									<Copy
										className="text-cgs-blue cursor-pointer hover:text-cgs-blue"
										size={16}
										onClick={(e) => {
											e.stopPropagation();
											navigator.clipboard.writeText(acc.accountNo);
										}}
									/>
								</div>
							</div>
							<ChevronRight className="text-cgs-blue group-hover:translate-x-0.5 transition-transform" size={14} />
						</div>
						<div className="flex justify-between mt-6 text-xs">
							<p className="text-typo-secondary font-normal">TR Name:</p>
							<p className="text-typo-primary font-semibold">{acc.trName || "-"}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TradingAccounts;
