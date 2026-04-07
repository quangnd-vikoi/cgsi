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
import { ASSET_CLASS_LABELS, CURRENCY_TO_MARKET } from "@/constants/accounts";
import Link from "next/link";
import { PortfolioType } from "@/types";
import type { IPortfolioHolding } from "@/types";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { getHoldings, getCdpTransferStatus, exportHoldings } from "@/lib/services/portfolioService";
import { Skeleton } from "@/components/ui/skeleton";
import { useExport } from "@/hooks/useExport";
import type { ICDPTransferStatus } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

type ColDef = { label: string; col: keyof IPortfolioHolding; right?: boolean };

const BASE_COLS: ColDef[] = [
	{ label: "Asset Class", col: "assetClass" },
	{ label: "Market", col: "marketCode" },

];

const CTA_COLS: ColDef[] = [
	...BASE_COLS,
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
	...BASE_COLS,
	{ label: "Security Code", col: "securityCode" },
	{ label: "Name", col: "securityName" },
	{ label: "Total Quantity", col: "totalQty", right: true },
	{ label: "Currency", col: "currency", right: true },
	{ label: "Closing Price", col: "closingPrice", right: true },
	{ label: "Market Value (SGD)", col: "marketValue", right: true },
	{ label: "Cap Price", col: "capPrice", right: true },
	// { label: "Cap Qty", col: "capQty", right: true },
	{ label: "Marginable Quantity", col: "marginableQty", right: true },
	{ label: "Valuation %", col: "valuationPct", right: true },
	{ label: "Collateral Value (SGD)", col: "collateralValue", right: true },
	{ label: "Portfolio %", col: "portfolioPct", right: true },
];

