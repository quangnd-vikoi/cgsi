import { toast } from "@/components/ui/toaster";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PortfolioType } from "@/types";
import { ACCOUNT_TYPE_LABELS } from "@/constants/accounts";
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
	const subject = encodeURIComponent("iTrade Client Enquiry");
	window.location.href = `mailto:${email}?subject=${subject}`;
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
	const entry = (Object.entries(ACCOUNT_TYPE_LABELS) as [PortfolioType, string][]).find(([, label]) => label === type);
	return entry ? entry[0] : "CTA";
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

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Format date string to DD-MMM-YYYY format (e.g. "13-Jun-2025").
 * Handles ISO strings, YYYY-MM-DD, and DD/MM/YYYY.
 * @param dateString - Input date value (string, null, or undefined)
 * @param fallback   - Returned when input is missing or unparseable (default: "-")
 */
export const formatDate = (dateString: string | null | undefined, fallback = "-"): string => {
	if (!dateString) return fallback;

	let date: Date;
	if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
		// DD/MM/YYYY
		const [day, month, year] = dateString.split("/");
		date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
	} else if (/^\d{8}$/.test(dateString)) {
		// YYYYMMDD
		date = new Date(`${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`);
	} else {
		date = new Date(dateString);
	}

	if (isNaN(date.getTime())) return fallback;

	const day = date.getDate().toString().padStart(2, "0");
	const month = MONTH_NAMES[date.getMonth()];
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}