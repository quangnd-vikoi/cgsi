import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTradingRepresentative } from "@/lib/utils";
import type { IAccountSummary } from "@/types";
import { getAmountDisplay } from "./amountDisplay";

interface SummarySectionProps {
	accountSummary: IAccountSummary | null;
	activeTab: "contracts" | "contra";
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

function getPaymentMethod(account: { giro?: string; eps?: string } | null | undefined): { label: string; value: string } {
	if (account?.giro) return { label: "Linked Payment Method - GIRO", value: account.giro };
	if (account?.eps) return { label: "Linked Payment Method - EPS", value: account.eps };
	return { label: "Linked Payment Method", value: "—" };
}

export function SummarySection({ accountSummary, activeTab, loading = false }: SummarySectionProps) {
	const { selectedAccount } = useTradingAccountStore();

	const skeletonVal = <Skeleton className="h-5 w-28 rounded mt-1" />;
	const skeletonLabel = <Skeleton className="h-4 w-32 rounded" />;
	const paymentMethod = getPaymentMethod(selectedAccount);

	if (activeTab === "contra") {
		const gain = getAmountDisplay(accountSummary?.contraGain, { currency: "SGD" });
		const loss = getAmountDisplay(accountSummary?.contraLoss, { currency: "SGD" });

		return (
			<div className="bg-background-section p-4 rounded border border-stroke-secondary mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
					<SummaryCard
						label={loading ? skeletonLabel : "Contra Gain"}
						value={loading ? skeletonVal : gain.text}
						valueClassName={loading ? undefined : gain.className}
					/>

					<SummaryCard
						label={loading ? skeletonLabel : "Contra Loss"}
						value={loading ? skeletonVal : loss.text}
						valueClassName={loading ? undefined : loss.className}
					/>

					<SummaryCard
						label={loading ? skeletonLabel : paymentMethod.label}
						value={loading ? skeletonVal : paymentMethod.value}
					/>

					<SummaryCard
						label={loading ? skeletonLabel : "Trading Representative"}
						value={loading ? skeletonVal : formatTradingRepresentative(selectedAccount?.trCode, selectedAccount?.trName, "—")}
					/>
				</div>
			</div>
		);
	}

	// Contracts tab
	const sell = getAmountDisplay(accountSummary?.contractsSell, { currency: "SGD" });
	const buy = getAmountDisplay(accountSummary?.contractsBuy, { currency: "SGD" });

	return (
		<div className="bg-background-section p-4 rounded border border-stroke-secondary mb-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
				<SummaryCard
					label={loading ? skeletonLabel : "Sell Contracts"}
					value={loading ? skeletonVal : sell.text}
					valueClassName={loading ? undefined : sell.className}
				/>

				<SummaryCard
					label={loading ? skeletonLabel : "Buy Contracts"}
					value={loading ? skeletonVal : buy.text}
					valueClassName={loading ? undefined : buy.className}
				/>

				<SummaryCard
					label={loading ? skeletonLabel : paymentMethod.label}
					value={loading ? skeletonVal : paymentMethod.value}
				/>

				<SummaryCard
					label={loading ? skeletonLabel : "Trading Representative"}
					value={loading ? skeletonVal : formatTradingRepresentative(selectedAccount?.trCode, selectedAccount?.trName, "—")}
				/>
			</div>
		</div>
	);
}
