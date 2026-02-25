import Image from "@/components/Image";
import React from "react";
import StockResearch from "./_components/StockResearch";
import ResearchArticles from "./_components/ResearchArticles";
import Insight from "./_components/Insight";
import { Button } from "@/components/ui/button";
import { INTERNAL_ROUTES } from "@/constants/routes";
import Link from "next/link";
const Discover = () => {
	return (
		<div>
			{/* Banner
			<div className="bg-discover-banner w-full aspect-[7/1] min-h-28 max-h-52 overflow-hidden">
				<div className="container-default flex items-center justify-between h-full">
					<p className="text-lg md:text-[32px] font-semibold text-white">Discover</p>
					<div className="hidden md:inline-block h-full overflow-hidden flex-shrink-0">
						<Image
							src="/icons/discover/BannerLogo.svg"
							alt="Banner Logo"
							width={500}
							height={200}
							className="h-full w-auto object-cover"
						/>
					</div>
				</div>
			</div> */}

			<StockResearch />

			<ResearchArticles />

			<Insight />

			{/* Donate  */}

			<div className="container-default py-6 md:py-12 flex justify-center">
				<div className="bg-background-section px-3 md:px-6 flex w-full max-w-[660px] md:h-[200px] border rounded overflow-hidden">
					<div className="w-2/3 py-[14px] md:py-6">
						<p className="font-semibold text-base md:text-2xl text-typo-primary">
							Invest in Kindness
						</p>
						<p className="text-base mt-2 font-medium md:font-normal text-typo-secondary">
							Let your money grow & your kindness flow
						</p>
						<Link href={INTERNAL_ROUTES.DONATIONS} className="inline-block mt-6 md:mt-12">
							<Button className="px-3 py-2 rounded-sm text-sm md:text-base font-normal">
								Donate Now
							</Button>
						</Link>
					</div>
					<div className="w-1/3 flex items-center justify-center relative md:right-4 shrink-0 flex-none">
						<Image
							src="/icons/discover/Donate.svg"
							alt="donate icon"
							width={221}
							height={200}
							className="h-full w-auto object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Discover;
