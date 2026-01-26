"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "@/components/Image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { IEventProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";
import { cn, formatDate } from "@/lib/utils";
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
		<Link href={CGSI.EVENT_BY_ID(event.id)} target="_blank" className="mb-[1px] block group">
			<div className="bg-white rounded flex flex-col hover:shadow transition-shadow">
				<div className="relative w-full aspect-[283/150] overflow-hidden">
					<Image
						className={cn("rounded-t object-cover transition-transform duration-300 group-hover:scale-105", imageClassName)}
						src={event.imageUrl}
						alt={event.title}
						fill
					/>
				</div>
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

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const url = ENDPOINTS.events();
				const response = await fetchAPI<EventAPIItem[]>(url);

				if (response.success && response.data) {
					// Deduplicate events based on SEO_Page_Name
					const uniqueEvents = response.data.filter(
						(event, index, self) =>
							index === self.findIndex((e) => e.SEO_Page_Name === event.SEO_Page_Name)
					);
					setEvents(uniqueEvents);
				}
			} catch (error) {
				console.error("Failed to fetch events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	if (loading) {
		return null; // Or a loading skeleton
	}

	return (
		<div
			className="bg-background-section bg-cover py-6 md:py-12"
		>
			<div className="md:mx-6 xl:mx-auto mx-4 xl:max-w-[1320px]">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-lg md:text-2xl">Events & Seminar</span>
					</div>
					<div className="flex items-center gap-3">
						<ViewAll href={CGSI.EVENTS} />
					</div>
				</div>

				{/* Event Carousel */}
				<div className="mt-4 md:mt-6">
					{events.length === 0 ? (
						<ErrorState
							type="empty"
							title="Currently No Scheduled Events"
							description="Check back soon—new events are on the way!"
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
										date: formatDate(item.Event_StartDate),
										time: item.Tagging_Timing || "7.30pm SGT (TBC)",
										location: item.Tagging_EventType || "Webinar",
									}}
									imageClassName={imageClassName}
								/>
							)}
							getItemKey={(item) => item.SEO_Page_Name}
							itemsPerView={{
								mobile: "basis-[75.2%]",
								tablet: "md:basis-[50.8%]",
								laptop: "lg:basis-[33.4%]",
								desktop: "xl:basis-[33.3%]",
							}}
							centerThreshold={{
								tablet: 2,
								laptop: 3,
								desktop: 3,
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
