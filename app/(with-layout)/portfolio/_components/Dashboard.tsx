"use client";

import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortfolioType, IAccountSummary } from "@/types";
import { ChartPie } from "./ChartPie";
import { PaymentModel } from "@/components/PaymentModel";
import { INTERNAL_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAccountSummary } from "@/lib/services/portfolioService";
import { usePermission } from "@/hooks/usePermission";
import { FEATURE_ACCESS } from "@/constants/accessControl";

type SignMode = "signed" | "unsigned" | "negative-only";

const formatCurrency = (value: number | undefined, currency = "SGD", mode: SignMode = "signed") => {
	if (value === undefined || value === null) return `0.00 ${currency}`;
	const formatted = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	if (mode === "unsigned") return `${formatted} ${currency}`;
	if (mode === "negative-only") {
		return value < 0 ? `- ${formatted} ${currency}` : `${formatted} ${currency}`;
	}
	const prefix = value >= 0 ? "+ " : "- ";
	return `${prefix}${formatted} ${currency}`;
};

const toMarginPercent = (ratio?: number): number =>
	ratio !== undefined && ratio !== null ? ratio * 100 : 0;

const marginRatioColor = (ratio?: number): "success" | "error" | "normal" => {
	if (ratio === undefined || ratio === null) return "normal";
	return toMarginPercent(ratio) < 125 ? "error" : "success";
};

const cashCallColor = (tradeLimit?: number, cashCall?: number): "error" | "normal" => {
	if (cashCall !== undefined && cashCall < 0) return "error";
	return "normal";
};

type DashboardBlockProps = {
	title: string;
	amount: string;
	type?: "normal" | "success" | "error";
	showPayButton?: boolean;
	onPay?: () => void;
};

const DashboardBlock = ({
	title,
	amount,
	type = "normal",
	showPayButton = false,
	onPay,
	isLoading = false,
}: DashboardBlockProps & { isLoading?: boolean }) => {
	const getTextColor = () => {
		switch (type) {
			case "success":
				return "text-status-success";
			case "error":
				return "text-status-error";
			default:
				return "text-typo-primary";
		}
	};

	return (
		<div className="bg-background-selected p-3 md:p-4 rounded border border-background-selected hover:border-cgs-blue transition-colors cursor-pointer flex justify-between items-center">
			<div className="">
				<p className="text-xs md:text-sm text-typo-secondary">{title}</p>
				<div className="text-sm md:text-base flex justify-between items-end mt-2 flex-wrap gap-2">
					{isLoading ? (
						<Skeleton className="h-5 w-28" />
					) : (
						<p className={`font-semibold ${getTextColor()}`}>{amount}</p>
					)}
				</div>
			</div>

			{showPayButton && (
				<Button
					size="sm"
					className="hidden md:block bg-cgs-blue hover:bg-cgs-blue/90 rounded text-sm px-3 py-1.5"
					onClick={onPay}
				>
					Settle
				</Button>
			)}
		</div>
	);
};

