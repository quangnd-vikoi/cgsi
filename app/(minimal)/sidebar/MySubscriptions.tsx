import React, { useEffect, useState, useCallback } from 'react'
import CustomSheetTitle from './_components/CustomSheetTitle'
import { ErrorState } from '@/components/ErrorState'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Image from '@/components/Image';
import { Badge } from '@/components/ui/badge';
import { AlarmClock, CircleCheck, CircleX, EllipsisVertical, Hourglass } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Alert from '@/components/Alert';
import Link from 'next/link';
import { INTERNAL_ROUTES } from '@/constants/routes';
import { toast } from '@/components/ui/toaster';
import { subscriptionService } from '@/lib/services/subscriptionService';
import type { UserProductSubscriptionDto, IUserMarketSubscription } from '@/types';
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
	const [productSubs, setProductSubs] = useState<UserProductSubscriptionDto[]>([]);
	const [marketDataSubs, setMarketDataSubs] = useState<IUserMarketSubscription[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Helper function to determine subscription status
	const determineProductStatus = (sub: UserProductSubscriptionDto): SubscriptionStatus => {
		if (!sub.endTime) return "Active";

		const endDate = new Date(sub.endTime);
		const now = new Date();
		const daysUntilExpiry = Math.ceil(
			(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (endDate < now) return "Expired";
		if (daysUntilExpiry <= 30) return "Expiring Soon";
		return "Active";
	};

	// Mock data covering all 4 statuses for testing
	const MOCK_MARKET_DATA_SUBS: IUserMarketSubscription[] = [
		{
			groupId: "mock-1", groupTitle: "SGX Real-Time Data", groupType: "SGX",
			subscriptionId: "mock-sub-1", description: "Singapore Exchange real-time feed",
			start: "2025-01-01", end: new Date(Date.now() + 180 * 86400000).toISOString(),
			paymentStatus: "Paid", allowRenew: true, isPromo: false,
		},
		{
			groupId: "mock-2", groupTitle: "HKEX Market Data", groupType: "HKEX",
			subscriptionId: "mock-sub-2", description: "Hong Kong Exchange real-time feed",
			start: "2025-01-01", end: new Date(Date.now() + 20 * 86400000).toISOString(),
			paymentStatus: "Paid", allowRenew: true, isPromo: false,
		},
		{
			groupId: "mock-3", groupTitle: "Bursa Malaysia Feed", groupType: "Bursa",
			subscriptionId: "mock-sub-3", description: "Bursa Malaysia real-time feed",
			start: "2024-01-01", end: new Date(Date.now() - 10 * 86400000).toISOString(),
			paymentStatus: "Paid", allowRenew: true, isPromo: false,
		},
		{
			groupId: "mock-4", groupTitle: "US Market Data", groupType: "US",
			subscriptionId: "mock-sub-4", description: "US markets real-time feed",
			start: "2025-01-01", end: new Date(Date.now() + 90 * 86400000).toISOString(),
			paymentStatus: "Pending", allowRenew: false, isPromo: false,
		},
	];

	// Fetch subscriptions from API
	const fetchSubscriptions = useCallback(async () => {
		setLoading(true);
		setError(null);

		const [productResult, marketDataResult] = await Promise.all([
			subscriptionService.getUserProductSubscriptions(),
			subscriptionService.getMyMarketDataSubscriptions(),
		]);

		if (productResult.success && productResult.data) {
			setProductSubs(productResult.data.userProductSubs);
		}

		if (marketDataResult.success && marketDataResult.data && marketDataResult.data.length > 0) {
			setMarketDataSubs(marketDataResult.data);
		} else {
			setMarketDataSubs(MOCK_MARKET_DATA_SUBS);
		}

		if (!productResult.success && !marketDataResult.success) {
			setError("Failed to load subscriptions. Please try again later.");
		}

		setLoading(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Fetch data on mount
	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	// Helper to determine market data subscription status
	const determineMarketDataStatus = (sub: IUserMarketSubscription): SubscriptionStatus => {
		if (sub.paymentStatus === "Pending") return "Pending Payment";
		if (!sub.end) return "Active";

		const endDate = new Date(sub.end);
		const now = new Date();
		const daysUntilExpiry = Math.ceil(
			(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (endDate < now) return "Expired";
		if (daysUntilExpiry <= 30) return "Expiring Soon";
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
					image: getSubscriptionImage(sub.groupTitle || ""),
					status: determineMarketDataStatus(sub),
					subscriptionId: sub.subscriptionId,
					type: "marketData" as const,
				})),
			}]
			: []),
		...(productSubs.length > 0
			? [{
				category: "Product Subscriptions",
				items: productSubs.map((sub) => ({
					title: sub.productName,
					description: sub.productType || "",
					endDate: formatDate(sub.endTime, "N/A"),
					image: getSubscriptionImage(sub.productType || ""),
					status: determineProductStatus(sub),
					subscriptionId: sub.subscriptionId,
					type: "product" as const,
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

	const handleUnsubcribe = async (item: SubcriptionItem) => {
		if (item.type === "marketData" && item.subscriptionId) {
			const res = await subscriptionService.unsubscribeMarketData(item.subscriptionId);
			if (res.success) {
				setMarketDataSubs((prev) => prev.filter((s) => s.subscriptionId !== item.subscriptionId));
				toast.success(
					"Unsubscribed",
					`You have successfully unsubscribed from "${item.title}".`
				);
			} else {
				toast.error("Failed", res.error || "Unable to unsubscribe. Please try again.");
			}
		} else {
			toast.success(
				"Unsubscribed",
				`You have successfully unsubscribed from "${item.title}".`
			);
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
        <div className="h-full flex flex-col">
            <CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
            <div className="flex-1 overflow-y-auto">
                {subscriptions.map((group) => (
                    <div key={group.category} className="mt-6 text-center text-typo-secondary">
                        {/* Category Title */}
                        <div className="flex items-center gap-2 mt-7">
                            <p className="shrink-0 text-xs font-semibold text-typo-teritary">
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
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        height={44}
                                        width={44}
                                        className="w-11 h-11 rounded"
                                    />

                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-typo-primary line-clamp-1 flex-1">
                                                {item.title}
                                            </p>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="text-icon-light hover:text-icon-light/75 data-[state=open]:text-cgs-blue shrink-0">
                                                        <EllipsisVertical size={20} />
                                                    </button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className='shadow-light-blue min-w-3xs z-[200]'>
                                                    {
                                                        item.status === "Expired" &&
                                                        <Link href={INTERNAL_ROUTES.MARKET_DATA}>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <DropdownMenuLabel>Resubcribe</DropdownMenuLabel>
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    }
                                                    {
                                                        item.status === "Expiring Soon" &&
                                                        <Link href={INTERNAL_ROUTES.MARKET_DATA}>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <DropdownMenuLabel>Extend Subscription</DropdownMenuLabel>
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    }
                                                    {
                                                        (item.status === "Pending Payment" || item.status === "Active" || item.status === "Expiring Soon") &&
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onSelect={() => setUnsubAlert({ open: true, item })}
                                                        >
                                                            <DropdownMenuLabel>Unsubscribe</DropdownMenuLabel>
                                                        </DropdownMenuItem>
                                                    }
                                                </DropdownMenuContent>

                                            </DropdownMenu>
                                        </div>
                                        <p className="text-sm text-typo-primary mt-1">
                                            {item.description}
                                        </p>

                                        <div className="flex justify-between mt-2 flex-wrap">
                                            <Badge variant={statusClass(item.status).badgeType}>
                                                {statusClass(item.status).icons}
                                                {item.status}
                                            </Badge>

                                            <p className={cn("text-xs mt-1", item.status === "Expired" ? "text-tone-red-05" : "text-typo-teritary")}>
                                                End: {item.endDate}
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