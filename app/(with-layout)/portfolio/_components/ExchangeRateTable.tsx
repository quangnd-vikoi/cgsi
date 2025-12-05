import React from "react";

interface ExchangeRate {
	ccyCodeFrom: string;
	ccyCodeTo: string;
	buyFXRate: number;
	sellFXRate: number;
}

interface ExchangeRateTableProps {
	lastUpdated?: string;
	rates?: ExchangeRate[];
}

const defaultRates: ExchangeRate[] = [
	{ ccyCodeFrom: "AUD", ccyCodeTo: "SGD", buyFXRate: 0.8383, sellFXRate: 0.8462 },
	{ ccyCodeFrom: "EUR", ccyCodeTo: "SGD", buyFXRate: 1.503, sellFXRate: 1.5163 },
	{ ccyCodeFrom: "GBP", ccyCodeTo: "SGD", buyFXRate: 1.704, sellFXRate: 1.7187 },
	{ ccyCodeFrom: "HKD", ccyCodeTo: "SGD", buyFXRate: 0.1671, sellFXRate: 0.1685 },
	{ ccyCodeFrom: "IDR", ccyCodeTo: "SGD", buyFXRate: 0.000076, sellFXRate: 0.000079 },
	{ ccyCodeFrom: "JPY", ccyCodeTo: "SGD", buyFXRate: 0.008288, sellFXRate: 0.008401 },
	{ ccyCodeFrom: "MYR", ccyCodeTo: "SGD", buyFXRate: 0.3132, sellFXRate: 0.3174 },
	{ ccyCodeFrom: "RMB", ccyCodeTo: "SGD", buyFXRate: 0.183, sellFXRate: 0.1846 },
	{ ccyCodeFrom: "THB", ccyCodeTo: "SGD", buyFXRate: 0.039951, sellFXRate: 0.040535 },
	{ ccyCodeFrom: "USD", ccyCodeTo: "SGD", buyFXRate: 1.3028, sellFXRate: 1.3109 },
];

export const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({
	lastUpdated = "12-Jun-2025, 08:15:15 SGT",
	rates = defaultRates,
}) => {
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
						{rates.map((rate, index) => (
							<div
								key={index}
								className="grid grid-cols-[1.2fr_1fr_1.2fr_1.2fr] gap-4 px-4 py-3 text-sm text-typo-primary"
							>
								<div>{rate.ccyCodeFrom}</div>
								<div>{rate.ccyCodeTo}</div>
								<div className="text-right">{rate.buyFXRate}</div>
								<div className="text-right">{rate.sellFXRate}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
