"use client";
import { useState } from "react";
import Link from "next/link";
import { ENDPOINT } from "@/constants/endpoint";
import Image from "next/image";
import { Button } from "../ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";


const EventCarousel = ({ events }: { events: Array<EventProps> }) => {
	const showControls = events.length >= 4;

	// Chỉ căn giữa khi ít items VÀ ở màn hình lớn
	const contentClass = showControls ? "" : "lg:justify-center lg:gap-[36px]";
	const itemClass = showControls
		? "basis-[66%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
		: "basis-[66%] md:basis-1/2 lg:basis-auto lg:flex-shrink-0";

	return (
		<div>
			<Carousel
				opts={{
					align: "start",
					slidesToScroll: 1,
				}}
			>
				<CarouselContent className={contentClass}>
					{events.map((event) => (
						<CarouselItem key={event.id} className={itemClass}>
							<div className={cn("w-[230px] md:w-[283px] rounded-lg shadow bg-white")}>
								<Image
									className="w-full h-auto rounded-t-lg"
									src={event.imageUrl}
									alt={event.title}
									width={100}
									height={100}
								/>
								<div className="py-[14px] px-3 flex flex-col gap-4">
									<div className="text-xs font-semibold leading-none">{event.title}</div>

									<div className="justify-start text-typo-secondary text-[10px] leading-4 line-clamp-3">
										{event.description}
										<br />
									</div>
									<div className="flex flex-col gap-2">
										<div className="self-stretch text-typo-tertiary text-[10px] leading-4 font-medium flex gap-2">
											<Calendar className="w-4 h-4" />
											{event.date}
										</div>

										<div className="self-stretch text-typo-tertiary text-[10px] leading-4 font-medium flex gap-2">
											<Clock className="w-4 h-4" />
											{event.time}
										</div>

										<div className="self-stretch text-typo-tertiary text-[10px] leading-4 font-medium flex gap-2">
											<MapPin className="w-4 h-4" />
											{event.location}
										</div>
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				{showControls && (
					<CarouselPrevious className="hidden lg:flex text-enhanced-blue border-enhanced-blue" />
				)}
				{showControls && (
					<CarouselNext className="hidden lg:flex text-enhanced-blue border-enhanced-blue" />
				)}
			</Carousel>
		</div>
	);
};
const Events = () => {
	const [events, setEvents] = useState<Array<EventProps> | null>([]); // Sửa ở đây

	// Tạo danh sách event tạm thời, lặp lại theo số lượng yêu cầu
	const generateTempEvents = (count: number): Array<EventProps> => {
		return Array.from({ length: count }, (_, index) => ({
			id: `temp-${index + 1}`,
			title: `CGS International Carving a Niche in Financial Services`,
			imageUrl: "/images/home-ev-temp.png",
			description: `With its rebranding, CGS International is moving beyond traditional
						brokerage services. As Deputy CEO Khairi Shahrin explains, there’s no
						value in chasing bottom-feeding fees - CGS is diving into niche
						markets where others aren't looking. He discusses the company’s
						strategy for growth, leveraging its China connection, and key trends
						shaping 2025.`,
			date: "05-May-2025",
			time: "8:00PM - 9:00PM ",
			location: "Zoom Webinar",
		}));
	};

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
		<div className="bg-[url('/images/bg-event.png')] py-12">
			<div className="container-default">
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<span className="font-semibold text-base">Event & Seminars</span>
					</div>
					<div className="flex items-center gap-3">
						<Button
							onClick={cycleEventsState}
							className="bg-transparent text-xs px-2 py-1 border border-enhanced-blue text-enhanced-blue rounded hover:bg-enhanced-blue/10"
						>
							Change number event
						</Button>
						<Link
							href={ENDPOINT.CGSI_EVENTS}
							className="text-enhanced-blue text-xs md:text-sm font-normal"
							target="_blank"
						>
							View All
						</Link>
					</div>
				</div>

				{/* Event Carousel */}

				<div className="mt-6">
					{events === null ? (
						<div className="py-[86px] flex flex-col items-center justify-center h-full">
							<Image
								src="/icons/home-ev-error.svg"
								alt="loading"
								width={100}
								height={100}
								className=""
							/>
							<div className="mt-6 self-stretch text-center text-typo-primary text-base font-semibold leading-normal">
								Oops, Something Went Wrong
							</div>
							<div className="self-stretch mt-1 text-center  text-typo-secondary text-sm font-normal leading-tight">
								We are unable to display the content,please{" "}
								<span className="block">please try again later.</span>
							</div>
						</div>
					) : events.length === 0 ? (
						<div className="py-[86px] flex flex-col items-center justify-center h-full">
							<Image
								src="/icons/home-ev-noevent.svg"
								alt="loading"
								width={100}
								height={100}
								className=""
							/>
							<div className="mt-6 self-stretch text-center text-typo-primary text-base font-semibold leading-normal">
								Currently No Scheduled Events
							</div>
							<div className="self-stretch mt-1 text-center  text-typo-secondary text-sm font-normal leading-tight">
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
