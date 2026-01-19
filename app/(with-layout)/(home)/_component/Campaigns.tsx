"use client";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselApi,
} from "@/components/ui/carousel";
import Image from "@/components/Image";
import React, { useEffect, useState, memo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

interface Campaign {
	SEO_Page_Name: string;
	MastheadBasic_Article_Title: string;
	MastheadBasic_Article_Short: string;
	Campaign_StartDate: string;
	MastheadBasic_Article_Card_Thumbnail_Image: string;
	Tagging_Timing?: string;
}

// Unified campaign card - same DOM structure, different styles based on position
// Using memo to prevent unnecessary re-renders
const CampaignCard = memo(
	({ campaign, isFeatured }: { campaign: Campaign; isFeatured: boolean }) => {
		// Featured card: only image with gradient, no text
		if (isFeatured) {
			return (
				<Link
					href={
						campaign.SEO_Page_Name
							? `${CGSI.CAMPAIGNS}${campaign.SEO_Page_Name}`
							: CGSI.CAMPAIGNS
					}
					target="_blank"
					className="relative flex h-full rounded-xl overflow-hidden group transition-all duration-300"
				>
					<Image
						src={campaign.MastheadBasic_Article_Card_Thumbnail_Image}
						alt={campaign.MastheadBasic_Article_Title || "campaign"}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 60vw"
						priority
					/>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100 transition-opacity duration-300" />
				</Link>
			);
		}

		// Regular card: image + text content
		return (
			<Link
				href={
					campaign.SEO_Page_Name
						? `${CGSI.CAMPAIGNS}${campaign.SEO_Page_Name}`
						: CGSI.CAMPAIGNS
				}
				target="_blank"
				className="relative flex flex-col h-full rounded overflow-hidden group transition-all duration-300 bg-white hover:shadow-lg"
			>
				{/* Image Container */}
				<div className="relative overflow-hidden aspect-[16/9] flex-shrink-0">
					<Image
						src={campaign.MastheadBasic_Article_Card_Thumbnail_Image}
						alt={campaign.MastheadBasic_Article_Title || "campaign"}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 33vw"
						priority
					/>
				</div>

				{/* Content */}
				<div className="flex flex-col flex-1 p-3 md:p-4">
					{/* Category Tag */}
					<span className="text-[10px] md:text-xs text-typo-secondary mb-1">
						{campaign.Tagging_Timing || "Campaign"}
					</span>

					{/* Title - always 2 lines */}
					<h3 className="font-semibold leading-tight line-clamp-2 min-h-[2lh] text-xs md:text-sm text-typo-primary mb-1.5">
						{campaign.MastheadBasic_Article_Title}
					</h3>

					{/* Description - always 3 lines */}
					<p className="leading-relaxed text-[10px] md:text-xs text-typo-secondary line-clamp-3 min-h-[3lh]">
						{campaign.MastheadBasic_Article_Short}
					</p>
				</div>
			</Link>
		);
	}
);

CampaignCard.displayName = "CampaignCard";

const Campaigns = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);

	useEffect(() => {
		const fetchCampaigns = async () => {
			const url = ENDPOINTS.campaigns();
			const response = await fetchAPI<Campaign[]>(url);
			if (response.success && response.data) {
				// x2 data để test scroll
				setCampaigns([...response.data, ...response.data]);
			}
		};

		fetchCampaigns();
	}, []);

	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		onSelect();
		api.on("select", onSelect);
		api.on("reInit", onSelect);

		return () => {
			api.off("select", onSelect);
			api.off("reInit", onSelect);
		};
	}, [api]);

	const scrollPrev = () => {
		api?.scrollPrev();
	};

	const scrollNext = () => {
		api?.scrollNext();
	};

	const scrollTo = (index: number) => {
		api?.scrollTo(index);
	};

	if (campaigns.length === 0) {
		return null;
	}

	return (
		<section className="bg-background-section">
			<div className="py-6 md:py-8 lg:py-10 container-default ">
				{/* Header */}
				<div className="flex items-center justify-between mb-4 md:mb-6">
					<h2 className="font-semibold text-lg md:text-xl lg:text-2xl text-typo-primary">
						Promotions & Campaigns
					</h2>
					<Link
						href={CGSI.CAMPAIGNS}
						target="_blank"
						className="text-sm md:text-base text-cgs-blue hover:underline font-medium underline underline-offset-2"
					>
						View All
					</Link>
				</div>

				{/* Carousel Container */}
				<div className="relative">
					<Carousel
						setApi={setApi}
						opts={{
							align: "start",
							loop: false,
							duration: 30,
							skipSnaps: false,
							inViewThreshold: 0.7,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-4">
							{campaigns.map((campaign, index) => {
								// First item: always large (57%), always featured style, with hidden snap point
								if (index === 0) {
									return (
										<React.Fragment key="featured">
											{/* Part 1: Main featured item - 66% on mobile, 57% on desktop */}
											<CarouselItem
												key="featured-1"
												className="pl-4 h-[280px] md:h-[320px] lg:h-[380px] basis-[66%] md:basis-[57%]"
											>
												<CampaignCard
													campaign={campaign}
													isFeatured={false}
												/>
											</CarouselItem>
											{/* Part 2: Invisible snap point - only on desktop for peek effect */}
											<CarouselItem
												key="featured-2"
												className="pl-0 h-[280px] md:h-[320px] lg:h-[380px] hidden md:block basis-[25%] md:-ml-[24%]"
											>
												<div className="w-full h-full pointer-events-none" />
											</CarouselItem>
										</React.Fragment>
									);
								}

								return (
									<CarouselItem
										key={index}
										className="pl-4 h-[280px] md:h-[320px] lg:h-[380px] basis-[66%] md:basis-[25%]"
									>
										<CampaignCard
											campaign={campaign}
											isFeatured={false}
										/>
									</CarouselItem>
								);
							})}
						</CarouselContent>

						{/* Navigation Arrows */}
						<Button
							size="icon"
							onClick={scrollPrev}
							className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center bg-background-section border-1 border-cgs-blue rounded-full w-10 h-10 shadow-md transition-all"
							aria-label="Previous"
						>
							<ArrowLeft className="w-5 h-5 text-cgs-blue" />
						</Button>

						<Button
							size="icon"
							onClick={scrollNext}
							className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden md:flex items-center justify-center  bg-background-section border-1 border-cgs-blue rounded-full w-10 h-10 shadow-md transition-all"
							aria-label="Next"
						>
							<ArrowRight className="w-5 h-5 text-cgs-blue" />
						</Button>
					</Carousel>

					{/* Blur overlay - Left (when scrolled, showing partial of first item) - hidden on mobile */}
					<div
						className={cn(
							"absolute left-0 top-0 h-[280px] md:h-[320px] lg:h-[380px] w-12 md:w-20 pointer-events-none transition-opacity duration-300 z-10 hidden md:block",
							"bg-gradient-to-r from-white via-white/60 to-transparent",
							current == 1 ? "opacity-100" : "opacity-0"
						)}
					/>

					{/* Blur overlay - Right (at start, when peeked items visible) - hidden on mobile */}
					<div
						className={cn(
							"absolute right-0 top-0 h-[280px] md:h-[320px] lg:h-[380px] w-12 md:w-20 pointer-events-none transition-opacity duration-300 z-10 hidden md:block",
							"bg-gradient-to-l from-white via-white/60 to-transparent",
							current === 0 ? "opacity-100" : "opacity-0"
						)}
					/>

					{/* Dot Indicators - number based on scroll snaps */}
					{api && api.scrollSnapList().length > 1 && (
						<div className="flex justify-center gap-2 mt-4 md:mt-6">
							{api.scrollSnapList().map((_, index) => (
								<button
									key={index}
									onClick={() => scrollTo(index)}
									className={cn(
										"w-2 h-2 rounded-full transition-colors duration-200",
										index === current
											? "bg-cgs-blue"
											: "bg-gray-300 hover:bg-gray-400"
									)}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Campaigns;
