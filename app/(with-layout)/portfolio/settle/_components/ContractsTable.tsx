"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate as fmtDate } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

// Display type for the contracts/contra table (mapped from API IContract/IContra)
export interface ContractDisplay {
	id: string;
	contractId: string;
	status: "Overdue" | "Outstanding";
	dueDate: string;
	settlementCcy: string;
	gainLoss: number;
	tradeDate: string;
	side: string;
	market: string;
	name: string;
	tradeCcy: string;
	price: number;
	quantity: number;
	mode: string;
	remarks: string;
	statementNo?: string;
}

interface ContractsTableProps {
	contracts: ContractDisplay[];
	activeTab: "contracts" | "contra";
	onOpenContraDetails: (contract: ContractDisplay) => void;
	onPayNow: (contract: ContractDisplay) => void;
	loading?: boolean;
}

type SortCol = keyof Omit<ContractDisplay, "id" | "statementNo">;

const CONTRACT_COLS: { label: string; col: SortCol; right?: boolean; w: string }[] = [
	{ label: "Contract ID",    col: "contractId",   w: "min-w-[120px]" },
	{ label: "Status",         col: "status",        w: "min-w-[100px]" },
	{ label: "Due Date",       col: "dueDate",       w: "min-w-[110px]" },
	{ label: "Settlement Ccy", col: "settlementCcy", w: "min-w-[120px]", right: true },
	{ label: "Gain/Loss",      col: "gainLoss",      w: "min-w-[110px]", right: true },
	{ label: "Trade Date",     col: "tradeDate",     w: "min-w-[110px]" },
	{ label: "Side",           col: "side",          w: "min-w-[70px]" },
	{ label: "Market",         col: "market",        w: "min-w-[80px]" },
	{ label: "Name",           col: "name",          w: "min-w-[140px]" },
	{ label: "Trade Ccy",      col: "tradeCcy",      w: "min-w-[90px]", right: true },
	{ label: "Price",          col: "price",         w: "min-w-[90px]", right: true },
	{ label: "Quantity",       col: "quantity",      w: "min-w-[90px]", right: true },
	{ label: "Mode",           col: "mode",          w: "min-w-[80px]" },
	{ label: "Remarks",        col: "remarks",       w: "min-w-[120px]" },
];

const CONTRA_COLS: { label: string; col: SortCol; right?: boolean; w: string }[] = [
	{ label: "Contra ID",      col: "contractId",   w: "min-w-[120px]" },
	{ label: "Status",         col: "status",        w: "min-w-[100px]" },
	{ label: "Due Date",       col: "dueDate",       w: "min-w-[110px]" },
	{ label: "Settlement Ccy", col: "settlementCcy", w: "min-w-[120px]", right: true },
	{ label: "Gain/Loss",      col: "gainLoss",      w: "min-w-[110px]", right: true },
	{ label: "Statement Date", col: "tradeDate",     w: "min-w-[120px]" },
	{ label: "Market",         col: "market",        w: "min-w-[80px]" },
	{ label: "Name",           col: "name",          w: "min-w-[140px]" },
];

const ACTION_W = "min-w-[120px]";

const thBase = "text-xs md:text-sm font-semibold text-typo-primary whitespace-nowrap px-4 py-4";
const tdBase = "text-xs md:text-sm text-typo-primary whitespace-nowrap px-4 py-3";

