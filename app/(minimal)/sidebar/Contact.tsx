import React from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SheetType } from "@/types";
import { useSheetStore } from "@/stores/sheetStore";

const Contact = () => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const contactOptions = [
		{
			title: "Trading Representative(s)",
			description: "For dedicated support & trading needs",
			available: null,
			sheet: "trading_representative" as SheetType,
		},
		{
			title: "Client Services",
			description: "For general enquiries during business hours",
			available: "08:30 - 17:30 SGT (Mon-Fri)",
			sheet: "client_services" as SheetType,
		},
		{
			title: "Central Dealing Desk",
			description: "For trading enquiries during business hours",
			available: "08:30 - 17:30 SGT, 21:30 - 04:00 SGT (Mon-Fri)",
			sheet: "central_dealing_desk" as SheetType,
		},
	];
	return (
		<div>
			<CustomSheetTitle title="Contact Us" backTo={"profile"} />

			<div className="mt-6 flex flex-col gap-4">
				{contactOptions.map((option, index) => (
					<div
						key={index}
						className="border border-stroke-secondary rounded hover:border-cgs-blue transition-colors cursor-pointer"
						onClick={() => setOpenSheet(option.sheet)}
					>
						<div className="p-4">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex justify-between">
										<div>
											<h3 className="text-sm font-semibold text-typo-primary mb-1">
												{option.title}
											</h3>
											<p className="text-xs text-typo-secondary">
												{option.description}
											</p>
										</div>

										<ChevronRight

											className="w-5 h-5 text-cgs-blue flex-shrink-0 ml-2 mt-1"
										/>
									</div>
									{option.available && (
										<div className="flex flex-col">
											<Separator className="my-3" />
											<div className="text-xs text-typo-secondary">
												<span className="font-semibold mr-1">Available</span>
												<span className="inline">{option.available}</span>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Contact;
