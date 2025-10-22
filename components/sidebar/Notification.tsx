"use client";
import { cn } from "@/lib/utils";
import { Dot, MailOpen } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import HomeEvNoevent from "@/public/icons/home-ev-noevent.svg";
import Image from "next/image";
import Alert from "../Alert";
import { Button } from "../ui/button";
import { toast } from "../ui/toaster";
import { INotification } from "@/types";
import CustomSheetTitle from "./CustomSheetTitle";

const tempNoti: INotification = {
	title: "Why Investors Are Looking Beyond the United States in 2025",
	description:
		"Investors are increasingly shifting capital away from U.S. markets. The article explains how a weaker U.S. dollar, rising trade uncertainties, and more attractive valuations in global markets are driving",
	read: true,
	time: "24-Aug-2025, 06:30 SGT",
};

const NotiItem = ({
	notification,
	setDetailViewing,
}: {
	notification: INotification;
	setDetailViewing: Dispatch<SetStateAction<INotification | null>>;
}) => {
	return (
		<div
			className={cn(
				"p-4 border-b border-stroke-secondary cursor-pointer",
				notification.read && "bg-status-selected"
			)}
			onClick={() => setDetailViewing(notification)}
		>
			<div className="flex gap-1">
				{notification.read && <Dot className="text-status-error" strokeWidth="5" color="#D92B2B" />}
				<span className="text-sm font-semibold leading-5">{notification.title}</span>
			</div>

			<p className="line-clamp-3 text-typo-secondary text-xs mt-1.5 leading-4">
				{notification.description}
			</p>

			<p className="text-typo-tertiary mt-4 text-xs">{notification.time}</p>
		</div>
	);
};

const Notification = () => {
	const [listNoti, setListNoti] = useState<INotification[]>([
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
		{ ...tempNoti, read: true },
		{ ...tempNoti, read: false },
	]);

	const [detailViewing, setDetailViewing] = useState<INotification | null>(null);
	const [hasUnread, setHasUnread] = useState(false);

	console.log("Has Unread", hasUnread);
	useEffect(() => {
		setHasUnread(listNoti.some((noti: INotification) => noti.read));
	}, [listNoti]);

	const handleMarkAllRead = () => {
		setListNoti((prev) =>
			prev.map((noti: INotification) => ({
				...noti,
				read: false,
			}))
		);
		toast.success("All Caught Up", "All messages have been marked as read.");
	};

	if (detailViewing === null) {
		return (
			<div className="relative h-full flex flex-col">
				<CustomSheetTitle title="Notification Centre" />

				<div className="flex justify-between items-center text-xs mt-6 flex-shrink-0">
					<p>2 Unread Notification(s)</p>

					<Alert
						trigger={
							<Button
								disabled={!hasUnread}
								className={cn(
									"font-medium flex gap-1 items-center bg-transparent p-0 hover:bg-transparent",
									hasUnread ? "text-enhanced-blue" : "text-status-disable-primary"
								)}
							>
								<MailOpen className="w-4 p-0" />
								<p className="text-xs">Mark All as Read</p>
							</Button>
						}
						title="Mark All as Read"
						description="Marking all messages as read may cause you to miss important information."
						onAction={() => handleMarkAllRead()}
					/>
				</div>
				<div className="flex flex-col overflow-y-auto sidebar-scroll flex-1 mt-4">
					{listNoti.length > 0 ? (
						listNoti.map((noti, index) => (
							<NotiItem key={index} notification={noti} setDetailViewing={setDetailViewing} />
						))
					) : (
						<div className="text-enhanced-blue pt-[72px] px-5 flex flex-col items-center gap-6">
							<HomeEvNoevent width={100} height={100} />
							<div className="text-center px-4">
								<p className="text-typo-primary text-base font-semibold">
									Notification Centre is currently empty
								</p>
								<p className="text-typo-secondary text-sm ">
									We&apos;ll let you know as soon as something new comes in
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return (
			<div className="relative h-full flex flex-col">
				{/* Your notification items */}

				<div className="mt-6">
					<Image
						src={"/images/bg-event.png"}
						alt="placeholder"
						width={400}
						height={128}
						className="w-full mb-4"
					/>
					<p className="text-base font-semibold text-typo-primary">{detailViewing.title}</p>
					<p className="text-xs text-typo-tertiary leading-4 mt-4">{detailViewing.time}</p>

					<div className="w-full h-[1px] border-t my-4"></div>
					<p className="text-sm text-typo-secondary">{detailViewing.description}</p>
				</div>
			</div>
		);
	}
};

export default Notification;
