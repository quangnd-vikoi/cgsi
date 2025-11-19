"use client";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { IEventProps } from "@/types";
import CustomizeCarousel from "@/components/CustomizeCarousel";
import { ErrorState } from "@/components/ErrorState";
import { cn } from "@/lib/utils";

// Event Card Component
const EventCard = ({ event, imageClassName }: { event: IEventProps; imageClassName?: string }) => {
	return (
		<div className="bg-white shadow mb-[1px] rounded-lg">
			<Image
				className={cn("rounded-t-lg w-full h-auto", imageClassName)}
				src={event.imageUrl}
				alt={event.title}
				width={283}
				height={283}
			/>
			<div className="flex flex-col gap-[14px] md:gap-4 px-3 py-[14px]">
				<div className="min-h-[32px] font-semibold text-xs line-clamp-2 leading-4">{event.title}</div>

				<div className="justify-start text-xs md:text-sm text-typo-secondary line-clamp-4 md:line-clamp-3 leading-4">
					{event.description}
					<br />
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex self-stretch gap-2 font-medium text-[10px] text-typo-tertiary">
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

// Events data
const events: Array<IEventProps> = [
	{
		id: "1",
		title: "Learn from the Pros",
		imageUrl: "/images/events/e1.png",
		description: `An initiative by CGS International, "Learn From The Pros" is a financial education series where experts from different professions in the financial industry share their investing and trading knowledge and experiences. It is an opportunity to learn from market practitioners on how we can all be better investors and traders.`,
		date: "27-Nov-2025",
		time: "7.30pm SGT",
		location: "Webinar",
	},
	{
		id: "2",
		title: "S-REITS Outlook 2H 2025",
		imageUrl: "/images/events/e2.png",
		description: `Singapore REITs enter the second half of 2025 with resilience and value on their side. Supported by stable fundamentals and attractive yields, the sector remains a key focus for investors seeking both income and growth. Join us as our analyst shares her outlook on the market and the opportunities that lie ahead.`,
		date: "11-Sep-2025",
		time: "7.30pm SGT",
		location: "Webinar",
	},
	{
		id: "3",
		title: "Diversify to the Power of Three: Geography, Income and Growth",
		imageUrl: "/images/events/e3.png",
		description: `While diversification is key in any environment or time period, it is particularly important now, as heightened geopolitical uncertainty continues to sway markets. With volatility expected to persist, diversification remains a cornerstone of resilient investment strategies and ETFs continue to uniquely offer cost-effective access to a broad range of markets and sectors.`,
		date: "07-Aug-2025",
		time: "7.30pm SGT",
		location: "Webinar",
	},
	{
		id: "4",
		title: "Unlock the Full Potential of CGS International iTrade - Join Our Live Platform",
		imageUrl: "/images/events/e4.png",
		description: `Whether you're new to our platform or looking to sharpen your trading edge, we invite you to join our exclusive live webinars designed to help you navigate and maximise the features of CGS iTrade Web and Mobile app. Conducted during actual trading hours, the webinars are designed to simulate a real-life trading environment—giving you hands-on exposure to the platform’s features as they function in real time.`,
		date: "15-Jul-2025 to 31-Dec-2025",
		time: "Tues, 10am & 2.30pm SGT",
		location: "Webinar",
	},
];

interface EventsProps {
	imageClassName?: string;
}

const Events = ({ imageClassName }: EventsProps) => {
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
						<CustomizeCarousel<IEventProps>
							items={events}
							renderItem={(event) => (
								<EventCard event={event} imageClassName={imageClassName} />
							)}
							getItemKey={(event) => event.id}
							loop={true}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
