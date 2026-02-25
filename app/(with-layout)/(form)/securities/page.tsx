"use client";
import { Separator } from "@/components/ui/separator";
import OverviewTab from "../_components/OverviewTab";
import AnalysisTab from "../_components/AnalysisTab";
import DocumentsTab from "../_components/DocumentsTab";
import ApplicationForm from "../_components/ApplicationForm";
import { useSelectionStore } from "@/stores/selectionStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductDetailsProvider, useProductDetails } from "../_components/ProductDetailsContext";
import { X } from "lucide-react";

function ApplyFooter() {
	const { productDetails } = useProductDetails();
	const { selectedItem } = useSelectionStore();
	if (productDetails?.allocationStatus === false && !selectedItem?.isCompact) {
		return (
			<div className="flex-shrink-0">
				<Separator className="mb-4" />
				<div className="flex justify-end">
					<ApplicationForm pathname="securities" />
				</div>
			</div>
		);
	}
	return null;
}

const Securities = () => {
	const { selectedItem, selectedId, clearSelection } = useSelectionStore();

	if (!selectedId) {
		return (
			<div className="relative h-[calc(100%-58px)] flex flex-col justify-center items-center">
				<p className="text-xs md:text-base font-normal text-typo-secondary text-center">No product selected yet</p>
			</div>
		);
	}

	return (
		<ProductDetailsProvider>
			<div className="relative h-[calc(100%-58px)] flex flex-col">
				<Tabs key={selectedId} defaultValue="overview" className="flex-1 flex flex-col min-h-0">
					{/* Tabs + X button inline */}
					<div className="flex items-center justify-between flex-shrink-0">
						<TabsList className="flex-1">
							<TabsTrigger className="py-2.5" value="overview">
								Overview
							</TabsTrigger>
							<TabsTrigger className="py-2.5" value="analysis">
								Analysis
							</TabsTrigger>
							<TabsTrigger className="py-2.5" value="documents">
								Documents
							</TabsTrigger>
						</TabsList>
						<X
							className="cursor-pointer hover:text-cgs-blue transition-colors"
							onClick={clearSelection}
						/>
					</div>

					{/* Content - Takes remaining space */}
					<TabsContent value="overview" className="flex-1 overflow-y-auto sidebar-scroll mt-0">
						<OverviewTab />
					</TabsContent>
					<TabsContent value="analysis" className="flex-1 overflow-y-auto sidebar-scroll mt-0">
						<AnalysisTab />
					</TabsContent>
					<TabsContent value="documents" className="flex-1 overflow-y-auto sidebar-scroll mt-0">
						<DocumentsTab />
					</TabsContent>
				</Tabs>

				{/* Footer - Fixed at bottom - Chỉ hiện khi chưa applied và chưa hết hạn */}
				<ApplyFooter />
			</div>
		</ProductDetailsProvider>
	);
};

export default Securities;
