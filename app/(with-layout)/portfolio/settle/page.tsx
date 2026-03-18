"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/Title";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { ContraDetailsDialog } from "./_components/ContraDetailsDialog";
import { SummarySection } from "./_components/SummarySection";
import { ContractsTable } from "./_components/ContractsTable";
import type { ContractDisplay } from "./_components/ContractsTable";
import { LEGACY_CURRENCY_TO_ISO } from "@/constants/accounts";
import { getContracts, getContra, depositPaynow, getAccountSummary } from "@/lib/services/portfolioService";
import type { IContract, IContra, IAccountSummary } from "@/types";
import { exportToExcel, fetchAllForExport } from "@/lib/exportToExcel";
import { contractsColumns } from "@/lib/exportConfigs";
import { toast } from "@/components/ui/toaster";
import { S2BPayButton } from "@/components/S2BPayButton";

type TabType = "contracts" | "contra";

// Parse date strings of formats: YYYY-MM-DD, YYYYMMDD, DD/MM/YYYY, ISO
const parseDate = (s: string | null | undefined): Date | null => {
	if (!s) return null;
	let d: Date;
	if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
		const [day, month, year] = s.split("/");
		d = new Date(+year, +month - 1, +day);
	} else if (/^\d{8}$/.test(s)) {
		d = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`);
	} else {
		d = new Date(s);
	}
	return isNaN(d.getTime()) ? null : d;
};

// Map API IContract to display format — status derived from due date
const mapContract = (c: IContract): ContractDisplay => {
	const due = parseDate(c.settlementDueDate);
	if (due) due.setHours(0, 0, 0, 0);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const status = due && due < today ? "Overdue" : "Outstanding";
	return {
		id: c.contractNo,
		contractId: c.contractNo,
		status,
		tradeDate: c.tradeDate,
		dueDate: c.settlementDueDate,
		settlementCcy: LEGACY_CURRENCY_TO_ISO[c.settlementCurrency] ?? c.settlementCurrency,
		gainLoss: c.netAmount,
		side: c.type?.toUpperCase() === "B" ? "BUY" : c.type?.toUpperCase() === "S" ? "SELL" : c.type,
		market: c.marketCode,
		name: c.securityName,
		tradeCcy: LEGACY_CURRENCY_TO_ISO[c.tradedCurrency] ?? c.tradedCurrency,
		price: c.price,
		quantity: c.quantity,
		mode: c.channel,
		remarks: c.remark,
	};
};

const sortByDueDate = (items: ContractDisplay[]): ContractDisplay[] =>
	[...items].sort((a, b) => (parseDate(a.dueDate)?.getTime() ?? 0) - (parseDate(b.dueDate)?.getTime() ?? 0));

// Map API IContra to display format
const mapContra = (c: IContra): ContractDisplay => {
	const base = parseDate(c.statementDate);
	const due = base ? new Date(base.getTime()) : null;
	if (due) due.setDate(due.getDate() + 7);
	const today = new Date(new Date().setHours(0, 0, 0, 0));
	return {
		id: c.statementNo,
		contractId: c.statementNo,
		status: due ? (due < today ? "Overdue" : "Outstanding") : "Outstanding",
		tradeDate: c.statementDate ?? "",
		dueDate: due ? `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}-${String(due.getDate()).padStart(2, "0")}` : "",
		settlementCcy: LEGACY_CURRENCY_TO_ISO[c.settlementCurrency] ?? c.settlementCurrency,
		gainLoss: c.settlementNetAmount,
		side: c.type?.toUpperCase() === "B" ? "BUY" : c.type?.toUpperCase() === "S" ? "SELL" : c.type,
		market: c.marketCode,
		name: c.securityName,
		tradeCcy: "",
		price: 0,
		quantity: 0,
		mode: "",
		remarks: "",
		statementNo: c.statementNo,
	};
};

export default function SettlePage() {
	const { accounts, selectedAccount, setSelectedAccount } = useTradingAccountStore();
	const searchParams = useSearchParams();
	const initialTab = searchParams.get("tab") === "contra" ? "contra" : "contracts";
	const [activeTab, setActiveTab] = useState<TabType>(initialTab);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [contraDialogOpen, setContraDialogOpen] = useState(false);
	const [selectedContra, setSelectedContra] = useState<{
		contraId: string;
		contraDate: string;
		dueDate: string;
		netGainLoss: number;
		currency: string;
		statementNo: string;
	} | null>(null);

	// Contracts tab data
	const [contractsData, setContractsData] = useState<ContractDisplay[]>([]);
	const [contractsTotal, setContractsTotal] = useState(0);
	const [contractsLoading, setContractsLoading] = useState(true);
	const [contractsCountLoaded, setContractsCountLoaded] = useState(false);

	// Contra tab data
	const [contraData, setContraData] = useState<ContractDisplay[]>([]);
	const [contraTotal, setContraTotal] = useState(0);
	const [contraLoading, setContraLoading] = useState(true);
	const [contraCountLoaded, setContraCountLoaded] = useState(false);

	const [accountSummary, setAccountSummary] = useState<IAccountSummary | null>(null);
	const [summaryLoading, setSummaryLoading] = useState(true);

	const [exporting, setExporting] = useState(false);
	const [paynowSubmitFn, setPaynowSubmitFn] = useState<(() => Promise<{
		s2bPayUrl: string;
		corpId: string;
		encStr: string;
	} | null>) | null>(null);
	const [payingId, setPayingId] = useState<string | null>(null);
	const accountNo = selectedAccount?.accountNo;

	const handlePayNow = (contract: ContractDisplay) => {
		if (!accountNo) return;
		const mode = activeTab === "contracts" ? "CONTRACT" : "CONTRA";
		setPayingId(contract.id);
		setPaynowSubmitFn(() => async () => {
			const response = await depositPaynow({
				accountNo,
				mode,
				amount: Math.abs(contract.gainLoss),
				currency: "SGD",
				refNo: contract.id,
			});
			if (!response.success) return null;
			return response.data;
		});
	};

	const handleExport = async () => {
		if (exporting || !accountNo) return;
		setExporting(true);
		try {
			let allData: ContractDisplay[];
			if (activeTab === "contracts") {
				const items = await fetchAllForExport(
					(pageSize, pageIndex) => getContracts(accountNo, undefined, pageSize, pageIndex),
					(data) => data.contracts,
				);
				allData = sortByDueDate(items.map(mapContract));
			} else {
				const items = await fetchAllForExport(
					(pageSize, pageIndex) => getContra(accountNo, undefined, pageSize, pageIndex),
					(data) => data.contra,
				);
				allData = items.map(mapContra);
			}
			if (allData.length === 0) {
				toast.warning("No Data", "There is no data to export.");
				return;
			}
			const label = activeTab === "contracts" ? "Contracts" : "Contra";
			exportToExcel({ filename: `${label}_${accountNo}`, columns: contractsColumns, data: allData });
			toast.success("Export Complete", `${allData.length} rows exported.`);
		} catch {
			toast.error("Export Failed", "Unable to export. Please try again.");
		} finally {
			setExporting(false);
		}
	};

	// Fetch contracts (outstanding)
	const fetchContracts = useCallback(async () => {
		if (!accountNo) return;
		setContractsLoading(true);
		const pageIndex = currentPage - 1;

		const res = await getContracts(accountNo, undefined, itemsPerPage, pageIndex);

		const contracts = res.success && res.data ? sortByDueDate(res.data.contracts.map(mapContract)) : [];

		setContractsData(contracts);
		setContractsTotal(res.data?.total ?? 0);
		setContractsLoading(false);
	}, [accountNo, currentPage, itemsPerPage]);

	// Fetch contra
	const fetchContra = useCallback(async () => {
		if (!accountNo) return;
		setContraLoading(true);
		const pageIndex = currentPage - 1;

		const response = await getContra(accountNo, undefined, itemsPerPage, pageIndex);
		if (response.success && response.data) {
			setContraData(sortByDueDate(response.data.contra.map(mapContra)));
			setContraTotal(response.data.total);
		}
		setContraLoading(false);
	}, [accountNo, currentPage, itemsPerPage]);

	// Auto-select first CTA account if current selection is not CTA
	useEffect(() => {
		if (!selectedAccount || selectedAccount.accountType !== "CTA") {
			const ctaAccount = accounts.find((acc) => acc.accountType === "CTA");
			if (ctaAccount) setSelectedAccount(ctaAccount);
		}
	}, [accounts]); // eslint-disable-line react-hooks/exhaustive-deps

	// Fetch data based on active tab
	useEffect(() => {
		if (activeTab === "contracts") {
			fetchContracts();
		} else {
			fetchContra();
		}
	}, [activeTab, fetchContracts, fetchContra]);

	// Fetch both tab counts on mount / account change so badges always show totals
	useEffect(() => {
		if (!accountNo) return;
		setContractsCountLoaded(false);
		setContraCountLoaded(false);
		getContracts(accountNo, undefined, 1, 0).then((res) => {
			if (res.success && res.data) {
				setContractsTotal(res.data.total);
			}
			setContractsCountLoaded(true);
		});
		getContra(accountNo, undefined, 1, 0).then((res) => {
			if (res.success && res.data) {
				setContraTotal(res.data.total);
			}
			setContraCountLoaded(true);
		});
	}, [accountNo]);

	// Fetch account summary on mount / account change
	useEffect(() => {
		if (!accountNo) return;
		setSummaryLoading(true);
		getAccountSummary(accountNo).then((res) => {
			setAccountSummary(res.success && res.data ? res.data : null);
			setSummaryLoading(false);
		});
	}, [accountNo]);

	const currentData = activeTab === "contracts" ? contractsData : contraData;
	const totalItems = activeTab === "contracts" ? contractsTotal : contraTotal;
	const loading = activeTab === "contracts" ? contractsLoading : contraLoading;

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	const handleTabChange = (tab: string) => {
		setActiveTab(tab as TabType);
		setCurrentPage(1);
	};

	const handleOpenContraDetails = (contract: ContractDisplay) => {
		setSelectedContra({
			contraId: contract.contractId,
			contraDate: contract.tradeDate,
			dueDate: contract.dueDate,
			netGainLoss: contract.gainLoss,
			currency: contract.settlementCcy,
			statementNo: contract.statementNo || contract.contractId,
		});
		setContraDialogOpen(true);
	};

	return (
		<div className="bg-background-section py-6">
			<div className="mx-auto max-w-[1400px] px-4 md:px-6">
				<div className="min-h-[calc(100vh-106px)] md:min-h-[calc(100vh-120px)] flex flex-col">
					{/* Header */}
					<Title showBackButton title="Outstanding Payments" />

					{/* Content Box */}
					<div className="bg-white pad rounded flex-1 flex flex-col">
						{/* Account Selector & Export Button */}
						<div className="mb-6 flex justify-between items-center gap-4">
							{!selectedAccount ? (
								<Skeleton className="h-9 w-full md:max-w-[258px] rounded-md" />
							) : (
								<Select
									value={selectedAccount.accountNo}
									onValueChange={(value) => {
										const account = accounts.find((acc) => acc.accountNo === value);
										setSelectedAccount(account || null);
									}}
								>
									<SelectTrigger className="w-full md:max-w-[258px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
										<SelectValue>
											<span className="text-sm text-typo-primary font-medium">
												({selectedAccount.accountType || ""}){" "}
												{selectedAccount.accountNo}
											</span>
										</SelectValue>
									</SelectTrigger>
									<SelectContent className="w-[--radix-select-trigger-width]">
										{accounts.map((account) => (
											<SelectItem
												key={account.accountNo}
												value={account.accountNo}
												disabled={account.accountType !== "CTA"}
											>
												<span className="text-sm">
													({account.accountType || ""}) {account.accountNo}
												</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							<Button
								variant="outline"
								size="sm"
								className="flex border border-cgs-blue text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 text-xs md:text-sm py-1 px-2 md:py-1.5 md:px-3"
								onClick={handleExport}
								disabled={exporting}
							>
								{exporting ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<FileDown className="size-4" />
								)}
								<span className="hidden md:inline">
									Export to Excel
								</span>
								<span className="md:hidden">
									Export
								</span>
							</Button>
						</div>

						{/* Tabs */}
						<Tabs value={activeTab} onValueChange={handleTabChange}>
							<TabsList className="mb-6 bg-transparent gap-4 border-b border-stroke-secondary pb-0">
								<TabsTrigger
									value="contracts"
									className="border-b-2 border-transparent rounded-none data-[state=active]:border-cgs-blue data-[state=active]:text-cgs-blue pb-2.5"
								>
									Contracts{" "}{contractsCountLoaded ? `(${contractsTotal})` : <Skeleton className="inline-block h-4 w-6 rounded align-middle" />}
								</TabsTrigger>
								<TabsTrigger
									value="contra"
									className="border-b-2 border-transparent rounded-none data-[state=active]:border-cgs-blue data-[state=active]:text-cgs-blue pb-2.5"
								>
									Contra{" "}{contraCountLoaded ? `(${contraTotal})` : <Skeleton className="inline-block h-4 w-6 rounded align-middle" />}
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Summary Cards */}
						<SummarySection accountSummary={accountSummary} activeTab={activeTab} loading={summaryLoading} />

						{/* Table */}
						<ContractsTable
							contracts={currentData}
							activeTab={activeTab}
							onOpenContraDetails={handleOpenContraDetails}
							onPayNow={handlePayNow}
							loading={loading}
							payingId={payingId}
						/>

						{/* Pagination Footer */}
						<PaginationFooter
							currentPage={currentPage}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							onPageChange={setCurrentPage}
							onItemsPerPageChange={handleItemsPerPageChange}
							itemsPerPageOptions={[10, 20, 50]}
							className="mt-auto"
							loading={loading}
						/>
					</div>

					{/* PayNow S2B */}
					{paynowSubmitFn && (
						<S2BPayButton
							submitFn={paynowSubmitFn}
							onReady={() => setPayingId(null)}
							onClose={() => setPaynowSubmitFn(null)}
							onError={() => {
								setPayingId(null);
								setPaynowSubmitFn(null);
								toast.error("PayNow Failed", "Failed to initiate PayNow. Please try again.");
							}}
						/>
					)}

					{/* Contra Details Dialog */}
					{selectedContra && (
						<ContraDetailsDialog
							open={contraDialogOpen}
							onOpenChange={setContraDialogOpen}
							contraId={selectedContra.contraId}
							contraDate={selectedContra.contraDate}
							dueDate={selectedContra.dueDate}
							netGainLoss={selectedContra.netGainLoss}
							currency={selectedContra.currency}
							statementNo={selectedContra.statementNo}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
