"use client";

import Image from "@/components/Image";
import React from "react";
import StockResearch from "./_components/StockResearch";
import ResearchArticles from "./_components/ResearchArticles";
import Insight from "./_components/Insight";
import { Button } from "@/components/ui/button";
import { INTERNAL_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermission";
import { FEATURE_ACCESS } from "@/constants/accessControl";

const Discover = () => {
	const { permissions } = usePermissions({
		discover_stock_research: FEATURE_ACCESS.discover_stock_research,
		discover_research_articles: FEATURE_ACCESS.discover_research_articles,
		discover_donations: FEATURE_ACCESS.discover_donations,
	});

	return (
		<div>
			{permissions.discover_stock_research && <StockResearch />}

			{permissions.discover_research_articles && <ResearchArticles />}

			<Insight />

			{permissions.discover_donations && (
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
								<Button className="px-3 py-2 rounded-sm text-rsp-sm font-normal">
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
			)}
		</div>
	);
};

export default Discover;
