// lib/api/endpoints.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.cgsi.com.sg/cgsi/api/v1";

export const LANG = {
	EN: 1,
	CN: 2,
} as const;

export type Language = (typeof LANG)[keyof typeof LANG];

export const ENDPOINTS = {
	/**
	 * Get Announcements
	 * @param lang - Language ID (1 = EN, 2 = CN)
	 * Reference: https://www.cgsi.com.sg/notices?lang=EN
	 */
	announcements: (lang: Language = LANG.EN) => `/GetAnnouncement?lang=${lang}`,

	/**
	 * Get Notices
	 * @param lang - Language ID (1 = EN, 2 = CN)
	 * Reference: https://www.cgsi.com.sg/notices?lang=EN
	 */
	notices: (lang: Language = LANG.EN) => `/GetNotices?lang=${lang}`,

	/**
	 * Get Campaigns/Promos
	 * @param lang - Language ID (1 = EN, 2 = CN)
	 * @param sort - Sort field (default: Campaign_StartDate)
	 * @param order - Sort order (asc | desc)
	 * Reference: https://www.cgsi.com.sg/campaigns/?lang=EN
	 */
	campaigns: (
		lang: Language = LANG.EN,
		sort: string = "Campaign_StartDate",
		order: "asc" | "desc" = "desc"
	) => `/GetCampaign?sort=${sort}&order=${order}&lang=${lang}`,

	/**
	 * Get Events
	 * @param lang - Language ID (1 = EN, 2 = CN)
	 * @param sort - Sort field (default: Event_StartDate)
	 * @param order - Sort order (asc | desc)
	 * Reference: https://www.cgsi.com.sg/events/?lang=EN
	 */
	events: (lang: Language = LANG.EN, sort: string = "Event_StartDate", order: "asc" | "desc" = "desc") =>
		`/GetEvent?sort=${sort}&order=${order}&lang=${lang}`,

	/**
	 * Get Research & Insights
	 * @param lang - Language ID (1 = EN, 2 = CN)
	 * @param sort - Sort field (default: Date)
	 * @param order - Sort order (asc | desc)
	 * Reference: https://www.cgsi.com.sg/insights/?lang=EN
	 */
	insights: (lang: Language = LANG.EN, sort: string = "Date", order: "asc" | "desc" = "desc") =>
		`/GetResearchAndInsight?sort=${sort}&order=${order}&lang=${lang}`,
} as const;
