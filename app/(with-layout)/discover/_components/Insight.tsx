"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "@/components/Image";
import { Calendar } from "lucide-react";
import { IInsightProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import ViewAll from "@/components/ViewAll";
import { formatDate } from "@/lib/utils";

// API Response Interface
interface InsightAPIItem {
	SEO_Page_Name: string;
	MastheadBasic_Article_Title: string;
	MastheadBasic_Article_Short: string;
	Date: string;
	Tagging_Series: string;
	MastheadBasic_Article_Card_Thumbnail_Image: string;
}

// Insight Card Component
const InsightCard = ({ article }: { article: IInsightProps }) => {
	return (
		<Link href={CGSI.INSIGHT_BY_ID(article.id)} target="_blank" className="py-1 group">
			<div className="bg-white rounded overflow-hidden h-full flex flex-col hover:shadow transition-shadow border border-stroke-secondary">
				<div className="relative w-full aspect-[16/9] overflow-hidden">
					<Image
						src={article.imageUrl}
						alt={article.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 74vw, (max-width: 1024px) 25.5vw, (max-width: 1280px) 20.1vw, 19.7vw"
						quality={90}
					/>
				</div>
				<div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 flex-grow">
					<div className="font-normal text-xs md:text-sm text-typo-tertiary">{article.tag}</div>
					<div className="h-[2lh] font-semibold text-base md:text-lg line-clamp-2 leading-6">{article.title}</div>
					<div className="h-[3lh] text-sm md:text-base text-typo-secondary line-clamp-3 leading-5 md:leading-6 flex-grow">
						{article.description}
					</div>
					<div className="flex flex-col gap-3 mt-auto">
						<div className="flex gap-4 font-normal text-sm md:text-base text-typo-tertiary">
							<Calendar className="w-4 h-4 md:w-5 md:h-5 text-cgs-blue" strokeWidth={1.5} />
							{formatDate(article.date)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

const Insight = () => {
	const [insights, setInsights] = useState<InsightAPIItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchInsights = async () => {
			try {
				const url = ENDPOINTS.insights();
				const response = await fetchAPI<InsightAPIItem[]>(url);

				if (response.success && response.data) {
					setInsights(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch insights:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInsights();
	}, []);

	if (loading) {
		return null; // Or a loading skeleton
	}

	return (
		<div className="bg-background-section bg-cover py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base md:text-2xl">CGSI Insights</span>
					</div>
					<ViewAll href={CGSI.INSIGHTS} />
				</div>

				{/* Event Carousel */}
				<div className="mt-4 md:mt-8">
					{insights.length > 0 && (
						<CustomizeCarousel<InsightAPIItem>
							items={insights}
							renderItem={(item) => (
								<InsightCard
									article={{
										id: item.SEO_Page_Name,
										title: item.MastheadBasic_Article_Title,
										description: item.MastheadBasic_Article_Short,
										date: item.Date,
										tag: item.Tagging_Series,
										imageUrl: item.MastheadBasic_Article_Card_Thumbnail_Image,
									}}
								/>
							)}
							getItemKey={(item) => item.SEO_Page_Name}
							contentClassName="lg:gap-0 xl:gap-2"
							centerThreshold={{
								desktop: 3,
								laptop: 3,
								tablet: 2,
							}}
							itemsPerView={{
								mobile: "basis-[75%]",
								tablet: "md:basis-[50.8%]",
								laptop: "lg:basis-[33.8%]",
								desktop: "xl:basis-[33.3%]",
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Insight;
