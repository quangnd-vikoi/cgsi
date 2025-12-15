/**
 * Notification-related API endpoints (relative paths only)
 * Base URL will be automatically prepended when exported
 */
export const notificationEndpoints = {
	/**
	 * Get List of User Notifications
	 * Returns list of active notifications with read/unread status
	 * Each notification includes: title, body, published date/time, update date
	 * Date format: DD-MMM-YYYY • HH:mm timezone (e.g., 24-Aug-2025, 06:30 SGT)
	 * Returns NULL if no new notifications
	 */
	notificationList: () => `/notification/list`,

	/**
	 * Mark User Notifications as Read
	 * Accepts notification IDs and updates status from unread to read
	 * Updates status to 'R'
	 * @returns Success/failure response
	 */
	notificationMarkAsRead: () => `/markAsRead`,
} as const;
