import Image from "@/components/Image";
import { cn } from "@/lib/utils";

interface SubscriptionThumbnailProps {
	src: string;
	alt: string;
	className?: string;
}

const SubscriptionThumbnail = ({ src, alt, className }: SubscriptionThumbnailProps) => {
	return (
		<div className={cn("shrink-0 w-11 h-11 rounded-full bg-background-section p-1.5 flex items-center justify-center overflow-hidden", className)}>
			<Image src={src} alt={alt} width={44} height={44} className="w-full h-full object-contain rounded-full" />
		</div>
	);
};

export default SubscriptionThumbnail;
