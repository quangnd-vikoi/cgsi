"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import React, { useState } from "react";
import OverviewTab from "../_components/OverviewTab";
import AnalysisTab from "../_components/AnalysisTab";
import DocumentsTab from "../_components/DocumentsTab";
import ApplicationForm from "../_components/ApplicationForm";
import { useSelectionStore } from "@/stores/selectionStore";

const Securities = () => {
	const { selectedId, selectedItem, clearSelection } = useSelectionStore();

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

	const handleBackToSidebar = () => {
		clearSelection();
	};

	// Nếu chưa chọn item nào thì chỉ hiện header
	if (!selectedId) {
		return (
			<div className="relative h-full flex flex-col">
				<div className="flex-shrink-0">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<ChevronLeft
								className="inline-block cursor-pointer md:hidden hover:text-enhanced-blue transition-colors"
								onClick={handleBackToSidebar}
							/>
							<p className="text-base font-semibold">Details</p>
						</div>
						<X
							className="cursor-pointer hover:text-enhanced-blue transition-colors"
							onClick={() => clearSelection()}
						/>
					</div>
				</div>
			</div>
		);
	}

	console.log(selectedItem);

	return (
		<div className="relative h-full flex flex-col">
			{/* Header - Fixed height */}
			<div className="flex-shrink-0">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<ChevronLeft
							className="inline-block cursor-pointer md:hidden hover:text-enhanced-blue transition-colors"
							onClick={handleBackToSidebar}
						/>
						<p className="text-base font-semibold">Details</p>
					</div>
					<X
						className="cursor-pointer hover:text-enhanced-blue transition-colors"
						onClick={handleBackToSidebar}
					/>
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

			{/* Footer - Fixed at bottom - Chỉ hiện khi chưa applied */}
			{!selectedItem?.applied && (
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
