import Link from "next/link";

interface ViewAllProps {
	href: string;
	className?: string;
}

const ViewAll = ({ href, className = "" }: ViewAllProps) => {
	return (
		<Link
			href={href}
			className={`text-cgs-blue text-xs md:text-sm font-semibold underline underline-offset-2 ${className}`}
			target="_blank"
		>
			View All
		</Link>
	);
};

export default ViewAll;
