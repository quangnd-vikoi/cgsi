import { toast } from "@/components/ui/toaster";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PortfolioType } from "@/types";
import { normalizeAccountType } from "@/constants/accounts";
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

export const handleEmail = (email: string, subject?: string, body?: string) => {
	const encodedSubject = encodeURIComponent(subject ?? "iTrade Client Enquiry");
	const encodedBody = body ? `&body=${encodeURIComponent(body)}` : "";
	window.location.href = `mailto:${email}?subject=${encodedSubject}${encodedBody}`;
};

export const formatTradingRepresentative = (
	trCode?: string | null,
	trName?: string | null,
	fallback = "N/A",
): string => {
	const code = trCode?.trim();
	const name = trName?.trim();

	if (code && name) return `[${code}] ${name}`;
	if (code) return `[${code}]`;
	if (name) return name;
	return fallback;
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
	return normalizeAccountType(type) ?? "CTA";
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
const SINGAPORE_TIME_ZONE = "Asia/Singapore";

const parseDateValue = (dateString: string | null | undefined): Date | null => {
	if (!dateString) return null;

	if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
		const [day, month, year] = dateString.split("/");
		const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		return Number.isNaN(date.getTime()) ? null : date;
	}

	if (/^\d{8}$/.test(dateString)) {
		const date = new Date(`${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`);
		return Number.isNaN(date.getTime()) ? null : date;
	}

	const date = new Date(dateString);
	return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Format date string to DD-MMM-YYYY format (e.g. "13-Jun-2025").
 * Handles ISO strings, YYYY-MM-DD, and DD/MM/YYYY.
 * @param dateString - Input date value (string, null, or undefined)
 * @param fallback   - Returned when input is missing or unparseable (default: "-")
 */
export const formatDate = (dateString: string | null | undefined, fallback = "-"): string => {
	const date = parseDateValue(dateString);
	if (!date) return fallback;

	const day = date.getDate().toString().padStart(2, "0");
	const month = MONTH_NAMES[date.getMonth()];
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}

export const formatSingaporeDate = (
	dateString: string | null | undefined,
	fallback = "N/A",
): string => {
	const date = parseDateValue(dateString);
	if (!date) return fallback;

	const parts = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: SINGAPORE_TIME_ZONE,
	}).formatToParts(date);

	const day = parts.find((part) => part.type === "day")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const year = parts.find((part) => part.type === "year")?.value;

	if (!day || !month || !year) return fallback;

	return `${day}-${month}-${year}`;
};

export const formatSingaporeTime = (
	dateString: string | null | undefined,
	fallback = "",
): string => {
	const date = parseDateValue(dateString);
	if (!date) return fallback;

	const parts = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: SINGAPORE_TIME_ZONE,
	}).formatToParts(date);

	const hour = parts.find((part) => part.type === "hour")?.value;
	const minute = parts.find((part) => part.type === "minute")?.value;

	if (!hour || !minute) return fallback;

	return `${hour}:${minute} SGT`;
};

export const formatNotificationHtml = (html: string): string => {
	if (!html) return "";

	return html
		.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
		.replace(/\son\w+=(["']).*?\1/gi, "")
		.replace(/\son\w+=([^\s>]+)/gi, "")
		.replace(/javascript:/gi, "")
		.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
			const hasTarget = /\btarget=/i.test(attrs);
			const hasRel = /\brel=/i.test(attrs);
			const nextAttrs = [
				attrs.trim(),
				hasTarget ? "" : 'target="_blank"',
				hasRel ? "" : 'rel="noopener noreferrer"',
			]
				.filter(Boolean)
				.join(" ");

			return `<a ${nextAttrs}>`;
		});
};
