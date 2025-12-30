"use client"
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import MarketItem from "./MarketItem";
import { ErrorState } from '@/components/ErrorState';
import { IMarketDataItem } from '../page';

// Type definitions
interface DropDownItem {
    label: string;
    value: string;
}

interface MarketItemData {
    id: number;
    title: string;
    description: string;
    image: string;
    dropDownItems: DropDownItem[];
}

interface MarketDataResponse {
    researchArticles: MarketItemData[];
    marketData: MarketItemData[];
}

// Fetch market data from API
const fetchMarketData = async (): Promise<MarketDataResponse> => {
	// TODO: Market data subscription endpoints do NOT exist in the API
	// Waiting for backend team to implement:
	// - GET /subscription/api/v1/subscription (get available subscriptions)
	// - GET /subscription/api/v1/userSubscription (get user's subscriptions)
	//
	// For now, return empty arrays which will trigger the "No Subscription Items Found" message

	return {
		researchArticles: [],
		marketData: [],
	};
};

interface NonProfessionalProps {
    selectedItems: Array<IMarketDataItem>;
    setSelectedItems: Dispatch<SetStateAction<Array<IMarketDataItem>>>;
}

const NonProfessional = ({ setSelectedItems }: NonProfessionalProps) => {
    const [researchArticles, setResearchArticles] = useState<MarketItemData[]>([]);
    const [marketData, setMarketData] = useState<MarketItemData[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setError(null);
            const data = await fetchMarketData();
            setResearchArticles(data.researchArticles);
            setMarketData(data.marketData);
        } catch {
            setError("Error fetching market data");
        } finally {
        }
    };

    if (error) {
        return <ErrorState title="Oops, Something Went Wrong" description='We are unable to display the content, please try again later.' />;
    }

    if (researchArticles.length === 0 && marketData.length === 0) {
        return <ErrorState title="No Subscription Items Found" description='Check back soon - new items are on the way!' type='empty' />;
    }

    return (
        <div className="py-6 pad-x max-w-4xl mx-auto">
            <div>
                <p className="text-sm text-typo-teritary">
                    <span className="font-semibold mr-1">
                        &quot;Non-Professional Subscriber&quot;
                    </span>
                    refers to individuals who access market data for personal and non-commercial use.
                    <Alert
                        trigger={
                            <span className="text-blue-600 ml-1 cursor-pointer hover:underline">
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



            <div className="flex items-center gap-2 mt-7">
                <p className="shrink-0 text-xs font-semibold text-typo-teritary">Research Articles</p>
                <Separator className="flex-1 border border-stroke-secondary" />
            </div>
            <div className="mt-2 space-y-3">
                {researchArticles.map((item) => (
                    <MarketItem
                        onSelectItem={(item) => {
                            setSelectedItems((prev) => [...prev, {
                                image: item.image,
                                title: item.title,
                                selectedOption: {
                                    value: item.selectedOption.value,
                                    label: item.selectedOption.label
                                }
                            }]);
                        }}
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        dropDownItems={item.dropDownItems}
                    />
                ))}
            </div>

            <div className="flex items-center gap-2 mt-7">
                <p className="shrink-0 text-xs font-semibold text-typo-teritary">Market Data</p>
                <Separator className="flex-1 border border-stroke-secondary" />
            </div>
            <div className="mt-2 space-y-3">
                {marketData.map((item) => (
                    <MarketItem
                        onSelectItem={(item) => {
                            setSelectedItems((prev) => [...prev, {
                                image: item.image,
                                title: item.title,
                                selectedOption: {
                                    value: item.selectedOption.value,
                                    label: item.selectedOption.label
                                }
                            }]);
                        }}
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        dropDownItems={item.dropDownItems}
                    />
                ))}
            </div>
        </div >
    );
};

export default NonProfessional;