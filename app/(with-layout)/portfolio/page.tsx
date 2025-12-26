"use client"

import React from "react";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Alert from "@/components/Alert";
import Image from "@/components/Image";
import Dashboard from "./_components/Dashboard";
import { CashBalance } from "./_components/CashBalance";
import { HoldingPosition } from "./_components/HoldingPosition";
import { ExchangeRateTable } from "./_components/ExchangeRateTable";

export type PortfolioType = "CTA" | "MTA" | "SBL" | "CUT" | "iCash";

const DevelopmentBanner = () => {
	return (
		<div className="bg-white shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] px-4 py-3 border-b rounded-lg w-full">
			<div className="flex flex-wrap justify-between items-center gap-3 mx-auto max-w-screen-2xl">
				<div className="flex items-center gap-2">
					<AlertCircle className="flex-shrink-0 w-4 h-4 text-enhanced-blue" />
					<p className="font-normal text-typo-primary text-sm">
						Information herein is updated only up to the last business day and should not be relied upon in any way.
					</p>
				</div>

				<Separator
					orientation="horizontal"
					className="block md:hidden bg-stroke-secondary h-[1px] w-full"
				/>

				<div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
					{/* Vertical separator trên desktop - dùng div */}
					<div className="hidden md:block bg-stroke-secondary w-[2px] h-6 self-stretch" />

					<Alert
						trigger={
							<Button
								variant="ghost"
								className="flex-1 md:flex-none p-0 h-auto font-normal text-enhanced-blue text-sm whitespace-nowrap gap-1 hover:bg-transparent hover:text-enhanced-blue/75"
							>
								<Image src={"/icons/portfolio/dollar-sign.svg"} className="hidden md:block" alt="FX Rate" width={20} height={20} />
								View FX Rate
							</Button>
						}
						title="Exchange Rate"
						className="max-h-[90%]"
						description={<ExchangeRateTable />}
						cancelText=""
						actionText="Close"
					/>

					<Alert
						trigger={
							<Button
								variant="outline"
								size="sm"
								className="flex-1 md:flex-none bg-white hover:bg-enhanced-blue/5 border-enhanced-blue hover:border-enhanced-blue/80 h-7 text-enhanced-blue hover:text-enhanced-blue/75 whitespace-nowrap"
							>
								Learn More
							</Button>
						}
						title="Disclaimer"
						description={
							<div className="text-sm md:text-base text-typo-secondary">
								<p>
									Information herein should only serve as a guide and should not be relied upon in any way. Please refer to your eStatements for more information.
								</p>

								<ul className="list-disc font-normal mt-6 pl-6">
									<li>For interest-bearing trust account, month-end interest adjustment will be reflected on second business day of the month.</li>
									<li>US trades will be reflected two market days after the trade date. All other markets will be reflected as of the previous market day.</li>
									<li>Please note that your share holdings will be updated one market day after due date.</li>
									<li>Please note that only foreign shares will be displayed in your Custody Holdings Balance Statement in CGS iTrade.</li>
								</ul>
							</div>
						}
						cancelText=""
						actionText="Close"
					/>
				</div>

			</div>
		</div>
	);
};

const Portfolio = () => {
	const [type, setType] = React.useState<PortfolioType>("CTA");

	return (
		<div className="bg-background-section py-6">
			<div className="container-default">
				<DevelopmentBanner />

				{/* Demo Images */}
				<div className="flex flex-col gap-6 mt-6">
					<Dashboard type={type} onTypeChange={setType} />

					<CashBalance />

					<HoldingPosition type={type} />
				</div>
			</div>
		</div>
	);
};

export default Portfolio;
