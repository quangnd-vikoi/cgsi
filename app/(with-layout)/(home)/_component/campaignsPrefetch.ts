import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";

export interface Campaign {
	SEO_Page_Name: string;
	MastheadBasic_Article_Title: string;
	MastheadBasic_Article_Short: string;
	Campaign_StartDate: string;
	MastheadBasic_Article_Card_Thumbnail_Image: string;
	Tagging_Timing?: string;
}

let campaignsPromise: Promise<APIResponse<Campaign[]>> | null = null;

export function prefetchCampaigns(): Promise<APIResponse<Campaign[]>> {
	if (!campaignsPromise) {
		campaignsPromise = fetchAPI<Campaign[]>(ENDPOINTS.campaigns());
	}
	return campaignsPromise;
}
