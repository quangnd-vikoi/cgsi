import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCircleAlertProps {
	size?: number;
	className?: string;
	color?: string;
}

const CustomCircleAlert = ({ size = 15, className, color = "#FFFFFF" }: CustomCircleAlertProps) => {
	return (
		<CircleAlert
			size={size}
			color={color}
			className={cn("fill-status-error border-status-error", className)}
		/>
	);
};

export default CustomCircleAlert;
