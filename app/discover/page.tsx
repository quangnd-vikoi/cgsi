import Image from "next/image";
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
			{/* Banner */}
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
			</div>

			<div className="py-6 md:py-12">
				<StockResearch />
			</div>

			<ResearchArticles />

			<Insight />

			{/* Donate  */}

			<div className="container-default py-6 md:py-12 flex gap-4 justify-center items-center relative">	
				<div className="relative bg-[url('/images/discover/bg-mobile-donate.png')] bg-cover px-3 md:px-6 py-[14px] md:py-5 flex justify-between w-full max-w-[588px] border border-blue-200 rounded-lg">
					<div className="">
						<div className="space-x-4">
							<p className="font-semibold text-base md:text-[32px] text-typo-primary">
								Invest in Kindness
							</p>
							<p className="text-[10px] md:text-sm font-medium md:font-normal text-typo-secondary">
								Let your money grow & your kindness flow
							</p>
						</div>

						<div className="mt-6 md:mt-12">
							<Link href={INTERNAL_ROUTES.DONATIONS}>
								<Button className="px-3 py-2 rounded-sm text-sm md:text-base font-normal">
									Donate Now
								</Button>
							</Link>
						</div>
					</div>

					<Image
						src={"/icons/discover/Donate.svg"}
						alt="donate icon"
						width={221}
						height={192}
						className="h-full w-fit absolute right-0 md:right-6 bottom-0 md:bottom-3"
					/>
				</div>
			</div>
		</div>
	);
};

export default Discover;
