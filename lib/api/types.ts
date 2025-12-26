export interface StandardAPIResponse<T> {
	status: "SUCCESS" | "ERROR";
	statuscode: string;
	article?: T;
	data?: T;
	message?: string;
}

export type DirectAPIResponse<T> = T & {
	error?: string;
};

export interface APIResponse<T> {
	success: boolean;
	data: T | null;
	error: string | null;
	statusCode: number;
}
