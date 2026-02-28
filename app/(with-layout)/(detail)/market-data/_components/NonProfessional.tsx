"use client"
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import MarketItem from "./MarketItem";
import { ErrorState } from '@/components/ErrorState';
import { subscriptionService } from '@/lib/services/subscriptionService';
import type { IMarketSubscriptionGroup, ISelectedMarketSubscription } from '@/types';

interface NonProfessionalProps {
    selectedItems: Array<ISelectedMarketSubscription>;
    setSelectedItems: Dispatch<SetStateAction<Array<ISelectedMarketSubscription>>>;
}

const NonProfessional = ({ setSelectedItems }: NonProfessionalProps) => {
    const [researchGroups, setResearchGroups] = useState<IMarketSubscriptionGroup[]>([]);
    const [marketDataGroups, setMarketDataGroups] = useState<IMarketSubscriptionGroup[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const filterNonProfessional = (groups: IMarketSubscriptionGroup[]): IMarketSubscriptionGroup[] => {
        return groups
            .map(group => ({
                ...group,
                subscriptions: group.subscriptions.filter(s => s.professionalFlag !== "Y"),
            }))
            .filter(group => group.subscriptions.length > 0);
    };

    const loadData = async () => {
        try {
            setError(null);
            const [catalogRes, mySubsRes] = await Promise.all([
                subscriptionService.getMarketDataSubscriptions(),
                subscriptionService.getMyMarketDataSubscriptions(),
            ]);

            if (!catalogRes.success || !catalogRes.data) {
                setError("Error fetching market data");
                return;
            }

            // TODO: Use mySubsRes to mark already-subscribed items
            void mySubsRes;

            setResearchGroups(filterNonProfessional(catalogRes.data.research || []));
            setMarketDataGroups(filterNonProfessional(catalogRes.data.marketData || []));
        } catch {
            setError("Error fetching market data");
        }
    };

    const getDescription = (group: IMarketSubscriptionGroup) => {
        const amounts = group.subscriptions.map(s => s.amount);
        const min = Math.min(...amounts);
        return `From SGD ${min.toFixed(2)}/month`;
    };

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
                    <span className="font-bold mr-1">
                        &quot;Non-Professional Subscriber&quot;
                    </span>
                    refers to individuals who access market data for personal and non-commercial use.
                    <Alert
                        trigger={
                            <span className="text-cgs-blue ml-1 cursor-pointer underline underline-offset-2">
                                Learn More
                            </span>
                        }
                        actionText="Close"
                        cancelText=""
                        title="Non-Professional Subscriber"
                        description={
                            <div className="text-base text-typo-teritary">
                                <span>&quot;Non-Professional Subscriber&quot; refers to any natural person who receives market data solely for his/her personal, non-business use and who is Not a &quot;Securities Professional&quot; meaning that you are:</span>
                                <ul className="list-disc space-y-6 pl-4 md:pl-7 mt-5">
                                    <li>
                                        Not registered or qualified with the Securities and Exchange Commission, the Commodities Futures Training Commission, any state securities agency, any securities exchange/association, or any commodities/futures contract market/association;
                                    </li>
                                    <li>
                                        Not engaged as an &quot;investment advisor&quot; as that term is defined in section 202(a)(11) of the Investment Advisor&apos;s Act of 1940 (whether or not registered or qualified under that Act) of the United States of America; and
                                    </li>
                                    <li>
                                        Not employed by a bank or other organisation, exempt from registration under the laws of the United States of America, to perform functions that would require you to be so registered or qualified if you were to perform such functions in a registered bank or organisation.
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
                        {researchGroups.map((group) => (
                            <MarketItem
                                key={group.groupId}
                                groupId={group.groupId}
                                groupTitle={group.groupTitle}
                                description={getDescription(group)}
                                image="/images/market-data/item-1.png"
                                subscriptions={group.subscriptions}
                                onSelectItem={(item) => {
                                    setSelectedItems((prev) => [...prev, item]);
                                }}
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
                        {marketDataGroups.map((group) => (
                            <MarketItem
                                key={group.groupId}
                                groupId={group.groupId}
                                groupTitle={group.groupTitle}
                                description={getDescription(group)}
                                image="/images/market-data/item-2.png"
                                subscriptions={group.subscriptions}
                                onSelectItem={(item) => {
                                    setSelectedItems((prev) => [...prev, item]);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div >
    );
};

export default NonProfessional;
