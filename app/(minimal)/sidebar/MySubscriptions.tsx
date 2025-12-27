import React, { useEffect, useState, useCallback } from 'react'
import CustomSheetTitle from './_components/CustomSheetTitle'
import { ErrorState } from '@/components/ErrorState'
import { Separator } from '@/components/ui/separator'
import Image from '@/components/Image';
import { Badge } from '@/components/ui/badge';
import { AlarmClock, CircleCheck, CircleX, EllipsisVertical, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import type { UserProductSubscriptionDto } from '@/types';
type SubscriptionStatus = 'Pending Payment' | 'Expiring Soon' | 'Expired' | 'Active';

type SubcriptionItem = {
    title: string;
    description: string;
    endDate: string;
    image: string;
    status: SubscriptionStatus;
};

type SubscriptionGroup = {
    category: string;
    items: SubcriptionItem[];
};

// Helper function to get subscription image based on category
const getSubscriptionImage = (category: string, index: number): string => {
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

	// Fetch subscriptions from API
	const fetchSubscriptions = useCallback(async () => {
		setLoading(true);
		setError(null);

		// NOTE: Only product subscriptions are fetched
		// Market data subscription endpoints do NOT exist in the API
		const result = await subscriptionService.getUserProductSubscriptions();

		if (result.success && result.data) {
			setProductSubs(result.data.userProductSubs);
		} else {
			setError(result.error || "Failed to load subscriptions. Please try again later.");
		}

		setLoading(false);
	}, []);

	// Fetch data on mount
	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	// Map API data to UI structure
	// NOTE: Market data subscriptions removed - endpoints do not exist
	const subscriptions: SubscriptionGroup[] = [
		{
			category: "Product Subscriptions",
			items: productSubs.map((sub, index) => ({
				title: sub.productName,
				description: sub.productType || "",
				endDate: sub.endTime
					? new Date(sub.endTime).toLocaleDateString("en-GB", {
							day: "2-digit",
							month: "short",
							year: "numeric",
					  })
					: "N/A",
				image: getSubscriptionImage(sub.productType || "", index),
				status: determineProductStatus(sub),
			})),
		},
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

	const handleUnsubcribe = (item: SubcriptionItem) => {
		console.log("Unsubscribed from ", item.title);
		toast.success(
			"Unsubscribed",
			`You have successfully unsubscribed from "${item.title} - ${item.description}".`
		);
	};

	// Loading state
	if (loading) {
		return (
			<div className="h-full">
				<CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
				<div className="flex items-center justify-center pt-20">
					<div className="space-y-4 p-6 w-full">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex gap-3 animate-pulse">
								<div className="w-11 h-11 bg-gray-200 rounded"></div>
								<div className="flex-1">
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
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
					title="Oops, Something Went Wrong"
					description={error}
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
                                                    <button className="text-icon-light hover:text-icon-light/75 data-[state=open]:text-enhanced-blue shrink-0">
                                                        <EllipsisVertical size={20} />
                                                    </button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className='shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] min-w-3xs'>
                                                    {
                                                        item.status === "Expired" &&
                                                        <Link href={INTERNAL_ROUTES.MARKET_DATA}>
                                                            <DropdownMenuItem>
                                                                <DropdownMenuLabel>Resubcribe</DropdownMenuLabel>
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    }
                                                    {
                                                        (item.status === "Expiring Soon" || item.status === "Active") &&
                                                        <Link href={INTERNAL_ROUTES.MARKET_DATA}>
                                                            <DropdownMenuItem>
                                                                <DropdownMenuLabel>Extend Subscription</DropdownMenuLabel>
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    }
                                                    {
                                                        (item.status === "Pending Payment" || item.status === "Active" || item.status === "Expiring Soon") &&
                                                        <Alert
                                                            trigger={
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <DropdownMenuLabel>Unsubscribe</DropdownMenuLabel>
                                                                </DropdownMenuItem>
                                                            }
                                                            title="Unsubscribe?"
                                                            description={
                                                                <p>
                                                                    Are you sure you want to unsubscribe from this &quot;{item.title} - {item.description}&quot;?
                                                                </p>
                                                            }
                                                            actionText="Confirm"
                                                            cancelText="Cancel"
                                                            onAction={() => handleUnsubcribe(item)}
                                                        />
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
        </div>
    )
}

export default MySubscriptions