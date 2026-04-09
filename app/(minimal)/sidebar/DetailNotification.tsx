import React, { useEffect } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Image from "@/components/Image";
import { useSheetStore } from "@/stores/sheetStore";
import { INotification } from "@/types";
import { isUnreadNotification, notificationService } from "@/lib/services/notificationService";
import { formatNotificationHtml } from "@/lib/utils";

/**
 * Format ISO 8601 date to display format
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string (e.g., "24-Aug-2025, 06:30 SGT")
 */
function formatDate(isoDate: string): string {
	try {
		const date = new Date(isoDate);
		const parts = new Intl.DateTimeFormat("en-SG", {
			timeZone: "Asia/Singapore",
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}).formatToParts(date);
		const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
		return `${get("day")}-${get("month")}-${get("year")}, ${get("hour")}:${get("minute")} SGT`;
	} catch {
		return isoDate;
	}
}

const DetailNotification = () => {
	const { notification } = useSheetStore((state) => state.payload) as { notification: INotification };

	useEffect(() => {
		if (notification && isUnreadNotification(notification)) {
			notificationService.markNotificationAsRead(notification.id).catch(console.error);
		}
	}, [notification?.id, notification?.status]);

	// Check if payload doesn't exist or is empty
	if (!notification) {
		return (
			<div>
				<CustomSheetTitle title="Details" backTo={"notification"} />
				<div className="mt-6 text-center text-typo-secondary">
					<p>No notification selected</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="relative h-full flex flex-col">
				<CustomSheetTitle title="Details" backTo={"notification"} />
				<div className="mt-6">
					{/* Only show image if imageUrl exists */}
					{notification.imageUrl && (
						<Image
							src={notification.imageUrl}
							alt="Notification"
							width={400}
							height={128}
							className="w-full mb-4"
						/>
					)}
					<p className="text-base font-semibold text-typo-primary line-clamp-2">{notification.title}</p>
					<p className="text-xs text-typo-secondary leading-4 mt-4">{formatDate(notification.createdOn)}</p>


					<div className="w-full h-[1px] border-t my-4"></div>
					<div
						className="text-sm text-typo-secondary whitespace-pre-wrap [&_a]:text-cgs-blue [&_a]:underline [&_b]:font-semibold [&_br]:leading-8"
						dangerouslySetInnerHTML={{ __html: formatNotificationHtml(notification.description) }}
					/>
				</div>
			</div>
		</div>
	);
};

export default DetailNotification;
