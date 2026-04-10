"use client";
import Image from "@/components/Image";
import React, { useState } from "react";
import { redirectToIScreener, redirectToStockFilter } from "@/lib/services/ssoService";
import { Loader2 } from "lucide-react";

type StockResearchCardProps = {
	title: string;
	available?: number | string;
	imageSrc: string;
	subtext: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	onClick?: () => void | Promise<void>;
	isDisabled?: boolean;
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
	isDisabled = false,
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={`relative bg-white rounded border border-stroke-secondary w-full overflow-visible text-left transition-colors ${isDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer hover:border-background-selected hover:shadow"}`}
		>
			<div className="p-4 md:pl-6 md:pt-5 md:pb-4 w-3/4 md:w-2/3">
				<div className="flex items-center gap-2 md:mb-2">
					<h2 className="text-[20px] font-semibold leading-7 text-typo-primary">{title}</h2>
					{isLoading && <Loader2 className="size-5 shrink-0 animate-spin text-cgs-blue" />}
				</div>
				<p className="max-w-[95%] line-clamp-2 text-base font-normal text-[#4B5563]">
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
		</button>
	);
};

const StockResearch = () => {
	const [loadingCard, setLoadingCard] = useState<string | null>(null);

	const handleClick = async (id: string, fn: () => Promise<void>) => {
		if (loadingCard) return;
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
						isDisabled={loadingCard !== null}
						title="iScreener"
						available={1}
						imageSrc="/icons/discover/Stock-Research-L.svg"
						subtext="Explore stocks powered by advanced algorithms to simplify stock analysis"
					/>

					<StockResearchCard
						onClick={() => handleClick("stockfilter", redirectToStockFilter)}
						isLoading={loadingCard === "stockfilter"}
						isDisabled={loadingCard !== null}
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
