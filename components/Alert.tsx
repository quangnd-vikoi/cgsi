import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertProps = {
	trigger?: React.ReactNode;
	title?: string;
	description?: React.ReactNode;
	cancelText?: string;
	actionText?: string;
	onAction?: () => void;
	onCancel?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
};

const Alert: React.FC<AlertProps> = ({
	trigger,
	title = "Are you absolutely sure?",
	description = <p>This action cannot be undone.</p>,
	cancelText = "Cancel",
	actionText = "Continue",
	onAction,
	onCancel,
	open,
	onOpenChange,
	className,
}) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			{trigger && (
				<AlertDialogTrigger asChild className="cursor-pointer">
					{trigger}
				</AlertDialogTrigger>
			)}

			<AlertDialogContent className={cn("p-0 sm:max-w-[528px] gap-0 max-h-[70%] md:max-h-[90%] flex flex-col overflow-hidden", className)}>
				<AlertDialogHeader className="text-start pad-x shrink-0 py-6 ">
					<AlertDialogTitle className="text-base font-semibold flex !h-6 justify-between items-center">
						{title}
						<AlertDialogCancel className="border-none shadow-none">
							<X size={16} />
						</AlertDialogCancel>
					</AlertDialogTitle>
				</AlertDialogHeader>

				<div className="flex-1 overflow-y-auto pad-x pb-4">
					<AlertDialogDescription asChild className="text-sm md:text-base">
						{description}
					</AlertDialogDescription>
				</div>

				<AlertDialogFooter className="bg-background-section py-4 px-6 flex flex-row justify-end gap-3 rounded-b-lg shrink-0">
					<AlertDialogCancel
						className="bg-transparent border-none shadow-none text-enhanced-blue font-normal"
						onClick={onCancel}
					>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction className="px-3 rounded-sm font-normal" onClick={onAction}>
						{actionText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default Alert;
