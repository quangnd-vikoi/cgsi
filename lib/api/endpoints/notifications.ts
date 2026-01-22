/**
 * Notification-related API endpoints (relative paths only)
 * Base URL will be automatically prepended when exported
 */
export const notificationEndpoints = {
	/**
	 * Get List of User Notifications (Paginated)
	 * @param pageSize - Number of notifications per page (default: 10, minimum: 1)
	 * @param pageIndex - Page index, 0-based (default: 0, minimum: 0)
	 * Returns: { total: number, notifications: UserNotificationData[] }
	 * Requires: Authentication (Bearer token)
	 */
	notificationList: (pageSize = 10, pageIndex = 0) =>
		`/notification/api/v1/list?pageSize=${pageSize}&pageIndex=${pageIndex}`,

	/**
	 * Get Latest User Notifications
	 * Retrieves notifications from the past X minutes for polling/real-time updates
	 * @param pastMins - Number of past minutes to retrieve (default: 5, minimum: 1)
	 * Returns: UserNotificationLatestResponse[]
	 * Requires: Authentication (Bearer token)
	 */
	notificationLatest: (pastMins = 5) => `/notification/api/v1/latest?pastMins=${pastMins}`,

	/**
	 * Mark User Notifications as Read
	 * POST request with body: { ids: string[] }
	 * Updates notification status from "U" (unread) to "R" (read)
	 * @returns { isSuccess: boolean }
	 * Requires: Authentication (Bearer token)
	 */
	notificationMarkAsRead: () => `/notification/api/v1/markAsRead`,
} as const;
