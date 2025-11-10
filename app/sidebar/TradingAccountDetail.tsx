import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { Copy } from "lucide-react";

const TradingAccountDetail = () => {
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);

	if (selectedAccount) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle backTo={"trading_accounts"} title="Account Details" />

				<div className="flex-1 overflow-y-auto pb-4 scrollbar-offset-laptop mt-6">
					<div className="mb-9">
						<p className="text-xs text-typo-secondary">{selectedAccount.type}</p>
						<div className="flex items-center gap-2">
							<p className="text-lg text-typo-primary font-semibold">{selectedAccount.id}</p>
							<Copy className="text-enhanced-blue" size={20} />
						</div>
					</div>

					<Group title="Account Linkages">
						<div className="py-6 px-4">
							<div className="">CDP </div>
						</div>
					</Group>

					<div className="mt-9">
						<Group title="Trading Representative">
							<p>Hi</p>
						</Group>
					</div>
				</div>
			</div>
		);
	}
};

export default TradingAccountDetail;
