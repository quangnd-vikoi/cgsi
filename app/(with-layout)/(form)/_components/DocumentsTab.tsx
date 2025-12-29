"use client";
import React from "react";
import { FileText, ChevronRight } from "lucide-react";
import { useProductDetails } from "./ProductDetailsContext";
import { ErrorState } from "@/components/ErrorState";

// TypeScript Interface for Document Item
interface DocumentItemProps {
	title: string;
	filePath: string;
}

// Document Item Component
const DocumentItem: React.FC<DocumentItemProps> = ({ title, filePath }) => {
	const handleClick = () => {
		window.open(filePath, "_blank");
	};

	return (
		<button
			onClick={handleClick}
			className="w-full flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors group"
		>
			<div className="flex items-center gap-3">
				<FileText className="w-5 h-5 text-typo-secondary" />
				<span className="text-sm font-medium text-typo-primary">{title}</span>
			</div>
			<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-typo-teritary transition-colors" />
		</button>
	);
};

const DocumentsTab: React.FC = () => {
	const { productDetails, loading, error } = useProductDetails();

	// Loading state
	if (loading) {
		return (
			<div className="pt-6">
				<div className="animate-pulse space-y-4">
					<div className="h-4 bg-gray-200 rounded w-1/3"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="h-16 bg-gray-200 rounded"></div>
						<div className="h-16 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !productDetails) {
		return (
			<div className="h-full flex items-center justify-center pt-6">
				<ErrorState
					type="error"
					title="Failed to Load Documents"
					description={error || "Unable to load documents. Please try again."}
				/>
			</div>
		);
	}

	// Parse refDocs - flexible format support
	const parseDocuments = (refDocs?: string): Array<{ title: string; url: string }> => {
		if (!refDocs) return [];

		try {
			// Try parsing as JSON array first
			const parsed = JSON.parse(refDocs);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => {
					if (typeof item === "string") {
						return { title: extractTitleFromUrl(item), url: item };
					}
					return {
						title: item.title || item.name || extractTitleFromUrl(item.url),
						url: item.url || item.link || item.path || "",
					};
				});
			}
		} catch {
			// Not JSON, parse as delimited string
		}

		// Split by newline or comma
		const delimiter = refDocs.includes("\n") ? "\n" : ",";
		const items = refDocs.split(delimiter).map((item) => item.trim()).filter(Boolean);

		return items.map((item) => {
			// Check for pipe separator: "Title|URL"
			if (item.includes("|")) {
				const [title, url] = item.split("|").map((s) => s.trim());
				return { title: title || extractTitleFromUrl(url), url: url || "" };
			}

			// Check for colon separator: "Title: URL"
			if (item.includes(": http")) {
				const colonIndex = item.indexOf(": http");
				const title = item.substring(0, colonIndex).trim();
				const url = item.substring(colonIndex + 2).trim();
				return { title, url };
			}

			// Just a URL
			return {
				title: extractTitleFromUrl(item),
				url: item,
			};
		});
	};

	// Extract title from URL
	const extractTitleFromUrl = (url: string): string => {
		try {
			const filename = url.split("/").pop() || "";
			const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
			return nameWithoutExt
				.split(/[-_]/)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ") || "Document";
		} catch {
			return "Document";
		}
	};

	let documents = parseDocuments(productDetails.refDocs);

	// Also check for tncUrl
	if (productDetails.tncUrl) {
		documents.push({
			title: "Terms & Conditions",
			url: productDetails.tncUrl,
		});
	}

	// Empty state
	if (documents.length === 0) {
		return (
			<div className="h-full flex items-center justify-center pt-6">
				<ErrorState
					type="empty"
					title="No Documents Available"
					description="Reference documents for this product are not available yet."
				/>
			</div>
		);
	}

	return (
		<div className="pt-6">
			<h3 className="text-base font-semibold text-typo-primary mb-4">Reference Documents</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{documents.map((doc, index) => (
					<DocumentItem key={index} title={doc.title} filePath={doc.url} />
				))}
			</div>
		</div>
	);
};

export default DocumentsTab;
