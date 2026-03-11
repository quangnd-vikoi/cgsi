"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ITrustBalanceDetail } from "@/types";
import { formatDate } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface CashTransactionsTableProps {
	transactions: ITrustBalanceDetail[];
	loading?: boolean;
}

type SortCol = keyof ITrustBalanceDetail | "amount";

const getAmount = (t: ITrustBalanceDetail) =>
	t.credit > 0 ? t.credit : t.debit > 0 ? -t.debit : 0;

export function CashTransactionsTable({ transactions, loading }: CashTransactionsTableProps) {
	const [sortColumn, setSortColumn] = useState<SortCol>("transactionDate");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

	const handleSort = (col: SortCol) => {
		if (col === sortColumn) {
			setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
		} else {
			setSortColumn(col);
			setSortDirection("desc");
		}
	};

	const getVal = (t: ITrustBalanceDetail, col: SortCol) =>
		col === "amount" ? getAmount(t) : t[col];

	const sorted = [...transactions].sort((a, b) => {
		const aVal = getVal(a, sortColumn);
		const bVal = getVal(b, sortColumn);
		const dir = sortDirection === "asc" ? 1 : -1;
		if (aVal == null && bVal == null) return 0;
		if (aVal == null) return dir;
		if (bVal == null) return -dir;
		if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
		return String(aVal).localeCompare(String(bVal)) * dir;
	});

	const cols: { label: string; col: SortCol; right?: boolean }[] = [
		{ label: "Transaction ID", col: "transactionNo" },
		{ label: "Transaction Date", col: "transactionDate" },
		{ label: "Description", col: "description" },
		{ label: "Currency", col: "currency", right: true },
		{ label: "Traded Price", col: "tradedPrice", right: true },
		{ label: "Quantity", col: "quantity", right: true },
		{ label: "Amount", col: "amount", right: true },
	];

	return (
		<div className="overflow-x-auto rounded-l-lg rounded-r-none md:rounded-r-lg mb-4 -mr-4 md:mr-0">
			<Table>
				<TableHeader>
					<TableRow className="bg-background-section border-b border-stroke-secondary [&>th]:text-xs md:[&>th]:text-sm [&>th]:font-semibold [&>th]:text-typo-primary [&>th]:whitespace-nowrap [&>th]:!px-4 [&>th]:py-3 md:[&>th]:px-2">
						{cols.map(({ label, col, right }) => (
							<TableHead key={col} className={right ? "text-right" : ""} onClick={() => handleSort(col)}>
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
						<TableRow>
							<TableCell colSpan={7} className="text-center py-8 text-sm text-typo-secondary">
								Loading transactions...
							</TableCell>
						</TableRow>
					) : sorted.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-8 text-sm text-typo-secondary">
								No transactions available
							</TableCell>
						</TableRow>
					) : (
						sorted.map((transaction) => (
							<TableRow
								key={transaction.transactionNo}
								className="border-b border-stroke-secondary last:border-0 hover:bg-background-section/50 [&>td]:text-xs [&>td]:md:text-sm [&>td]:text-typo-primary [&>td]:whitespace-nowrap [&>td]:px-4 [&>td]:py-3"
							>
								<TableCell>{transaction.transactionNo}</TableCell>
								<TableCell>{formatDate(transaction.transactionDate)}</TableCell>
								<TableCell>{transaction.description}</TableCell>
								<TableCell className="text-right">{transaction.currency}</TableCell>
								<TableCell className="text-right">{transaction.tradedPrice}</TableCell>
								<TableCell className="text-right">{transaction.quantity}</TableCell>
								<TableCell className="text-right">
									{transaction.debit > 0 ? (
										<span className="text-status-error">
											-{transaction.debit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
										</span>
									) : transaction.credit > 0 ? (
										<span className="text-status-success">
											+{transaction.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
										</span>
									) : "-"}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
