"use client"
import { Dispatch, SetStateAction } from 'react';
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import MarketItem from "./MarketItem";
import { ErrorState } from '@/components/ErrorState';
import { IMarketDataItem } from '../page';
import type { IMarketSubscriptionGroup } from '@/types';
import { Loader2 } from 'lucide-react';

/** Static images cycled per group index */
const GROUP_IMAGES = [
    "/images/market-data/item-1.png",
    "/images/market-data/item-2.png",
    "/images/market-data/item-3.png",
    "/images/market-data/item-4.png",
    "/images/market-data/item-5.png",
    "/images/market-data/item-6.png",
];

function formatDuration(months: number): string {
    return months === 1 ? "1 Month" : `${months} Months`;
}

function groupToDropdownItems(group: IMarketSubscriptionGroup) {
    return group.subscriptions.map((sub) => ({
        id: sub.id,
        label: formatDuration(sub.duration),
        value: `${sub.amount.toFixed(2)} SGD`,
    }));
}

function groupDescription(group: IMarketSubscriptionGroup): string {
    const paidSubs = group.subscriptions.filter((s) => s.paymentType !== "1");
    if (paidSubs.length === 0) return "Free";
    const longest = paidSubs.reduce((a, b) => (b.duration > a.duration ? b : a));
    const monthly = longest.amount / (longest.duration || 1);
    if (monthly === 0) return "Free";
    return `From SGD ${monthly.toFixed(2)}/month`;
}

interface ProfessionalProps {
    selectedItems: Array<IMarketDataItem>;
    setSelectedItems: Dispatch<SetStateAction<Array<IMarketDataItem>>>;
    researchGroups: IMarketSubscriptionGroup[];
    marketDataGroups: IMarketSubscriptionGroup[];
    loading: boolean;
    error: string | null;
}

/** Find the dropdown item matching an existing selection for a group */
function findDefaultSelected(
    group: IMarketSubscriptionGroup,
    selectedItems: IMarketDataItem[]
) {
    const match = selectedItems.find((item) => item.title === group.groupTitle);
    if (!match) return null;
    const items = groupToDropdownItems(group);
    return items.find((d) => d.value === match.selectedOption.value) ?? null;
}

const Professional = ({
    selectedItems,
    setSelectedItems,
    researchGroups,
    marketDataGroups,
    loading,
    error,
}: ProfessionalProps) => {

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-cgs-blue" />
            </div>
        );
    }

    if (error) {
        return <ErrorState title="Oops, Something Went Wrong" description='We are unable to display the content, please try again later.' />;
    }

    if (researchGroups.length === 0 && marketDataGroups.length === 0) {
        return <ErrorState title="No Subscription Items Found" description='Check back soon - new items are on the way!' type='empty' />;
    }

    return (
        <div className="py-6 pad-x max-w-4xl mx-auto">
            <div>
                <p className="text-sm text-typo-secondary">
                    <span className="font-bold mr-0.5">
                        &quot;Professional Subscriber&quot;
                    </span>
                    refers to individuals or entities that use market data for business, commercial/ professional purpose.
                    <Alert
                        trigger={
                            <span className="text-cgs-blue ml-1 cursor-pointer underline underline-offset-2">
                                Learn More
                            </span>
                        }
                        actionText="Close"
                        cancelText=""
                        title="Professional Subscriber"
                        description={
                            <div className="text-base text-typo-secondary">
                                <span className='font-bold'>&quot;Professional Subscriber&quot;</span> <span>refers to any person or entity that uses market data for business, commercial, or professional purposes, including but not limited to individuals or organizations that meet any of the following criteria:</span>
                                <ul className="list-disc space-y-4 pl-4 md:pl-7 mt-5">
                                    <li>
                                        Registered or qualified with the Securities and Exchange Commission, the Commodities Futures Trading Commission, any state securities agency, any securities exchange or association, or any commodities/futures contract market or association;
                                    </li>
                                    <li>
                                        Engaged as an &quot;investment advisor&quot; as defined in section 202(a)(11) of the Investment Advisor&apos;s Act of 1940 (whether or not registered or qualified under that Act) of the United States of America;
                                    </li>
                                    <li>
                                        Employed by a bank or other organization, exempt from registration under the laws of the United States of America, to perform functions that would require registration or qualification if performed in a registered bank or organization;
                                    </li>
                                    <li>
                                        Any person or entity that uses market data in connection with any business activities, including trading for the account of others, providing investment advice, or operating as a financial professional.
                                    </li>
                                </ul>
                            </div>
                        }
                    />
                </p>
            </div>

            {researchGroups.length > 0 && (
                <>
                    <div className="flex items-center gap-2 mt-7">
                        <p className="shrink-0 text-xs font-semibold text-typo-teritary">Research Articles</p>
                        <Separator className="flex-1 border border-stroke-secondary" />
                    </div>
                    <div className="mt-2 space-y-3">
                        {researchGroups.map((group, idx) => (
                            <MarketItem
                                onSelectItem={(item) => {
                                    setSelectedItems((prev) => [
                                        ...prev.filter((i) => i.title !== item.title),
                                        {
                                            image: item.image,
                                            title: item.title,
                                            subscriptionId: item.subscriptionId,
                                            selectedOption: {
                                                value: item.selectedOption.value,
                                                label: item.selectedOption.label
                                            }
                                        }
                                    ]);
                                }}
                                key={group.groupId}
                                title={group.groupTitle}
                                description={groupDescription(group)}
                                image={GROUP_IMAGES[idx % GROUP_IMAGES.length]}
                                dropDownItems={groupToDropdownItems(group)}
                                defaultSelected={findDefaultSelected(group, selectedItems)}
                            />
                        ))}
                    </div>
                </>
            )}

            {marketDataGroups.length > 0 && (
                <>
                    <div className="flex items-center gap-2 mt-7">
                        <p className="shrink-0 text-xs font-semibold text-typo-teritary">Market Data</p>
                        <Separator className="flex-1 border border-stroke-secondary" />
                    </div>
                    <div className="mt-2 space-y-3">
                        {marketDataGroups.map((group, idx) => (
                            <MarketItem
                                onSelectItem={(item) => {
                                    setSelectedItems((prev) => [
                                        ...prev.filter((i) => i.title !== item.title),
                                        {
                                            image: item.image,
                                            title: item.title,
                                            subscriptionId: item.subscriptionId,
                                            selectedOption: {
                                                value: item.selectedOption.value,
                                                label: item.selectedOption.label
                                            }
                                        }
                                    ]);
                                }}
                                key={group.groupId}
                                title={group.groupTitle}
                                description={groupDescription(group)}
                                image={GROUP_IMAGES[(researchGroups.length + idx) % GROUP_IMAGES.length]}
                                dropDownItems={groupToDropdownItems(group)}
                                defaultSelected={findDefaultSelected(group, selectedItems)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div >
    );
};

export default Professional;
