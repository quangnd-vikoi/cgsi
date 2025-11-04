"use client";
import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSelectionStore } from "@/stores/selectionStore";
import { INTERNAL_ROUTES } from "@/constants/routes";

export default function Sidebar() {
	const pathname = usePathname();
	const { selectedId, setSelectedItem } = useSelectionStore();

	const etfData = [
		{
			id: 1,
			name: "CGS Fullgoal CSI 1000 ETF",
			code: "GRU.SGX",
			issuePrice: "1.00 USD",
			minUnits: "10",
			openingDate: "20-Oct-2025, 10:00 SGT",
			closingDate: "02-Nov-2025, 17:00 SGT",
			hasDetails: true,
			applied: true,
		},
		{
			id: 2,
			name: "CGS Fullgoal Vietnam 30 Sector Cap ETF",
			code: "GRU.SGX",
			issuePrice: "1.00 USD",
			minUnits: "10",
			openingDate: "20-Oct-2025, 10:00 SGT",
			closingDate: "02-Nov-2025, 17:00 SGT",
			hasDetails: false,
			applied: false,
		},
		{
			id: 3,
			name: "CGS Fullgoal Vietnam 30 Sector Cap ETF Example Example Exa...",
			code: "VND.SGX",
			closingDate: "20-May-2025, 17:00 SGT",
			hasDetails: false,
			isCompact: true,
			applied: false,
		},
		{
			id: 4,
			name: "CGS Fullgoal Vietnam 30 Sector Cap ETF Example Example Exa...",
			code: "VND.SGX",
			closingDate: "20-May-2025, 17:00 SGT",
			hasDetails: false,
			isCompact: true,
			applied: true,
		},
		// {
		// 	id: 4,
		// 	name: "CGS Fullgoal Vietnam 30 Sector Cap ETF Example Example Exa...",
		// 	code: "VND.SGX",
		// 	closingDate: "20-May-2025, 17:00 SGT",
		// 	hasDetails: false,
		// 	isCompact: true,
		// 	applied: true,
		// },
		// {
		// 	id: 5,
		// 	name: "CGS Fullgoal Vietnam 30 Sector Cap ETF Example Example Exa...",
		// 	code: "VND.SGX",
		// 	closingDate: "20-May-2025, 17:00 SGT",
		// 	hasDetails: false,
		// 	isCompact: true,
		// 	applied: false,
		// },
	];

	return (
		<div className="relative h-full flex flex-col bg-white rounded md:max-w-sm" id="sidebar_form">
			{/* Header - Fixed */}
			<div className="flex-shrink-0 p-4 md:p-6 !pb-4">
				<h1 className="text-base font-semibold text-typo-primary">
					{pathname.startsWith(INTERNAL_ROUTES.SECURITIES)
						? "Initial Offering Price (IOP)"
						: "Commercial Papers"}
				</h1>
			</div>

			{/* Content - Scrollable */}
			<div className="flex-1 overflow-y-auto sidebar-scroll p-4 md:p-6 !pt-0">
				<div className="space-y-4">
					{etfData.map((etf) => (
						<div
							key={etf.id}
							className={cn(
								"rounded-lg border p-4 shadow-sm relative",
								selectedId === etf.id ? "border-enhanced-blue" : "border-stroke-secondary",
								etf.isCompact ? "bg-theme-neutral-095" : "bg-white"
							)}
						>
							{/* Applied Badge - góc trái trên */}
							{etf.applied && (
								<div className="absolute top-0 left-0">
									<div className="bg-status-success text-white text-[10px] font-medium px-2 py-0.5 rounded-tl-[9px] rounded-br-[9px]">
										Applied
									</div>
								</div>
							)}

							{/* Header */}
							<div className={cn("flex items-start gap-2 mb-2", etf.applied && "mt-3")}>
								<div className="flex-1">
									<h3
										className={cn(
											"text-base font-medium text-typo-primary line-clamp-2",
											etf.isCompact && "text-typo-tertiary"
										)}
									>
										{etf.name}
									</h3>
								</div>
								<Button
									className={cn(
										"gap-1 px-3 h-6 border border-enhanced-blue text-xs rounded-4xl flex items-center leading-2",
										selectedId === etf.id
											? "bg-enhanced-blue text-white"
											: "bg-transparent text-enhanced-blue hover:bg-background-focus transition-colors "
									)}
									onClick={() => setSelectedItem(etf)}
								>
									{selectedId === etf.id && <Check className="text-sm" />}
									Details
									{selectedId !== etf.id && (
										<ArrowRight className="text-sm text-enhanced-blue" />
									)}
								</Button>
							</div>

							<span className="px-3 py-1 text-typo-secondary text-xs rounded-full border border-stroke-secondary">
								{etf.code}
							</span>

							{/* Details */}
							{!etf.isCompact && (
								<div className="flex flex-col gap-3 mt-4 *:text-xs">
									<div className="flex justify-between items-center">
										<span className=" text-typo-secondary">Issue Price</span>
										<span className=" font-medium text-typo-primary">
											{etf.issuePrice}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className=" text-typo-secondary">Min. Number of Units</span>
										<span className=" font-medium text-typo-primary">{etf.minUnits}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className=" text-typo-secondary">Opening Date</span>
										<span className=" font-medium text-typo-primary">
											{etf.openingDate}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className=" text-typo-secondary">Closing Date</span>
										<span className=" font-medium text-typo-primary">
											{etf.closingDate}
										</span>
									</div>
								</div>
							)}

							{etf.isCompact && (
								<div className="mt-4">
									<div className="flex justify-between items-center *:text-xs">
										<span className=" text-typo-tertiary">Closing Date</span>
										<span className=" font-medium text-typo-tertiary">
											{etf.closingDate}
										</span>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
