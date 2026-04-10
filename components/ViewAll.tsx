import Link from "next/link";
import { Loader2 } from "lucide-react";

interface ViewAllProps {
	href?: string;
	onClick?: () => void | Promise<void>;
	className?: string;
	disabled?: boolean;
	isLoading?: boolean;
}

const ViewAll = ({ href, onClick, className = "", disabled = false, isLoading = false }: ViewAllProps) => {
	const baseClassName = `text-cgs-blue text-xs md:text-lg font-medium underline underline-offset-2 ${className}`;
	const isButtonDisabled = disabled || isLoading;

	if (onClick) {
		return (
			<button
				type="button"
				onClick={!isButtonDisabled ? onClick : undefined}
				disabled={isButtonDisabled}
				aria-busy={isLoading}
				style={isButtonDisabled ? { cursor: isLoading ? "wait" : "not-allowed" } : undefined}
				className={`${baseClassName} inline-flex items-center gap-2 ${isButtonDisabled ? "opacity-60" : ""}`}
			>
				{isLoading && <Loader2 className="size-4 animate-spin" />}
				<span>View All</span>
			</button>
		);
	}

	return (
		<Link
			href={href || "#"}
			className={baseClassName}
			target="_blank"
		>
			View All
		</Link>
	);
};

export default ViewAll;
