"use client";
import { cn } from "@/lib/utils";
import { Dot, MailOpen } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
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
import { useNotificationStore } from "@/stores/notificationStore";
import { ErrorState } from "@/components/ErrorState";
import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

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
	} catch {
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
	const [error, setError] = useState<string | null>(null);

	const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

	const pageSize = 10;
	const hasMore = (pageIndex + 1) * pageSize < total;

	// Calculate unread count
	const unreadCount = listNoti.filter((noti) => noti.status === "U").length;
	const hasUnread = unreadCount > 0;

	// Update global unread count whenever listNoti changes
	useEffect(() => {
		const count = listNoti.filter((noti) => noti.status === "U").length;
		setUnreadCount(count);
	}, [listNoti, setUnreadCount]);

	// Fetch notifications from API
	const fetchNotifications = async (currentPageIndex: number, append: boolean = false) => {
		if (append) {
			setLoadingMore(true);
		} else {
			setLoading(true);
			setError(null); // Clear previous errors on fresh load
		}

		const response = await fetchAPI<NotificationListResponse>(
			ENDPOINTS.notificationList(pageSize, currentPageIndex),
			{ useAuth: true } // Requires authentication
		);

		if (response.success && response.data) {
			const { notifications, total } = response.data;
			if (append) {
				// Append to existing list (pagination)
				setListNoti((prev) => [...prev, ...notifications]);
			} else {
				// Replace list (initial load)
				setListNoti(notifications);
			}
			setTotal(total);
			setError(null); // Clear error on success
		} else {
			console.error("Failed to fetch notifications:", response.error);
			if (!append) {
				// Only set error state for initial load failures
				setError(response.error || "Failed to load notifications");
			} else {
				// For pagination failures, just show a toast
				toast.error("Error", response.error || "Failed to load more notifications");
			}
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
					return; // Exit early, nothing to process
				}
				const latestNotifications = response.data;
				// Merge new notifications with existing ones (avoid duplicates)
				setListNoti((prev) => {
					const existingIds = new Set(prev.map((n) => n.id));
					const newNotifications = latestNotifications.filter((n) => !existingIds.has(n.id));
					if (newNotifications.length > 0) {
						// Prepend new notifications to the list (red dot will show for unread)
						return [...newNotifications, ...prev];
					}
					return prev;
				});

				// Update total count
				setTotal((prev) => prev + latestNotifications.length);
			} else {
				// API returned an error - log but don't show toast (polling should be silent)
				console.error("Failed to fetch latest notifications (polling):", response.error);
			}
		} catch (err) {
			// Network error or unexpected exception - log but don't show toast
			console.error("Error polling for latest notifications:", err);
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

	// Infinite scroll observer
	const observerTarget = useRef<HTMLDivElement>(null);

	// Load more notifications (pagination)
	const handleLoadMore = useCallback(() => {
		if (loadingMore || !hasMore) return;

		const nextPage = pageIndex + 1;
		setPageIndex(nextPage);
		fetchNotifications(nextPage, true);
	}, [pageIndex, loadingMore, hasMore]);

	// Set up intersection observer for infinite scroll
	useEffect(() => {
		const target = observerTarget.current;
		if (!target) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore) {
					handleLoadMore();
				}
			},
			{ threshold: 0.1 }
		);

		observer.observe(target);

		return () => {
			if (target) observer.unobserve(target);
		};
	}, [hasMore, loadingMore, handleLoadMore]);

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
			{ useAuth: true }
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
				) : error ? (
					<ErrorState
						type="error"
						title="Failed to load notifications"
						description={error}
						className="!pt-[72px] justify-start"
					/>
				) : listNoti.length > 0 ? (
					<>
						{listNoti.map((noti) => (
							<NotiItem key={noti.id} notification={noti} />
						))}

						{/* Infinite scroll trigger */}
						{hasMore && (
							<div ref={observerTarget} className="p-4 flex items-center justify-center">
								{loadingMore && (
									<p className="text-typo-secondary text-sm">Loading more...</p>
								)}
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
