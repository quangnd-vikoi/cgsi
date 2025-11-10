"use client";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { IResearchArticleProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";

// Research Article Card Component
const ResearchArticleCard = ({ article }: { article: IResearchArticleProps }) => {
	return (
		<Link href={article.url} target="_blank">
			<div className="bg-white shadow rounded-lg mb-[1px]">
				<div className="flex flex-col gap-4 px-3 py-[14px]">
					<div className="text-[10px] font-medium text-typo-tertiary">{article.tag}</div>
					<div className="font-semibold text-xs leading-4 line-clamp-2 min-h-[32px]">
						{article.title}
					</div>

					<div className="justify-start text-[10px] text-typo-secondary line-clamp-4 leading-4 font-normal min-h-16">
						{article.description}
						<br />
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
							<Calendar className="w-4 h-4" />
							{article.date}
						</div>
						<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
							<User className="w-4 h-4" />
							{article.author}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

// Fixed research articles array - 4 articles
const articles: Array<IResearchArticleProps> = [
	{
		id: "1",
		title: "CJ ENM - What if China opens a door for K-content?",
		description: `We observe nascent signs of a Korea–China thaw, with the first K-pop concert approval since 2015 and policy support for overseas content imports. Potential China reopening could add W40bn revenue and W32bn net income, driving FY26F/FY27F EPS upside potential of 84%/47% vs. consensus.`,
		date: "25-Aug-2025",
		author: "Joshua Kim",
		tag: "Idea of the Day",
		url: "https://rfs.cgsi.com/api/download?file=7a06a036-c5a0-4b77-b738-1ef6da8626d5",
	},
	{
		id: "2",
		title: "Global Markets Push Higher as Fed Rate Cut Hopes Build",
		description: `Global markets rise on Fed rate cut hopes; U.S. healthcare, Europe earnings, and Asia tech lead gains amid diverging regional momentum.`,
		date: "30-Jul-2025",
		author: "Rayhan Abhir",
		tag: "Trendspotter",
		url: "https://rfs.cgsi.com/api/download?file=7a06a036-c5a0-4b77-b738-1ef6da8626d5",
	},
	{
		id: "3",
		title: "Markets at a Crossroad: Stock Optimism versus Economic Concerns",
		description: `July US headline CPI was +2.7% yoy, slightly below expectations, while core CPI ticked up to +3.1%, which is its highest in five months. Markets saw this as a green light for for for for for for for for for for for for for for for for for for for for for for for for for for for for for for imminent rate cuts, sparking a wave of optimism across equities, bonds, and risk assets as investors interpreted the data as a sign that inflation pressures are cooling just enough to give the Fed room to pivot sooner rather than later.`,
		date: "05-July-2025",
		author: "Lim Yi Bin",
		tag: "Idea of the Day",
		url: "https://rfs.cgsi.com/api/download?file=7a06a036-c5a0-4b77-b738-1ef6da8626d5",
	},
	{
		id: "4",
		title: "Merdeka Copper Gold - Undervalued gold and copper invites opportunities",
		description: `MDKA plans to start Pani Gold in 2026F and TB Copper in 2028F, which we believe could be significant growth drivers for the company. We expect 54% EBITDA CAGR in FY25-28F. We also estimate MDKA’s TB Copper project is undervalued by 50% by the market. A key category th...`,
		date: "15-May-2025",
		author: "Dlynn Tan",
		tag: "Trading Lens",
		url: "https://rfs.cgsi.com/api/download?file=7a06a036-c5a0-4b77-b738-1ef6da8626d5",
	},
];

const ResearchArticles = () => {
	return (
		<div className="bg-background-section md:bg-[url('/images/bg-event.png')] bg-cover py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1200px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base">Research Articles</span>
					</div>
				</div>

				{/* Research Articles Carousel */}
				<div className="mt-4 md:mt-6">
					{articles.length === 0 ? (
						<ErrorState
							type="empty"
							title="Currently No New Research Articles"
							description="Check back soon - new articles are on the way!"
							className="pr-4 md:pr-0"
						/>
					) : (
						<CustomizeCarousel<IResearchArticleProps>
							items={articles}
							renderItem={(article) => <ResearchArticleCard article={article} />}
							getItemKey={(article) => article.id}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResearchArticles;
