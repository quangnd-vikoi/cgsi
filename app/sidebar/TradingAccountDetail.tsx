import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { ChevronRight, Copy } from "lucide-react";
import WaringIcon from "@/public/icons/Warning.svg";

const TradingAccountDetail = () => {
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);

	if (selectedAccount) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle backTo={"trading_accounts"} title="Account Details" />

				<div className="flex-1 mt-6 pb-4 overflow-y-auto scrollbar-offset-laptop">
					<div className="mb-9">
						<p className="text-typo-secondary text-xs">{selectedAccount.type}</p>
						<div className="flex items-center gap-2">
							<p className="font-semibold text-typo-primary text-lg">{selectedAccount.id}</p>
							<Copy className="text-enhanced-blue" size={20} />
						</div>
					</div>

					<Group title="Account Linkages">
						<div className="">
							<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs">
								CDP <WaringIcon />
							</div>

							<div className="flex justify-between items-center">
								{selectedAccount.details.cdp ? (
									<p className="font-medium text-typo-primary text-sm">
										{selectedAccount.details.cdp}
									</p>
								) : (
									<p className="text-typo-tertiary">-</p>
								)}
								<p className="flex gap-1 text-enhanced-blue text-xs cursor-pointer">
									Update to SUB-CDP <ChevronRight />
								</p>
							</div>
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
