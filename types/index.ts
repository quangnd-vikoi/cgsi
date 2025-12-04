export interface INotification {
	title: string;
	description: string;
	read: boolean;
	time: string;
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
