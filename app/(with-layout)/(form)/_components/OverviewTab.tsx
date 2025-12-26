import { Check, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "@/components/Image";

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
	const dates: TimelineDate[] = [
		{
			id: "1",
			label: "Opening Date",
			date: "08-Aug-2024",
			time: "09:00 SGT",
			status: "completed",
			daysRemaining: 733,
		},
		{
			id: "2",
			label: "Closing Date",
			date: "08-Aug-2024",
			time: "17:00 SGT",
			status: "completed",
		},
		{
			id: "3",
			label: "Payment Due Date",
			date: "08-Aug-2024",
			time: "17:00 SGT",
			status: "completed",
		},
		{
			id: "4",
			label: "Reserve Date",
			date: "10-Aug-2024",
			time: "17:00 SGT",
			status: "active",
			daysRemaining: 385.09,
		},
		{
			id: "5",
			label: "Closing Date",
			date: "10-Aug-2024",
			time: "17:00 SGT",
			status: "upcoming",
			daysRemaining: 385.09,
		},
		{
			id: "6",
			label: "Listing Date",
			date: "10-Aug-2024",
			time: "17:00 SGT",
			status: "upcoming",
			daysRemaining: 385.09,
		},
	];

	const fundamentals: FundamentalItem[] = [
		{
			key: "Base Currency",
			value: "USD",
			highlighted: true,
		},
		{
			key: "Trading Currency",
			value: "USD, SGD",
		},
		{
			key: "SGC Code",
			value: "GRU (USD), GRO (SGD)",
		},
		{
			key: "Exchange",
			value: "SGX",
			badge: "196",
		},
		{
			key: "Issue Price",
			value: "1.00 USD",
		},
		{
			key: "Brokerage",
			value: "0.25 % (min. 8.00 USD)",
		},
		{
			key: "Admin Fee",
			value: "8.00 USD plus GST",
			highlighted: true,
		},
		{
			key: "Management Fee",
			value: "0.9 %",
		},
		{
			key: "Conversion Rate from Base Currency to SGD",
			value: "1.39",
		},
		{
			key: "Mode of Payment",
			value: "Bank Transfer, PayNow, Telegraphic Transfer, GIRO, Trust Account, Margin Account",
		},
		{
			key: "Minimum Subscription",
			value: "1,000 Unit(s) (increments of 1,000 Unit(s))",
		},
		{
			key: "Excluded/ Specific Investment",
			value: "Excluded Investment Product (EIP)",
		},
	];
	return (
		<div className="space-y-6 h-full md:pr-3">
			{/* Banner */}
			<div className="">
				<Image
					src={"/images/securitiy-overview.png"}
					height={200}
					width={400}
					className="w-full mt-6"
					alt="overview-item"
				/>
			</div>
			<div className="mb-4 md:mb-6">
				<h4 className="text-base md:text-lg font-semibold text-typo-primary mb-2 md:mb-3">
					CGS 3-month SGD Commercial Paper Series
				</h4>
				<p className="text-xs md:text-sm text-typo-secondary leading-relaxed">
					Excellent pace of economic volatility, technological innovation in China continues to
					flourish. With CSI 1000 constituents comprising high-growth and innovative industries that
					align with Made in China 2025 policy goals.
				</p>
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
