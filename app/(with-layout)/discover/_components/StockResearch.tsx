"use client";
import Image from "@/components/Image";
import React, { useEffect, useState } from "react";
import { getIScreenerSSO, getStockFilterSSO, redirectToIScreener, redirectToStockFilter, redirectToSSO } from "@/lib/services/ssoService";

type StockResearchCardProps = {
	title: string;
	available?: number | string;
	imageSrc: string;
	subtext: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	onClick?: () => void | Promise<void>;
};

const StockResearchCard: React.FC<StockResearchCardProps & { isLoading?: boolean }> = ({
	title,
	imageSrc,
	subtext,
	imageAlt,
	imageWidth = 110,
	imageHeight = 125,
	onClick,
	isLoading,
}) => {
	return (
		<div
			onClick={!isLoading ? onClick : undefined}
			className={`relative bg-white rounded border border-stroke-secondary hover:border-background-selected hover:shadow w-full overflow-visible ${isLoading ? "cursor-wait opacity-75" : "cursor-pointer"}`}
		>
			<div className="p-4 md:pl-6 md:pt-5 md:pb-4 w-2/3">
				<div className="flex items-center gap-4 md:mb-2">
					<h2 className="text-lg font-semibold text-typo-primary">{title}</h2>
				</div>
				<p className="text-typo-tertiary text-sm max-w-[95%] line-clamp-2">
					{subtext}
				</p>
			</div>

			<Image
				src={imageSrc}
				alt={imageAlt ?? title}
				className="absolute right-0 lg:right-8 bottom-0 p-3 md:p-0 h-full md:h-[120%] w-auto object-contain"
				width={imageWidth}
				height={imageHeight}
			/>
		</div>
	);
};

const StockResearch = () => {
	const [loadingCard, setLoadingCard] = useState<string | null>(null);
	const [prefetchedUrls, setPrefetchedUrls] = useState<Record<string, string>>({});

	useEffect(() => {
		getIScreenerSSO().then((r) => {
			if (r.success && r.data) {
				setPrefetchedUrls((prev) => ({ ...prev, iscreener: r.data!.redirectUrl }));
			}
		});
		getStockFilterSSO().then((r) => {
			if (r.success && r.data) {
				setPrefetchedUrls((prev) => ({ ...prev, stockfilter: r.data!.redirectUrl }));
			}
		});
	}, []);

	const handleClick = async (id: string, fn: () => Promise<void>) => {
		const prefetchedUrl = prefetchedUrls[id];
		if (prefetchedUrl) {
			redirectToSSO(prefetchedUrl);
			return;
		}
		setLoadingCard(id);
		try { await fn(); } finally { setLoadingCard(null); }
	};

	return (
		<div className="bg-background-section">
			<div className="container-default py-4 md:py-8">
				<div className="flex  justify-between items-center">
					<div className="flex gap-2 items-center">
						<span className="font-semibold text-2xl">Tools</span>
					</div>
				</div>

				<div className="mt-6 flex flex-col md:flex-row gap-4 justify-between">
					<StockResearchCard
						onClick={() => handleClick("iscreener", redirectToIScreener)}
						isLoading={loadingCard === "iscreener"}
						title="iScreener"
						available={1}
						imageSrc="/icons/discover/Stock-Research-L.svg"
						subtext="Explore stocks powered by advanced algorithms to simplify stock analysis"
					/>

					<StockResearchCard
						onClick={() => handleClick("stockfilter", redirectToStockFilter)}
						isLoading={loadingCard === "stockfilter"}
						title="Stock Filter"
						available={0}
						imageSrc="/icons/discover/Stock-Research-R.svg"
						subtext="Use advanced filters powered by real-time data to screen stocks"
					/>
				</div>
			</div>
		</div>
	);
};

export default StockResearch;
