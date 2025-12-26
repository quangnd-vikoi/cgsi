import React from 'react'
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

export const subscriptions: SubscriptionGroup[] = [
    {
        category: "Research Articles",
        items: [
            {
                title: "CGSI Research",
                description: "3 Months",
                endDate: "22-Feb-2026",
                image: "/images/market-data/item-1.png",
                status: "Pending Payment",
            },
        ],
    },
    {
        category: "Market Data",
        items: [
            {
                title: "Singapore SGX Live Feed + Market Depth",
                description: "Promo till 31-Dec-2025",
                endDate: "31-Dec-2025",
                image: "/images/market-data/item-2.png",
                status: "Expiring Soon",
            },
            {
                title: "Hong Kong HKEX Live Feed + Market Depth",
                description: "6 Months",
                endDate: "26-Oct-2025",
                image: "/images/market-data/item-3.png",
                status: "Expired",
            },
            {
                title: "[Non-Pro Only] Malaysia BURSA Live Feed",
                description: "Promo 6 Months",
                endDate: "01-Apr-2026",
                image: "/images/market-data/item-4.png",
                status: "Active",
            },
            {
                title: "[Non-Pro Only] Thailand SET Live Feed",
                description: "Promo 6 Months",
                endDate: "01-Sep-2025",
                image: "/images/market-data/item-5.png",
                status: "Expired",
            },
            {
                title: "[Non-Pro Only] US Live Feed",
                description: "Promo 6 Months",
                endDate: "01-Jul-2026",
                image: "/images/market-data/item-6.png",
                status: "Active",
            },
        ],
    },
];

const MY_SUBSCRIPTIONS =
{
    research_articles: [
        {
            id: 1,
            title: "CGSI Research",
            description: "From SGD 16.67/month",
            date: "25-Aug-2025",
            author: "Rayrayhan Abhirama",
            status: "Active" as SubscriptionStatus,

        },
        {
            id: 2,
            title: "Hong Kong HKEX Live Feed",
            description: "From SGD 16.67/month",
            date: "25-Aug-2025",
            author: "Rayrayhan Abhirama",
            status: "Active" as SubscriptionStatus,
        },
        {
            id: 3,
            title: "Hong Kong HKEX Live Feed",
            description: "From SGD 16.67/month",
            date: "25-Aug-2025",
            author: "Rayrayhan Abhirama",
            tag: "Idea of the Day",
            status: "Pending Payment" as SubscriptionStatus,
        }
    ],
    market_data: [
        {
            id: 1,
            title: "Singapore SGX Live Feed + Market Depth",
            description: "From SGD 16.67/month",
            date: "25-Aug-2025",
            author: "Rayrayhan Abhirama",
            tag: "Idea of the Day",
            url: "https://www.cgsi.com.sg/market-data/idea-of-the-day-1"
        },
        {
            id: 2,
            title: "Hong Kong HKEX Live Feed",
            description: "From SGD 16.67/month",
            date: "25-Aug-2025",
            author: "Rayrayhan Abhirama",
            tag: "Idea of the Day",
            url: "https://www.cgsi.com.sg/market-data/idea-of-the-day-2"
        },
        {
            id: 3,
            title: "Hong Kong HKEX Live Feed",
            description: "From SGD 16.67/month",
            date: "25-Aug-2025",
            author: "Rayrayhan Abhirama",
            tag: "Idea of the Day",
            url: "https://www.cgsi.com.sg/market-data/idea-of-the-day-3"
        }]
}

const MySubscriptions = () => {

    function statusClass(status: SubscriptionStatus): { badgeType: "default" | "secondary" | "destructive" | "outline" | "success" | "expiring" | null | undefined; icons: React.ReactNode } {

        switch (status) {
            case "Pending Payment":
                return {
                    badgeType: "default",
                    icons: <Hourglass />
                }
            case "Expiring Soon":
                return {
                    badgeType: "expiring",
                    icons: <AlarmClock />
                };
            case "Expired":
                return {
                    badgeType: "destructive",
                    icons: <CircleX />
                };
            case "Active":
                return {
                    badgeType: "success",
                    icons: <CircleCheck />
                };
        }
    }



    if (MY_SUBSCRIPTIONS.research_articles.length === 0 && MY_SUBSCRIPTIONS.market_data.length === 0) {
        return (
            <div className='h-full'>
                <CustomSheetTitle title="My Subscriptions" backTo={"profile"} />
                {/* <ErrorState title="No Subscription Records Found" description='Subscribe and find your active subscriptions here!' type='empty' /> */}
                <ErrorState title="Oops, Something Went Wrong" description='We are unable to display the content, please try again later.' type='error' />
            </div>
        )
    }


    const handleUnsubcribe = (item: SubcriptionItem) => {
        console.log("Unsubscribed from ", item.title);
        toast.success('Unsubscribed', `You have successfully unsubscribed from "${item.title} - ${item.description}".`);
    };

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