import React, { useState, useEffect, useCallback } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy } from "lucide-react";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { useSheetStore } from "@/stores/sheetStore";
import { getUserAccounts } from "@/lib/services/profileService";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

const TradingAccounts = () => {
	const accounts = useTradingAccountStore((state) => state.accounts);
	const setAccounts = useTradingAccountStore((state) => state.setAccounts);
	const isInitialized = useTradingAccountStore((state) => state.isInitialized);
	const setSelectedAccount = useTradingAccountStore((state) => state.setSelectedAccount);
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAccounts = useCallback(async () => {
		if (isInitialized) return;

		setLoading(true);
		setError(null);

		try {
			const response = await getUserAccounts();

			if (response.success && response.data) {
				setAccounts(response.data);
			} else {
				setError(response.error || "Failed to load trading accounts. Please try again.");
			}
		} catch (err) {
			console.error("Error fetching trading accounts:", err);
			setError("Network error. Please check your connection and try again.");
		} finally {
			setLoading(false);
		}
	}, [isInitialized, setAccounts]);

	useEffect(() => {
		fetchAccounts();
	}, [fetchAccounts]);

	const handleDetailsClick = (accountNo: string) => {
		const account = accounts.find((acc) => acc.accountNo === accountNo);
		if (account) {
			setSelectedAccount(account);
		}

		setOpenSheet("trading_account_details");
	};

	if (loading) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle title="Trading Accounts" backTo={"profile"} />
				<div className="flex-1 flex items-center justify-center">
					<div className="space-y-4 w-full p-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="p-4 border border-stroke-secondary rounded-xl space-y-2">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-6 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle title="Trading Accounts" backTo={"profile"} />
				<div className="flex-1 flex flex-col items-center justify-center">
					<ErrorState
						type="error"
						title="Failed to Load Accounts"
						description={
							<div className="space-y-4">
								<p>{error}</p>
								<Button onClick={fetchAccounts} variant="outline" size="sm">
									Retry
								</Button>
							</div>
						}
					/>
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
					<div key={acc.accountNo} className="p-4 border border-stroke-secondary rounded-xl mt-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-xs font-normal">{acc.accountType || "Trading Account"}</p>
								<div className="flex gap-2 items-center mt-1">
									<p className="text-lg font-semibold">{acc.accountNo}</p>
									<Copy
										className="text-cgs-blue cursor-pointer hover:text-cgs-blue"
										size={16}
									/>
								</div>
							</div>
							<Button
								onClick={() => handleDetailsClick(acc.accountNo)}
								className="gap-1 px-2.5 h-6 border border-cgs-blue text-xs rounded-full flex items-center leading-2 bg-white text-cgs-blue hover:bg-cgs-blue hover:text-white group"
							>
								Details
								<ArrowRight className="text-cgs-blue group-hover:text-white" size={14} />
							</Button>
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
