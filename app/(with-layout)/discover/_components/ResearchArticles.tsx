"use client";
import Link from "next/link";
import { Calendar, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { IResearchArticleProps } from "@/types";
import type { IResearchArticle } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import ViewAll from "@/components/ViewAll";
import ResearchStateIcon from "@/public/icons/research-state.svg";
import { getResearchSSO, redirectToSSO } from "@/lib/services/externalSSOService";
import { getResearchArticles } from "@/lib/services/notificationService";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";

// Research Article Card Component
const ResearchArticleCard = ({ article }: { article: IResearchArticleProps }) => {
	return (
		<Link href={article.url} target="_blank">
			<div className="bg-white rounded hover:shadow transition-shadow border border-stroke-secondary">
				<div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6">
					<div className="text-rsp-xs font-medium text-typo-tertiary">{article.tag}</div>
					<div className="font-semibold text-rsp-base leading-7 line-clamp-2 min-h-[2lh]">
						{article.title}
					</div>

					<div className="justify-start text-rsp-sm text-typo-secondary line-clamp-3 leading-6 font-normal min-h-[3lh]">
						{article.description}
						<br />
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2 md:gap-4 text-rsp-sm text-typo-secondary leading-4">
							<Calendar className="w-5 h-5 text-cgs-blue" strokeWidth={1.5} />
							{article.date}
						</div>
						<div className="flex items-center gap-2 md:gap-4 text-rsp-sm text-typo-secondary leading-4">
							<UserRoundPen className="w-5 h-5 text-cgs-blue" strokeWidth={1.5} />
							{article.author}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

const mapArticle = (item: IResearchArticle): IResearchArticleProps => ({
	id: item.id,
	title: item.title,
	description: item.description,
	date: item.publishedDate,
	author: item.publishedBy,
	tag: item.type,
	url: item.reportUrl,
});

const ResearchArticles = () => {
	const [articles, setArticles] = useState<IResearchArticle[]>([]);
	const [loading, setLoading] = useState(true);
	const [subscribed, setSubscribed] = useState(false);
	const [ssoRedirectUrl, setSsoRedirectUrl] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				const ssoResponse = await getResearchSSO();
				if (ssoResponse.success && ssoResponse.data) {
					setSubscribed(true);
					setSsoRedirectUrl(ssoResponse.data.redirectUrl);

					const articlesResponse = await getResearchArticles();
					if (articlesResponse.success && articlesResponse.data) {
						setArticles(articlesResponse.data);
					}
				}
			} catch (error) {
				console.error("Failed to initialize research section:", error);
			} finally {
				setLoading(false);
			}
		};

		init();
	}, []);

	const handleViewAll = () => {
		if (ssoRedirectUrl) {
			redirectToSSO(ssoRedirectUrl);
		}
	};

	if (loading) {
		return (
			<div className="bg-white py-6 md:py-12">
				<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
					<div className="flex justify-between items-center">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-5 w-16" />
					</div>
					<div className="mt-4 md:mt-8 flex gap-4 overflow-hidden">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="shrink-0 basis-[70%] md:basis-[50.8%] lg:basis-[33.8%] xl:basis-[33.3%] rounded border border-stroke-secondary p-4 md:p-6 flex flex-col gap-4 md:gap-6"
							>
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-14 w-full" />
								<div className="flex flex-col gap-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-2">
										<Skeleton className="h-5 w-5 rounded-full" />
										<Skeleton className="h-4 w-24" />
									</div>
									<div className="flex items-center gap-2">
										<Skeleton className="h-5 w-5 rounded-full" />
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="bg-white md:bg-cover py-6 md:py-12"
		>
			<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-2xl">Research Articles</span>
					</div>
					<ViewAll onClick={handleViewAll} isLoading={!subscribed} className={!subscribed ? "!text-status-disable-primary" : ""} />
				</div>

				{/* Research Articles Carousel */}
				<div className="mt-4 md:mt-8">
					{!subscribed ? (
						<div className="flex flex-col justify-center items-center py-5 md:py-7 h-full">
							<ResearchStateIcon width={100} height={100} className="text-status-disable-primary" />
							<div className="mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
								Unlock Premium Research
							</div>
							<div className="mt-1 font-normal text-typo-secondary text-sm text-center leading-tight md:px-5 line-clamp-none">
								Subscribe now to access comprehensive global market reports and exclusive analysis
							</div>
							<Link
								href={INTERNAL_ROUTES.MARKET_DATA}
								className="mt-6 inline-flex items-center justify-center rounded bg-cgs-blue px-6 py-2 text-sm font-medium text-white hover:bg-cgs-blue/90 transition-colors"
							>
								Subscribe
							</Link>
						</div>
					) : articles.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-5 md:py-7 h-full">
							<ResearchStateIcon width={100} height={100} className="text-status-disable-primary" />
							<div className="mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
								Currently No New Research Articles
							</div>
							<div className="mt-1 font-normal text-typo-secondary text-sm text-center leading-tight md:px-5">
								Check back soon - new articles are on the way!
							</div>
						</div>
					) : (
						<CustomizeCarousel<IResearchArticleProps>
							items={articles.map(mapArticle)}
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
