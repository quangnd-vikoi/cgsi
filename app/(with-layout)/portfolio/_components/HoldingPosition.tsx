"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ArrowDown,
	ArrowRightLeft,
	ArrowUp,
	EllipsisVertical,
	Expand,
	FileOutput,
	Loader2,
} from "lucide-react";
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

type ColDef = { label: string; col: keyof IPortfolioHolding; right?: boolean };

const CTA_COLS: ColDef[] = [
	{ label: "Asset Class", col: "assetClass" },
	{ label: "Market", col: "marketCode" },
	{ label: "Code", col: "securityCode" },
	{ label: "Name", col: "securityName" },
	{ label: "Total Qty", col: "totalQty", right: true },
	{ label: "Earmarked", col: "earmarkQty", right: true },
	{ label: "Avail Qty", col: "availQty", right: true },
	{ label: "Currency", col: "currency", right: true },
	{ label: "Closing Price", col: "closingPrice", right: true },
	{ label: "Market Value", col: "marketValue", right: true },
];

const MTA_COLS: ColDef[] = [
	{ label: "Asset Class", col: "assetClass" },
	{ label: "Market", col: "marketCode" },
	{ label: "Code", col: "securityCode" },
	{ label: "Name", col: "securityName" },
	{ label: "Total Qty", col: "totalQty", right: true },
	{ label: "Currency", col: "currency", right: true },
	{ label: "Closing Price", col: "closingPrice", right: true },
	{ label: "Market Value", col: "marketValue", right: true },
	{ label: "Cap Price", col: "capPrice", right: true },
	{ label: "Cap Qty", col: "capQty", right: true },
	{ label: "Marg. Qty", col: "marginableQty", right: true },
	{ label: "Valuation %", col: "valuationPct", right: true },
	{ label: "Collateral Val", col: "collateralValue", right: true },
];

const CUT_COLS: ColDef[] = [
	{ label: "Asset Class", col: "assetClass" },
	{ label: "Market", col: "marketCode" },
	{ label: "Code", col: "securityCode" },
	{ label: "Name", col: "securityName" },
	{ label: "Total Qty", col: "totalQty", right: true },
	{ label: "Currency", col: "currency", right: true },
	{ label: "Closing Price", col: "closingPrice", right: true },
	{ label: "Market Value", col: "marketValue", right: true },
];

const getColDefs = (accountType?: string): ColDef[] => {
	if (accountType === "MTA") return MTA_COLS;
	if (accountType === "CUT" || accountType === "iCash") return CUT_COLS;
	return CTA_COLS; // default: CTA / SBL
};

export const HoldingPosition = ({ type }: { type: PortfolioType }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [holdings, setHoldings] = useState<IPortfolioHolding[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const { selectedAccount } = useTradingAccountStore();
	const [exporting, setExporting] = useState(false);
	const [sortColumn, setSortColumn] = useState<keyof IPortfolioHolding | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (column: keyof IPortfolioHolding) => {
		if (column === sortColumn) {
			if (sortDirection === "asc") setSortDirection("desc");
			else setSortColumn(null);
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const sortedHoldings = [...holdings].sort((a, b) => {
		if (!sortColumn) return 0;
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
			exportToExcel({
				filename: `Holdings_${selectedAccount.accountNo}`,
				columns: holdingsColumns,
				data: allData,
			});
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
				setHoldings(response.data.portfolio ?? []);
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

	const isSubCDP = selectedAccount?.cdp?.startsWith("217 1");

	const colDefs = getColDefs(selectedAccount?.accountType);
	const colCount = colDefs.length;

	return (
		<div className="bg-white rounded border border-stroke-secondary">
			<div className="pad-x py-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-4 md:mb-6">
					<div className="flex items-center gap-2">
						<h2 className="text-base font-semibold text-typo-primary">
							Holdings &amp; Positions
						</h2>
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
							{exporting ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								<FileOutput className="size-4" />
							)}
							Export to Excel
						</Button>
						{type === "CTA" && !isSubCDP && (
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
									{exporting ? (
										<Loader2 size={16} className="animate-spin" />
									) : (
										<FileOutput size={16} />
									)}
									Export to Excel
								</DropdownMenuItem>
								{type === "CTA" && !isSubCDP && (
									<DropdownMenuItem>
										<ArrowRightLeft size={16} />
										SGX Shares Transfer
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto  rounded">
					<Table>
						<TableHeader>
							<TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs md:[&>th]:text-sm [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:!px-4 [&>th]:py-3 md:[&>th]:px-2">
								{colDefs.map(({ label, col, right }) => (
									<TableHead
										key={col}
										className={right ? "text-right" : ""}
										onClick={() => handleSort(col)}
									>
										<button
											className={`inline-flex items-center gap-1 cursor-pointer select-none${right ? " flex-row-reverse" : ""}`}
										>
											{label}
											{sortColumn === col ? (
												sortDirection === "asc" ? (
													<ArrowUp className="size-3" />
												) : (
													<ArrowDown className="size-3" />
												)
											) : (
												<ArrowUp className="size-3 invisible" />
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
										{Array.from({ length: colCount }).map((_, j) => (
											<TableCell key={j}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										))}
									</TableRow>
								))
							) : holdings.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={colCount}
										className="text-center py-8 text-sm text-typo-secondary"
									>
										No holdings data available
									</TableCell>
								</TableRow>
							) : (
								sortedHoldings.map((item, index) => (
									<TableRow
										key={`${item.securityCode}-${index}`}
										className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:!px-4 [&>td]:py-3 md:[&>td]:px-2"
									>
										{colDefs.map(({ col, right }) => {
											const raw = item[col];
											const isNum = typeof raw === "number";
											const value =
												col === "assetClass"
													? (ASSET_CLASS_LABELS[item.assetClass] ?? item.assetClass)
													: isNum
														? (raw as number).toLocaleString("en-US", {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															})
														: (raw ?? "—");
											return (
												<TableCell key={col} className={right ? "text-right" : ""}>
													{String(value)}
												</TableCell>
											);
										})}
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
