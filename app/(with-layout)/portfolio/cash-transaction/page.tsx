"use client";

import React, { useState, useEffect } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Title from "@/components/Title";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { CashTransactionsTable } from "./_components/CashTransactionsTable";
import { getTrustBalanceDetails, exportTrustBalanceDetails } from "@/lib/services/portfolioService";
import type { ITrustBalanceDetail } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useExport } from "@/hooks/useExport";

export default function CashTransactionPage() {
	const { accounts, selectedAccount, setSelectedAccount, isInitialized } = useTradingAccountStore();
	const selectedCurrency = "SGD";
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [transactions, setTransactions] = useState<ITrustBalanceDetail[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const { exporting, handleExport: runExport } = useExport();

	const handleExport = () => {
		if (!selectedAccount?.accountNo) return;
		runExport(() => exportTrustBalanceDetails(selectedAccount.accountNo));
	};

	useEffect(() => {
		const fetchTransactions = async () => {
			if (!selectedAccount?.accountNo) return;
			setLoading(true);
			const pageIndex = currentPage - 1;
			const response = await getTrustBalanceDetails(selectedAccount.accountNo, itemsPerPage, pageIndex);
			if (response.success && response.data) {
				setTransactions(response.data.trustBalanceDetails);
				setTotalItems(response.data.total);
			}
			setLoading(false);
		};
		fetchTransactions();
	}, [selectedAccount?.accountNo, selectedCurrency, currentPage, itemsPerPage]);

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	return (
		<div className="bg-background-section py-6">
			<div className="mx-auto max-w-[1400px] pad-x">
				<div className="min-h-[calc(100vh-106px)] md:min-h-[calc(100vh-120px)] flex flex-col">
					{/* Header */}
					<Title showBackButton title="Cash Transactions" />

					{/* Content Box */}
					<div className="bg-white pad rounded flex-1 flex flex-col">
						{/* Account Selector & Time Period & Export Button */}
						<div className="mb-6 flex flex-row gap-4 justify-between items-center">
							{!isInitialized ? (
								<Skeleton className="h-10 w-full md:w-[258px]" />
							) : (
								<Select
									value={selectedAccount?.accountNo}
									onValueChange={(value) => {
										const account = accounts.find((acc) => acc.accountNo === value);
										setSelectedAccount(account || null);
									}}
								>
									<SelectTrigger className="w-[258px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
										<SelectValue placeholder="Select trading account">
											{selectedAccount && (
												<span className="text-sm text-typo-primary font-medium">
													{selectedAccount.accountType &&
														`(${selectedAccount.accountType})`}{" "}
													{selectedAccount.accountNo}
												</span>
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent className="w-[--radix-select-trigger-width]">
										{accounts.map((account) => (
											<SelectItem key={account.accountNo} value={account.accountNo}>
												<span className="text-sm">
													{account.accountType && `(${account.accountType})`}{" "}
													{account.accountNo}
												</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}


							<div className="flex gap-4 items-center">
								<p className="hidden md:inline text-sm text-typo-secondary">
									Record only avail for up to 2 Months
								</p>

								<Button
									variant="outline"
									size="sm"
									className="border-2 border-cgs-blue text-sm font-medium text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75"
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
										Excel
									</span>
								</Button>
							</div>
						</div>

						{/* Table */}
						<CashTransactionsTable transactions={transactions} loading={loading} />

						{/* Pagination Footer */}
						<PaginationFooter
							currentPage={currentPage}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							onPageChange={setCurrentPage}
							onItemsPerPageChange={handleItemsPerPageChange}
							itemsPerPageOptions={[10, 20, 50]}
							className="mt-auto"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
