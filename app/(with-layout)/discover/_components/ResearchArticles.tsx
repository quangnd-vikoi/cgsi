"use client";
import Link from "next/link";
import { Calendar, User, UserRoundPen } from "lucide-react";
import { IResearchArticleProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";
import { getBgImageClass } from "@/lib/utils";
import ViewAll from "@/components/ViewAll";
import { redirectToResearch } from "@/lib/services/externalSSOService";

// Research Article Card Component
const ResearchArticleCard = ({ article }: { article: IResearchArticleProps }) => {
	return (
		<Link href={article.url} target="_blank">
			<div className="bg-white rounded hover:shadow transition-shadow border border-stroke-secondary">
				<div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
					<div className="text-xs md:text-sm font-medium text-typo-tertiary">{article.tag}</div>
					<div className="font-semibold text-base md:text-lg leading-7 line-clamp-2 min-h-[2lh]">
						{article.title}
					</div>

					<div className="justify-start text-sm md:text-base text-typo-secondary line-clamp-3 leading-6 font-normal min-h-[3lh]">
						{article.description}
						<br />
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2 md:gap-4 text-sm md:text-base text-typo-secondary leading-4">
							<Calendar className="w-5 h-5 text-cgs-blue" strokeWidth={1.5} />
							{article.date}
						</div>
						<div className="flex items-center gap-2 md:gap-4 text-sm md:text-base text-typo-secondary leading-4">
							<UserRoundPen className="w-5 h-5 text-cgs-blue" strokeWidth={1.5} />
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
		<div
			className="bg-white md:bg-cover py-6 md:py-12"
		>
			<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-2xl">Research Articles</span>
					</div>
					<ViewAll onClick={redirectToResearch} />
				</div>

				{/* Research Articles Carousel */}
				<div className="mt-4 md:mt-8">
					{articles.length === 0 ? (
						<ErrorState
							type="empty"
							title="Currently No New Research Articles"
							description="Check back soon - new articles are on the way!"
						/>
					) : (
						<CustomizeCarousel<IResearchArticleProps>
							items={articles}
							renderItem={(article) => <ResearchArticleCard article={article} />}
							getItemKey={(article) => article.id}
							itemsPerView={{
								mobile: "basis-[70%]",
								tablet: "md:basis-[50.8%]",
								laptop: "lg:basis-[33.8%]",
								desktop: "xl:basis-[33.3%]",
							}}
							centerThreshold={{
								desktop: 3,
								laptop: 3,
								tablet: 2,
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResearchArticles;
