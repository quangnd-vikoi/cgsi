import React from "react";
import { INotification } from "@/types";
import CustomSheetTitle from "./CustomSheetTitle";
const Announcements = ({
	detailViewing = {
		time: "24-Aug-2025, 06:30 SGT",
		title: "iTrade+ Maintenance Unavailable at 30-Aug-2025, 06:00 - 13:30",

		description:
			"Dear Clients,Please be informed that iTrade+ will undergo scheduled system maintenance on 30 March 2025 from 06:00 AM to 1:30 PM (SGT). During this time, the platform will be unavailable for all trading and account-related activities.We recommend completing any necessary transactions before the maintenance period begins. Normal service will resume immediately after the maintenance is completed.Thank you for your understanding.",
		read: true,
	},
}: // setDetailViewing,
{
	detailViewing?: INotification;
	// setDetailViewing: Dispatch<SetStateAction<INotification | null>>;
}) => {
	return (
		<div className="relative h-full flex flex-col">
			<CustomSheetTitle title="Announcement" />
			{/* Your notification items */}

			<div className="mt-6">
				<p className="text-base font-semibold text-typo-primary">{detailViewing.title}</p>
				<p className="text-xs text-typo-tertiary leading-4 mt-4">{detailViewing.time}</p>

				<div className="w-full h-[1px] border-t my-4"></div>
				<p className="text-sm text-typo-secondary">{detailViewing.description}</p>
			</div>
		</div>
	);
};

export default Announcements;
