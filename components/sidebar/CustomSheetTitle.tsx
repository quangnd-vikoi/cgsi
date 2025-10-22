import React from "react";
import { SheetHeader, SheetTitle, SheetClose } from "../ui/sheet";
import { ChevronLeft, X } from "lucide-react";
import { SheetType } from "@/types";
import { useSheetStore } from "@/stores/sheetStore";

interface CustomSheetTitleProps {
	title: string;
	backTo?: SheetType;
}

const CustomSheetTitle = ({ title, backTo }: CustomSheetTitleProps) => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleBack = () => {
		if (backTo !== undefined) {
			setOpenSheet(backTo);
		}
	};

	return (
		<SheetHeader className="p-0 text-[16px] lg:text-lg flex-shrink-0">
			<div className="flex justify-between">
				<SheetTitle className="text-typo-primary flex gap-2 items-center">
					{backTo !== undefined && (
						<ChevronLeft className="text-icon-light cursor-pointer" onClick={handleBack} />
					)}
					{title}
				</SheetTitle>
				<SheetClose className="text-typo-secondary">
					<X />
				</SheetClose>
			</div>
		</SheetHeader>
	);
};

export default CustomSheetTitle;
