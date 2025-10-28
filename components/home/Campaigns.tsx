"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ENDPOINT } from "@/constants/routes";

const Campaigns = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
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

	return (
		<div className="w-full  bg-cover bg-center bg-[url('/images/bg-campaigns.png')]">
			<div className="container-default flex flex-col md:flex-row md:justify-between items-center h-full py-12 gap-6 text-white">
				<div className="md:w-2/5 flex flex-col gap-[6px] md:gap-4 md:pl-2 text-center md:text-start ">
					<div className="self-stretch justify-start text-[18px] md:text-4xl font-semibold leading-6 md:leading-10">
						Trade Globally with CGS iTrade
					</div>
					<div className="self-stretch justify-start font-normal text-sm md:text-xl leading-5 md:leading-7">
						Your gateway to seamless trading in Asia and beyond.
					</div>
				</div>
				<div className="md:w-3/5 relative">
					<Carousel setApi={setApi} className="relative">
						<CarouselContent>
							<CarouselItem className="w-full h-[171px] md:h-[345px]">
								<Image
									className="w-full h-full object-cover rounded-lg"
									src={"/images/home-cp-placeholder.png"}
									alt="campaign"
									width={200}
									height={345}
								/>
							</CarouselItem>
							<CarouselItem className="w-full h-[171px] md:h-[345px] flex items-center justify-center bg-gray-700 rounded-lg">
								<span className="text-4xl">2</span>
							</CarouselItem>
							<CarouselItem className="w-full h-[171px] md:h-[345px] flex items-center justify-center bg-gray-700 rounded-lg">
								<span className="text-4xl">2</span>
							</CarouselItem>
							<CarouselItem className="w-full h-[171px] md:h-[345px] flex items-center justify-center bg-gray-600 rounded-lg">
								<span className="text-4xl">3</span>
							</CarouselItem>
						</CarouselContent>
					</Carousel>

					{/* Navigation Bar */}
					<div className="flex items-center w-full mt-4 gap-6">
						{/* Previous Button */}
						<div className="flex gap-4">
							<Button
								size={"icon"}
								onClick={scrollPrev}
								disabled={current === 0}
								className="w-6 h-6 rounded-full border-[1.25px] border-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent flex-shrink-0 flex items-center justify-center"
								aria-label="Previous"
							>
								<ArrowLeft />
							</Button>

							{/* Next Button */}
							<Button
								size={"icon"}
								onClick={scrollNext}
								disabled={current === count - 1}
								className="w-6 h-6 rounded-full border-[1.25px] border-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent flex-shrink-0 flex items-center justify-center"
								aria-label="Next"
							>
								<ArrowRight />
							</Button>
						</div>

						{/* Progress Bar */}
						<div className="flex gap-1 flex-grow justify-center items-center">
							{Array.from({ length: count }).map((_, index) => (
								<button
									key={index}
									onClick={() => scrollTo(index)}
									className={`rounded-full flex-1 transition-all ${
										index === current
											? "h-[3px] bg-white"
											: "h-[1px] bg-white/40 hover:bg-white/60"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>

						{/* View All Button */}
						<Button className="h-6 px-3 border border-white rounded-full hover:bg-white/20 bg-transparent text-[12px] font-normal whitespace-nowrap flex-shrink-0 cursor-pointer">
							<Link href={ENDPOINT.CGSI_CAMPAIGNS} target="_blank">
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
