import { toast } from "@/components/ui/toaster";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PortfolioType } from "@/types";
export const getBasePath = () => process.env.NEXT_PUBLIC_BASE_PATH || "";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertTo2DigitsNumber(value: string) {
	return parseFloat(value).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function handleCopy(text: string) {
	navigator.clipboard.writeText(text);
	toast.success("Copied to clipboard");
}

export const handleCall = (phone: string) => {
	window.location.href = `tel:${phone}`;
};

export const handleEmail = (email: string) => {
	window.location.href = `mailto:${email}`;
};

export const handleOpenMap = (address: string) => {
	const encodedAddress = encodeURIComponent(address);
	window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
};
export const withBasePath = (path: string): string => {
	const basePath = getBasePath();
	if (!path.startsWith("/")) {
		return path;
	}
	return `${basePath}${path}`;
};

export const getBgImageClass = (imagePath: string): string => {
	return `url('${withBasePath(imagePath)}')`;
};


export const getAccountTypeCode = (type: string): PortfolioType => {
	const typeMap: Record<string, PortfolioType> = {
		"Cash Trading Account": "CTA",
		"Margin Trading Account": "MTA",
		"Shares Borrowing Account": "SBL",
		"CUT Account": "CUT",
		"iCash Account": "iCash"
	}
	return typeMap[type] || "CTA"
}

/**
 * Scroll to top of the page
 * @param behavior - 'smooth' for smooth scrolling, 'instant' for immediate jump, 'auto' for browser default
 */
export const scrollToTop = (behavior: ScrollBehavior = "smooth") => {
	if (typeof window !== "undefined") {
		window.scrollTo({ top: 0, behavior });
	}
}