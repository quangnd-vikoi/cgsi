"use client";

import React, { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { CashTransactionsTable } from "./_components/CashTransactionsTable";
import { getTrustBalanceDetails } from "@/lib/services/portfolioService";
import type { ITrustBalanceDetail } from "@/types";

// Time period options
const timePeriods = [
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "last3months", label: "Last 3 Months" },
    { value: "last6months", label: "Last 6 Months" },
    { value: "lastYear", label: "Last Year" },
];

export default function CashTransactionPage() {
    const { accounts, selectedAccount, setSelectedAccount } = useTradingAccountStore();
    const [selectedPeriod, setSelectedPeriod] = useState("last30days");
    const [selectedCurrency, setSelectedCurrency] = useState("SGD");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transactions, setTransactions] = useState<ITrustBalanceDetail[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!selectedAccount?.accountNo) return;
            setLoading(true);
            const pageIndex = currentPage - 1;
            const response = await getTrustBalanceDetails(
                selectedAccount.accountNo,
                selectedCurrency,
                itemsPerPage,
                pageIndex
            );
            if (response.success && response.data) {
                setTransactions(response.data.trustBalances);
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
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                <Select
                                    value={selectedAccount?.accountNo}
                                    onValueChange={(value) => {
                                        const account = accounts.find((acc) => acc.accountNo === value);
                                        setSelectedAccount(account || null);
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-[258px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
                                        <SelectValue placeholder="Select trading account">
                                            {selectedAccount && (
                                                <span className="text-sm text-typo-primary font-medium">
                                                    {selectedAccount.accountType && `(${selectedAccount.accountType})`} {selectedAccount.accountNo}
                                                </span>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="w-[--radix-select-trigger-width]">
                                        {accounts.map((account) => (
                                            <SelectItem key={account.accountNo} value={account.accountNo}>
                                                <span className="text-sm">
                                                    {account.accountType && `(${account.accountType})`} {account.accountNo}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger className="w-full md:w-[152px] bg-white border border-stroke-secondary rounded-md shadow-none h-auto py-2 px-3">
                                        <SelectValue placeholder="Select period">
                                            {timePeriods.find((p) => p.value === selectedPeriod)?.label}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="w-[--radix-select-trigger-width]">
                                        {timePeriods.map((period) => (
                                            <SelectItem key={period.value} value={period.value}>
                                                <span className="text-sm">{period.label}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-cgs-blue text-sm font-normal text-cgs-blue rounded hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75"
                            >
                                <FileDown className="size-4" />
                                Export to Excel
                            </Button>
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
