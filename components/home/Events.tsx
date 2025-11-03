"use client";
import { useState } from "react";
import Link from "next/link";
import { ENDPOINT } from "@/constants/routes";
import Image from "next/image";
import { Button } from "../ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, RefreshCcw } from "lucide-react";
import { IEventProps } from "@/types";
import HomeEvNoevent from "@/public/icons/home-ev-noevent.svg";
import { useMediaQuery } from "@/hooks/useMediaQuerry";
import { useEffect } from "react";

const EventCarousel = ({ events }: { events: Array<IEventProps> }) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	const isTablet = useMediaQuery("tablet");
	const isLaptop = useMediaQuery("laptop");
	const isDesktop = useMediaQuery("desktop");
	const eventsCount = events.length;

	const shouldCenter =
		eventsCount === 1 || (isTablet && eventsCount < 3) || ((isLaptop || isDesktop) && eventsCount < 4);

	// Track carousel state
	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<div className="relative">
			<Carousel
				setApi={setApi}
				opts={{
					align: "start",
					slidesToScroll: 1,
					loop: true,
				}}
			>
				<CarouselContent
					className={cn(
						"justify-start w-full",
						shouldCenter && "justify-center",
						"md:gap-1",
						"lg:gap-4 xl:gap-6"
					)}
				>
					{events.map((event) => (
						<CarouselItem
							key={event.id}
							className={cn(
								// Mobile: 66% (tự slide, không có control)
								"basis-[74%]",
								"md:basis-[33.5%]",
								"lg:basis-[24%]",
								"xl:basis-[23.8%]"
							)}
						>
							<div className="bg-white shadow rounded-lg">
								<Image
									className="rounded-t-lg w-full h-auto"
									src={event.imageUrl}
									alt={event.title}
									width={283}
									height={283}
								/>
								<div className="flex flex-col gap-4 px-3 py-[14px]">
									<div className="font-semibold text-xs leading-none">{event.title}</div>

									<div className="justify-start text-[10px] text-typo-secondary line-clamp-3 leading-4">
										{event.description}
										<br />
									</div>
									<div className="flex flex-col gap-2">
										<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
											<Calendar className="w-4 h-4" />
											{event.date}
										</div>

										<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
											<Clock className="w-4 h-4" />
											{event.time}
										</div>

										<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
											<MapPin className="w-4 h-4" />
											{event.location}
										</div>
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Arrow Controls */}
				<>
					<CarouselPrevious
						className={cn(
							"hidden border-enhanced-blue text-enhanced-blue",
							!shouldCenter && "md:flex md:-left-4 xl:-left-12"
						)}
					/>
					<CarouselNext
						className={cn(
							"hidden border-enhanced-blue text-enhanced-blue",
							!shouldCenter && "md:flex md:-right-4 lg:-right-2 xl:-right-12"
						)}
					/>
				</>
			</Carousel>

			{/* Dot Navigation - chỉ hiện trên tablet khi có >= 3 items */}
			{eventsCount >= 2 && (
				<div className="md:hidden flex justify-center gap-3 mt-4">
					{Array.from({ length: eventsCount }).map((_, index) => (
						<button
							key={index}
							onClick={() => api?.scrollTo(index)}
							className={cn(
								"rounded-full w-2 h-2 transition-all",
								current === index
									? "bg-enhanced-blue"
									: "bg-theme-neutral-08 hover:bg-theme-neutral-095"
							)}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};
// Tạo danh sách event tạm thời, lặp lại theo số lượng yêu cầu
const generateTempEvents = (count: number): Array<IEventProps> => {
	return Array.from({ length: count }, (_, index) => ({
		id: `temp-${index + 1}`,
		title: `CGS International Carving a Niche in Financial Services`,
		imageUrl: "/images/home-ev-temp.png",
		description: `With its rebranding, CGS International is moving beyond traditional
					brokerage services. As Deputy CEO Khairi Shahrin explains, there's no
					value in chasing bottom-feeding fees - CGS is diving into niche
					markets where others aren't looking. He discusses the company's
					strategy for growth, leveraging its China connection, and key trends
					shaping 2025.`,
		date: "05-May-2025",
		time: "8:00PM - 9:00PM ",
		location: "Zoom Webinar",
	}));
};

const Events = () => {
	const [events, setEvents] = useState<Array<IEventProps> | null>(generateTempEvents(6));

	// Nút chuyển trạng thái: null -> 1 -> 2 -> 3 -> 6 -> null

	const cycleEventsState = () => {
		if (events === null) {
			setEvents(generateTempEvents(0));
			return;
		}

		const currentCount = events.length;
		if (currentCount === 0) {
			setEvents(generateTempEvents(1));
			return;
		}
		if (currentCount === 1) {
			setEvents(generateTempEvents(2));
			return;
		}
		if (currentCount === 2) {
			setEvents(generateTempEvents(3));
			return;
		}
		if (currentCount === 3) {
			setEvents(generateTempEvents(6));
			return;
		}
		if (currentCount === 6) {
			setEvents(null);
			return;
		}

		// Trạng thái khác (ví dụ []): đưa về null trước
		setEvents(null);
	};

	return (
		<div className="bg-background-section md:bg-[url('/images/bg-event.png')] py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1200px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base">Event & Seminars</span>
					</div>
					<div className="flex items-center gap-3">
						<Button
							onClick={cycleEventsState}
							className="bg-transparent hover:bg-enhanced-blue/10 px-2 py-1 border border-enhanced-blue rounded text-enhanced-blue text-xs"
						>
							<RefreshCcw />
						</Button>
						<Link
							href={ENDPOINT.CGSI_EVENTS}
							className="font-normal text-enhanced-blue text-xs md:text-sm"
							target="_blank"
						>
							View All
						</Link>
					</div>
				</div>

				{/* Event Carousel */}
				<div className="mt-6">
					{events === null ? (
						<div className="flex flex-col justify-center items-center py-[86px] h-full">
							<Image
								src="/icons/home-ev-error.svg"
								alt="loading"
								width={100}
								height={100}
								className=""
							/>
							<div className="self-stretch mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
								Oops, Something Went Wrong
							</div>
							<div className="self-stretch mt-1 font-normal text-typo-secondary text-sm text-center leading-tight">
								We are unable to display the content,please{" "}
								<span className="block">please try again later.</span>
							</div>
						</div>
					) : events.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-[86px] h-full">
							<HomeEvNoevent width={100} height={100} className="text-status-disable-primary" />
							<div className="self-stretch mt-6 font-semibold text-typo-primary text-base text-center leading-normal">
								Currently No Scheduled Events
							</div>
							<div className="self-stretch mt-1 font-normal text-typo-secondary text-sm text-center leading-tight">
								Check back soon—new events are on the way!
							</div>
						</div>
					) : (
						<EventCarousel events={events} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
