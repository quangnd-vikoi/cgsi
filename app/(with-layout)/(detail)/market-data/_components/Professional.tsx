"use client"
import { Dispatch, SetStateAction } from 'react';
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import MarketItem from "./MarketItem";
import { ErrorState } from '@/components/ErrorState';
import { IMarketDataItem } from '../page';
import type { IMarketSubscriptionGroup } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

/** Fallback images cycled per group index when API doesn't provide one */
const FALLBACK_IMAGES = [
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
    return [...group.subscriptions]
        .sort((a, b) => a.duration - b.duration)
        .map((sub) => ({
            id: sub.id,
            label: sub.subscriptionModel === "1" ? "One Time" : formatDuration(sub.duration),
            value: sub.paymentType === "1" ? "Free" : `${sub.amount.toFixed(2)} SGD`,
        }));
}

function isFreeOnlyGroup(group: IMarketSubscriptionGroup): boolean {
    return group.subscriptions.every(s => s.paymentType === "1");
}

function groupDescription(group: IMarketSubscriptionGroup): string {
    const hasFree = group.subscriptions.some((s) => s.paymentType === "1");
    if (hasFree) return "Free";
    const longest = group.subscriptions.reduce((a, b) => (b.duration > a.duration ? b : a));
    const monthly = longest.amount / (longest.duration || 1);
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
            <div className="py-6 pad-x max-w-4xl mx-auto space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                    </div>
                ))}
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
                        <p className="shrink-0 text-xs md:text-sm font-medium !text-typo-teritary">Research Articles</p>
                        <Separator className="flex-1 border border-stroke-secondary" />
                    </div>
                    <div className="mt-2 space-y-3">
                        {researchGroups.map((group, idx) => {
                            const freeOnly = isFreeOnlyGroup(group);
                            return (
                                <MarketItem
                                    onSelectItem={(item) => {
                                        const sub = group.subscriptions.find(s => s.id === item.subscriptionId);
                                        setSelectedItems((prev) => {
                                            if (freeOnly && prev.find(i => i.title === item.title)) {
                                                return prev.filter(i => i.title !== item.title);
                                            }
                                            return [
                                                ...prev.filter((i) => i.title !== item.title),
                                                {
                                                    ...item,
                                                    gstIndicator: sub?.gstIndicator,
                                                    usMarketDeclaration: sub?.usMarketDeclaration,
                                                    professionalFlag: sub?.professionalFlag,
                                                }
                                            ];
                                        });
                                    }}
                                    key={group.groupId}
                                    title={group.groupTitle}
                                    description={groupDescription(group)}
                                    image={group.groupImageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                                    dropDownItems={freeOnly ? undefined : groupToDropdownItems(group)}
                                    defaultSelected={findDefaultSelected(group, selectedItems)}
                                    freeOnly={freeOnly}
                                    freeSubscriptionId={freeOnly ? [...group.subscriptions].sort((a, b) => b.duration - a.duration)[0]?.id : undefined}
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {marketDataGroups.length > 0 && (
                <>
                    <div className="flex items-center gap-2 mt-7">
                        <p className="shrink-0 text-xs md:text-sm font-medium !text-typo-tertiary">Market Data</p>
                        <Separator className="flex-1 border border-stroke-secondary" />
                    </div>
                    <div className="mt-2 space-y-3">
                        {marketDataGroups.map((group, idx) => {
                            const freeOnly = isFreeOnlyGroup(group);
                            return (
                                <MarketItem
                                    onSelectItem={(item) => {
                                        const sub = group.subscriptions.find(s => s.id === item.subscriptionId);
                                        setSelectedItems((prev) => {
                                            if (freeOnly && prev.find(i => i.title === item.title)) {
                                                return prev.filter(i => i.title !== item.title);
                                            }
                                            return [
                                                ...prev.filter((i) => i.title !== item.title),
                                                {
                                                    ...item,
                                                    gstIndicator: sub?.gstIndicator,
                                                    usMarketDeclaration: sub?.usMarketDeclaration,
                                                    professionalFlag: sub?.professionalFlag,
                                                }
                                            ];
                                        });
                                    }}
                                    key={group.groupId}
                                    title={group.groupTitle}
                                    description={groupDescription(group)}
                                    image={group.groupImageUrl || FALLBACK_IMAGES[(researchGroups.length + idx) % FALLBACK_IMAGES.length]}
                                    dropDownItems={freeOnly ? undefined : groupToDropdownItems(group)}
                                    defaultSelected={findDefaultSelected(group, selectedItems)}
                                    freeOnly={freeOnly}
                                    freeSubscriptionId={freeOnly ? [...group.subscriptions].sort((a, b) => b.duration - a.duration)[0]?.id : undefined}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div >
    );
};

export default Professional;
