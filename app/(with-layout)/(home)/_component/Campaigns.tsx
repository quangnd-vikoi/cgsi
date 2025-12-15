"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Image from "@/components/Image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { getBgImageClass } from "@/lib/utils";

interface Campaign {
	SEO_Page_Name: string;
	MastheadBasic_Article_Title: string;
	MastheadBasic_Article_Short: string;
	Campaign_StartDate: string;
	MastheadBasic_Article_Card_Thumbnail_Image: string;
	Tagging_Timing?: string;
}

const Campaigns = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);

	useEffect(() => {
		const fetchCampaigns = async () => {
			const url = ENDPOINTS.campaigns();
			const response = await fetchAPI<Campaign[]>(url);
			if (response.success && response.data) {
				setCampaigns(response.data);
			}
		};

		fetchCampaigns();
	}, []);

	useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api, campaigns]); // Add campaigns to dependency to update count when data loads

	const scrollPrev = () => {
		api?.scrollPrev();
	};

	const scrollNext = () => {
		api?.scrollNext();
	};

	const scrollTo = (index: number) => {
		api?.scrollTo(index);
	};

	// Fallback if no campaigns loaded yet or error
	if (campaigns.length === 0) {
		return null; // Or render a skeleton/loading state
	}

	return (
		<div
			className="bg-cover bg-center w-full"
			style={{ backgroundImage: getBgImageClass('/images/bg-campaigns.png') }}
		>
			<div className="flex md:flex-row flex-col md:justify-between items-center gap-6 md:gap-4 lg:gap-6 lg:p-12 py-6 h-fit md:aspect-[8/3] text-white container-default">
				<div className="flex flex-col gap-[6px] md:gap-2.5 lg:gap-4 md:pl-2 md:w-2/5 text-center md:text-start">
					<div className="justify-start self-stretch font-semibold text-[20px] lg:text-[34px] leading-6 lg:leading-10">
						Trade Globally with CGS iTrade
					</div>
					<div className="justify-start self-stretch font-normal md:text-xs text-sm lg:text-xl leading-5 lg:leading-7">
						Your gateway to seamless trading in Asia and beyond.
					</div>
				</div>
				<div className="w-full md:w-3/5">
					<Carousel setApi={setApi}>
						<CarouselContent>
							{campaigns.map((campaign, index) => (
								<CarouselItem key={campaign.SEO_Page_Name || index} className="aspect-[2/1]">
									<Link
										href={
											campaign.SEO_Page_Name
												? `${CGSI.CAMPAIGNS}${campaign.SEO_Page_Name}`
												: CGSI.CAMPAIGNS
										}
										target="_blank"
										className="relative block rounded-lg w-full h-full overflow-hidden cursor-pointer"
									>
										<Image
											src={campaign.MastheadBasic_Article_Card_Thumbnail_Image}
											alt={campaign.MastheadBasic_Article_Title || "campaign"}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 60vw"
											priority={index === 0}
										/>
									</Link>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>

					{/* Navigation Bar */}
					<div className="flex items-center gap-6 mt-4 w-full">
						{/* Previous Button */}
						<div className="flex gap-4">
							<Button
								size={"icon"}
								onClick={scrollPrev}
								disabled={current === 0}
								className="flex flex-shrink-0 justify-center items-center bg-transparent hover:bg-white/20 disabled:opacity-50 border-[1.25px] border-white rounded-full w-6 h-6 transition-colors disabled:cursor-not-allowed"
								aria-label="Previous"
							>
								<ArrowLeft />
							</Button>

							{/* Next Button */}
							<Button
								size={"icon"}
								onClick={scrollNext}
								disabled={current === count - 1}
								className="flex flex-shrink-0 justify-center items-center bg-transparent hover:bg-white/20 disabled:opacity-50 border-[1.25px] border-white rounded-full w-6 h-6 transition-colors disabled:cursor-not-allowed"
								aria-label="Next"
							>
								<ArrowRight />
							</Button>
						</div>

						{/* Progress Bar */}
						<div className="flex flex-grow justify-center items-center gap-1">
							{Array.from({ length: count }).map((_, index) => (
								<button
									key={index}
									onClick={() => scrollTo(index)}
									className={`rounded-full flex-1 transition-all ${index === current
										? "h-[3px] bg-white"
										: "h-[1px] bg-white/40 hover:bg-white/60"
										}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>

						{/* View All Button */}
						<Button className="flex-shrink-0 bg-transparent hover:bg-white/20 px-3 border border-white rounded-full h-6 font-normal text-[12px] whitespace-nowrap cursor-pointer">
							<Link href={CGSI.CAMPAIGNS} target="_blank">
								View All
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Campaigns;
