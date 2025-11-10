"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { IInsightProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";

// Event Card Component
const InsightCard = ({ article }: { article: IInsightProps }) => {
	return (
		<Link href={"#"} target="_blank">
			<div className="bg-white shadow mb-[1px] rounded-lg overflow-hidden">
				<div className="relative w-full aspect-[16/9]">
					<Image
						src={article.imageUrl}
						alt={article.title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 74vw, (max-width: 1024px) 25.5vw, (max-width: 1280px) 20.1vw, 19.7vw"
						quality={90}
					/>
				</div>
				<div className="flex flex-col gap-3 px-3 py-[14px]">
					<div className="font-medium text-[10px] text-typo-tertiary">{article.tag}</div>
					<div className="min-h-8 font-semibold text-xs line-clamp-2">{article.title}</div>

					<div className="min-h-[4em] text-[10px] text-typo-secondary line-clamp-4 leading-4">
						{article.description}
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
							<Calendar className="w-4 h-4" />
							{article.date}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

const articles: Array<IInsightProps> = [
	{
		id: "insight-1",
		title: "Beyond the Boardroom",
		description:
			"​Ever wondered what CEOs discuss Beyond the Boardroom? Our new video series pulls back the curtain! Join CGS International Singapore's CEO, Malcolm Koo and Research Analyst, Natalie Ong for an exclusive video series, Beyond the Boardroom. They'll be hosting insightful conversations with CEOs of leading SGX-listed",
		date: "31-Dec-2025",
		tag: "Video Series",
		imageUrl: "/images/insights/i1.png",
	},
	{
		id: "insight-2",
		title: "Kopi with Uncle Song & Friends",
		description:
			"Ever wondered what the future holds for Singapore's economy? Or how to navigate the ever-changing market landscape? CGS International Securities is bringing you Kopi with Uncle Song & Friends, a content series where economic guru Mr. Song Seng Wun spills the beans on all things economic.",
		date: "31-Dec-2025",
		tag: "Video Series",
		imageUrl: "/images/insights/i2.png",
	},
	{
		id: "insight-3",
		title: "Market Pulse: Earnings Strength, Shutdown Delays & Yield Watch",
		description:
			"Strong US Corporate Earnings Fuel Equity Market Gains. US equity markets started this week with fresh upside momentum. The Dow Jones Industrial Average hit a record of 46,924.74, led by strong earnings from companies like 3M and Coca‑Cola. Meanwhile, General Motors surged nearly 15% after raising its full-year forecast. These positive results provided tangible support for equity prices amidst the overhang of concerns about stretched US equity valuations and prevailing geopolitical risk. What is also aiding the stock market's resilience is the prospect of Fed easing at its Oct 28th & 29th FOMC meeting where a 25bp Fed funds rate cut is anticipated.",
		date: "27-Oct-2025",
		tag: "Market Outlook",
		imageUrl: "/images/insights/i3.png",
	},
	{
		id: "insight-4",
		title: "Inside Our Hong Kong Regional Webinar: What's Next for China's Economy?",
		description:
			"We recently wrapped up our Hong Kong Regional Webinar, and it turned out to be a fascinating session for anyone following China's fast-evolving Electric Vehicle (EV) and Advanced Driver Assistance Systems (ADAS) sectors. Hosted by CGS International Securities Hong Kong's analysts, Ray Kwok and Sera Chen, the webinar took a deep dive into how the country's EV market has matured beyond the phase of price wars and subsidies, and how emerging technologies like LiDAR, AI chips, and autonomous driving systems are setting the tone for the next chapter of growth.",
		date: "24-Oct-2025",
		tag: "Webinar Recap",
		imageUrl: "/images/insights/i4.png",
	},
	{
		id: "insight-5",
		title: "Meet Lim Siew Khee, Head of Singapore Research",
		description:
			"With a sharp eye for market trends and a commitment to delivering timely, actionable insights, Siew Khee leads one of Singapore's largest research teams. CGSI Research has earned industry recognition and continues to set itself apart through agility, originality, and a client-first approach. Her team's work empowers investors with robust analysis and forward-looking strategies in today's fast-moving financial landscape.",
		date: "22-Oct-2025",
		tag: "Inside CGSI",
		imageUrl: "/images/insights/i5.png",
	},
];

const Insight = () => {
	return (
		<div className="bg-white bg-cover py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1200px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base">CGSI Insights</span>
					</div>
					<Link
						href={CGSI.INSIGHTS}
						className="font-normal text-enhanced-blue text-xs md:text-sm"
						target="_blank"
					>
						View All
					</Link>
				</div>

				{/* Event Carousel */}
				<div className="mt-4 md:mt-6">
					<CustomizeCarousel<IInsightProps>
						items={articles}
						renderItem={(article) => <InsightCard article={article} />}
						getItemKey={(article) => article.id}
						contentClassName="lg:gap-0 xl:gap-2"
						centerThreshold={{
							desktop: 5,
							laptop: 5,
							tablet: 4,
						}}
						itemsPerView={{
							mobile: "basis-[74%]",
							tablet: "md:basis-[25.5%]",
							laptop: "lg:basis-[20.1%]",
							desktop: "xl:basis-[19.7%]",
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Insight;
