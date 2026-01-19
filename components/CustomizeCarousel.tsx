"use client";
import { useState, useEffect, ReactNode } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CustomizeCarousel<T> {
	items: T[];
	renderItem: (item: T, index: number) => ReactNode;
	getItemKey: (item: T, index: number) => string;
	itemClassName?: string;
	showDots?: boolean;
	showArrows?: boolean;
	arrowClassName?: string;
	dotClassName?: string;
	containerClassName?: string;
	contentClassName?: string;
	itemsPerView?: {
		mobile?: string;
		tablet?: string;
		laptop?: string;
		desktop?: string;
	};
	centerWhenFew?: boolean;
	centerThreshold?: {
		tablet?: number;
		laptop?: number;
		desktop?: number;
	};
	breakpoints?: {
		tablet: number;
		laptop: number;
		desktop: number;
	};
	loop?: boolean;
	align?: "start" | "center" | "end";
}

const CustomizeCarousel = <T,>({
	items,
	renderItem,
	getItemKey,
	itemClassName = "",
	showDots = true,
	showArrows = true,
	arrowClassName = "",
	dotClassName = "",
	containerClassName = "",
	contentClassName = "",
	itemsPerView = {
		mobile: "basis-[75.2%]",
		tablet: "md:basis-[33.9%]",
		laptop: "lg:basis-[25.1%]",
		desktop: "xl:basis-[24.9%]",
	},
	centerWhenFew = true,
	centerThreshold = {
		tablet: 3,
		laptop: 4,
		desktop: 4,
	},
	breakpoints = {
		tablet: 768,
		laptop: 1024,
		desktop: 1280,
	},
	loop = true,
	align = "start",
}: CustomizeCarousel<T>) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1280
	);

	const itemsCount = items.length;

	// Handle window resize and initial mount
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Determine if carousel should center based on item count and screen size
	const isTablet = windowWidth >= breakpoints.tablet && windowWidth < breakpoints.laptop;
	const isLaptop = windowWidth >= breakpoints.laptop && windowWidth < breakpoints.desktop;
	const isDesktop = windowWidth >= breakpoints.desktop;

	const threshold = {
		tablet: centerThreshold.tablet ?? 2,
		laptop: centerThreshold.laptop ?? 3,
		desktop: centerThreshold.desktop ?? 4,
	};

	const shouldCenter =
		centerWhenFew &&
		(itemsCount === 1 ||
			(isTablet && itemsCount < threshold.tablet) ||
			(isLaptop && itemsCount < threshold.laptop) ||
			(isDesktop && itemsCount < threshold.desktop));

	// Track carousel state
	useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	// Show dots only on mobile when there are 2+ items
	const shouldShowDots = showDots && itemsCount >= 2;

	// Show arrows only when not centering
	const shouldShowArrows = showArrows && !shouldCenter;

	return (
		<div className={cn("relative", containerClassName)}>
			<Carousel
				setApi={setApi}
				opts={{
					align: align,
					slidesToScroll: 1,
					loop: loop,
				}}
			>
				<CarouselContent
					className={cn(
						"justify-start w-full",
						shouldCenter && "justify-center",
						"gap-0",
						"lg:gap-1 xl:gap-2",
						contentClassName
					)}
				>
					{items.map((item, index) => (
						<CarouselItem
							key={getItemKey(item, index)}
							className={cn(
								itemsPerView.mobile,
								itemsPerView.tablet,
								itemsPerView.laptop,
								itemsPerView.desktop,

								itemClassName
							)}
						>
							{renderItem(item, index)}
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Arrow Controls */}
				{shouldShowArrows && (
					<>
						<CarouselPrevious
							className={cn(
								"hidden border-cgs-blue text-cgs-blue hover:text-cgs-blue hover:bg-background-section",
								"md:flex md:-left-4",
								arrowClassName
							)}
						/>
						<CarouselNext
							className={cn(
								"hidden border-cgs-blue text-cgs-blue hover:text-cgs-blue hover:bg-background-section",
								"md:flex md:-right-4",
								arrowClassName
							)}
						/>
					</>
				)}
			</Carousel>

			{/* Dot Navigation - only show on mobile when there are 2+ items */}
			{shouldShowDots && (
				<div className="flex justify-center gap-3 mt-4 md:mt-6">
					{Array.from({ length: itemsCount }).map((_, index) => (
						<button
							key={index}
							onClick={() => api?.scrollTo(index)}
							className={cn(
								"rounded-full w-2 h-2 transition-all",
								current === index
									? "bg-cgs-blue"
									: "bg-theme-neutral-08 hover:bg-theme-neutral-095",
								dotClassName
							)}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default CustomizeCarousel;
