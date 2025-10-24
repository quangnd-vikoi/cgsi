import React from "react";
import CustomSheetTitle from "./CustomSheetTitle";
import Image from "next/image";
import { useSheetStore } from "@/stores/sheetStore";
import { INotification } from "@/types";

const DetailNotification = () => {
	const { notification } = useSheetStore((state) => state.payload) as { notification: INotification };

	// Check nếu payload không tồn tại hoặc rỗng
	if (!notification) {
		return (
			<div>
				<CustomSheetTitle title="Detail" backTo={"notification"} />
				<div className="mt-6 text-center text-typo-secondary">
					<p>No notification selected</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="relative h-full flex flex-col">
				<CustomSheetTitle title="Detail" backTo={"notification"} />
				<div className="mt-6">
					<Image
						src={"/images/bg-event.png"}
						alt="placeholder"
						width={400}
						height={128}
						className="w-full mb-4"
					/>
					<p className="text-base font-semibold text-typo-primary">{notification.title}</p>
					<p className="text-xs text-typo-tertiary leading-4 mt-4">{notification.time}</p>

					<div className="w-full h-[1px] border-t my-4"></div>
					<p className="text-sm text-typo-secondary">{notification.description}</p>
				</div>
			</div>
		</div>
	);
};

export default DetailNotification;
