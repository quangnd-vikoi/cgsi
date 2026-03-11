"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { getFxRates } from "@/lib/services/portfolioService";
import type { IExchangeRate } from "@/types";

interface ExchangeRateTableProps {
	lastUpdated?: string;
}

export const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({
	lastUpdated: lastUpdatedProp,
}) => {
	const [rates, setRates] = useState<IExchangeRate[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState(lastUpdatedProp || "");
	const [sortColumn, setSortColumn] = useState<keyof IExchangeRate>("fromCurrency");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (col: keyof IExchangeRate) => {
		if (col === sortColumn) {
			setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
		} else {
			setSortColumn(col);
			setSortDirection("desc");
		}
	};

	const sortedRates = [...rates].sort((a, b) => {
		const aVal = a[sortColumn];
		const bVal = b[sortColumn];
		const dir = sortDirection === "asc" ? 1 : -1;
		if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
		return String(aVal).localeCompare(String(bVal)) * dir;
	});

	const SortIcon = ({ col }: { col: keyof IExchangeRate }) =>
		sortColumn === col ? (
			sortDirection === "asc" ? <ArrowUp className="size-3 inline-block ml-1" /> : <ArrowDown className="size-3 inline-block ml-1" />
		) : (
			<ArrowUpDown className="size-3 inline-block ml-1 text-typo-secondary/50" />
		);

	useEffect(() => {
		const fetchRates = async () => {
			setLoading(true);
			const response = await getFxRates();
			if (response.success && response.data) {
				setRates(response.data);
				if (!lastUpdatedProp) {
					setLastUpdated(new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" }) + " SGT");
				}
			}
			setLoading(false);
		};
		fetchRates();
	}, [lastUpdatedProp]);

	return (
		<div className="space-y-4">
			{/* Info text */}
			<p className="text-sm text-typo-secondary">
				Rates used are updated at the start of the last business day.
				<br />
				Last Updated: {lastUpdated}
			</p>

			{/* Exchange Rate Table */}
			<div className="rounded-t-lg overflow-x-auto">
				<div className="min-w-[420px]">
					{/* Table Header */}
					<div className="grid grid-cols-[1.2fr_1fr_1.2fr_1.2fr] gap-4 px-4 py-3 bg-background-section border-b border-stroke-secondary text-sm font-semibold text-typo-primary">
						<button className="whitespace-nowrap text-left inline-flex items-center cursor-pointer select-none" onClick={() => handleSort("fromCurrency")}>Ccy Code From<SortIcon col="fromCurrency" /></button>
						<button className="whitespace-nowrap text-left inline-flex items-center cursor-pointer select-none" onClick={() => handleSort("toCurrency")}>Ccy Code To<SortIcon col="toCurrency" /></button>
						<button className="whitespace-nowrap text-right inline-flex items-center justify-end cursor-pointer select-none" onClick={() => handleSort("bid")}><SortIcon col="bid" />Buy FX Rate</button>
						<button className="whitespace-nowrap text-right inline-flex items-center justify-end cursor-pointer select-none" onClick={() => handleSort("offer")}><SortIcon col="offer" />Sell FX Rate</button>
					</div>

					{/* Table Body */}
					<div className="divide-y divide-stroke-secondary bg-white">
						{loading ? (
							<div className="px-4 py-8 text-center text-sm text-typo-secondary">Loading exchange rates...</div>
						) : rates.length === 0 ? (
							<div className="px-4 py-8 text-center text-sm text-typo-secondary">No exchange rates available</div>
						) : (
							sortedRates.map((rate, index) => (
								<div
									key={index}
									className="grid grid-cols-[1.2fr_1fr_1.2fr_1.2fr] gap-4 px-4 py-3 text-sm text-typo-primary"
								>
									<div>{rate.fromCurrency}</div>
									<div>{rate.toCurrency}</div>
									<div className="text-right">{rate.bid}</div>
									<div className="text-right">{rate.offer}</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
