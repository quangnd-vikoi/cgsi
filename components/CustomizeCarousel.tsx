"use client";
import { useState, useEffect, ReactNode } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
	loop = false,
	align = "start",
}: CustomizeCarousel<T>) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [scrollSnapCount, setScrollSnapCount] = useState(0);
	const [windowWidth, setWindowWidth] = useState(1280);
	const [mounted, setMounted] = useState(false);

	const itemsCount = items.length;

	// Handle window resize and initial mount
	useEffect(() => {
		setMounted(true);
		setWindowWidth(window.innerWidth);

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
		mounted &&
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

		const onSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		const updateSnapCount = () => {
			// Get the actual scroll snap count from Embla
			const snapList = api.scrollSnapList();
			const totalSlides = items.length;

			// Calculate visible slides based on container and slide widths
			const containerNode = api.containerNode();
			const slideNodes = api.slideNodes();

			if (!containerNode || slideNodes.length === 0) {
				setScrollSnapCount(snapList.length);
				return;
			}

			const containerWidth = containerNode.offsetWidth;
			const slideWidth = slideNodes[0].offsetWidth;

			// Calculate how many full slides fit in the container
			const visibleSlides = Math.floor(containerWidth / slideWidth);

			if (visibleSlides >= totalSlides) {
				// All slides visible, no pagination needed
				setScrollSnapCount(1);
			} else {
				// Number of pages = total - visible + 1
				// e.g., 4 items with 3 visible = 4 - 3 + 1 = 2 pages
				const pages = Math.max(1, totalSlides - visibleSlides + 1);
				setScrollSnapCount(pages);
			}
		};

		onSelect();
		// Delay snap count calculation to ensure slides are rendered
		setTimeout(updateSnapCount, 100);

		api.on("select", onSelect);
		api.on("reInit", () => {
			onSelect();
			updateSnapCount();
		});
		api.on("resize", updateSnapCount);

		return () => {
			api.off("select", onSelect);
			api.off("reInit", updateSnapCount);
			api.off("resize", updateSnapCount);
		};
	}, [api, items.length]);

	// Navigation handlers - manual wrap around like Campaigns
	const scrollPrev = () => {
		if (!api) return;
		// If on first slide, go to last slide
		if (current === 0) {
			api.scrollTo(scrollSnapCount - 1);
		} else {
			api.scrollPrev();
		}
	};

	const scrollNext = () => {
		if (!api) return;
		const lastIndex = scrollSnapCount - 1;
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

	// Show dots only when there are 2+ scroll snaps
	const shouldShowDots = showDots && scrollSnapCount > 1;

	// Show arrows only when not centering
	const shouldShowArrows = showArrows && !shouldCenter;

	return (
		<div className={cn("relative overflow-visible", containerClassName)}>
			<Carousel
				setApi={setApi}
				opts={{
					align: align,
					loop: loop,
					skipSnaps: false,
					inViewThreshold: 0.7,
				}}
			>
				<CarouselContent
					className={cn(
						"justify-start w-full overflow-visible",
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
								"overflow-visible py-1",
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
						<Button
							size="icon"
							onClick={scrollPrev}
							className={cn(
								"absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center bg-white rounded-full w-10 h-10 shadow-md transition-all hover:bg-background-section hover:shadow-light-blue border border-cgs-blue",
								"md:-left-5",
								arrowClassName
							)}
							aria-label="Previous"
						>
							<ArrowLeft className="w-5 h-5 text-cgs-blue" />
						</Button>
						<Button
							size="icon"
							onClick={scrollNext}
							className={cn(
								"absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center bg-white rounded-full w-10 h-10 shadow-md transition-all hover:bg-background-section hover:shadow-light-blue border border-cgs-blue",
								"md:-right-3",
								arrowClassName
							)}
							aria-label="Next"
						>
							<ArrowRight className="w-5 h-5 text-cgs-blue" />
						</Button>
					</>
				)}
			</Carousel>

			{/* Dot Navigation - based on scroll snaps count */}
			{shouldShowDots && (
				<div className="flex justify-center gap-3 mt-4 md:mt-6">
					{Array.from({ length: scrollSnapCount }).map((_, index) => (
						<button
							key={index}
							onClick={() => scrollTo(index)}
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
