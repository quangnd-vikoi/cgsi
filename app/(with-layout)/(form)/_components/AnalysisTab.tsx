"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import { useProductDetails } from "./ProductDetailsContext";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";

// TypeScript Interface for AccordionItem Props
interface AnalysisAccordionItemProps {
	value: string;
	title: string;
	children: React.ReactNode;
}

// Custom AccordionItem Component
const AnalysisAccordionItem: React.FC<AnalysisAccordionItemProps> = ({ value, title, children }) => {
	return (
		<AccordionItem value={value} className="border border-b-0 rounded mb-4">
			<AccordionTrigger
				className="p-4 text-base border-b rounded data-[state=open]:rounded-b-none data-[state=open]:border-b-0 font-medium hover:no-underline data-[state=open]:bg-theme-blue-09 data-[state=open]:text-cgs-blue"
			>
				{title}
			</AccordionTrigger>
			<AccordionContent className="p-4 text-base text-typo-primary border-b rounded">
				{children}
			</AccordionContent>
		</AccordionItem>
	);
};

const AnalysisTab: React.FC = () => {
	const { productDetails, loading, error, openAccordionValue, setOpenAccordionValue } = useProductDetails();

	// Loading state
	if (loading) {
		return (
			<div className="py-6">
				<div className="space-y-4">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			</div>
		);
	}

	// Error state
	if (error || !productDetails) {
		return (
			<div className="h-full flex items-center justify-center py-6">
				<ErrorState
					type="error"
					title="Unable to Load Analysis"
					description="We are unable to display the product analysis at this time. Please try again later."
				/>
			</div>
		);
	}

	// Parse content2 into sections for accordion
	const parseSections = (content?: string): Array<{ title: string; content: string }> => {
		if (!content) return [];

		try {
			// Try parsing as JSON first: [{title: "...", content: "..."}, ...]
			const parsed = JSON.parse(content);
			if (Array.isArray(parsed)) {
				return parsed.map((item, index) => ({
					title: item.title || item.name || `Section ${index + 1}`,
					content: item.content || item.body || item.text || "",
				}));
			}
		} catch {
			// Not JSON, continue with text parsing
		}

		const sections: Array<{ title: string; content: string }> = [];

		// Try splitting by markdown headers (## or ###)
		if (content.includes("##")) {
			const parts = content.split(/(?=#{2,3}\s)/);
			parts.forEach((part) => {
				const trimmed = part.trim();
				if (!trimmed) return;

				// Extract title from markdown header
				const match = trimmed.match(/^#{2,3}\s+(.+?)(?:\n|$)/);
				if (match) {
					const title = match[1].trim();
					const body = trimmed.substring(match[0].length).trim();
					if (title && body) {
						sections.push({ title, content: body });
					}
				}
			});
			if (sections.length > 0) return sections;
		}

		// Try splitting by "---" delimiter
		if (content.includes("---")) {
			const parts = content.split("---").map((p) => p.trim()).filter(Boolean);
			parts.forEach((part, index) => {
				const lines = part.split("\n").filter(Boolean);
				if (lines.length === 0) return;

				// First line is title, rest is content
				const title = lines[0].replace(/^[#*\-\s]+/, "").trim();
				const body = lines.slice(1).join("\n").trim();

				sections.push({
					title: title || `Section ${index + 1}`,
					content: body || part,
				});
			});
			if (sections.length > 0) return sections;
		}

		// Try splitting by double newlines (paragraphs)
		const paragraphs = content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
		if (paragraphs.length > 1) {
			paragraphs.forEach((para, index) => {
				const lines = para.split("\n").filter(Boolean);
				const firstLine = lines[0].replace(/^[#*\-\s]+/, "").trim();

				// If first line is short, use it as title
				if (firstLine.length < 80 && lines.length > 1) {
					sections.push({
						title: firstLine,
						content: lines.slice(1).join("\n").trim(),
					});
				} else {
					// Use paragraph as content with generic title
					sections.push({
						title: `Section ${index + 1}`,
						content: para,
					});
				}
			});
			if (sections.length > 0) return sections;
		}

		// Fallback: return entire content as single section
		return [{ title: "Product Analysis", content: content }];
	};

	const sections = parseSections(productDetails.content2);

	// Empty state
	if (sections.length === 0) {
		return (
			<div className="h-full flex items-center justify-center py-6">
				<ErrorState
					type="empty"
					title="No Analysis Available"
					description="Analysis information for this product is not available yet."
				/>
			</div>
		);
	}

	return (
		<div className="py-6">
			<Accordion
				type="single"
				collapsible
				className="w-full"
				value={openAccordionValue}
				onValueChange={setOpenAccordionValue}
			>
				{sections.map((section, index) => (
					<AnalysisAccordionItem
						key={index}
						value={`item-${index}`}
						title={section.title}
					>
						<div className="whitespace-pre-line leading-relaxed">
							{section.content.split('\n\n').map((paragraph, pIndex) => (
								<p key={pIndex} className={pIndex > 0 ? "mt-4" : ""}>
									{paragraph}
								</p>
							))}
						</div>
					</AnalysisAccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default AnalysisTab;
