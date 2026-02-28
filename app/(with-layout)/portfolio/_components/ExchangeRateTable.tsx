"use client";

import React, { useEffect, useState } from "react";
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
						<div className="whitespace-nowrap">Ccy Code From</div>
						<div className="whitespace-nowrap">Ccy Code To</div>
						<div className="text-right whitespace-nowrap">Buy FX Rate</div>
						<div className="text-right whitespace-nowrap">Sell FX Rate</div>
					</div>

					{/* Table Body */}
					<div className="divide-y divide-stroke-secondary bg-white">
						{loading ? (
							<div className="px-4 py-8 text-center text-sm text-typo-secondary">Loading exchange rates...</div>
						) : rates.length === 0 ? (
							<div className="px-4 py-8 text-center text-sm text-typo-secondary">No exchange rates available</div>
						) : (
							rates.map((rate, index) => (
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
