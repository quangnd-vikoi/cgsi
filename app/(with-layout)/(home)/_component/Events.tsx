"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "@/components/Image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { IEventProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { getBgImageClass } from "@/lib/utils";
import ViewAll from "@/components/ViewAll";

// API Response Interface
interface EventAPIItem {
	SEO_Page_Name: string;
	MastheadBasic_Article_Title: string;
	MastheadBasic_Article_Short: string;
	Event_StartDate: string;
	Tagging_EventType: string;
	Tagging_EventStatus: string;
	MastheadBasic_Article_Card_Thumbnail_Image: string;
	Tagging_Timing?: string; // Optional as it might not be in all items
}

// Event Card Component
const EventCard = ({ event, imageClassName }: { event: IEventProps; imageClassName?: string }) => {
	return (
		<Link href={CGSI.EVENT_BY_ID(event.id)} target="_blank" className="mb-[1px] block">
			<div className="bg-white shadow mb-[1px] rounded flex flex-col">
				<Image
					className={cn("rounded-t w-full h-auto", imageClassName)}
					src={event.imageUrl}
					alt={event.title}
					width={283}
					height={283}
				/>
				<div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 ">
					<div className="h-12 text-base md:text-lg font-semibold line-clamp-2 leading-6">{event.title}</div>

					<div className="text-sm md:text-base text-typo-secondary line-clamp-3 md:line-clamp-3 h-[72px] overflow-hidden">
						{event.description}
					</div>
					<div className="flex flex-col gap-3 text-sm md:text-base text-typo-secondary">
						<div className="flex items-center gap-4  ">
							<Calendar className="w-5 h-5 text-cgs-blue" strokeWidth={1.25} />
							{event.date}
						</div>

						{event.time && (
							<div className="flex items-center gap-4 leading-6">
								<Clock className="w-5 h-5 text-cgs-blue" strokeWidth={1.25} />
								{event.time}
							</div>
						)}

						<div className="flex items-center gap-4 leading-6">
							<MapPin className="w-5 h-5 text-cgs-blue" strokeWidth={1.25} />
							{event.location}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

interface EventsProps {
	imageClassName?: string;
}

const Events = ({ imageClassName }: EventsProps) => {
	const [events, setEvents] = useState<EventAPIItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		const fetchEvents = async () => {
			try {
				const url = ENDPOINTS.events();
				const response = await fetchAPI<EventAPIItem[]>(url);

				if (response.success && response.data) {
					setEvents(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	if (!mounted || loading) {
		return null; // Or a loading skeleton
	}

	return (
		<div
			className="bg-background-section md:bg-cover py-6 md:py-12"
		>
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1320px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-2xl">Event & Seminars</span>
					</div>
					<div className="flex items-center gap-3">
						<ViewAll href={CGSI.EVENTS} />
					</div>
				</div>

				{/* Event Carousel */}
				<div className="mt-7">
					{events.length === 0 ? (
						<ErrorState
							type="empty"
							title="Currently No Scheduled Events"
							description="Check back soon—new events are on the way!"
							className="md:py-[86px]"
						/>
					) : (
						<CustomizeCarousel<EventAPIItem>
							items={events}
							renderItem={(item) => (
								<EventCard
									event={{
										id: item.SEO_Page_Name,
										title: item.MastheadBasic_Article_Title,
										imageUrl: item.MastheadBasic_Article_Card_Thumbnail_Image,
										description: item.MastheadBasic_Article_Short,
										date: item.Event_StartDate,
										time: item.Tagging_Timing || "7.30pm SGT (TBC)",
										location: item.Tagging_EventType || "Webinar",
									}}
									imageClassName={imageClassName}
								/>
							)}
							getItemKey={(item) => item.SEO_Page_Name}
							loop={true}
							itemsPerView={{
								"mobile": "basis-[75.2%]",
								"tablet": "md:basis-[50.8%]",
								"laptop": "lg:basis-[33.4%]",
								"desktop": "xl:basis-[33.3%]",
							}}
							centerThreshold={{
								"tablet": 2,
								"laptop": 3,
								"desktop": 3,
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
