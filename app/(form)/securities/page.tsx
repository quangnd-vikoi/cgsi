"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import React, { useState } from "react";
import OverviewTab from "./OverviewTab";
import AnalysisTab from "./AnalysisTab";
import DocumentsTab from "./DocumentsTab";

const Securities = () => {
	const tabs = [
		{ label: "Overview", key: "overview" },
		{ label: "Analysis", key: "analysis" },
		{ label: "Documents", key: "documents" },
	];

	const [activeTab, setActiveTab] = useState("overview");

	const renderContent = {
		overview: <OverviewTab />,
		analysis: <AnalysisTab />,
		documents: <DocumentsTab />,
	}[activeTab];

	const handleBackDetail = () => {};

	return (
		<div className="relative h-full flex flex-col">
			{/* Header - Fixed height */}
			<div className="flex-shrink-0">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<ChevronLeft className="inline-block md:hidden" onClick={handleBackDetail} />
						<p className="text-base font-semibold">Details</p>
					</div>
					<X />
				</div>

				<Separator className="my-4" />

				{/* Tabs */}
				<div className="border-b border-stroke-secondary">
					<div className="flex gap-3 md:gap-4">
						{tabs.map((tab) => (
							<Button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={cn(
									"px-0 text-xs md:text-sm font-medium rounded-xs bg-transparent hover:bg-background-focus transition-colors",
									activeTab === tab.key
										? "border-b-2 border-enhanced-blue text-enhanced-blue"
										: "text-typo-secondary hover:text-typo-primary"
								)}
							>
								{tab.label}
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Content - Takes remaining space */}
			<div className="flex-1 overflow-y-auto sidebar-scroll">{renderContent}</div>

			{/* Footer - Fixed at bottom */}
			<div className="flex-shrink-0 pb-4">
				<Separator className="mb-4" />
				<div className="flex justify-end">
					<Button className="px-3 h-10">Apply</Button>
				</div>
			</div>
		</div>
	);
};

export default Securities;
