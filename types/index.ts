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
