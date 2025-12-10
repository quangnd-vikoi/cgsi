import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import type { Contract } from "../../_components/data";

interface SummarySectionProps {
	contracts: Contract[];
}
interface SummaryCardProps {
	label: string | React.ReactNode;
	value: string | React.ReactNode;
	valueClassName?: string;
}

export function SummaryCard({ label, value, valueClassName }: SummaryCardProps) {
	return (
		<div className="grid grid-cols-2 md:flex md:flex-col items-center md:items-start">
			<div className="text-sm text-typo-secondary md:mb-1">{label}</div>
			<div className={`text-sm md:text-lg font-semibold text-right md:text-left ${valueClassName || "text-typo-primary"}`}>
				{value}
			</div>
		</div>
	);
}

export function SummarySection({ contracts }: SummarySectionProps) {
	const { selectedAccount } = useTradingAccountStore();

	const sellContracts = contracts.filter((c) => c.side === "Sell");
	const buyContracts = contracts.filter((c) => c.side === "Buy");

	const totalSellAmount = sellContracts.reduce((sum, c) => sum + Math.abs(c.gainLoss), 0);
	const totalBuyAmount = buyContracts.reduce((sum, c) => sum + Math.abs(c.gainLoss), 0);

	const sellCurrency = "SGD";
	const buyCurrency = "SGD";

	return (
		<div className="bg-background-section p-4 rounded-lg border border-stroke-secondary mb-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
				<SummaryCard
					label={`Sell Contracts (${sellContracts.length})`}
					value={`+ ${totalSellAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${sellCurrency}`}
					valueClassName="text-status-success"
				/>

				<SummaryCard
					label={`Buy Contracts (${buyContracts.length})`}
					value={`- ${totalBuyAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${buyCurrency}`}
					valueClassName="text-status-error"
				/>

				<SummaryCard
					label={
						<>
							<span className="md:hidden">Linked Payment Method - GIRO</span>
							<span className="hidden md:inline">Linked Payment Method</span>
						</>
					}
					value={
						<>
							<span className="md:hidden">(DBS) 01208923</span>
							<span className="hidden md:inline">GIRO (DBS) 01208923</span>
						</>
					}
				/>

				<SummaryCard
					label="Trading Representative"
					value={selectedAccount?.details.representative.name || "U7- Lim Yi Bin"}
				/>
			</div>
		</div>
	);
}
