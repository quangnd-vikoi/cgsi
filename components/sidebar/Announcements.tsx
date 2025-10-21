import React from "react";
import { SheetClose, SheetHeader, SheetTitle } from "../ui/sheet";
import { X } from "lucide-react";
import { INotification } from "@/types";
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
			<SheetHeader className="p-0 text-[16px] lg:text-lg flex-shrink-0">
				<div className="flex justify-between">
					<SheetTitle className="text-typo-primary flex gap-2 items-center">
						{/* <ChevronLeft className="text-icon-light" onClick={() => setDetailViewing(null)} /> */}
						Announcement
					</SheetTitle>
					<SheetClose className="text-typo-secondary">
						<X />
					</SheetClose>
				</div>
			</SheetHeader>
			{/* Your notification items */}

			<div className="mt-6">
				{/* <Image
					src={"/images/bg-event.png"}
					alt="placeholder"
					width={400}
					height={128}
					className="w-full mb-4"
				/> */}
				<p className="text-base font-semibold text-typo-primary">{detailViewing.title}</p>
				<p className="text-xs text-typo-tertiary leading-4 mt-4">{detailViewing.time}</p>

				<div className="w-full h-[1px] border-t my-4"></div>
				<p className="text-sm text-typo-secondary">{detailViewing.description}</p>
			</div>
		</div>
	);
};

export default Announcements;
