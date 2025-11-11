import { toast } from "@/components/ui/toaster";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
