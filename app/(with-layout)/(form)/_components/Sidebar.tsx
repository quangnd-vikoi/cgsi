"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSelectionStore } from "@/stores/selectionStore";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { ErrorState } from "@/components/ErrorState";
import { subscriptionService } from "@/lib/services/subscriptionService";
import type { ProductSubscriptionDto } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Sidebar() {
	const pathname = usePathname();
	const { selectedId, setSelectedItem } = useSelectionStore();
	const [productSubs, setProductSubs] = useState<ProductSubscriptionDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Determine product type based on pathname
	const productType = pathname.startsWith(INTERNAL_ROUTES.SECURITIES) ? "IOP" : "AI";

	// Fetch product subscriptions
	const fetchProductSubscriptions = useCallback(async () => {
		setLoading(true);
		setError(null);

		const result = await subscriptionService.getProductSubscriptionsByType(productType);

		if (result.success && result.data) {
			setProductSubs(result.data.productSubs);
		} else {
			setError(result.error || "Failed to load products. Please try again later.");
		}

		setLoading(false);
	}, [productType]);

	// Fetch data on mount and when product type changes
	useEffect(() => {
		fetchProductSubscriptions();
	}, [fetchProductSubscriptions]);

	// Format date string to display format
	const formatDateTime = (isoString: string): string => {
		const date = new Date(isoString);
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) + ", " + date.toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});
	};

	// Check if closing date has passed
	const isClosingDatePassed = (endTime: string): boolean => {
		const closingDate = new Date(endTime);
		const now = new Date();
		return now > closingDate;
	};

	// Map API data to UI structure
	const etfData = productSubs.map((sub) => ({
		id: sub.productCode,
		name: sub.productName,
		code: `${sub.stockCode}.${sub.exchangeCode}`,
		issuePrice: `${sub.issuePrice} ${sub.currency}`,
		minUnits: sub.minQty.toString(),
		openingDate: formatDateTime(sub.startTime),
		closingDate: formatDateTime(sub.endTime),
		hasDetails: true,
		applied: sub.isSubscribed,
		isCompact: isClosingDatePassed(sub.endTime),
	}));

	// Loading state
	if (loading) {
		return (
			<div className="relative h-full w-full flex flex-col bg-white rounded md:w-sm" id="sidebar_form">
				<div className="flex-1 flex items-center justify-center pad">
					<div className="space-y-4 w-full">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="rounded border border-stroke-secondary p-4 space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="relative h-full w-full flex flex-col bg-white rounded md:w-sm" id="sidebar_form">
				<div className="flex-1 overflow-y-auto sidebar-scroll pad !pt-0">
					<ErrorState
						type="error"
						title="Unable to Load Subscription Details"
						description="We are unable to display the subscription details at this time. Please try again later."
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full w-full flex flex-col bg-white rounded md:w-sm" id="sidebar_form">
			{/* Content - Scrollable */}
			<div className="flex-1 overflow-y-auto sidebar-scroll pad">
				<div className="flex-shrink-0 pb-6">
					<h1 className="text-base font-semibold text-typo-primary">Products</h1>
				</div>
				{etfData.length === 0 ? (
					<ErrorState
						type="empty"
						title="No Products Yet"
						description="We are curating something exciting here - Check back soon!"
					/>
				) : (
					<div className="space-y-4">
						{etfData.map((etf) => (
							<div
								key={etf.id}
								className={cn(
									"rounded border p-4 shadow-sm relative",
									selectedId === etf.id
										? "border-cgs-blue"
										: "border-stroke-secondary",
									etf.isCompact ? "bg-theme-neutral-095" : "bg-white"
								)}
							>
								{/* Applied Badge - góc trái trên */}
								{etf.applied && (
									<div className="absolute top-0 left-0">
										<div className="bg-status-success text-white text-[10px] font-medium px-2 py-0.5 rounded-tl rounded-br">
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
											"gap-1 px-3 h-6 border border-cgs-blue text-cgs-blue  text-xs rounded flex items-center leading-2",
											selectedId === etf.id
												? "bg-background-selected hover:bg-background-selected cursor-default"
												: "bg-white hover:bg-transparent hover:opacity-80 transition-colors"
										)}
										onClick={() => setSelectedItem(etf)}
									>
										{selectedId === etf.id && <Check className="text-sm" />}
										Details
										{selectedId !== etf.id && (
											<ArrowRight className="text-sm text-cgs-blue" />
										)}
									</Button>
								</div>

								<span className="px-3 py-1 text-typo-secondary text-xs rounded-full border border-stroke-secondary">
									{etf.code}
								</span>

								{/* Details */}
								{!etf.isCompact && (
									<div className="flex flex-col gap-3 mt-6 *:text-xs">
										<div className="flex justify-between items-center">
											<span className=" text-typo-secondary">Issue Price</span>
											<span className=" font-medium text-typo-primary">
												{etf.issuePrice}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className=" text-typo-secondary">Min. Number of Units</span>
											<span className=" font-medium text-typo-primary">
												{etf.minUnits}
											</span>
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
				)}
			</div>
		</div>
	);
}
