import { toast } from "@/components/ui/toaster";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
