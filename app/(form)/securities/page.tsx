"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import OverviewTab from "../_components/OverviewTab";
import AnalysisTab from "../_components/AnalysisTab";
import DocumentsTab from "../_components/DocumentsTab";
import ApplicationForm from "../_components/ApplicationForm";
import { useSelectionStore } from "@/stores/selectionStore";

const Securities = () => {
	const { selectedItem, selectedId } = useSelectionStore();
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

	if (!selectedId) {
		return (
			<div className="relative h-[calc(100%-58px)] flex flex-col justify-center items-center">
				<p className="text-xs text-typo-secondary text-center">No product selected yet</p>
			</div>
		);
	}
	return (
		<div className="relative h-[calc(100%-58px)] flex flex-col">
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
			{/* Content - Takes remaining space */}
			<div className="flex-1 relative">
				{" "}
				{/* wrapper KHÔNG có overflow */}
				<div className="absolute inset-0 overflow-y-auto sidebar-scroll scrollbar-offset-right">
					{renderContent}
				</div>
			</div>

			{/* Footer - Fixed at bottom - Chỉ hiện khi chưa applied */}
			{selectedItem?.applied === false && (
				<div className="flex-shrink-0">
					<Separator className="mb-4" />
					<div className="flex justify-end">
						<ApplicationForm pathname="securities" />
					</div>
				</div>
			)}
		</div>
	);
};

export default Securities;
