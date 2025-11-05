"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface TitleProps {
	title: string;
	showBackButton?: boolean;
	onBack?: () => void;
	rightContent?: ReactNode;
}

export default function Title({ title, showBackButton = false, onBack, rightContent }: TitleProps) {
	const router = useRouter();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	return (
		<div className={`flex items-center gap-2 mb-6 ${rightContent ? "justify-between" : ""}`}>
			<div className="flex items-center gap-2">
				{showBackButton && (
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ChevronLeft className="h-6 w-6" />
					</Button>
				)}
				<h1 className="text-xl font-semibold text-typo-primary">{title}</h1>
			</div>
			{rightContent && <div>{rightContent}</div>}
		</div>
	);
}
