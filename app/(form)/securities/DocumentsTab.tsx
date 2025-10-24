import React from "react";
import { FileText, ChevronRight } from "lucide-react";

// TypeScript Interface for Document Item
interface DocumentItemProps {
	title: string;
	onClick?: () => void;
}

// Document Item Component
const DocumentItem: React.FC<DocumentItemProps> = ({ title, onClick }) => {
	return (
		<button
			onClick={onClick}
			className="w-full flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors group"
		>
			<div className="flex items-center gap-3">
				<FileText className="w-5 h-5 text-typo-secondary" />
				<span className="text-sm font-medium text-typo-primary">{title}</span>
			</div>
			<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
		</button>
	);
};

const DocumentsTab: React.FC = () => {
	const handleDocumentClick = (docName: string) => {
		console.log(`Clicked on: ${docName}`);
		// Add your document open logic here
	};

	return (
		<div className="pt-6">
			<h3 className="text-base font-semibold text-typo-primary mb-4">Reference Documents</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<DocumentItem title="Prospectus" onClick={() => handleDocumentClick("Prospectus")} />
				<DocumentItem title="Fact Sheet" onClick={() => handleDocumentClick("Fact Sheet")} />
				<DocumentItem
					title="Supplementary Note"
					onClick={() => handleDocumentClick("Supplementary Note")}
				/>
			</div>
		</div>
	);
};

export default DocumentsTab;
