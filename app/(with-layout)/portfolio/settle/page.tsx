"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Title from "@/components/Title";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { ContraDetailsDialog } from "./_components/ContraDetailsDialog";
import { SummarySection } from "./_components/SummarySection";
import { ContractsTable } from "./_components/ContractsTable";
import type { ContractDisplay } from "./_components/ContractsTable";
import { getContracts, getContra } from "@/lib/services/portfolioService";
import type { IContract, IContra } from "@/types";
import { exportToExcel, fetchAllForExport } from "@/lib/exportToExcel";
import { contractsColumns } from "@/lib/exportConfigs";
import { toast } from "@/components/ui/toaster";

type TabType = "contracts" | "contra";

// Map API IContract to display format
const mapContract = (c: IContract, status: "Outstanding" | "Overdue"): ContractDisplay => ({
	id: c.contractNo,
	contractId: c.contractNo,
	status,
	tradeDate: c.tradeDate,
	dueDate: c.settlementDueDate,
	settlementCcy: c.settlementCurrency,
	gainLoss: c.netAmount,
	side: c.type,
	market: c.marketCode,
	code: c.securityName,
});

// Map API IContra to display format
const mapContra = (c: IContra): ContractDisplay => ({
	id: c.statementNo,
	contractId: c.statementNo,
	status: "Contra",
	tradeDate: c.statementDate,
	dueDate: c.lastUpdatedOn,
	settlementCcy: c.settlementCurrency,
	gainLoss: c.settlementNetAmount,
	side: c.type,
	market: c.marketCode,
	code: c.securityName,
	statementNo: c.statementNo,
});

export default function SettlePage() {
	const { accounts, selectedAccount, setSelectedAccount } = useTradingAccountStore();
	const [activeTab, setActiveTab] = useState<TabType>("contracts");
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

	// Contra tab data
	const [contraData, setContraData] = useState<ContractDisplay[]>([]);
	const [contraTotal, setContraTotal] = useState(0);
	const [contraLoading, setContraLoading] = useState(true);

	const [exporting, setExporting] = useState(false);
	const accountNo = selectedAccount?.accountNo;

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
				allData = items.map(c => mapContract(c, "Outstanding"));
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

		const contracts = res.success && res.data
			? res.data.contracts.map(c => mapContract(c, "Outstanding"))
			: [];

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
			setContraData(response.data.contra.map(mapContra));
			setContraTotal(response.data.total);
		}
		setContraLoading(false);
	}, [accountNo, currentPage, itemsPerPage]);

	// Fetch data based on active tab
	useEffect(() => {
		if (activeTab === "contracts") {
			fetchContracts();
		} else {
			fetchContra();
		}
	}, [activeTab, fetchContracts, fetchContra]);

	// Also fetch the inactive tab counts on mount / account change
	useEffect(() => {
		if (!accountNo) return;
		getContracts(accountNo, undefined, 1, 0).then(res => {
			if (res.success && res.data) {
				setContractsTotal(res.data.total);
			}
		});
		getContra(accountNo, undefined, 1, 0).then(res => {
			if (res.success && res.data) {
				setContraTotal(res.data.total);
			}
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
						<div className="mb-6 flex justify-between items-center">
							<Select
								value={selectedAccount?.accountNo}
								onValueChange={(value) => {
									const account = accounts.find((acc) => acc.accountNo === value);
									setSelectedAccount(account || null);
								}}
							>
								<SelectTrigger className="w-full md:max-w-[258px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
									<SelectValue placeholder="Select trading account">
										{selectedAccount && (
											<span className="text-sm text-typo-primary font-medium">
												({selectedAccount.accountType || ""}) {selectedAccount.accountNo}
											</span>
										)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="w-[--radix-select-trigger-width]">
									{accounts.map((account) => (
										<SelectItem key={account.accountNo} value={account.accountNo}>
											<span className="text-sm">
												({account.accountType || ""}) {account.accountNo}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								size="sm"
								className="hidden md:flex border border-cgs-blue text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75"
								onClick={handleExport}
								disabled={exporting}
							>
								{exporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
								Export to Excel
							</Button>
						</div>

						{/* Tabs */}
						<Tabs value={activeTab} onValueChange={handleTabChange}>
							<TabsList className="mb-6 bg-transparent gap-4 border-b border-stroke-secondary pb-0">
								<TabsTrigger
									value="contracts"
									className="border-b-2 border-transparent rounded-none data-[state=active]:border-cgs-blue data-[state=active]:text-cgs-blue pb-2.5"
								>
									Contracts ({contractsTotal})
								</TabsTrigger>
								<TabsTrigger
									value="contra"
									className="border-b-2 border-transparent rounded-none data-[state=active]:border-cgs-blue data-[state=active]:text-cgs-blue pb-2.5"
								>
									Contra ({contraTotal})
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Mobile Export Button */}
						<Button
							variant="outline"
							size="sm"
							className="flex md:hidden border border-cgs-blue text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 mb-6"
							onClick={handleExport}
							disabled={exporting}
						>
							{exporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
							Export to Excel
						</Button>

						{/* Summary Cards */}
						<SummarySection contracts={currentData} />

						{/* Table */}
						<ContractsTable
							contracts={currentData}
							activeTab={activeTab}
							onOpenContraDetails={handleOpenContraDetails}
							loading={loading}
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
