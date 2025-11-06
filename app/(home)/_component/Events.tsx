"use client";
import { useState } from "react";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "next/image";
import { Calendar, Clock, MapPin, RefreshCcw } from "lucide-react";
import { IEventProps } from "@/types";
import { Button } from "@/components/ui/button";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";

// Event Card Component
const EventCard = ({ event }: { event: IEventProps }) => {
	return (
		<div className="bg-white shadow rounded-lg mb-[1px]">
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
	);
};

// Generate temporary events for testing
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

	// Cycle through different event states
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

		setEvents(null);
	};

	return (
		<div className="bg-background-section md:bg-[url('/images/bg-event.png')] bg-cover py-6 md:py-12">
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
							href={CGSI.EVENTS}
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
						<ErrorState type="error" className="md:py-[86px]" />
					) : events.length === 0 ? (
						<ErrorState
							type="empty"
							title="Currently No Scheduled Events"
							description="Check back soon—new events are on the way!"
							className="md:py-[86px]"
						/>
					) : (
						<CustomizeCarousel<IEventProps>
							items={events}
							renderItem={(event) => <EventCard event={event} />}
							getItemKey={(event) => event.id}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
