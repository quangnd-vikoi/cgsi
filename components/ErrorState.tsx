import NoEvent from "@/public/icons/home-ev-noevent.svg";
import Error from "@/public/icons/home-ev-error.svg";

type ErrorStateType = "error" | "empty";

interface ErrorStateProps {
	type?: ErrorStateType;
	title?: string;
	description?: string;
	iconWidth?: number;
	iconHeight?: number;
	className?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
	type = "error",
	title,
	description,
	iconWidth = 100,
	iconHeight = 100,
	className = "",
	titleClassName = "",
	descriptionClassName = "",
}) => {
	// Default text based on type (only used if title/description not provided)
	const defaultTexts = {
		error: {
			title: "Oops, Something Went Wrong",
			description: "We are unable to display the content, please try again later.",
		},
		empty: {
			title: "Currently No Scheduled Content",
			description: "Check back soon—new content is on the way!",
		},
	};

	// Select icon based on type
	const IconComponent = type === "error" ? Error : NoEvent;

	// Use custom text if provided, otherwise use default
	const displayTitle = title || defaultTexts[type].title;
	const displayDescription = description || defaultTexts[type].description;

	return (
		<div className={`flex flex-col justify-center items-center py-5 md:py-7 h-full ${className}`}>
			<IconComponent width={iconWidth} height={iconHeight} className="text-status-disable-primary" />

			<div
				className={`mt-6 font-semibold text-typo-primary text-base text-center leading-normal ${titleClassName}`}
			>
				{displayTitle}
			</div>

			<div
				className={`mt-1 font-normal text-typo-secondary text-sm text-center leading-tight px-5 ${descriptionClassName}`}
			>
				{displayDescription}
			</div>
		</div>
	);
};
