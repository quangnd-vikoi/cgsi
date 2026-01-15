import React, { useEffect, useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { useSheetStore } from "@/stores/sheetStore";
import { fetchAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Skeleton } from "@/components/ui/skeleton";

interface NoticeItem {
	Title: string;
	Content: string;
	Anchor_Link: string;
	CTA_Label: string | null;
	CTA: string | null;
	CTA_Label2: string | null;
	CTA2: string | null;
}

interface NoticeResponse {
	Content: NoticeItem[];
}

const Announcements = () => {
	const payload = useSheetStore((state) => state.payload) as { anchor_link?: string } | undefined;
	const [notice, setNotice] = useState<NoticeItem | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchNotices = async () => {
			if (!payload?.anchor_link) return;

			setLoading(true);
			try {
				const response = await fetchAPI<NoticeResponse>(ENDPOINTS.notices());
				if (response.success && response.data && Array.isArray(response.data.Content)) {
					const foundNotice = response.data.Content.find(
						(item) => item.Anchor_Link === payload.anchor_link
					);
					setNotice(foundNotice || null);
				} else {
					console.error("Invalid data format received:", response.data);
				}
			} catch (error) {
				console.error("Failed to fetch notices:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchNotices();
	}, [payload?.anchor_link]);

	if (loading) {
		return (
			<div className="relative h-full flex flex-col">
				<CustomSheetTitle title="Announcement" />
				<div className="mt-6 px-6 space-y-4">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			</div>
		);
	}

	if (!notice) {
		return (
			<div className="relative h-full flex flex-col">
				<CustomSheetTitle title="Announcement" />
				<div className="mt-6 text-center text-typo-secondary">No announcement found.</div>
			</div>
		);
	}

	return (
		<div className="relative h-full flex flex-col">
			<CustomSheetTitle title="Announcement" />

			<div className="mt-6 overflow-y-auto sidebar-scroll flex-1 pr-2 scrollbar-offset-laptop">
				<p className="text-base font-semibold text-typo-primary">{notice.Title}</p>
				{/* Date removed as it is not in the provided API response shape */}
				<p className="text-xs text-typo-tertiary leading-4 mt-4">24-Aug-2025, 06:30 SGT (TBC)</p>

				<div className="w-full h-[1px] border-t my-4"></div>
				<div
					className="text-sm text-typo-secondary leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_a]:text-cgs-blue [&_a]:underline"
					dangerouslySetInnerHTML={{ __html: notice.Content }}
				/>
			</div>
		</div>
	);
};

export default Announcements;
