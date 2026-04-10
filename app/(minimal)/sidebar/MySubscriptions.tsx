import React, { useEffect, useState, useCallback } from 'react'
import CustomSheetTitle from './_components/CustomSheetTitle'
import { ErrorState } from '@/components/ErrorState'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import SubscriptionThumbnail from '@/components/SubscriptionThumbnail';
import { Badge } from '@/components/ui/badge';
import { AlarmClock, CircleCheck, CircleX, EllipsisVertical, Hourglass, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Alert from '@/components/Alert';
import { useRouter, usePathname } from 'next/navigation';
import { INTERNAL_ROUTES } from '@/constants/routes';
import { toast } from '@/components/ui/toaster';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { useSheetStore } from '@/stores/sheetStore';
import { useMarketDataCatalogStore } from '@/stores/marketDataCatalogStore';
import type { /* UserProductSubscriptionDto, */ IUserMarketSubscription } from '@/types';
type SubscriptionStatus = 'Pending Payment' | 'Expiring Soon' | 'Expired' | 'Active';

type SubcriptionItem = {
	title: string;
	description: string;
	endDate: string;
	image: string;
	status: SubscriptionStatus;
	subscriptionId?: string;
	type?: "product" | "marketData";
};

type SubscriptionGroup = {
	category: string;
	items: SubcriptionItem[];
};

// Helper function to get subscription image based on category
const getSubscriptionImage = (category: string): string => {
	const SUBSCRIPTION_IMAGES: Record<string, string> = {
		sgx: "/images/market-data/item-2.png",
		hkex: "/images/market-data/item-3.png",
		bursa: "/images/market-data/item-4.png",
		malaysia: "/images/market-data/item-4.png",
		thailand: "/images/market-data/item-5.png",
		set: "/images/market-data/item-5.png",
		us: "/images/market-data/item-6.png",
		research: "/images/market-data/item-1.png",
		default: "/images/market-data/item-1.png",
	};

	const key = Object.keys(SUBSCRIPTION_IMAGES).find((k) =>
		category.toLowerCase().includes(k.toLowerCase())
	);
	return (
		SUBSCRIPTION_IMAGES[key as keyof typeof SUBSCRIPTION_IMAGES] ||
		SUBSCRIPTION_IMAGES.default
	);
};

const MySubscriptions = () => {
	// State management
	// const [productSubs, setProductSubs] = useState<UserProductSubscriptionDto[]>([]);
	const { closeSheet } = useSheetStore();
	const router = useRouter();
	const pathname = usePathname();
	const loadCatalog = useMarketDataCatalogStore((state) => state.loadCatalog);

	const handleNavigateToMarketData = () => {
		closeSheet();
		if (pathname === INTERNAL_ROUTES.MARKET_DATA) {
			window.dispatchEvent(new Event("market-data:reset"));
		} else {
			router.push(INTERNAL_ROUTES.MARKET_DATA);
		}
	};
	const [marketDataSubs, setMarketDataSubs] = useState<IUserMarketSubscription[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Helper function to determine subscription status
	// const determineProductStatus = (sub: UserProductSubscriptionDto): SubscriptionStatus => {
	// 	if (!sub.endTime) return "Active";
	//
	// 	const endDate = new Date(sub.endTime);
	// 	const now = new Date();
	// 	const daysUntilExpiry = Math.ceil(
	// 		(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
	// 	);
	//
	// 	if (endDate < now) return "Expired";
	// 	if (daysUntilExpiry <= 90) return "Expiring Soon";
	// 	return "Active";
	// };

	// Fetch subscriptions from API
	const fetchSubscriptions = useCallback(async () => {
		setLoading(true);
		setError(null);

		const marketDataResult = await subscriptionService.getMyMarketDataSubscriptions();

		if (marketDataResult.success && marketDataResult.data) {
			setMarketDataSubs(marketDataResult.data);
		}

		if (!marketDataResult.success) {
			setError("Failed to load subscriptions. Please try again later.");
		}

		setLoading(false);
	}, []);

	// Fetch data on mount
	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	// Helper to determine market data subscription status
	const determineMarketDataStatus = (sub: IUserMarketSubscription): SubscriptionStatus => {
		if (sub.paymentStatus === "PENDING") return "Pending Payment";
		if (!sub.end) return "Active";

		const endDate = new Date(sub.end);
		const now = new Date();
		const daysUntilExpiry = Math.ceil(
			(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (endDate < now) return "Expired";
		if (daysUntilExpiry <= 90) return "Expiring Soon";
		return "Active";
	};

	// Map API data to UI structure
	const subscriptions: SubscriptionGroup[] = [
		...(marketDataSubs.length > 0
			? [{
				category: "Market Data Subscriptions",
				items: marketDataSubs.map((sub) => ({
					title: sub.groupTitle,
					description: sub.description || sub.groupType || "",
					endDate: formatDate(sub.end, "N/A"),
					image: sub.groupImageUrl || getSubscriptionImage(sub.groupTitle || ""),
					status: determineMarketDataStatus(sub),
					subscriptionId: sub.subscriptionId,
					type: "marketData" as const,
				})),
			}]
			: []),
	];

	function statusClass(status: SubscriptionStatus): {
		badgeType:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "success"
		| "expiring"
		| null
		| undefined;
		icons: React.ReactNode;
	} {
		switch (status) {
			case "Pending Payment":
				return {
					badgeType: "default",
					icons: <Hourglass />,
				};
			case "Expiring Soon":
				return {
					badgeType: "expiring",
					icons: <AlarmClock />,
				};
			case "Expired":
				return {
					badgeType: "destructive",
					icons: <CircleX />,
				};
			case "Active":
				return {
					badgeType: "success",
					icons: <CircleCheck />,
				};
		}
	}

	const [unsubAlert, setUnsubAlert] = useState<{ open: boolean; item: SubcriptionItem | null }>({ open: false, item: null });
	const [unsubscribing, setUnsubscribing] = useState(false);

	const handleUnsubcribe = async (item: SubcriptionItem) => {
		setUnsubscribing(true);
		try {
			if (item.type === "marketData" && item.subscriptionId) {
				const res = await subscriptionService.unsubscribeMarketData(item.subscriptionId);
				if (res.success) {
					void loadCatalog({ force: true });
					setMarketDataSubs((prev) => prev.filter((s) => s.subscriptionId !== item.subscriptionId));
					toast.success(
						"Unsubscribed",
						`You have successfully unsubscribed from "${item.title}".`
					);
				} else {
					toast.error("Unable to Unsubscribe", res.error || "We could not process your request at this time. Please try again later.");
				}
			} else {
				toast.success(
					"Unsubscribed",
					`You have successfully unsubscribed from "${item.title}".`
				);
			}
		} finally {
			setUnsubscribing(false);
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="h-full">
				<CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
				<div className="flex items-center justify-center pt-20">
					<div className="space-y-4 p-6 w-full">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex gap-3">
								<Skeleton className="w-11 h-11 rounded" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
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
			<div className="h-full">
				<CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
				<ErrorState
					title="Unable to Load Subscriptions"
					description="We are unable to display your subscriptions at this time. Please try again later."
					type="error"
				/>
			</div>
		);
	}

	// Empty state
	if (
		subscriptions.every((group) => group.items.length === 0)
	) {
		return (
			<div className="h-full">
				<CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
				<ErrorState
					title="No Subscription Records Found"
					description="Subscribe and find your active subscriptions here!"
					type="empty"
				/>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col relative">
			{unsubscribing && (
				<div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-cgs-blue" />
				</div>
			)}
			<CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
			<div className="flex-1 overflow-y-auto">
				{subscriptions.map((group) => (
					<div key={group.category} className="mt-6 text-center text-typo-secondary">
						{/* Category Title */}
						<div className="flex items-center gap-2 mt-7">
							<p className="shrink-0 text-xs md:text-sm font-semibold md:font-medium text-typo-teritary">
								{group.category}
							</p>
							<Separator className="flex-1 border border-stroke-secondary" />
						</div>

						{/* Items */}
						<div className="mt-4">
							{group.items.map((item, index) => (
								<div
									key={index}
									className="flex gap-3 py-4"
								>
									<SubscriptionThumbnail src={item.image} alt={item.title} />

									<div className="flex-1 text-left">
										<div className="flex justify-between items-start">
											<p className="text-sm md:text-base font-medium text-typo-primary line-clamp-1 flex-1">
												{item.title}
											</p>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button className="text-icon-light hover:text-icon-light/75 data-[state=open]:text-cgs-blue shrink-0">
														<EllipsisVertical size={20} />
													</button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end" className='shadow-light-blue min-w-3xs z-[200] px-0 py-1'>
													{
														item.status === "Expired" &&
														<DropdownMenuItem
															className="cursor-pointer px-3 py-[10px] rounded-none"
															onSelect={handleNavigateToMarketData}
														>
															Resubscribe
														</DropdownMenuItem>
													}
													{
														item.status === "Expiring Soon" &&
														<DropdownMenuItem
															className="cursor-pointer px-3 py-[10px] rounded-none"
															onSelect={handleNavigateToMarketData}
														>
															Extend Subscription
														</DropdownMenuItem>
													}
													{
														(item.status === "Pending Payment" || item.status === "Active" || item.status === "Expiring Soon") &&
														<DropdownMenuItem
															className="cursor-pointer px-3 py-[10px] rounded-none"
															onSelect={() => setUnsubAlert({ open: true, item })}
														>
															Unsubscribe
														</DropdownMenuItem>
													}
												</DropdownMenuContent>

											</DropdownMenu>
										</div>
										<p className="mt-1 text-sm text-typo-secondary">
											{item.description}
										</p>

										<div className="flex justify-between mt-2 flex-wrap">
											<Badge variant={statusClass(item.status).badgeType}>
												{statusClass(item.status).icons}
												{item.status}
											</Badge>

											<p className={cn("mt-1 text-xs md:text-sm md:font-medium", item.status === "Expired" ? "text-tone-red-05" : "text-typo-teritary")}>
												Expiry Date: {item.endDate}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			<Alert
				open={unsubAlert.open}
				onOpenChange={(open) => setUnsubAlert((prev) => ({ ...prev, open }))}
				title="Unsubscribe?"
				description={
					<p>
						Are you sure you want to unsubscribe from &quot;{unsubAlert.item?.title} - {unsubAlert.item?.description}&quot;?
					</p>
				}
				actionText="Confirm"
				cancelText="Cancel"
				onAction={() => {
					if (unsubAlert.item) handleUnsubcribe(unsubAlert.item);
					setUnsubAlert({ open: false, item: null });
				}}
				onCancel={() => setUnsubAlert({ open: false, item: null })}
			/>
		</div>
	)
}

export default MySubscriptions
