import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { useSheetStore } from "@/stores/sheetStore";

interface AnnouncementItem {
	Announcement_Type: string;
	Announcement_Type_Label: string;
	Announcement_Title: string;
	Announcement_Content: string;
	Announcement_Start_Date: string;
	Announcement_End_Date: string;
}

function formatDate(dateStr: string): string {
	try {
		const [year, month, day] = dateStr.split("-");
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		return date.toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" });
	} catch {
		return dateStr;
	}
}

const Announcements = () => {
	const payload = useSheetStore((state) => state.payload) as { announcement?: AnnouncementItem } | undefined;
	const announcement = payload?.announcement;

	if (!announcement) {
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
				<p className="text-rsp-base font-semibold text-typo-primary">{announcement.Announcement_Title}</p>
				<p className="text-xs text-typo-secondary leading-4 mt-4">{formatDate(announcement.Announcement_Start_Date)}</p>

				<div className="w-full h-[1px] border-t my-6"></div>
				<div
					className="text-rsp-xs text-typo-secondary leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_a]:text-cgs-blue [&_a]:underline"
					dangerouslySetInnerHTML={{ __html: announcement.Announcement_Content }}
				/>
			</div>
		</div>
	);
};

export default Announcements;
