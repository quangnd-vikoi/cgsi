"use client";
import { Check } from "lucide-react";
import { cn, formatSingaporeDate, formatSingaporeTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/Image";
import { useProductDetails } from "./ProductDetailsContext";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

type TimelineStatus = "completed" | "active" | "upcoming";

interface TimelineDate {
	id: string;
	label: string;
	date: string;
	time: string;
	status: TimelineStatus;
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
		return {
			date: formatSingaporeDate(isoString, "N/A"),
			time: formatSingaporeTime(isoString),
		};
	};

	const getTimelineConnectorClass = (
		currentStatus: TimelineStatus,
		nextStatus?: TimelineStatus,
	): string => {
		if (currentStatus === "completed" && nextStatus === "completed") {
			return "border-l-2 border-cgs-blue";
		}

		if (currentStatus === "completed" && nextStatus === "active") {
			return "border-l-2 border-dotted border-cgs-blue";
		}

		return "border-l-2 border-dotted border-status-disable-primary";
	};

	// Loading state
	if (loading) {
		return (
			<div className="space-y-6 h-full md:pr-3 p-6">
				<div className="space-y-4">
					<Skeleton className="h-48 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
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
					title="Unable to Load Product Details"
					description="We are unable to display the product details at this time. Please try again later."
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
	const milestoneDates = [
		{
			id: "1",
			label: "Opening Date",
			rawDate: productDetails.startTime,
			date: openingDateTime.date,
			time: openingDateTime.time,
		},
		{
			id: "2",
			label: "Closing Date",
			rawDate: productDetails.endTime,
			date: closingDateTime.date,
			time: closingDateTime.time,
		},
		...(productDetails.paymentDate
			? [
				{
					id: "3",
					label: "Payment Due Date",
					rawDate: productDetails.paymentDate,
					date: paymentDateTime.date,
					time: paymentDateTime.time,
				},
			]
			: []),
		...(productDetails.allocationDate
			? [
				{
					id: "4",
					label: "Allocation Date",
					rawDate: productDetails.allocationDate,
					date: allocationDateTime.date,
					time: allocationDateTime.time,
				},
			]
			: []),
		...(productDetails.acknowledgementDate
			? [
				{
					id: "5",
					label: "Acknowledgement Date",
					rawDate: productDetails.acknowledgementDate,
					date: acknowledgementDateTime.date,
					time: acknowledgementDateTime.time,
				},
			]
			: []),
		...(productDetails.listingDate
			? [
				{
					id: "6",
					label: "Listing Date",
					rawDate: productDetails.listingDate,
					date: listingDateTime.date,
					time: listingDateTime.time,
				},
			]
			: []),
	];
	const now = Date.now();
	const currentMilestoneIndex = milestoneDates.findIndex((milestone) => {
		const milestoneDate = new Date(milestone.rawDate);
		return !Number.isNaN(milestoneDate.getTime()) && milestoneDate.getTime() >= now;
	});
	const dates: TimelineDate[] = milestoneDates.map((milestone, index) => ({
		id: milestone.id,
		label: milestone.label,
		date: milestone.date,
		time: milestone.time,
		status:
			currentMilestoneIndex === -1
				? "completed"
				: index < currentMilestoneIndex
					? "completed"
					: index === currentMilestoneIndex
						? "active"
						: "upcoming",
	}));

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
					value: `${productDetails.brokerageFee}%${productDetails.minBrokerageFee
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
					value: `${productDetails.transferFee} ${productDetails.baseCurrency || ""}${productDetails.gst ? " plus GST" : ""
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
			value: `${productDetails.minQty.toLocaleString()} Unit(s)${productDetails.incrementQty
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
					<p className="text-base text-typo-secondary leading-relaxed whitespace-pre-line">
						{productDetails.content1}
					</p>
				)}
			</div>
			{/* Timeline */}
			<div className="p-4 bg-background-section rounded">
				<div className="relative">
					{/* Timeline items */}
					<div className="space-y-5">
						{dates.map((item, index) => {
							const isLast = index === dates.length - 1;
							const nextItem = dates[index + 1];

							return (
								<div key={item.id} className="relative flex items-start">
									{/* Vertical line for each item */}
									{!isLast && (
										<div
											className={cn(
												"absolute left-[9px] top-5 w-0.5",
												getTimelineConnectorClass(item.status, nextItem?.status),
											)}
											style={{ height: "calc(100% + 20px)" }}
										></div>
									)}

									<div className="flex-1 flex items-start justify-between">
										<div className="flex items-center gap-2">
											<div
												className={cn(
													"relative z-10 flex items-center justify-center w-5 h-5 rounded-full border-2",
													item.status === "completed" && "bg-cgs-blue border-cgs-blue",
													item.status === "active" && "bg-white border-cgs-blue",
													item.status === "upcoming" &&
														"bg-white border-status-disable-primary",
												)}
											>
												{item.status === "completed" ? (
													<Check className="w-3 h-3 text-white" strokeWidth={4} />
												) : item.status === "active" ? (
													<div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cgs-blue" />
												) : (
													<Check
														className="w-3 h-3 text-status-disable-primary"
														strokeWidth={4}
													/>
												)}
											</div>
											<span className="text-typo-primary text-sm font-medium">
												{item.label}
											</span>
										</div>
										<div className="text-right">
											<div className="text-typo-secondary text-sm font-medium">
												{item.date}
											</div>
											<div className="text-xs text-typo-tertiary">{item.time}</div>
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

			<div className="rounded pb-4">
				<h5 className="text-lg font-semibold text-typo-primary">Fundamentals</h5>
				<table className="w-full mt-4 text-xs">
					<tbody className="">
						{fundamentals.map((item, index) => (
							<tr key={index} className="">
								<td className={cn("py-2 w-1/2 text-typo-secondary font-normal text-base")}>
									{item.key}
								</td>
								<td className="text-typo-primary font-medium text-base text-right">
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
