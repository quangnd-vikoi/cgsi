export interface INotification {
	id: string; // Required for mark as read functionality
	title: string;
	description: string;
	category: string; // Notification category for filtering/grouping
	status: "R" | "U"; // "R" = Read, "U" = Unread
	createdOn: string; // ISO 8601 date-time format
}

// API Response Types for Notifications
export interface NotificationListResponse {
	total: number;
	notifications: INotification[];
}

export interface NotificationMarkAsReadRequest {
	ids: string[]; // Array of notification IDs to mark as read (minItems: 1)
}

export interface NotificationMarkAsReadResponse {
	isSuccess: boolean;
}

export interface IEventProps {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	date: string;
	time: string;
	location: string;
}

export type SheetType =
	| "notification"
	| "profile"
	| "announcement"
	| "contact"
	| "trading_representative"
	| "client_services"
	| "central_dealing_desk"
	| "password_and_security"
	| "detail_notification"
	| "acknowledgements"
	| "trading_declarations"
	| "trading_accounts"
	| "trading_account_details"
	| "user_profile"
	| "my_subscriptions"
	| null;

export interface IResearchArticleProps {
	id: string;
	title: string;
	description: string;
	date: string;
	author: string;
	tag: string;
	url: string;
}

export interface IInsightProps {
	id: string;
	imageUrl: string;
	tag: string; // "Idea of the Day"
	title: string; // "Malaysian Portfolios with US-China Trade Exposure"
	description: string; // đoạn mô tả ngắn
	date: string; // "25-Aug-2025"
}
