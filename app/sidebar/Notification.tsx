"use client";
import { cn } from "@/lib/utils";
import { Dot, MailOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { INotification } from "@/types";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { useSheetStore } from "@/stores/sheetStore";
import { ErrorState } from "@/components/ErrorState";

const tempNoti: INotification = {
	title: "Why Investors Are Looking Beyond the United States in 2025",
	description:
		"Investors are increasingly shifting capital away from U.S. markets. The article explains how a weaker U.S. dollar, rising trade uncertainties, and more attractive valuations in global markets are driving",
	read: true,
	time: "24-Aug-2025, 06:30 SGT",
};

const NotiItem = ({ notification }: { notification: INotification }) => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleNotiClick = () => {
		setOpenSheet("detail_notification", { notification });
	};
	return (
		<div
			className={cn(
				"p-4 border-b border-stroke-secondary cursor-pointer",
				notification.read && "bg-status-selected"
			)}
			onClick={handleNotiClick}
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
					listNoti.map((noti, index) => <NotiItem key={index} notification={noti} />)
				) : (
					<ErrorState
						type="empty"
						title="Notification Centre is currently empty"
						description="We'll let you know as soon as something new comes in"
						className="!pt-[72px] justify-start"
					/>
				)}
			</div>
		</div>
	);
};

export default Notification;
