import Link from "next/link";

interface ViewAllProps {
	href: string;
	className?: string;
}

const ViewAll = ({ href, className = "" }: ViewAllProps) => {
	return (
		<Link
			href={href}
			className={`text-cgs-blue text-xs md:text-lg font-medium underline underline-offset-2 ${className}`}
			target="_blank"
		>
			View All
		</Link>
	);
};

export default ViewAll;
