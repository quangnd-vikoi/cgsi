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

type AlertProps = {
	trigger?: React.ReactNode;
	title?: string;
	description?: string | React.ReactNode;
	cancelText?: string;
	actionText?: string;
	onAction?: () => void;
	onCancel?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

const Alert: React.FC<AlertProps> = ({
	trigger,
	title = "Are you absolutely sure?",
	description = "This action cannot be undone.",
	cancelText = "Cancel",
	actionText = "Continue",
	onAction,
	onCancel,
	open,
	onOpenChange,
}) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			{trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

			<AlertDialogContent className="p-0 sm:max-w-[528px] gap-0">
				<AlertDialogHeader className="text-start p-4">
					<AlertDialogTitle className="text-base font-semibold flex justify-between">
						{title}
						<AlertDialogCancel className="border-none shadow-none">
							<X size={16} />
						</AlertDialogCancel>
					</AlertDialogTitle>

					<AlertDialogDescription className="text-sm md:text-base">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="bg-background-section py-4 px-6 flex flex-row justify-end gap-3 rounded-b-lg">
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
