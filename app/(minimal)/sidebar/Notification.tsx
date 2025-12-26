"use client";
import { cn } from "@/lib/utils";
import { Dot, MailOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import {
	INotification,
	NotificationListResponse,
	NotificationMarkAsReadRequest,
	NotificationMarkAsReadResponse,
} from "@/types";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { useSheetStore } from "@/stores/sheetStore";
import { ErrorState } from "@/components/ErrorState";
import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Format ISO 8601 date to display format
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string (e.g., "24-Aug-2025, 06:30 SGT")
 */
function formatDate(isoDate: string): string {
	try {
		const date = new Date(isoDate);
		return date.toLocaleString("en-SG", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});
	} catch (error) {
		return isoDate; // Fallback to raw string if parsing fails
	}
}

const NotiItem = ({ notification }: { notification: INotification }) => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleNotiClick = () => {
		setOpenSheet("detail_notification", { notification });
	};

	const isUnread = notification.status === "U";

	return (
		<div
			className={cn(
				"p-4 border-b border-stroke-secondary cursor-pointer",
				isUnread && "bg-status-selected"
			)}
			onClick={handleNotiClick}
		>
			<div className="flex">
				{isUnread && (
					<Dot className="text-status-error relative right-1 -mr-1.5" strokeWidth="5" color="#D92B2B" />
				)}
				<span className="text-sm font-semibold leading-5">{notification.title}</span>
			</div>

			<p className="line-clamp-3 text-typo-secondary text-xs mt-1.5 leading-4">
				{notification.description}
			</p>

			<p className="text-typo-tertiary mt-4 text-xs">{formatDate(notification.createdOn)}</p>
		</div>
	);
};

const Notification = () => {
	const [listNoti, setListNoti] = useState<INotification[]>([]);
	const [total, setTotal] = useState(0);
	const [pageIndex, setPageIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);

	const pageSize = 10;
	const hasMore = (pageIndex + 1) * pageSize < total;

	// Calculate unread count
	const unreadCount = listNoti.filter((noti) => noti.status === "U").length;
	const hasUnread = unreadCount > 0;

	// Fetch notifications from API
	const fetchNotifications = async (currentPageIndex: number, append: boolean = false) => {
		if (append) {
			setLoadingMore(true);
		} else {
			setLoading(true);
		}

		const response = await fetchAPI<NotificationListResponse>(
			ENDPOINTS.notificationList(pageSize, currentPageIndex),
			{ useAuth: true } // Requires authentication
		);

		if (response.success && response.data) {
			if (append) {
				// Append to existing list (pagination)
				setListNoti((prev) => [...prev, ...response.data.notifications]);
			} else {
				// Replace list (initial load)
				setListNoti(response.data.notifications);
			}

			setTotal(response.data.total);
		} else {
			console.error("Failed to fetch notifications:", response.error);
			toast.error("Error", response.error || "Failed to load notifications");
		}

		if (append) {
			setLoadingMore(false);
		} else {
			setLoading(false);
		}
	};

	// Fetch latest notifications for polling
	const fetchLatestNotifications = async () => {
		try {
			const response = await fetchAPI<INotification[]>(
				ENDPOINTS.notificationLatest(5), // Last 5 minutes
				{ useAuth: true }
			);

			// Handle successful response
			if (response.success) {
				// Handle empty array or null/undefined data
				if (!response.data || response.data.length === 0) {
					console.log("No new notifications in the last 5 minutes");
					return; // Exit early, nothing to process
				}

				// Merge new notifications with existing ones (avoid duplicates)
				setListNoti((prev) => {
					const existingIds = new Set(prev.map((n) => n.id));
					const newNotifications = response.data.filter((n) => !existingIds.has(n.id));

					if (newNotifications.length > 0) {
						console.log(`Found ${newNotifications.length} new notification(s)`);

						// Show toast notification for new items
						toast.info(
							"New Notifications",
							`You have ${newNotifications.length} new notification${newNotifications.length > 1 ? "s" : ""}`
						);

						// Prepend new notifications to the list
						return [...newNotifications, ...prev];
					}

					console.log("All notifications already in list (duplicates filtered)");
					return prev;
				});

				// Update total count only if we have new data
				if (response.data && response.data.length > 0) {
					setTotal((prev) => prev + response.data.length);
				}
			} else {
				// API returned an error - log but don't show toast (polling should be silent)
				console.error("Failed to fetch latest notifications (polling):", response.error);
			}
		} catch (error) {
			// Network error or unexpected exception - log but don't show toast
			console.error("Error polling for latest notifications:", error);
		}
	};

	// Initial fetch on mount
	useEffect(() => {
		fetchNotifications(0);
	}, []);

	// Polling: Fetch latest notifications every 5 minutes
	useEffect(() => {
		const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

		const intervalId = setInterval(() => {
			fetchLatestNotifications();
		}, POLLING_INTERVAL);

		// Cleanup on unmount
		return () => clearInterval(intervalId);
	}, []);

	// Load more notifications (pagination)
	const handleLoadMore = () => {
		const nextPage = pageIndex + 1;
		setPageIndex(nextPage);
		fetchNotifications(nextPage, true);
	};

	// Mark all unread notifications as read
	const handleMarkAllRead = async () => {
		// Get all unread notification IDs
		const unreadIds = listNoti.filter((noti) => noti.status === "U").map((noti) => noti.id);

		if (unreadIds.length === 0) {
			toast.info("No Unread Notifications", "All messages are already marked as read.");
			return;
		}

		const requestBody: NotificationMarkAsReadRequest = { ids: unreadIds };

		const response = await postAPI<NotificationMarkAsReadResponse, NotificationMarkAsReadRequest>(
			ENDPOINTS.notificationMarkAsRead(),
			requestBody,
			{ useAuth: true } // Enable auth headers
		);

		if (response.success && response.data?.isSuccess) {
			// Update local state - change status from "U" to "R"
			setListNoti((prev) =>
				prev.map((noti) => ({
					...noti,
					status: noti.status === "U" ? "R" : noti.status,
				}))
			);
			toast.success("All Caught Up", "All messages have been marked as read.");
		} else {
			console.error("Failed to mark as read:", response.error);
			toast.error("Error", response.error || "Failed to mark notifications as read.");
		}
	};

	return (
		<div className="relative h-full flex flex-col">
			<CustomSheetTitle title="Notification Centre" />

			<div className="flex justify-between items-center text-xs mt-6 flex-shrink-0">
				<p>
					{unreadCount} Unread Notification{unreadCount !== 1 ? "s" : ""}
				</p>

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
					description={
						<p>
							Marking all messages as read may cause you to miss important information.
						</p>
					}
					onAction={() => handleMarkAllRead()}
				/>
			</div>

			<div className="flex flex-col overflow-y-auto sidebar-scroll flex-1 mt-4">
				{loading ? (
					<div className="flex items-center justify-center pt-20">
						<p className="text-typo-secondary text-sm">Loading notifications...</p>
					</div>
				) : listNoti.length > 0 ? (
					<>
						{listNoti.map((noti) => (
							<NotiItem key={noti.id} notification={noti} />
						))}

						{/* Load More Button for Pagination */}
						{hasMore && (
							<div className="p-4">
								<Button
									onClick={handleLoadMore}
									disabled={loadingMore}
									variant="outline"
									className="w-full"
								>
									{loadingMore ? "Loading..." : "Load More"}
								</Button>
							</div>
						)}
					</>
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
