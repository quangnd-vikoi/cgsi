"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { INotification, NotificationListResponse } from "@/types";

/**
 * Background notification polling component
 * Runs on all pages to fetch unread notification count
 * - Initial load: Fetches full notification list for accurate count
 * - Polling: Uses /latest endpoint to check for new notifications every 5 minutes
 */
export function NotificationPolling() {
	const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

	// Initial fetch: Get full notification list for accurate unread count
	const fetchInitialUnreadCount = async () => {
		try {
			const response = await fetchAPI<NotificationListResponse>(
				ENDPOINTS.notificationList(50, 0),
				{ useAuth: true }
			);

			if (response.success && response.data) {
				const unreadCount = response.data.notifications.filter((n) => n.status === "U").length;
				setUnreadCount(unreadCount);
			} else {
				console.error("Failed to fetch initial notifications:", response.error);
			}
		} catch (err) {
			console.error("Error fetching initial notifications:", err);
		}
	};

	// Polling: Fetch latest notifications to update count
	const pollLatestNotifications = async () => {
		try {
			const response = await fetchAPI<INotification[]>(
				ENDPOINTS.notificationLatest(5), // Last 5 minutes
				{ useAuth: true }
			);

			if (response.success && response.data) {
				// Count unread notifications in latest batch
				const newUnreadCount = response.data.filter((n) => n.status === "U").length;
				// Update the count (this will add to existing count if there are new notifications)
				if (newUnreadCount > 0) {
					setUnreadCount((prev) => prev + newUnreadCount);
				}
			} else {
				console.error("Failed to poll latest notifications:", response.error);
			}
		} catch (err) {
			console.error("Error polling latest notifications:", err);
		}
	};

	// Initial fetch on mount
	useEffect(() => {
		fetchInitialUnreadCount();
	}, []);

	// Poll every 5 minutes for new notifications
	useEffect(() => {
		const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

		const intervalId = setInterval(() => {
			pollLatestNotifications();
		}, POLLING_INTERVAL);

		return () => clearInterval(intervalId);
	}, []);

	return null;
}
