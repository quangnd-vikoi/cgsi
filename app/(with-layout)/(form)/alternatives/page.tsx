"use client";
import { Separator } from "@/components/ui/separator";
import OverviewTab from "../_components/OverviewTab";
import AnalysisTab from "../_components/AnalysisTab";
import DocumentsTab from "../_components/DocumentsTab";
import ApplicationForm from "../_components/ApplicationForm";
import { useSelectionStore } from "@/stores/selectionStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductDetailsProvider } from "../_components/ProductDetailsContext";

const Alternatives = () => {
	const { selectedItem, selectedId } = useSelectionStore();

	if (!selectedId) {
		return (
			<div className="relative h-[calc(100%-58px)] flex flex-col justify-center items-center">
				<p className="text-xs text-typo-secondary text-center">No product selected yet</p>
			</div>
		);
	}

	return (
		<ProductDetailsProvider>
			<div className="relative h-[calc(100%-58px)] flex flex-col">
				<Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
					{/* Tabs */}
					<TabsList className="flex-shrink-0">
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

				{/* Footer - Fixed at bottom - Chỉ hiện khi chưa applied */}
				{selectedItem?.applied === false && (
					<div className="flex-shrink-0">
						<Separator className="mb-4" />
						<div className="flex justify-end">
							<ApplicationForm pathname="alternatives" />
						</div>
					</div>
				)}
			</div>
		</ProductDetailsProvider>
	);
};

export default Alternatives;
