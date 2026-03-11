import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContractDisplay } from "./ContractsTable";

interface SummarySectionProps {
	contracts: ContractDisplay[];
	loading?: boolean;
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

export function SummarySection({ contracts, loading = false }: SummarySectionProps) {
	const { selectedAccount } = useTradingAccountStore();

	const sellContracts = contracts.filter((c) => c.side === "Sell");
	const buyContracts = contracts.filter((c) => c.side === "Buy");

	const totalSellAmount = sellContracts.reduce((sum, c) => sum + Math.abs(c.gainLoss), 0);
	const totalBuyAmount = buyContracts.reduce((sum, c) => sum + Math.abs(c.gainLoss), 0);

	const skeletonVal = <Skeleton className="h-5 w-28 rounded mt-1" />;
	const skeletonLabel = <Skeleton className="h-4 w-32 rounded" />;

	return (
		<div className="bg-background-section p-4 rounded border border-stroke-secondary mb-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
				<SummaryCard
					label={loading ? skeletonLabel : `Sell Contracts (${sellContracts.length})`}
					value={loading ? skeletonVal : `+ ${totalSellAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`}
					valueClassName="text-status-success"
				/>

				<SummaryCard
					label={loading ? skeletonLabel : `Buy Contracts (${buyContracts.length})`}
					value={loading ? skeletonVal : `- ${totalBuyAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} SGD`}
					valueClassName="text-status-error"
				/>

				<SummaryCard
					label={loading ? skeletonLabel : (
						<>
							<span className="md:hidden">Linked Payment Method - GIRO</span>
							<span className="hidden md:inline">Linked Payment Method</span>
						</>
					)}
					value={loading ? skeletonVal : (
						<>
							<span className="md:hidden">(DBS) 01208923</span>
							<span className="hidden md:inline">GIRO (DBS) 01208923</span>
						</>
					)}
				/>

				<SummaryCard
					label={loading ? skeletonLabel : "Trading Representative"}
					value={loading ? skeletonVal : (selectedAccount?.trName || "—")}
				/>
			</div>
		</div>
	);
}