const TypeSelect = ({ totalAsset, fullWidth, isLoading = false }: { totalAsset: number; fullWidth?: boolean; isLoading?: boolean }) => {
	const { accounts, selectedAccount, setSelectedAccount } = useTradingAccountStore();

	const selectEl = (
		<Select
			value={selectedAccount?.accountNo}
			onValueChange={(value) => {
				const account = accounts.find((acc) => acc.accountNo === value);
				setSelectedAccount(account || null);
			}}
		>
			<SelectTrigger
				className={cn(
					"w-full bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3",
					!fullWidth && "md:max-w-[258px]",
				)}
			>
				<SelectValue placeholder="Select trading account">
					{selectedAccount && (
						<span className="text-sm text-typo-primary font-medium">
							{selectedAccount.accountType ? `(${selectedAccount.accountType})` : ""}{" "}
							{selectedAccount.accountNo}
						</span>
					)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent className="w-[--radix-select-trigger-width]">
				{accounts.map((account) => (
					<SelectItem key={account.accountNo} value={account.accountNo}>
						<span className="text-sm">
							{account.accountType ? `(${account.accountType})` : ""} {account.accountNo}
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);

	const totalAssetBlock = (
		<div className="w-full">
			<p className="text-xs md:text-sm text-typo-secondary">Total Asset Value</p>
			{isLoading ? (
				<Skeleton className="mt-2 h-8 w-40" />
			) : (
				<p className="mt-2 text-lg md:text-2xl font-semibold">
					{totalAsset.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{" "}
					SGD
				</p>
			)}
		</div>
	);

	const trRepBlock = (
		<div className="w-full">
			<p className="text-xs md:text-sm text-typo-secondary">Trading Representative</p>
			<p className="mt-2 text-base leading-6 font-semibold">
				{selectedAccount?.trName || "N/A"}
			</p>
		</div>
	);

	const verticalSep = (
		<Separator
			orientation="vertical"
			className="hidden md:block! h-14 bg-tone-blue-02 !w-[1px]"
		/>
	);

	if (fullWidth) {
		return (
			<div className="bg-background-section p-4 md:p-6 rounded h-full flex flex-col md:flex-row  items-center gap-4 md:gap-6">
				<div className="w-full ">{selectEl}</div>
				{verticalSep}
				{totalAssetBlock}
				{verticalSep}
				{trRepBlock}
			</div>
		);
	}

	return (
		<div className="bg-background-section p-4 md:p-6 rounded h-full flex flex-col justify-between">
			{selectEl}

			<div className="mt-6 flex flex-col md:flex-row justify-between gap-4 md:gap-6 items-start">
				<div className="w-full md:w-1/2">{totalAssetBlock}</div>
				{verticalSep}
				<div className="w-full md:w-1/2">{trRepBlock}</div>
			</div>
		</div>
	);
};

type DashboardProps = {
	type?: PortfolioType;
	onTypeChange?: (type: PortfolioType) => void;
};

const DashboardSkeleton = () => (
	<div className="bg-white pad-x py-6 rounded border border-stroke-secondary">
		<div className="flex flex-col md:flex-row gap-4">
			<div className="w-full md:w-1/2">
				<div className="bg-background-section p-4 md:p-6 rounded h-full flex flex-col justify-between">
					<Skeleton className="h-9 w-full md:max-w-[258px]" />
					<div className="mt-6 flex flex-col md:flex-row justify-between gap-4 md:gap-6 items-start">
						<div className="w-full md:w-1/2 space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-8 w-40" />
						</div>
						<div className="w-full md:w-1/2 space-y-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-6 w-32" />
						</div>
					</div>
				</div>
			</div>
			<div className="grid gap-4 grid-cols-2 grid-rows-2 w-full md:w-1/2">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="bg-background-selected p-3 md:p-4 rounded border border-background-selected space-y-2"
					>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-6 w-32" />
					</div>
				))}
			</div>
		</div>
		<div className="mt-6">
			<Skeleton className="h-80 w-full" />
		</div>
	</div>
);

const Dashboard = ({ type: propType, onTypeChange }: DashboardProps) => {
	const { selectedAccount, accounts } = useTradingAccountStore();
	const accountType = selectedAccount?.accountType as PortfolioType | undefined;
	const type = propType || accountType;
	const router = useRouter();
	const { isAllowed: showContractsContra } = usePermission(FEATURE_ACCESS.portfolio_contracts_contra);

	const [showPaymentModel, setShowPaymentModel] = React.useState(false);
	const [accountSummary, setAccountSummary] = React.useState<IAccountSummary | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		if (onTypeChange && accountType && accountType !== propType) {
			onTypeChange(accountType);
		}
	}, [accountType, onTypeChange, propType]);

	React.useEffect(() => {
		if (!selectedAccount?.accountNo) {
			setAccountSummary(null);
			return;
		}

		let cancelled = false;
		const fetchSummary = async () => {
			setIsLoading(true);
			const response = await getAccountSummary(selectedAccount.accountNo);
			if (!cancelled) {
				if (response.success && response.data) {
					setAccountSummary(response.data);
				}
				setIsLoading(false);
			}
		};
		fetchSummary();

		return () => {
			cancelled = true;
		};
	}, [selectedAccount?.accountNo]);

	const colorByValue = (value?: number): "success" | "error" | "normal" =>
		value === undefined || value === null ? "normal" : value < 0 ? "error" : value > 0 ? "success" : "normal";

	if (accounts.length === 0 || !type) return <DashboardSkeleton />;

	const layoutConfig = {
		CTA: [
			{
				id: 1,
				gridArea: "1 / 1 / 2 / 2",
				component: (
					<DashboardBlock title="Sell Contracts" amount={formatCurrency(accountSummary?.contractsSell)} type={colorByValue(accountSummary?.contractsSell)} isLoading={isLoading} />
				),
			},
			{
				id: 2,
				gridArea: "1 / 2 / 2 / 3",
				component: (
					<DashboardBlock
						title="Buy Contracts"
						amount={formatCurrency(accountSummary?.contractsBuy)}
						type={colorByValue(accountSummary?.contractsBuy)}
						isLoading={isLoading}
						showPayButton={showContractsContra && !!accountSummary?.contractsBuy && accountSummary.contractsBuy !== 0}
						onPay={() => router.push(`${INTERNAL_ROUTES.SETTLE}?tab=contracts`)}
					/>
				),
			},
			{
				id: 3,
				gridArea: "2 / 1 / 3 / 2",
				component: (
					<DashboardBlock title="Contra Gain" amount={formatCurrency(accountSummary?.contraGain)} type={colorByValue(accountSummary?.contraGain)} isLoading={isLoading} />
				),
			},
			{
				id: 4,
				gridArea: "2 / 2 / 3 / 3",
				component: (
					<DashboardBlock
						title="Contra Loss"
						amount={formatCurrency(accountSummary?.contraLoss)}
						type={colorByValue(accountSummary?.contraLoss)}
						isLoading={isLoading}
						showPayButton={showContractsContra && !!accountSummary?.contraLoss && accountSummary.contraLoss !== 0}
						onPay={() => router.push(`${INTERNAL_ROUTES.SETTLE}?tab=contra`)}
					/>
				),
			},
		],
		MTA: [
			{
				id: 1,
				gridArea: "1 / 1 / 2 / 2",
				component: (
					<DashboardBlock
						title="Avail Trade Limit"
						amount={formatCurrency(accountSummary?.tradeLimit, "SGD", "unsigned")}
						type="normal"
						isLoading={isLoading}
					/>
				),
			},
			{
				id: 2,
				gridArea: "2 / 1 / 3 / 2",
				component: <DashboardBlock title="Margin Ratio" amount={`${toMarginPercent(accountSummary?.marginRatio)}%`} type={marginRatioColor(accountSummary?.marginRatio)} isLoading={isLoading} />,
			},
			{
				id: 3,
				gridArea: "1 / 2 / 2 / 3",
				component: (
					<DashboardBlock
						title="Collateral Value"
						amount={formatCurrency(accountSummary?.collateralValue, "SGD", "unsigned")}
						type="normal"
						isLoading={isLoading}
					/>
				),
			},
			{
				id: 4,
				gridArea: "2 / 2 / 3 / 3",
				component: (
					<DashboardBlock
						title="Cash Call"
						amount={formatCurrency(accountSummary?.cashCall, "SGD", "negative-only")}
						type={cashCallColor(accountSummary?.tradeLimit, accountSummary?.cashCall)}
						isLoading={isLoading}
						showPayButton={!!accountSummary?.cashCall && accountSummary.cashCall !== 0}
						onPay={() => setShowPaymentModel(true)}
					/>
				),
			},
		],
		SBL: [
			{
				id: 2,
				gridArea: "1 / 1 / 2 / 3",
				component: <DashboardBlock title="Margin Ratio" amount={`${toMarginPercent(accountSummary?.marginRatio)}%`} type={marginRatioColor(accountSummary?.marginRatio)} isLoading={isLoading} />,
			},
			{
				id: 3,
				gridArea: "2 / 1 / 3 / 3",
				component: (
					<DashboardBlock
						title="Cash Call"
						amount={formatCurrency(accountSummary?.cashCall, "SGD", "negative-only")}
						type={cashCallColor(accountSummary?.tradeLimit, accountSummary?.cashCall)}
						isLoading={isLoading}
						showPayButton={!!accountSummary?.cashCall && accountSummary.cashCall !== 0}
						onPay={() => setShowPaymentModel(true)}
					/>
				),
			},
		],
		CUT: [],
		iCash: [],
	};

	const currentLayout = layoutConfig[type] ?? [];

	return (
		<div className="bg-white pad-x py-6 rounded border border-stroke-secondary">
			<div className="flex flex-col md:flex-row gap-4">
				<div className={cn("w-full", type == "iCash" || type == "CUT" ? "" : "md:w-1/2")}>
					<TypeSelect totalAsset={accountSummary?.totalAsset ?? 0} fullWidth={type === "iCash" || type === "CUT"} isLoading={isLoading} />
				</div>

				{type != "iCash" && type != "CUT" && (
					<div className="grid gap-4 grid-cols-2 grid-rows-2 w-full md:w-1/2">
						{currentLayout.map((item) => (
							<div key={item.id} style={{ gridArea: item.gridArea }}>
								{item.component}
							</div>
						))}
					</div>
				)}
			</div>
			{type === "CTA" && showContractsContra && (
				<div className="flex w-full justify-end">
					<Link
						href={INTERNAL_ROUTES.SETTLE}
						className="flex text-cgs-blue text-xs md:text-sm font-medium items-center mt-4 cursor-pointer hover:text-cgs-blue/75"
					>
						<p>View Contracts & Contra</p>
						<ChevronRight className="inline-block ml-0.5" size={16} />
					</Link>
				</div>
			)}
	
			<PaymentModel open={showPaymentModel} onOpenChange={setShowPaymentModel} />

			<div className="mt-6">
				<ChartPie type={type} assetList={accountSummary?.assetList} isLoading={isLoading} />
			</div>
		</div>
	);
};

export default Dashboard;
