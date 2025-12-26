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

// Giả lập API fetch với khả năng random error
const fetchMarketData = async (): Promise<MarketDataResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const randomValue = Math.random();

            if (randomValue > 0.8) {
                reject(console.error("Error fetching market data"));
            } else {
                resolve({
                    researchArticles: [
                        {
                            id: 1,
                            title: "CGSI Research",
                            description: "From SGD 16.67/month",
                            image: "/images/market-data/item-1.png",
                            dropDownItems: [
                                { label: "1 Month", value: "21.80 SGD" },
                                { label: "3 Months", value: "50.00 SGD" },
                                { label: "6 Months", value: "109.00 SGD" },
                                { label: "12 Months", value: "218.00 SGD" }
                            ]
                        },
                        {
                            id: 2,
                            title: "Market Insights & Analysis",
                            description: "From SGD 12.50/month",
                            image: "/images/market-data/item-4.png",
                            dropDownItems: [
                                { label: "1 Month", value: "15.00 SGD" },
                                { label: "3 Months", value: "40.00 SGD" },
                                { label: "6 Months", value: "85.00 SGD" },
                                { label: "12 Months", value: "165.00 SGD" }
                            ]
                        },
                        {
                            id: 3,
                            title: "Technical Analysis Reports",
                            description: "From SGD 20.83/month",
                            image: "/images/market-data/item-5.png",
                            dropDownItems: [
                                { label: "1 Month", value: "25.00 SGD" },
                                { label: "3 Months", value: "70.00 SGD" },
                                { label: "6 Months", value: "135.00 SGD" },
                                { label: "12 Months", value: "250.00 SGD" }
                            ]
                        },
                        {
                            id: 4,
                            title: "Weekly Market Commentary",
                            description: "From SGD 8.33/month",
                            image: "/images/market-data/item-6.png",
                            dropDownItems: [
                                { label: "1 Month", value: "10.00 SGD" },
                                { label: "3 Months", value: "28.00 SGD" },
                                { label: "6 Months", value: "55.00 SGD" },
                                { label: "12 Months", value: "100.00 SGD" }
                            ]
                        }
                    ],
                    marketData: [
                        {
                            id: 1,
                            title: "Singapore SGX Live Feed + Market Depth",
                            description: "From SGD 16.67/month",
                            image: "/images/market-data/item-2.png",
                            dropDownItems: [
                                { label: "1 Month", value: "21.80 SGD" },
                                { label: "3 Months", value: "50.00 SGD" },
                                { label: "6 Months", value: "109.00 SGD" },
                                { label: "12 Months", value: "218.00 SGD" }
                            ]
                        },
                        {
                            id: 2,
                            title: "Hong Kong HKEX Live Feed",
                            description: "From SGD 16.67/month",
                            image: "/images/market-data/item-3.png",
                            dropDownItems: [
                                { label: "1 Month", value: "21.80 SGD" },
                                { label: "3 Months", value: "50.00 SGD" },
                                { label: "6 Months", value: "109.00 SGD" },
                                { label: "12 Months", value: "218.00 SGD" }
                            ]
                        },
                        {
                            id: 3,
                            title: "US NYSE & NASDAQ Live Feed",
                            description: "From SGD 25.00/month",
                            image: "/images/market-data/item-4.png",
                            dropDownItems: [
                                { label: "1 Month", value: "30.00 SGD" },
                                { label: "3 Months", value: "85.00 SGD" },
                                { label: "6 Months", value: "165.00 SGD" },
                                { label: "12 Months", value: "320.00 SGD" }
                            ]
                        },
                        {
                            id: 4,
                            title: "China Shanghai & Shenzhen Live Feed",
                            description: "From SGD 18.33/month",
                            image: "/images/market-data/item-5.png",
                            dropDownItems: [
                                { label: "1 Month", value: "22.00 SGD" },
                                { label: "3 Months", value: "60.00 SGD" },
                                { label: "6 Months", value: "115.00 SGD" },
                                { label: "12 Months", value: "220.00 SGD" }
                            ]
                        },
                        {
                            id: 5,
                            title: "Malaysia Bursa Live Feed",
                            description: "From SGD 12.50/month",
                            image: "/images/market-data/item-6.png",
                            dropDownItems: [
                                { label: "1 Month", value: "15.00 SGD" },
                                { label: "3 Months", value: "42.00 SGD" },
                                { label: "6 Months", value: "80.00 SGD" },
                                { label: "12 Months", value: "150.00 SGD" }
                            ]
                        },
                        {
                            id: 6,
                            title: "Thailand SET Live Feed",
                            description: "From SGD 12.50/month",
                            image: "/images/market-data/item-4.png",
                            dropDownItems: [
                                { label: "1 Month", value: "15.00 SGD" },
                                { label: "3 Months", value: "42.00 SGD" },
                                { label: "6 Months", value: "80.00 SGD" },
                                { label: "12 Months", value: "150.00 SGD" }
                            ]
                        },
                        {
                            id: 7,
                            title: "Japan Tokyo Stock Exchange Live Feed",
                            description: "From SGD 20.83/month",
                            image: "/images/market-data/item-5.png",
                            dropDownItems: [
                                { label: "1 Month", value: "25.00 SGD" },
                                { label: "3 Months", value: "70.00 SGD" },
                                { label: "6 Months", value: "135.00 SGD" },
                                { label: "12 Months", value: "250.00 SGD" }
                            ]
                        },
                        {
                            id: 8,
                            title: "Australia ASX Live Feed",
                            description: "From SGD 18.33/month",
                            image: "/images/market-data/item-6.png",
                            dropDownItems: [
                                { label: "1 Month", value: "22.00 SGD" },
                                { label: "3 Months", value: "60.00 SGD" },
                                { label: "6 Months", value: "115.00 SGD" },
                                { label: "12 Months", value: "220.00 SGD" }
                            ]
                        }
                    ]
                });
            }
        }, 1000);
    });
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
        } catch (err) {
            console.error(err);
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