"use client"
import { useState, useEffect } from 'react';
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import MarketItem from "./MarketItem";
import { ErrorState } from '@/components/ErrorState';
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
        reject(new Error('Failed to fetch market data. Please try again.'));
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
            }
          ]
        });
      }
    }, 1000); // Giả lập delay 1 giây
  });
};

const Professional = () => {
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
      console.log(err)
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
          <span className="font-semibold mr-0.5">
            &quot;Professional Subscriber&quot;
          </span>
          refers to individuals or entities that use market data for business, commercial/ professional purpose.
          <Alert
            trigger={
              <span className="text-blue-600 ml-1 cursor-pointer hover:underline">
                Learn More
              </span>
            }
            actionText="Close"
            cancelText=""
            title="Professional Subscriber"
            description={
              <div className="text-base text-typo-teritary">
                <span>&quot;Professional Subscriber&quot; refers to any person or entity that uses market data for business, commercial, or professional purposes, including but not limited to individuals or organizations that meet any of the following criteria:</span>
                <ul className="list-disc space-y-4 pl-4 md:pl-7 mt-5">
                  <li>
                    Registered or qualified with the Securities and Exchange Commission, the Commodities Futures Trading Commission, any state securities agency, any securities exchange or association, or any commodities/futures contract market or association;
                  </li>
                  <li>
                    Engaged as an “investment advisor” as defined in section 202(a)(11) of the Investment Advisor’s Act of 1940 (whether or not registered or qualified under that Act) of the United States of America;
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



      <div className="flex items-center gap-2 mt-7">
        <p className="shrink-0 text-xs font-semibold text-typo-teritary">Research Articles</p>
        <Separator className="flex-1 border border-stroke-secondary" />
      </div>
      <div className="mt-2 space-y-3">
        {researchArticles.map((item) => (
          <MarketItem
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

export default Professional;