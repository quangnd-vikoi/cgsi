/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { notificationService } from "@/lib/services/notificationService";
import { toast } from "@/components/ui/toaster";

export function NotificationPolling() {
	const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

	const fetchInitialUnreadCount = async () => {
		try {
			const response = await notificationService.getNotifications(50, 0);

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

	const pollLatestNotifications = async () => {
		try {
			const response = await notificationService.getLatestNotifications(5);

			if (response.success && response.data) {
				const unreadNotifications = response.data.filter((n) => n.status === "U");
				if (unreadNotifications.length > 0) {
					setUnreadCount((prev) => prev + unreadNotifications.length);

					// Show toast for each new notification
					unreadNotifications.forEach((notification) => {
						toast.info(notification.title, notification.description);
					});
				}
			} else {
				console.error("Failed to poll latest notifications:", response.error);
			}
		} catch (err) {
			console.error("Error polling latest notifications:", err);
		}
	};

	useEffect(() => {
		fetchInitialUnreadCount();
	}, []);

	useEffect(() => {
		const POLLING_INTERVAL = 5 * 60 * 1000;

		const intervalId = setInterval(() => {
			pollLatestNotifications();
		}, POLLING_INTERVAL);

		return () => clearInterval(intervalId);
	}, []);

	return null;
}
