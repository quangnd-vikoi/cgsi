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
import ViewAll from "@/components/ViewAll";
import { useMediaQuery } from "@/hooks/useMediaQuerry";

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
		const linkHref = campaign.SEO_Page_Name
			? `${CGSI.CAMPAIGNS}${campaign.SEO_Page_Name}`
			: CGSI.CAMPAIGNS;

		// Featured card: only shows on desktop (md+), mobile renders regular card separately
		if (isFeatured) {
			return (
				<Link
					href={linkHref}
					target="_blank"
					className="relative flex h-full rounded overflow-hidden group transition-all duration-300 hover:shadow"
				>
					<Image
						src={campaign.MastheadBasic_Article_Card_Thumbnail_Image}
						alt={campaign.MastheadBasic_Article_Title || "campaign"}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="60vw"
						priority
					/>
					{/* Gradient Overlay - stronger on hover to show content */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300" />
					{/* Content - appears on hover */}
					<div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
						<span className="text-sm text-white/80 mb-4 block">
							{campaign.Tagging_Timing || "Campaign"}
						</span>
						<h3 className="font-semibold leading-tight line-clamp-1 text-[20px] text-white mb-4">
							{campaign.MastheadBasic_Article_Title}
						</h3>
						<p className="h-[2lh] text-base text-white/90 line-clamp-2 leading-6 font-normal">
							{campaign.MastheadBasic_Article_Short}
						</p>
					</div>
				</Link>
			);
		}

		// Regular card: image + text content
		return (
			<Link
				href={linkHref}
				target="_blank"
				className="relative flex flex-col h-full rounded overflow-hidden group transition-all duration-300 bg-white hover:shadow"
			>
				{/* Image Container */}
				<div className="relative overflow-hidden h-[127px] md:h-[157px] flex-shrink-0">
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
				<div className="flex flex-col flex-1 p-4 gap-4 md:gap-[18px]">
					{/* Category Tag */}
					<span className="text-xs md:text-sm text-typo-tertiary mb-1">
						{campaign.Tagging_Timing || "Campaign"}
					</span>

					{/* Title - always 2 lines */}
					<h3 className="font-semibold leading-tight line-clamp-2 min-h-[2lh] text-sm md:text-lg text-typo-primary">
						{campaign.MastheadBasic_Article_Title}
					</h3>

					{/* Description - always 3 lines */}
					<p className=" text-sm md:text-base text-typo-secondary line-clamp-3 min-h-[3lh] leading-5 md:leading-6 font-normal pb-3">
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
	const isMobile = useMediaQuery("mobile");

	useEffect(() => {
		const fetchCampaigns = async () => {
			const url = ENDPOINTS.campaigns();
			const response = await fetchAPI<Campaign[]>(url);
			if (response.success && response.data) {
				// Deduplicate campaigns based on SEO_Page_Name
				const uniqueCampaigns = response.data.filter(
					(campaign, index, self) =>
						index === self.findIndex((c) => c.SEO_Page_Name === campaign.SEO_Page_Name)
				);
				// TODO: remove duplicate when API returns enough data (>6)
				const duplicated = [...uniqueCampaigns, ...uniqueCampaigns];
				setCampaigns(duplicated.slice(0, 6));
				// Original: setCampaigns(uniqueCampaigns.slice(0, 6));
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
		if (api) {
			// If on first slide, go to last slide
			if (current === 0) {
				api.scrollTo(api.scrollSnapList().length - 1);
			} else {
				api.scrollPrev();
			}
		}
	};

	const scrollNext = () => {
		if (!api) return;

		const lastIndex = api.scrollSnapList().length - 1;

		// If on last slide, go to first slide
		if (current === lastIndex) {
			api.scrollTo(0);
		} else {
			api.scrollNext();
		}
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
					<ViewAll href={CGSI.CAMPAIGNS} />
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
						<CarouselContent className="-ml-4 overflow-visible">
							{campaigns.map((campaign, index) => {
								// First item: regular card on mobile, featured banner on desktop
								if (index === 0) {
									// Mobile: render as regular card
									if (isMobile) {
										return (
											<CarouselItem
												key="featured-mobile"
												className="pl-4 basis-[75%] overflow-visible py-1"
											>
												<CampaignCard
													campaign={campaign}
													isFeatured={false}
												/>
											</CarouselItem>
										);
									}
									// Desktop: render featured banner with snap point
									return (
										<React.Fragment key="featured">
											<CarouselItem
												key="featured-desktop"
												className="pl-4 basis-[55%] lg:basis-[57%] overflow-visible py-1"
											>
												<CampaignCard
													campaign={campaign}
													isFeatured={true}
												/>
											</CarouselItem>
											{/* Invisible snap point for peek effect */}
											<CarouselItem
												key="featured-snap"
												className="pl-0 basis-[40%] lg:basis-[25%] -ml-[39%] lg:-ml-[24%] py-1"
											>
												<div className="w-full h-full pointer-events-none" />
											</CarouselItem>
										</React.Fragment>
									);
								}

								return (
									<CarouselItem
										key={index}
										className={cn(
											"pl-4 overflow-visible py-1",
											isMobile ? "basis-[75%]" : "basis-[40%] lg:basis-[25%]"
										)}
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
							className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center bg-white rounded-full w-10 h-10 shadow-md transition-all hover:bg-background-section hover:shadow-light-blue border border-cgs-blue"
							aria-label="Previous"
						>
							<ArrowLeft className="w-5 h-5 text-cgs-blue" />
						</Button>

						<Button
							size="icon"
							onClick={scrollNext}
							className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden md:flex items-center justify-center bg-white rounded-full w-10 h-10 shadow-md transition-all hover:bg-background-section hover:shadow-light-blue border border-cgs-blue"
							aria-label="Next"
						>
							<ArrowRight className="w-5 h-5 text-cgs-blue" />
						</Button>
						{/* Blur overlay - Left (when scrolled, showing partial of first item) - hidden on mobile */}
						<div
							className={cn(
								"absolute left-0 top-1 bottom-1 w-12 md:w-20 pointer-events-none transition-opacity duration-300 z-10 hidden md:block",
								"bg-gradient-to-r from-white via-white/60 to-transparent",
								current == 1 ? "opacity-100" : "opacity-0"
							)}
						/>

						{/* Blur overlay - Right (at start, when peeked items visible) - hidden on mobile */}
						<div
							className={cn(
								"absolute right-0 top-1 bottom-1 w-12 md:w-20 pointer-events-none transition-opacity duration-300 z-10 hidden md:block",
								"bg-gradient-to-l from-white via-white/60 to-transparent",
								current === 0 ? "opacity-100" : "opacity-0"
							)}
						/>
					</Carousel>


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
