"use client";
import { Check, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/Image";
import { useProductDetails } from "./ProductDetailsContext";
import { ErrorState } from "@/components/ErrorState";

interface TimelineDate {
	id: string;
	label: string;
	date: string;
	time: string;
	status: "completed" | "active" | "upcoming";
	daysRemaining?: number;
}

interface FundamentalItem {
	key: string;
	value: string;
	highlighted?: boolean;
	badge?: string;
}

const OverviewTab = () => {
	const { productDetails, loading, error } = useProductDetails();

	// Format date-time to display format
	const formatDateTime = (isoString?: string): { date: string; time: string } => {
		if (!isoString) return { date: "N/A", time: "" };
		const date = new Date(isoString);
		return {
			date: date.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}),
			time: date.toLocaleTimeString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				timeZoneName: "short",
			}),
		};
	};

	// Determine timeline status based on current date
	const getTimelineStatus = (dateStr?: string): "completed" | "active" | "upcoming" => {
		if (!dateStr) return "upcoming";
		const date = new Date(dateStr);
		const now = new Date();
		if (date < now) return "completed";
		const daysDiff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		if (daysDiff <= 7) return "active";
		return "upcoming";
	};

	// Loading state
	if (loading) {
		return (
			<div className="space-y-6 h-full md:pr-3 p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-48 bg-gray-200 rounded w-full"></div>
					<div className="h-4 bg-gray-200 rounded w-3/4"></div>
					<div className="h-3 bg-gray-200 rounded w-1/2"></div>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !productDetails) {
		return (
			<div className="h-full flex items-center justify-center">
				<ErrorState
					type="error"
					title="Failed to Load Product Details"
					description={error || "Unable to load product information. Please try again."}
				/>
			</div>
		);
	}

	const openingDateTime = formatDateTime(productDetails.startTime);
	const closingDateTime = formatDateTime(productDetails.endTime);
	const paymentDateTime = formatDateTime(productDetails.paymentDate);
	const listingDateTime = formatDateTime(productDetails.listingDate);
	const allocationDateTime = formatDateTime(productDetails.allocationDate);
	const acknowledgementDateTime = formatDateTime(productDetails.acknowledgementDate);
	const dates: TimelineDate[] = [
		{
			id: "1",
			label: "Opening Date",
			date: openingDateTime.date,
			time: openingDateTime.time,
			status: getTimelineStatus(productDetails.startTime),
		},
		{
			id: "2",
			label: "Closing Date",
			date: closingDateTime.date,
			time: closingDateTime.time,
			status: getTimelineStatus(productDetails.endTime),
		},
		...(productDetails.paymentDate
			? [
					{
						id: "3",
						label: "Payment Due Date",
						date: paymentDateTime.date,
						time: paymentDateTime.time,
						status: getTimelineStatus(productDetails.paymentDate),
					},
			  ]
			: []),
		...(productDetails.allocationDate
			? [
					{
						id: "4",
						label: "Allocation Date",
						date: allocationDateTime.date,
						time: allocationDateTime.time,
						status: getTimelineStatus(productDetails.allocationDate),
					},
			  ]
			: []),
		...(productDetails.acknowledgementDate
			? [
					{
						id: "5",
						label: "Acknowledgement Date",
						date: acknowledgementDateTime.date,
						time: acknowledgementDateTime.time,
						status: getTimelineStatus(productDetails.acknowledgementDate),
					},
			  ]
			: []),
		...(productDetails.listingDate
			? [
					{
						id: "6",
						label: "Listing Date",
						date: listingDateTime.date,
						time: listingDateTime.time,
						status: getTimelineStatus(productDetails.listingDate),
					},
			  ]
			: []),
	];

	const fundamentals: FundamentalItem[] = [
		...(productDetails.baseCurrency
			? [
					{
						key: "Base Currency",
						value: productDetails.baseCurrency,
						highlighted: true,
					},
			  ]
			: []),
		...(productDetails.tradingCurrency
			? [
					{
						key: "Trading Currency",
						value: productDetails.tradingCurrency,
					},
			  ]
			: []),
		{
			key: "Stock Code",
			value: `${productDetails.stockCode}`,
		},
		{
			key: "Exchange",
			value: productDetails.exchangeCode,
		},
		{
			key: "Issue Price",
			value: `${productDetails.issuePrice} ${productDetails.baseCurrency || ""}`,
		},
		...(productDetails.brokerageFee !== undefined
			? [
					{
						key: "Brokerage",
						value: `${productDetails.brokerageFee}%${
							productDetails.minBrokerageFee
								? ` (min. ${productDetails.minBrokerageFee} ${productDetails.baseCurrency || ""})`
								: ""
						}`,
					},
			  ]
			: []),
		...(productDetails.transferFee !== undefined
			? [
					{
						key: "Admin Fee",
						value: `${productDetails.transferFee} ${productDetails.baseCurrency || ""}${
							productDetails.gst ? " plus GST" : ""
						}`,
						highlighted: true,
					},
			  ]
			: []),
		...(productDetails.managementFee !== undefined
			? [
					{
						key: "Management Fee",
						value: `${productDetails.managementFee}%`,
					},
			  ]
			: []),
		...(productDetails.conversionRate !== undefined
			? [
					{
						key: "Conversion Rate from Base Currency to SGD",
						value: `${productDetails.conversionRate}`,
					},
			  ]
			: []),
		...(productDetails.paymentMode
			? [
					{
						key: "Mode of Payment",
						value: productDetails.paymentMode,
					},
			  ]
			: []),
		{
			key: "Minimum Subscription",
			value: `${productDetails.minQty.toLocaleString()} Unit(s)${
				productDetails.incrementQty
					? ` (increments of ${productDetails.incrementQty.toLocaleString()} Unit(s))`
					: ""
			}`,
		},
		...(productDetails.excludedInvestment
			? [
					{
						key: "Excluded/ Specific Investment",
						value: productDetails.excludedInvestment,
					},
			  ]
			: []),
	];
	return (
		<div className="space-y-6 h-full md:pr-3">
			{/* Banner */}
			{productDetails.bannerUrl && (
				<div className="">
					<Image
						src={productDetails.bannerUrl}
						height={200}
						width={400}
						className="w-full mt-6"
						alt={productDetails.productName}
					/>
				</div>
			)}
			<div className="mb-4 md:mb-6">
				<h4 className="text-base md:text-lg font-semibold text-typo-primary mb-2 md:mb-3">
					{productDetails.productName}
				</h4>
				{productDetails.content1 && (
					<p className="text-xs md:text-sm text-typo-secondary leading-relaxed whitespace-pre-line">
						{productDetails.content1}
					</p>
				)}
			</div>
			{/* Timeline */}
			<div className="p-4 bg-background-section rounded-lg">
				<div className="relative">
					{/* Timeline items */}
					<div className="space-y-5">
						{dates.map((item, index) => {
							const isLast = index === dates.length - 1;
							const nextItem = dates[index + 1];
							const isNextComing = nextItem?.status === "upcoming";

							return (
								<div key={item.id} className="relative flex items-start">
									{/* Vertical line for each item */}
									{!isLast && (
										<div
											className={`absolute left-[9px] top-5 w-0.5 ${isNextComing
													? "border-l-2 border-dashed border-status-disable-primary bg-transparent"
													: "bg-enhanced-blue"
												}`}
											style={{ height: "calc(100% + 20px)" }}
										></div>
									)}

									<div className="flex-1 flex items-start justify-between">
										<div className="flex items-center gap-2">
											<div
												className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border-2 ${item.status === "completed"
														? "bg-enhanced-blue border-enhanced-blue"
														: item.status === "active"
															? "bg-white border-enhanced-blue"
															: "bg-white border-status-disable-primary"
													}`}
											>
												{item.status === "completed" ? (
													<Check className="w-5 h-5 text-white" />
												) : item.status === "active" ? (
													<Dot
														strokeWidth={10}
														className="w-5 h-5 text-enhanced-blue"
													/>
												) : (
													<Check className="w-5 h-5 text-status-disable-primary" />
												)}
											</div>
											<span className="text-typo-primary text-xs font-medium">
												{item.label}
											</span>
										</div>
										<div className="text-right">
											<div className="text-typo-secondary text-xs font-medium">
												{item.date}
											</div>
											<div className="text-[10px] text-typo-tertiary">{item.time}</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<Separator className="mt-6" />
			{/* Fundamental */}

			<div className="rounded-lg pb-4">
				<h5 className="text-base font-semibold text-typo-primary">Fundamentals</h5>
				<table className="w-full mt-4 text-xs">
					<tbody className="">
						{fundamentals.map((item, index) => (
							<tr key={index} className="">
								<td className={cn("py-2 w-1/2 text-typo-secondary font-normal text-sm")}>
									{item.key}
								</td>
								<td className="text-typo-primary font-medium text-sm text-right">
									{item.value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OverviewTab;
