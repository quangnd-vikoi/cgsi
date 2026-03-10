"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { IResearchArticleProps } from "@/types";
import type { IResearchArticle } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";
import ViewAll from "@/components/ViewAll";
import Alert from "@/components/Alert";
import { getResearchSSO, redirectToSSO } from "@/lib/services/externalSSOService";
import { getResearchArticles } from "@/lib/services/notificationService";
import { INTERNAL_ROUTES } from "@/constants/routes";

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
	const router = useRouter();
	const [articles, setArticles] = useState<IResearchArticle[]>([]);
	const [loading, setLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [showSubscribeAlert, setShowSubscribeAlert] = useState(false);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await getResearchArticles();
				if (response.success && response.data) {
					setArticles(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch research articles:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
	}, []);

	const handleViewAll = async () => {
		setIsLoading(true);
		try {
			const response = await getResearchSSO();
			if (response.success && response.data) {
				redirectToSSO(response.data.redirectUrl);
			} else if (!response.success && response.statusCode !== 401) {
				setShowSubscribeAlert(true);
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (loading) {
		return null;
	}

	return (
		<>
		<div
			className="bg-white md:bg-cover py-6 md:py-12"
		>
			<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-2xl">Research Articles</span>
					</div>
					<ViewAll onClick={handleViewAll} isLoading={isLoading} />
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

		<Alert
			open={showSubscribeAlert}
			onOpenChange={setShowSubscribeAlert}
			title="Subscribe to Research Access"
			description={
				<p>
					Subscribe now to unlock unlimited access to our complete suite of research articles,
					premium insights, and expert analysis, everything you need to stay informed and ahead.
				</p>
			}
			cancelText="Cancel"
			actionText="Subscribe"
			onCancel={() => setShowSubscribeAlert(false)}
			onAction={() => {
				setShowSubscribeAlert(false);
				router.push(INTERNAL_ROUTES.MARKET_DATA);
			}}
		/>
		</>
	);
};

export default ResearchArticles;
