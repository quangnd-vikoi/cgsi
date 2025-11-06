"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCcw, User } from "lucide-react";
import { IResearchArticleProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";

// Event Card Component
const ResearchArticleCard = ({ article }: { article: IResearchArticleProps }) => {
	return (
		<Link href={article.url} target="_blank">
			<div className="bg-white shadow rounded-lg mb-[1px]">
				<div className="flex flex-col gap-4 px-3 py-[14px]">
					<div className="text-[10px] font-medium text-typo-tertiary">{article.tag}</div>
					<div className="font-semibold text-xs leading-none">{article.title}</div>

					<div className="justify-start text-[10px] text-typo-secondary line-clamp-4 leading-4 font-normal">
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

// Generate temporary events for testing
const generateTempResearchArticles = (count: number): Array<IResearchArticleProps> => {
	return Array.from({ length: count }, (_, index) => ({
		id: `temp-${index + 1}`,
		title: `CGS International Carving a Niche in Financial Services`,
		description: `We observe nascent signs of a Korea–China thaw, with the first K-pop concert approval since 2015 and policy support for overseas content imports. Potential China reopening could add W40bn revenue and W32bn net income, driving FY26F/FY27F EPS upside potential of 84%/47% vs. consensus.`,
		date: "05-May-2025",
		author: "John Doe",
		tag: "Stock Research",
		url: "https://rfs.cgsi.com/api/download?file=7a06a036-c5a0-4b77-b738-1ef6da8626d5",
	}));
};

const ResearchArticles = () => {
	const [articles, setArticles] = useState<Array<IResearchArticleProps> | null>(
		generateTempResearchArticles(6)
	);

	// Cycle through different event states
	const cycleEventsState = () => {
		if (articles === null) {
			setArticles(generateTempResearchArticles(0));
			return;
		}

		const currentCount = articles.length;
		if (currentCount === 0) {
			setArticles(generateTempResearchArticles(1));
			return;
		}
		if (currentCount === 1) {
			setArticles(generateTempResearchArticles(2));
			return;
		}
		if (currentCount === 2) {
			setArticles(generateTempResearchArticles(3));
			return;
		}
		if (currentCount === 3) {
			setArticles(generateTempResearchArticles(6));
			return;
		}
		if (currentCount === 6) {
			setArticles(null);
			return;
		}

		setArticles(null);
	};

	return (
		<div className="bg-background-section md:bg-[url('/images/bg-event.png')] bg-cover py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1200px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base">Research Articles</span>
					</div>
					<div className="flex items-center gap-3">
						<Button
							onClick={cycleEventsState}
							className="bg-transparent hover:bg-enhanced-blue/10 px-2 py-1 border border-enhanced-blue rounded text-enhanced-blue text-xs"
						>
							<RefreshCcw />
						</Button>
					</div>
				</div>

				{/* Event Carousel */}
				<div className="mt-4 md:mt-6">
					{articles === null ? (
						<ErrorState type="error" className="pr-4 md:pr-0" />
					) : articles.length === 0 ? (
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