export function ContractsTable({ contracts, activeTab, onOpenContraDetails, onPayNow, loading = false }: ContractsTableProps) {
	const COLS = activeTab === "contra" ? CONTRA_COLS : CONTRACT_COLS;
	const [sortColumn, setSortColumn] = useState<SortCol>("dueDate");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (col: SortCol) => {
		if (col === sortColumn) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(col);
			setSortDirection("asc");
		}
	};

	const sorted = [...contracts].sort((a, b) => {
		const aVal = a[sortColumn];
		const bVal = b[sortColumn];
		const dir = sortDirection === "asc" ? 1 : -1;
		if (aVal == null && bVal == null) return 0;
		if (aVal == null) return dir;
		if (bVal == null) return -dir;
		if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
		return String(aVal).localeCompare(String(bVal)) * dir;
	});

	return (
		<div className="overflow-x-auto rounded border border-stroke-secondary mb-4">
			<Table>
				<TableHeader>
					<TableRow className="bg-background-section border-b border-stroke-secondary">
						{COLS.map(({ label, col, right, w }) => (
							<TableHead
								key={col}
								className={`${thBase} ${w} ${right ? "text-right" : ""}`}
								onClick={() => handleSort(col)}
							>
								<button className={`inline-flex items-center gap-1 cursor-pointer select-none ${right ? "flex-row-reverse" : ""}`}>
									{label}
									{sortColumn === col
										? sortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
										: <ArrowUpDown className="size-3 text-typo-secondary/50" />
									}
								</button>
							</TableHead>
						))}
						<TableHead className={`${thBase} ${ACTION_W} text-center sticky px-4 right-0 bg-background-section`}>
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ? (
						Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i} className="border-b border-stroke-secondary">
								{COLS.map(({ col, w }) => (
									<TableCell key={col} className={`${tdBase} ${w}`}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
								<TableCell className={`${tdBase} ${ACTION_W}`}>
									<Skeleton className="h-8 w-full rounded" />
								</TableCell>
							</TableRow>
						))
					) : sorted.length === 0 ? (
						<TableRow>
							<TableCell colSpan={COLS.length + 1} className="text-center py-8 text-sm text-typo-secondary">
								No data available
							</TableCell>
						</TableRow>
					) : sorted.map((contract) => (
						<TableRow
							key={contract.id}
							className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50"
						>
							<TableCell className={`${tdBase} min-w-[120px]`}>{contract.contractId}</TableCell>
							<TableCell className={`${tdBase} min-w-[100px]`}>
								<span className={contract.status === "Overdue" ? "text-status-error" : "text-typo-primary"}>
									{contract.status}
								</span>
							</TableCell>
							<TableCell className={`${tdBase} min-w-[110px]`}>{fmtDate(contract.dueDate)}</TableCell>
							<TableCell className={`${tdBase} min-w-[120px] text-right`}>{contract.settlementCcy}</TableCell>
							<TableCell className={`${tdBase} min-w-[110px] text-right ${["SELL", "CR"].includes(contract.side) ? "text-status-success" : "text-status-error"}`}>
								{["SELL", "CR"].includes(contract.side) ? "+" : "-"}{" "}
								{Math.abs(contract.gainLoss).toLocaleString("en-US", { minimumFractionDigits: 2 })}
							</TableCell>
							<TableCell className={`${tdBase} min-w-[110px]`}>{fmtDate(contract.tradeDate)}</TableCell>
							{activeTab === "contracts" && (
								<TableCell className={`${tdBase} min-w-[70px]`}>{contract.side}</TableCell>
							)}
							<TableCell className={`${tdBase} min-w-[80px]`}>{contract.market}</TableCell>
							<TableCell className={`${tdBase} min-w-[140px]`}>{contract.name}</TableCell>
							{activeTab === "contracts" && (<>
								<TableCell className={`${tdBase} min-w-[90px] text-right`}>{contract.tradeCcy}</TableCell>
								<TableCell className={`${tdBase} min-w-[90px] text-right`}>{contract.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
								<TableCell className={`${tdBase} min-w-[90px] text-right`}>{contract.quantity.toLocaleString("en-US")}</TableCell>
								<TableCell className={`${tdBase} min-w-[80px]`}>{contract.mode}</TableCell>
								<TableCell className={`${tdBase} min-w-[120px]`}>{contract.remarks}</TableCell>
							</>)}
							<TableCell className={`${tdBase} ${ACTION_W} text-center sticky right-0 bg-white flex gap-2 justify-center`}>
								{activeTab === "contra" && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => onOpenContraDetails(contract)}
										className="shadow-none border-none font-medium text-cgs-blue hover:text-cgs-blue/80 hover:bg-white rounded px-3"
									>
										Details
									</Button>
								)}
								<Button
									size="sm"
									disabled={!["BUY", "DR"].includes(contract.side) || contract.settlementCcy !== "SGD"}
									className="bg-cgs-blue font-medium hover:bg-cgs-blue/90 text-white rounded px-3 disabled:bg-status-disable-primary"
									onClick={() => onPayNow(contract)}
								>
									PayNow
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
