import Link from "next/link";

interface ViewAllProps {
	href?: string;
	onClick?: () => void;
	className?: string;
}

const ViewAll = ({ href, onClick, className = "" }: ViewAllProps) => {
	const baseClassName = `text-cgs-blue text-xs md:text-lg font-medium underline underline-offset-2 ${className}`;

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className={baseClassName}
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
