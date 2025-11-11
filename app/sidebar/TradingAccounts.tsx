import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy } from "lucide-react";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { useSheetStore } from "@/stores/sheetStore";

const TradingAccounts = () => {
	const accounts = useTradingAccountStore((state) => state.accounts);
	const setSelectedAccount = useTradingAccountStore((state) => state.setSelectedAccount);
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleDetailsClick = (accountId: string) => {
		const account = accounts.find((acc) => acc.id === accountId);
		if (account) {
			setSelectedAccount(account);
			// TODO: Navigate to details page or open modal
		}

		setOpenSheet("trading_account_details");
	};

	return (
		<div className="flex flex-col h-full">
			<CustomSheetTitle title="Trading Accounts" backTo={"profile"} />

			<div className="flex-1 overflow-y-auto pb-4 scrollbar-offset-laptop">
				{accounts.map((acc) => (
					<div key={acc.id} className="p-4 border border-stroke-secondary rounded-xl mt-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-xs font-normal">{acc.type}</p>
								<div className="flex gap-2 items-center mt-1">
									<p className="text-lg font-semibold">{acc.id}</p>
									<Copy
										className="text-enhanced-blue cursor-pointer hover:text-enhanced-blue"
										size={16}
									/>
								</div>
							</div>
							<Button
								onClick={() => handleDetailsClick(acc.id)}
								className="gap-1 px-2.5 h-6 border border-enhanced-blue text-xs rounded-full flex items-center leading-2 bg-white text-enhanced-blue hover:bg-enhanced-blue hover:text-white group"
							>
								Details
								<ArrowRight className="text-enhanced-blue group-hover:text-white" size={14} />
							</Button>
						</div>
						<div className="flex justify-between mt-6 text-xs">
							<p className="text-typo-secondary font-normal">TR Name:</p>
							<p className="text-typo-primary font-semibold">{acc.trName}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TradingAccounts;
