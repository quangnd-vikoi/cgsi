"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TitleProps {
	title: string;
	showBackButton?: boolean;
	onBack?: () => void;
	rightContent?: ReactNode;
	className?: string;
}

export default function Title({
	title,
	showBackButton = false,
	onBack,
	rightContent,
	className,
}: TitleProps) {
	const router = useRouter();

	const handleBack = () => {
		if (onBack) onBack();
		else router.back();
	};

	return (
		<div className={cn("flex items-center gap-2 mb-6", rightContent && "justify-between", className)}>
			<div className="flex items-center gap-2.5">
				{showBackButton && <ChevronLeft size={24} onClick={handleBack} />}
				<h1 className="text-base md:text-lg font-semibold text-typo-primary">{title}</h1>
			</div>
			{rightContent && <div>{rightContent}</div>}
		</div>
	);
}
