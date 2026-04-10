"use client";
import Link from "next/link";
import { Calendar, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { IResearchArticleProps } from "@/types";
import type { IResearchArticle } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import ViewAll from "@/components/ViewAll";
import ResearchStateIcon from "@/public/icons/research-state.svg";
import { getResearchSSO, redirectToSSO } from "@/lib/services/externalSSOService";
import { getResearchArticles } from "@/lib/services/notificationService";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { useMarketDataCatalogStore } from "@/stores/marketDataCatalogStore";

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
	const [articlesError, setArticlesError] = useState<string | null>(null);
	const [articlesStatus, setArticlesStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [ssoLoading, setSsoLoading] = useState(false);
	const catalog = useMarketDataCatalogStore((state) => state.catalog);
	const catalogError = useMarketDataCatalogStore((state) => state.error);
	const catalogHasLoaded = useMarketDataCatalogStore((state) => state.hasLoaded);
	const catalogLoading = useMarketDataCatalogStore((state) => state.loading);
	const loadCatalog = useMarketDataCatalogStore((state) => state.loadCatalog);
	const researchCount = catalog?.research.length ?? null;
	const hasResearchAccess = researchCount === 0;
	const shouldSuggestSubscribe = researchCount !== null && researchCount > 0;

	useEffect(() => {
		void loadCatalog();
	}, [loadCatalog]);

	useEffect(() => {
		if (researchCount === null) return;

		if (!hasResearchAccess) {
			setArticles([]);
			setArticlesError(null);
			setArticlesStatus("idle");
			return;
		}

		let isCancelled = false;

		const loadArticles = async () => {
			setArticlesStatus("loading");
			setArticlesError(null);

			try {
				const articlesResponse = await getResearchArticles();
				if (isCancelled) return;

				if (articlesResponse.success && articlesResponse.data) {
					setArticles(articlesResponse.data);
					setArticlesStatus("success");
					return;
				}

				setArticles([]);
				setArticlesError(
					articlesResponse.error || "We are unable to display the content, please try again later.",
				);
				setArticlesStatus("error");
			} catch (error) {
				if (isCancelled) return;
				console.error("Failed to load research articles:", error);
				setArticles([]);
				setArticlesError("We are unable to display the content, please try again later.");
				setArticlesStatus("error");
			}
		};

		void loadArticles();

		return () => {
			isCancelled = true;
		};
	}, [hasResearchAccess, researchCount]);

	const handleViewAll = async () => {
		if (!hasResearchAccess || ssoLoading) return;

		setSsoLoading(true);
		try {
			const ssoResponse = await getResearchSSO();
			if (ssoResponse.success && ssoResponse.data) {
				redirectToSSO(ssoResponse.data.redirectUrl);
				return;
			}

			toast.error(
				"Unable to Open Research",
				ssoResponse.error || "We could not open Research Articles at this time. Please try again later.",
			);
		} catch (error) {
			console.error("Failed to fetch research SSO:", error);
			toast.error(
				"Unable to Open Research",
				"We could not open Research Articles at this time. Please try again later.",
			);
		} finally {
			setSsoLoading(false);
		}
	};

	if (!catalogHasLoaded || catalogLoading || (hasResearchAccess && articlesStatus !== "success" && articlesStatus !== "error")) {
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
					<ViewAll
						onClick={handleViewAll}
						disabled={!hasResearchAccess || ssoLoading}
						isLoading={ssoLoading}
						className={!hasResearchAccess ? "!text-status-disable-primary" : ""}
					/>
				</div>

				{/* Research Articles Carousel */}
				<div className="mt-4 md:mt-8">
					{catalogError || articlesStatus === "error" ? (
						<ErrorState
							title="Unable to Load Research Articles"
							description={articlesError || catalogError || "We are unable to display the content, please try again later."}
						/>
					) : shouldSuggestSubscribe ? (
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
