import Link from "next/link";

interface ViewAllProps {
	href?: string;
	onClick?: () => void;
	className?: string;
	isLoading?: boolean;
}

const ViewAll = ({ href, onClick, className = "", isLoading }: ViewAllProps) => {
	const baseClassName = `text-cgs-blue text-xs md:text-lg font-medium underline underline-offset-2 ${className}`;

	if (onClick) {
		return (
			<button
				type="button"
				onClick={!isLoading ? onClick : undefined}
				disabled={isLoading}
				className={`${baseClassName} ${isLoading ? "cursor-wait opacity-60" : ""}`}
			>
				View All
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
