"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getFxRates } from "@/lib/services/portfolioService";
import type { IExchangeRate } from "@/types";

interface ExchangeRateTableProps {
	lastUpdated?: string;
}

const formatSGTDate = (isoDate: string): string => {
	return new Date(isoDate).toLocaleDateString("en-SG", { timeZone: "Asia/Singapore" });
};

const formatSGTTime = (isoDate: string): string => {
	return new Date(isoDate).toLocaleTimeString("en-SG", { timeZone: "Asia/Singapore" }) + " SGT";
};

export const ExchangeRateTable: React.FC<ExchangeRateTableProps> = () => {
	const [rates, setRates] = useState<IExchangeRate[]>([]);
	const [loading, setLoading] = useState(true);
	const [sortColumn, setSortColumn] = useState<keyof IExchangeRate | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (col: keyof IExchangeRate) => {
		if (col === sortColumn) {
			if (sortDirection === "asc") setSortDirection("desc");
			else setSortColumn(null);
		} else {
			setSortColumn(col);
			setSortDirection("asc");
		}
	};

	const sortedRates = [...rates].sort((a, b) => {
		if (!sortColumn) return 0;
		const aVal = a[sortColumn];
		const bVal = b[sortColumn];
		const dir = sortDirection === "asc" ? 1 : -1;
		const aNum = Number(aVal);
		const bNum = Number(bVal);
		if (!isNaN(aNum) && !isNaN(bNum)) return (aNum - bNum) * dir;
		return String(aVal).localeCompare(String(bVal)) * dir;
	});

	const SortIcon = ({ col, side = "right" }: { col: keyof IExchangeRate; side?: "left" | "right" }) => {
		const margin = side === "left" ? "mr-1" : "ml-1";
		return sortColumn === col ? (
			sortDirection === "asc" ? (
				<ArrowUp className={`size-3 shrink-0 ${margin}`} />
			) : (
				<ArrowDown className={`size-3 shrink-0 ${margin}`} />
			)
		) : (
			<ArrowUp className={`size-3 shrink-0 ${margin} invisible`} />
		);
	};

	useEffect(() => {
		const fetchRates = async () => {
			setLoading(true);
			const response = await getFxRates();
			if (response.success && response.data) {
				setRates(response.data);
			}
			setLoading(false);
		};
		fetchRates();
	}, []);

	return (
		<div className="space-y-4">
			{/* Info text */}
			<p className="text-sm text-typo-secondary">
				Rates used are updated at the start of the last business day.
			</p>

			{/* Exchange Rate Table */}
			<div className="rounded-t-lg overflow-x-auto">
				<div className="min-w-[680px]">
					{/* Table Header */}
					<div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,2fr)] gap-x-6 px-4 py-3 bg-background-section border-b border-stroke-secondary text-sm font-semibold text-typo-primary">
						<button
							className="whitespace-nowrap w-full flex items-center cursor-pointer select-none p-0 m-0 border-0 bg-transparent font-semibold text-sm text-typo-primary"
							onClick={() => handleSort("fromCurrency")}
						>
							Ccy Code From
							<SortIcon col="fromCurrency" />
						</button>
						<button
							className="whitespace-nowrap w-full flex items-center cursor-pointer select-none p-0 m-0 border-0 bg-transparent font-semibold text-sm text-typo-primary"
							onClick={() => handleSort("toCurrency")}
						>
							Ccy Code To
							<SortIcon col="toCurrency" />
						</button>
						<button
							className="whitespace-nowrap w-full flex items-center justify-end cursor-pointer select-none p-0 m-0 border-0 bg-transparent font-semibold text-sm text-typo-primary"
							onClick={() => handleSort("bid")}
						>
							<SortIcon col="bid" side="left" />
							Buy FX Rate
						</button>
						<button
							className="whitespace-nowrap w-full flex items-center justify-end cursor-pointer select-none p-0 m-0 border-0 bg-transparent font-semibold text-sm text-typo-primary"
							onClick={() => handleSort("offer")}
						>
							<SortIcon col="offer" side="left" />
							Sell FX Rate
						</button>
						<button
							className="whitespace-nowrap w-full flex items-center justify-end cursor-pointer select-none p-0 m-0 border-0 bg-transparent font-semibold text-sm text-typo-primary"
							onClick={() => handleSort("lastUpdatedOn")}
						>
							<SortIcon col="lastUpdatedOn" side="left" />
							Last Updated
						</button>
					</div>

					{/* Table Body */}
					<div className="divide-y divide-stroke-secondary bg-white">
						{loading ? (
							<div className="px-4 py-8 text-center text-sm text-typo-secondary">
								Loading exchange rates...
							</div>
						) : rates.length === 0 ? (
							<div className="px-4 py-8 text-center text-sm text-typo-secondary">
								No exchange rates available
							</div>
						) : (
							sortedRates.map((rate, index) => (
								<div
									key={index}
									className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,2fr)] gap-x-6 px-4 py-3 text-sm text-typo-primary items-center"
								>
									<div>{rate.fromCurrency}</div>
									<div>{rate.toCurrency}</div>
									<div className="text-right">{Number(rate.bid).toFixed(6)}</div>
									<div className="text-right">{Number(rate.offer).toFixed(6)}</div>
									<div className="text-right">
										{rate.lastUpdatedOn ? (
											<>
												<div>{formatSGTDate(rate.lastUpdatedOn)}</div>
												<div>{formatSGTTime(rate.lastUpdatedOn)}</div>
											</>
										) : "—"}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
