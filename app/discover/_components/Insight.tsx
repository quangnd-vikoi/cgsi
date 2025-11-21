"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { IInsightProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/fetchWrapper";
import { ENDPOINTS } from "@/lib/apiConfig";

// API Response Interface
interface InsightAPIItem {
	SEO_Page_Name: string;
	MastheadBasic_Article_Title: string;
	MastheadBasic_Article_Short: string;
	Date: string;
	Tagging_Series: string;
	MastheadBasic_Article_Card_Thumbnail_Image: string;
}

// Event Card Component
const InsightCard = ({ article }: { article: IInsightProps }) => {
	return (
		<Link href={CGSI.INSIGHT_BY_ID(article.id)} target="_blank">
			<div className="bg-white shadow mb-[1px] rounded-lg overflow-hidden h-full flex flex-col">
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
				<div className="flex flex-col gap-3 px-3 py-[14px] flex-grow">
					<div className="font-medium text-[10px] text-typo-tertiary">{article.tag}</div>
					<div className="min-h-8 font-semibold text-xs line-clamp-2">{article.title}</div>

					<div className="min-h-[4em] text-[10px] text-typo-secondary line-clamp-4 leading-4 flex-grow">
						{article.description}
					</div>
					<div className="flex flex-col gap-3 mt-auto">
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
					)}
				</div>
			</div>
		</div>
	);
};

export default Insight;
