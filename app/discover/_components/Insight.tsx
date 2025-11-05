"use client";
import { useState } from "react";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCcw } from "lucide-react";
import { IInsightProps } from "@/types";
import HomeEvNoevent from "@/public/icons/home-ev-noevent.svg";
import CustomizeCarousel from "@/components/CustomizeCarousel";

// Event Card Component
const InsightCard = ({ article }: { article: IInsightProps }) => {
	return (
		<Link href={"#"} target="_blank">
			<div className="bg-white shadow rounded-lg">
				<div>
					<Image
						src={article.imageUrl}
						alt="insight items"
						width={50}
						height={50}
						className="w-full"
					/>
				</div>
				<div className="flex flex-col gap-4 px-3 py-[14px]">
					<div className="text-[10px] font-medium text-typo-tertiary">{article.tag}</div>
					<div className="font-semibold text-xs leading-none">{article.title}</div>

					<div className="justify-start text-[10px] text-typo-secondary line-clamp-4 leading-4">
						{article.description}
						<br />
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

// Generate temporary events for testing
const generateTempInsight = (count: number): Array<IInsightProps> => {
	return Array.from({ length: count }, (_, index) => ({
		id: `temp-${index + 1}`,
		title: `Malaysian Portfolios with US-China Trade Exposure`,
		description: `Lorem ipsum dolor sit amet consectetur. Quis leo enim tincidunt facilisis leo magna eget vel urna. Ipsum quis at amet nulla id vulputate suspendisse. Fusce euismod facilisi dis mauris id nam pulvinar. Odio magna rhoncus rhoncus vitae nisi mollis aenean ipsum id. Lectus enim id vestibulum amet vel sed adipiscing quis tristique. Tellus sagittis hendrerit et neque in. Vitae turpis pharetra magna nibh.`,
		date: "05-May-2025",
		tag: "Idea of the Day",
		imageUrl: "/images/discover/insight-placeholder.png",
	}));
};

const Insight = () => {
	const [articles, setArticles] = useState<Array<IInsightProps> | null>(generateTempInsight(6));

	// Cycle through different event states
	const cycleEventsState = () => {
		if (articles === null) {
			setArticles(generateTempInsight(0));
			return;
		}

		const currentCount = articles.length;
		if (currentCount === 0) {
			setArticles(generateTempInsight(1));
			return;
		}
		if (currentCount === 1) {
			setArticles(generateTempInsight(2));
			return;
		}
		if (currentCount === 2) {
			setArticles(generateTempInsight(3));
			return;
		}
		if (currentCount === 3) {
			setArticles(generateTempInsight(4));
			return;
		}
		if (currentCount === 4) {
			setArticles(generateTempInsight(6));
			return;
		}
		if (currentCount === 6) {
			setArticles(null);
			return;
		}

		setArticles(null);
	};

	return (
		<div className="bg-white bg-cover py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1200px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base">CGSI Insights</span>
					</div>
					<div className="flex items-center gap-3">
						<Button
							onClick={cycleEventsState}
							className="bg-transparent hover:bg-enhanced-blue/10 px-2 py-1 border border-enhanced-blue rounded text-enhanced-blue text-xs"
						>
							<RefreshCcw />
						</Button>
						<Link
							href={CGSI.INSIGHTS}
							className="font-normal text-enhanced-blue text-xs md:text-sm"
							target="_blank"
						>
							View All
						</Link>
					</div>
				</div>

				{/* Event Carousel */}
				<div className="mt-4 md:mt-6">
					{articles === null ? (
						<div className="flex flex-col justify-center items-center py-5 md:py-7 h-full pr-4 md:pr-0">
							<Image
								src="/icons/home-ev-error.svg"
								alt="loading"
								width={100}
								height={100}
								className=""
							/>
							<div className="mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
								Oops, Something Went Wrong
							</div>
							<div className="mt-1 font-normal text-typo-secondary text-sm text-center leading-tight px-5">
								We are unable to display the content,please try again later.
							</div>
						</div>
					) : articles.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-5 md:py-7 h-full  pr-4 md:pr-0">
							<HomeEvNoevent width={100} height={100} className="text-status-disable-primary" />
							<div className="mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
								Currently No Scheduled Articles
							</div>
							<div className="mt-1 font-normal text-typo-secondary text-sm text-center leading-tight px-5">
								Check back soon - new articles are on the way!
							</div>
						</div>
					) : (
						<CustomizeCarousel<IInsightProps>
							items={articles}
							renderItem={(article) => <InsightCard article={article} />} // article có type IInsightProps
							getItemKey={(article) => article.id}
							contentClassName="lg:gap-0 xl:gap-2"
							centerThreshold={{
								desktop: 5,
								laptop: 5,
								tablet: 4,
							}}
							itemsPerView={{
								mobile: "basis-[74%]",
								tablet: "md:basis-[25.1%]",
								laptop: "lg:basis-[20.1%]",
								desktop: "xl:basis-[19.7%]",
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Insight;
