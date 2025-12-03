"use client";
import { CGSI } from "@/constants/routes";
import Image from "@/components/Image";
import React from "react";
import { useRouter } from "next/navigation";
import { StockResearchLMobile, StockResearchRMobile } from "@/public/icons/discover";

type StockResearchCardProps = {
	title: string;
	available?: number | string;
	imageSrc: string;
	subtext: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	href: string;
};

const StockResearchCard: React.FC<StockResearchCardProps> = ({
	title,
	imageSrc,
	subtext,
	imageAlt,
	imageWidth = 110,
	imageHeight = 125,
	href = "/",
}) => {
	const router = useRouter();
	return (
		<div
			onClick={() => router.push(href)}
			className="relative rounded-lg shadow-sm w-full cursor-pointer "
		>
			<div className="relative rounded-lg w-full border border-transparent hover:border-background-selected hover:shadow h-full">
				<div className="overflow-hidden rounded-lg bg-stockresearch-gradient shadow-sm h-full">
					<div className="pl-2 py-3 md:pl-6 md:pt-5 md:pb-4 w-full md:w-1/2">
						<div className="flex items-center gap-4 md:mb-2">
							<div className="md:hidden bg-white p-2 rounded-full">
								{title == "iScreener" ? <StockResearchLMobile /> : <StockResearchRMobile />}
							</div>
							<h2 className="text-xs md:text-lg font-semibold text-typo-primary">{title}</h2>
						</div>
						<p className="hidden md:inline text-typo-tertiary leading-relaxed text-sm max-w-[70%] lg:max-w-[70%] line-clamp-2">
							{subtext}
						</p>
					</div>
				</div>
			</div>
			<div className="hidden md:block absolute right-0 lg:right-8 bottom-0 h-[90%] md:h-[70%] lg:h-[110%] xl:h-[120%]">
				<Image
					src={imageSrc}
					alt={imageAlt ?? title}
					className="h-full w-auto object-contain scale-x-80 md:scale-x-90 md:left-2 lg:left-10 xl:left-4 relative"
					width={imageWidth}
					height={imageHeight}
				/>
			</div>
		</div>
	);
};

const StockResearch = () => {
	return (
		<div className="container-default bg-white">
			<div className="flex md:hidden justify-between items-center">
				<div className="flex gap-2 items-center">
					<span className="font-semibold text-base">Stock Research</span>
				</div>
			</div>

			<div className="mt-6 flex gap-4 justify-between">
				<StockResearchCard
					href={CGSI.ISCREENER}
					title="iScreener"
					available={1}
					imageSrc="/icons/discover/Stock-Research-L.svg"
					subtext="Explore stocks powered by advanced algorithms to simplify stock analysis"
				/>

				<StockResearchCard
					href={CGSI.STOCK_FILTER}
					title="Stock Filter"
					available={0}
					imageSrc="/icons/discover/Stock-Research-R.svg"
					subtext="Use advanced filters powered by real-time data to screen stocks"
				/>
			</div>
		</div>
	);
};

export default StockResearch;