const CUT_COLS: ColDef[] = [
	...BASE_COLS,
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
	const { selectedAccount, isInitialized, selectedAccountSummary } = useTradingAccountStore();
	const { exporting, handleExport: runExport } = useExport();
	const [sortColumn, setSortColumn] = useState<keyof IPortfolioHolding | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [showTransferDetails, setShowTransferDetails] = useState(false);

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

	const handleExport = () => {
		if (!selectedAccount?.accountNo) return;
		runExport(() => exportHoldings(selectedAccount.accountNo));
	};

	useEffect(() => {
		const fetchHoldings = async () => {
			if (!selectedAccount?.accountNo) return;
			setLoading(true);
			const pageIndex = currentPage - 1;
			const response = await getHoldings(selectedAccount.accountNo, itemsPerPage, pageIndex);
			if (response.success && response.data) {
				const totalCollateralValue = selectedAccountSummary?.collateralValue ?? 0;

				const enriched = (response.data.portfolio ?? []).map((item) => ({
					...item,
					portfolioPct:
						totalCollateralValue > 0
							? (item.collateralValue ?? 0) / totalCollateralValue
							: 0,
				}));

				setHoldings(enriched);
				setTotalItems(response.data.total);
			}
			setLoading(false);
		};
		fetchHoldings();
	}, [selectedAccount?.accountNo, currentPage, itemsPerPage, selectedAccountSummary]);

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	const isSubCDP = useTradingAccountStore((s) => s.isSubCDP());

	const [cdpTransfer, setCdpTransfer] = useState<ICDPTransferStatus | null>(null);
	const [cdpStatusLoading, setCdpStatusLoading] = useState(false);

	useEffect(() => {
		if (type !== "CTA") return;
		let cancelled = false;
		const fetchStatus = async () => {
			setCdpStatusLoading(true);
			const response = await getCdpTransferStatus();
			if (!cancelled && response.success && response.data) {
				// Use the latest status entry
				const latest = response.data[response.data.length - 1] ?? null;
				setCdpTransfer(latest);
			}
			if (!cancelled) setCdpStatusLoading(false);
		};
		fetchStatus();
		return () => {
			cancelled = true;
		};
	}, [type]);

	const cdpStatus = cdpTransfer?.status ?? null;
	const isCdpPending = cdpStatus === "2";
	const isCdpSuccessful = cdpStatus === "3";

	const colDefs = getColDefs(selectedAccount?.accountType);
	const colCount = colDefs.length;

	return (
		<div className="bg-white rounded border border-stroke-secondary">
			<div className="pad-x py-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-4 md:mb-6">
					<h2 className="text-base font-semibold text-typo-primary">Holdings &amp; Positions</h2>

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
						{!isInitialized || cdpStatusLoading ? (
							<Skeleton className="h-8 w-36 rounded" />
						) : type === "CTA" && !isSubCDP ? (
							<>
								{isCdpPending ? (
									<Button
										size="sm"
										className="text-sm rounded gap-2 bg-status-disable-primary text-white cursor-not-allowed"
										disabled
									>
										<ArrowRightLeft className="size-4" />
										Transfer Pending
									</Button>
								) : isCdpSuccessful ? (
									<Button
										size="sm"
										className="text-sm rounded gap-2 bg-status-disable-primary text-white cursor-not-allowed"
										disabled
									>
										<ArrowRightLeft className="size-4" />
										Transfer Successful
									</Button>
								) : (
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
								{cdpTransfer && cdpStatus !== "1" && (
									<div className="flex flex-col items-end text-xs text-typo-secondary">
										<span>
											Transfer Requested on:{" "}
											{new Date(cdpTransfer.requestedOn).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</span>
										<button
											onClick={() => setShowTransferDetails(true)}
											className="text-cgs-blue hover:text-cgs-blue/75 font-medium cursor-pointer"
										>
											View Details
										</button>
									</div>
								)}
							</>
						) : null}
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
								{!isInitialized || cdpStatusLoading ? (
									<DropdownMenuItem disabled>
										<Skeleton className="h-4 w-32 rounded" />
									</DropdownMenuItem>
								) : type === "CTA" && !isSubCDP && isCdpPending ? (
									<DropdownMenuItem disabled>
										<ArrowRightLeft size={16} />
										Transfer Pending
									</DropdownMenuItem>
								) : type === "CTA" && !isSubCDP && isCdpSuccessful ? (
									<DropdownMenuItem disabled>
										<ArrowRightLeft size={16} />
										Transfer Successful
									</DropdownMenuItem>
								) : type === "CTA" && !isSubCDP ? (
									<DropdownMenuItem asChild>
										<Link href={INTERNAL_ROUTES.SHARE_TRANSFER}>
											<ArrowRightLeft size={16} />
											SGX Shares Transfer
										</Link>
									</DropdownMenuItem>
								) : null}
								{type === "CTA" && cdpTransfer && cdpStatus !== "1" && (
									<DropdownMenuItem onClick={() => setShowTransferDetails(true)}>
										<FileOutput size={16} />
										Transfer Request Details
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto lg:overflow-visible rounded">
					<Table>
						<TableHeader>
							<TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs md:[&>th]:text-sm [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:!px-4 [&>th]:py-3 lg:[&>th]:px-2">
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
										className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:!px-4 [&>td]:py-3 lg:[&>td]:px-2"
									>
										{colDefs.map(({ col, right }) => {
											const raw = item[col];
											const isNum = typeof raw === "number";
											const value =
												col === "assetClass"
													? (ASSET_CLASS_LABELS[item.assetClass] ?? item.assetClass)
													: col === "marketCode" && selectedAccount?.accountType === "MTA"
														? (CURRENCY_TO_MARKET[item.currency] ?? raw ?? "—")
													: isNum
														? (raw as number).toLocaleString("en-US", {
															minimumFractionDigits: (["totalQty", "marginableQty", "valuationPct"]).includes(col) ? 0 : 2,
															maximumFractionDigits: (["totalQty", "marginableQty", "valuationPct"]).includes(col) ? 0 : 2,
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

			{/* Transfer Request Details Dialog */}
			{cdpTransfer && (
				<Dialog open={showTransferDetails} onOpenChange={setShowTransferDetails}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="text-base font-semibold">
								Transfer Request Details
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-typo-secondary">Transfer Request on</span>
								<span className="font-medium text-right">
									{new Date(cdpTransfer.requestedOn).toLocaleDateString("en-GB", {
										day: "2-digit",
										month: "short",
										year: "numeric",
									})}
									,{" "}
									{new Date(cdpTransfer.requestedOn).toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
									})}{" "}
									SGT
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-typo-secondary">CDP Account</span>
								<span className="font-medium">{cdpTransfer.cdpNo}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-typo-secondary">Trading Account</span>
								<span className="font-medium">{cdpTransfer.acctNo}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-typo-secondary">Status</span>
								<span className="font-medium">{cdpTransfer.statusDesc}</span>
							</div>
						</div>
						<div className="flex justify-end mt-4">
							<DialogClose asChild>
								<Button size="sm" className="bg-cgs-blue hover:bg-cgs-blue/90 rounded px-6">
									Close
								</Button>
							</DialogClose>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};
