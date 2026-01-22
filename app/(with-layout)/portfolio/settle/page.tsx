"use client";

import React, { useState } from "react";
import { FileDown } from "lucide-react";
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
import { mockContracts } from "../_components/data";
import { ContraDetailsDialog } from "./_components/ContraDetailsDialog";
import { SummarySection } from "./_components/SummarySection";
import { ContractsTable } from "./_components/ContractsTable";

type TabType = "contracts" | "contra";

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
	} | null>(null);

	const contracts = mockContracts;

	// Pagination
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = contracts.slice(startIndex, endIndex);

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	const handleOpenContraDetails = (contract: typeof contracts[0]) => {
		setSelectedContra({
			contraId: contract.contractId,
			contraDate: contract.tradeDate,
			dueDate: contract.dueDate,
			netGainLoss: contract.gainLoss,
			currency: contract.settlementCcy,
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
							>
								<FileDown className="size-4" />
								Export to Excel
							</Button>
						</div>

						{/* Tabs */}
						<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
							<TabsList className="mb-6 bg-transparent gap-4 border-b border-stroke-secondary pb-0">
								<TabsTrigger
									value="contracts"
									className="border-b-2 border-transparent rounded-none data-[state=active]:border-cgs-blue data-[state=active]:text-cgs-blue pb-2.5"
								>
									Contracts ({contracts.length})
								</TabsTrigger>
								<TabsTrigger
									value="contra"
									className="border-b-2 border-transparent rounded-none data-[state=active]:border-cgs-blue data-[state=active]:text-cgs-blue pb-2.5"
								>
									Contra (7)
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Mobile Export Button */}
						<Button
							variant="outline"
							size="sm"
							className="flex md:hidden border border-cgs-blue text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 mb-6"
						>
							<FileDown className="size-4" />
							Export to Excel
						</Button>

						{/* Summary Cards */}
						<SummarySection contracts={contracts} />

						{/* Table */}
						<ContractsTable
							contracts={currentData}
							activeTab={activeTab}
							onOpenContraDetails={handleOpenContraDetails}
						/>

						{/* Pagination Footer */}
						<PaginationFooter
							currentPage={currentPage}
							totalItems={contracts.length}
							itemsPerPage={itemsPerPage}
							onPageChange={setCurrentPage}
							onItemsPerPageChange={handleItemsPerPageChange}
							itemsPerPageOptions={[10, 20, 50]}
							className="mt-auto"
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
						/>
					)}
				</div>
			</div>
		</div>
	);
}
