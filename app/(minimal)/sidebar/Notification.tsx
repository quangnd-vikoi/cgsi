"use client";
import { cn, formatNotificationHtml } from "@/lib/utils";
import { Dot, MailOpen } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import type { INotification } from "@/types";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { useSheetStore } from "@/stores/sheetStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { ErrorState } from "@/components/ErrorState";
import { isUnreadNotification, notificationService } from "@/lib/services/notificationService";
import { Skeleton } from "@/components/ui/skeleton";

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

const NotiItem = ({ notification }: { notification: INotification }) => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleNotiClick = () => {
		setOpenSheet("detail_notification", { notification });
	};

	const isUnread = isUnreadNotification(notification);

	return (
		<div
			className={cn(
				"p-4 border-b border-stroke-secondary cursor-pointer relative",
				isUnread && "bg-background-section hover:bg-background-selected"
			)}
			onClick={handleNotiClick}
		>
			<div className="flex gap-0 md:gap-1 relative right-2 md:right-0">
				{isUnread && (
					<Dot className="text-status-error md:absolute md:-left-4.5 shrink-0" strokeWidth="3" color="#D92B2B" />
				)}
				<span className="text-sm md:text-base font-semibold leading-5 line-clamp-2 flex-1 min-w-0 relative right-1 md:right-0">{notification.title}</span>
			</div>

			<div
				className="line-clamp-3 text-typo-secondary text-sm mt-1 md:mt-2 leading-4 [&_a]:text-cgs-blue [&_a]:underline [&_b]:font-semibold"
				dangerouslySetInnerHTML={{ __html: formatNotificationHtml(notification.description) }}
			/>

			<p className="text-typo-secondary mt-4 text-xs">{formatDate(notification.createdOn)}</p>
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
	const unreadCount = listNoti.filter(isUnreadNotification).length;
	const hasUnread = unreadCount > 0;

	// Update global unread count whenever listNoti changes
	useEffect(() => {
		const count = listNoti.filter(isUnreadNotification).length;
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

		const response = await notificationService.getNotifications(pageSize, currentPageIndex);

		if (response.success && response.data) {
			const { notifications, total } = response.data;

			// Sort notifications by createdOn date, newest first
			const sortedNotifications = [...notifications].sort((a, b) => {
				const dateA = new Date(a.createdOn).getTime();
				const dateB = new Date(b.createdOn).getTime();
				return dateB - dateA; // Descending order (newest first)
			});

			if (append) {
				// Append to existing list (pagination)
				setListNoti((prev) => [...prev, ...sortedNotifications]);
			} else {
				// Replace list (initial load)
				setListNoti(sortedNotifications);
			}
			setTotal(total);
			setError(null); // Clear error on success
		} else {
			console.error("Failed to fetch notifications:", response.error);
			if (!append) {
				// Only set error state for initial load failures
				setError(response.error || "Unable to load notifications");
			} else {
				// For pagination failures, just show a toast
				toast.error("Unable to Load", response.error || "We could not load more notifications. Please try again later.");
			}
		}

		if (append) {
			setLoadingMore(false);
		} else {
			setLoading(false);
		}
	};

	// Initial fetch on mount
	useEffect(() => {
		fetchNotifications(0);
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
		const unreadIds = listNoti.filter(isUnreadNotification).map((noti) => noti.id);

		if (unreadIds.length === 0) {
			toast.info("No Unread Notifications", "All messages are already marked as read.");
			return;
		}

		const response = await notificationService.markNotificationsAsRead(unreadIds);

		if (response.success && response.data?.success) {
			// Update local state - change new/unread notifications to read
			setListNoti((prev) =>
				prev.map((noti) => ({
					...noti,
					status: isUnreadNotification(noti) ? "R" : noti.status,
				}))
			);
			toast.success("All Caught Up", "All messages have been marked as read.");
		} else {
			console.error("Failed to mark as read:", response.error);
			toast.error("Unable to Update", response.error || "We could not mark your notifications as read. Please try again later.");
		}
	};

	return (
		<div className="relative h-full flex flex-col">
			<CustomSheetTitle title="Notification Centre" />

			<div className="flex justify-between items-center mt-6 flex-shrink-0">
				<p className="text-sm font-medium text-typo-secondary">
					{unreadCount} Unread Notification{unreadCount !== 1 ? "s" : ""}
				</p>

				<Alert
					trigger={
						<Button
							disabled={!hasUnread}
							className={cn(
								"font-medium flex gap-1 items-center bg-transparent p-0 hover:bg-transparent border ",
								hasUnread ? "text-cgs-blue border-cgs-blue underline underline-offset-2 md:no-underline" : "text-[#BAC3D1] border-[#BAC3D1] bg-transparent"
							)}
						>
							<MailOpen className="w-4 p-0" />
							<span className="text-sm">Mark All as Read</span>
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
					<div className="px-4 pt-6 space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						))}
					</div>
				) : error ? (
					<ErrorState
						type="error"
						title="Oops, Something Went Wrong"
						description="We are unable to display notifications at this time. Please try again later."
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
