"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { IEventProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/fetchWrapper";
import { ENDPOINTS } from "@/lib/apiConfig";

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
		<Link href={CGSI.EVENT_BY_ID(event.id)} target="_blank" className="mb-[1px] block h-[calc(100%-1px)]">
			<div className="bg-white shadow mb-[1px] rounded-lg h-full flex flex-col">
				<Image
					className={cn("rounded-t-lg w-full h-auto", imageClassName)}
					src={event.imageUrl}
					alt={event.title}
					width={283}
					height={283}
				/>
				<div className="flex flex-col gap-[14px] md:gap-4 px-3 py-[14px] flex-grow">
					<div className="min-h-[32px] font-semibold text-xs line-clamp-2 leading-4">{event.title}</div>

					<div className="justify-start text-xs md:text-sm text-typo-secondary line-clamp-4 md:line-clamp-3 leading-4 flex-grow">
						{event.description}
					</div>
					<div className="flex flex-col gap-2 mt-auto">
						<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary">
							<Calendar className="w-4 h-4" />
							{event.date}
						</div>

						{event.time && (
							<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
								<Clock className="w-4 h-4" />
								{event.time}
							</div>
						)}

						<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary leading-4">
							<MapPin className="w-4 h-4" />
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

	if (loading) {
		return null; // Or a loading skeleton
	}

	return (
		<div className="bg-background-section md:bg-[url('/images/bg-event.png')] bg-cover py-6 md:py-12">
			<div className="md:mx-6 xl:mx-auto mr-0 ml-4 xl:max-w-[1200px]">
				<div className="flex justify-between items-center pr-4 md:pr-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-base">Event & Seminars</span>
					</div>
					<div className="flex items-center gap-3">
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
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
