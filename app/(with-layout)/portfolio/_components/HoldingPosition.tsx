"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowRightLeft, ArrowUp, ArrowUpDown, EllipsisVertical, Expand, FileOutput, Loader2 } from "lucide-react";
import { PaginationFooter } from "@/components/PaginationFooter";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { ASSET_CLASS_LABELS } from "@/constants/accounts";
import Link from "next/link";
import { PortfolioType } from "@/types";
import type { IPortfolioHolding } from "@/types";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { getHoldings } from "@/lib/services/portfolioService";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel, fetchAllForExport } from "@/lib/exportToExcel";
import { holdingsColumns } from "@/lib/exportConfigs";
import { toast } from "@/components/ui/toaster";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

export const HoldingPosition = ({ type }: { type: PortfolioType }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [holdings, setHoldings] = useState<IPortfolioHolding[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const { selectedAccount } = useTradingAccountStore();
    const [exporting, setExporting] = useState(false);
    const [sortColumn, setSortColumn] = useState<keyof IPortfolioHolding>("securityName");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: keyof IPortfolioHolding) => {
        if (column === sortColumn) {
            setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
        } else {
            setSortColumn(column);
            setSortDirection("desc");
        }
    };

    const sortedHoldings = [...holdings].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const dir = sortDirection === "asc" ? 1 : -1;
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return dir;
        if (bVal == null) return -dir;
        if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
        return String(aVal).localeCompare(String(bVal)) * dir;
    });

    const handleExport = async () => {
        if (exporting || !selectedAccount?.accountNo) return;
        setExporting(true);
        try {
            const allData = await fetchAllForExport(
                (pageSize, pageIndex) => getHoldings(selectedAccount.accountNo, pageSize, pageIndex),
                (data) => data.portfolio,
            );
            if (allData.length === 0) {
                toast.warning("No Data", "There is no data to export.");
                return;
            }
            exportToExcel({ filename: `Holdings_${selectedAccount.accountNo}`, columns: holdingsColumns, data: allData });
            toast.success("Export Complete", `${allData.length} rows exported.`);
        } catch {
            toast.error("Export Failed", "Unable to export. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        const fetchHoldings = async () => {
            if (!selectedAccount?.accountNo) return;
            setLoading(true);
            const pageIndex = currentPage - 1;
            const response = await getHoldings(selectedAccount.accountNo, itemsPerPage, pageIndex);
            if (response.success && response.data) {
                setHoldings(response.data.portfolio);
                setTotalItems(response.data.total);
            }
            setLoading(false);
        };
        fetchHoldings();
    }, [selectedAccount?.accountNo, currentPage, itemsPerPage]);

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white rounded border border-stroke-secondary">
            <div className="pad-x py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-typo-primary">Holdings &amp; Positions</h2>
                    </div>

                    {/* Desktop: Show buttons */}
                    <div className="hidden md:flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-cgs-blue text-sm text-cgs-blue rounded gap-2 hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75"
                            onClick={handleExport}
                            disabled={exporting}
                        >
                            {exporting ? <Loader2 className="size-4 animate-spin" /> : <FileOutput className="size-4" />}
                            Export to Excel
                        </Button>
                        {type === "CTA" && (
                            <Link href={INTERNAL_ROUTES.SHARE_TRANSFER}>
                                <Button
                                    size="sm"
                                    className="text-sm rounded gap-2 bg-cgs-blue hover:bg-cgs-blue/90"
                                >
                                    <ArrowRightLeft className="size-4" />
                                    SGX Shares Transfer
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile: Show dropdown menu */}
                    <div className="flex gap-4 items-center md:hidden">
                        <Button variant="ghost" size="icon" className="size-4 md:hidden">
                            <Expand size={16} />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-5">
                                    <EllipsisVertical size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={handleExport} disabled={exporting}>
                                    {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileOutput size={16} />}
                                    Export to Excel
                                </DropdownMenuItem>
                                {type === "CTA" && (
                                    <DropdownMenuItem>
                                        <ArrowRightLeft size={16} />
                                        SGX Shares Transfer
                                    </DropdownMenuItem>)}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto  rounded">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs md:[&>th]:text-sm [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:!px-4 [&>th]:py-3 md:[&>th]:px-2">
                                {(
                                    [
                                        { label: "Asset Class", col: "assetClass" as const },
                                        { label: "Market", col: "marketCode" as const },
                                        { label: "Security Code", col: "securityCode" as const },
                                        { label: "Security Name", col: "securityName" as const },
                                        { label: "Total Qty", col: "totalQty" as const, right: true },
                                        { label: "Avail. Qty", col: "availQty" as const, right: true },
                                        { label: "Earmarked Qty", col: "earmarkQty" as const, right: true },
                                        { label: "Currency", col: "currency" as const, right: true },
                                        { label: "Closing Price", col: "closingPrice" as const, right: true },
                                        { label: "Market Value", col: "marketValue" as const, right: true },
                                    ] as { label: string; col: keyof IPortfolioHolding; right?: boolean }[]
                                ).map(({ label, col, right }) => (
                                    <TableHead
                                        key={col}
                                        className={right ? "text-right" : ""}
                                        onClick={() => handleSort(col)}
                                    >
                                        <button className={`inline-flex items-center gap-1 cursor-pointer select-none${right ? " flex-row-reverse" : ""}`}>
                                            {label}
                                            {sortColumn === col ? (
                                                sortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                                            ) : (
                                                <ArrowUpDown className="size-3 text-typo-secondary/50" />
                                            )}
                                        </button>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="[&>td]:!px-4 [&>td]:py-3">
                                        {Array.from({ length: 10 }).map((_, j) => (
                                            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : holdings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-sm text-typo-secondary">
                                        No holdings data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedHoldings.map((item, index) => (
                                    <TableRow
                                        key={`${item.securityCode}-${index}`}
                                        className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:!px-4 [&>td]:py-3 md:[&>td]:px-2"
                                    >
                                        <TableCell>{ASSET_CLASS_LABELS[item.assetClass] ?? item.assetClass}</TableCell>
                                        <TableCell>{item.marketCode}</TableCell>
                                        <TableCell>{item.securityCode}</TableCell>
                                        <TableCell>{item.securityName}</TableCell>
                                        <TableCell className="text-right">{item.totalQty}</TableCell>
                                        <TableCell className="text-right">{item.availQty ?? 0}</TableCell>
                                        <TableCell className="text-right">{item.earmarkQty ?? 0}</TableCell>
                                        <TableCell className="text-right">{item.currency}</TableCell>
                                        <TableCell className="text-right">
                                            {item.closingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="font-medium text-right">
                                            {item.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Footer */}
                <PaginationFooter
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
                    className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-stroke-secondary"
                    loading={loading}
                />
            </div>
        </div>
    );
};
