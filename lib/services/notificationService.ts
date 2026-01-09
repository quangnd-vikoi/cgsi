import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	NotificationListResponse,
	INotification,
	NotificationMarkAsReadRequest,
	NotificationMarkAsReadResponse,
} from "@/types";

export const getNotifications = async (
	pageSize = 10,
	pageIndex = 0
): Promise<APIResponse<NotificationListResponse>> => {
	return await fetchAPI<NotificationListResponse>(
		ENDPOINTS.notificationList(pageSize, pageIndex),
		{ useAuth: true }
	);
};

export const getLatestNotifications = async (
	pastMins = 5
): Promise<APIResponse<INotification[]>> => {
	return await fetchAPI<INotification[]>(ENDPOINTS.notificationLatest(pastMins), {
		useAuth: true,
	});
};

export const markNotificationsAsRead = async (
	ids: string[]
): Promise<APIResponse<NotificationMarkAsReadResponse>> => {
	const requestBody: NotificationMarkAsReadRequest = { ids };

	return await postAPI<NotificationMarkAsReadResponse, NotificationMarkAsReadRequest>(
		ENDPOINTS.notificationMarkAsRead(),
		requestBody,
		{ useAuth: true }
	);
};

export const markNotificationAsRead = async (
	id: string
): Promise<APIResponse<NotificationMarkAsReadResponse>> => {
	return await markNotificationsAsRead([id]);
};

export const getUnreadCount = async (): Promise<number> => {
	const response = await getNotifications(1000, 0);

	if (response.success && response.data) {
		return response.data.notifications.filter((n) => n.status === "U").length;
	}

	return 0;
};

export const markAllAsRead = async (): Promise<APIResponse<NotificationMarkAsReadResponse>> => {
	const listResponse = await getNotifications(1000, 0);

	if (!listResponse.success || !listResponse.data) {
		return {
			success: false,
			data: null,
			error: listResponse.error || "Failed to fetch notifications",
			statusCode: listResponse.statusCode,
		};
	}

	const unreadIds = listResponse.data.notifications
		.filter((n) => n.status === "U")
		.map((n) => n.id);

	if (unreadIds.length === 0) {
		return {
			success: true,
			data: { isSuccess: true },
			error: null,
			statusCode: 200,
		};
	}

	return await markNotificationsAsRead(unreadIds);
};

export const notificationService = {
	getNotifications,
	getLatestNotifications,
	markNotificationsAsRead,
	markNotificationAsRead,
	getUnreadCount,
	markAllAsRead,
};

export default notificationService;
