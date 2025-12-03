import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";

// TypeScript Interface for AccordionItem Props
interface AnalysisAccordionItemProps {
	value: string;
	title: string;
	children: React.ReactNode;
}

// Custom AccordionItem Component
const AnalysisAccordionItem: React.FC<AnalysisAccordionItemProps> = ({ value, title, children }) => {
	return (
		<AccordionItem value={value} className="border border-b-0 rounded-lg mb-4">
			<AccordionTrigger
				className={`p-4 text-sm border-b rounded-lg data-[state=open]:rounded-b-none data-[state=open]:border-b-0 font-medium hover:no-underline data-[state=open]:bg-theme-blue-09 data-[state=open]:text-enhanced-blue`}
			>
				{title}
			</AccordionTrigger>
			<AccordionContent className="p-4 text-sm text-typo-primary border-b rounded-lg">
				{children}
			</AccordionContent>
		</AccordionItem>
	);
};
const AnalysisTab: React.FC = () => {
	return (
		<div className="py-6">
			<Accordion type="single" collapsible defaultValue="item-1" className="w-full">
				<AnalysisAccordionItem value="item-1" title="Exposure to Small Cap Stocks">
					<p className="mb-4">
						Lorem ipsum dolor sit amet consectetur. Dolor fringilla felis in faucibus urna nibh
						sit rhoncus. Viverra at lectus adipiscing bibendum congue. Curabitur porttitor ut sed
						justo aliquam velit tellus etelend. Viverra libero non semper nibh ipsum tellus
						consectetur.
					</p>
					<p>
						Lorem ipsum dolor sit amet consectetur. Dolor fringilla felis in faucibus urna nibh
						sit rhoncus. Viverra at lectus adipiscing bibendum congue. Curabitur porttitor ut sed
						justo aliquam velit tellus etelend. Viverra libero non semper nibh ipsum tellus
						consectetur.
					</p>
				</AnalysisAccordionItem>

				<AnalysisAccordionItem value="item-2" title="Innovative & High-Growth Industries">
					<p className="mb-4">
						Lorem ipsum dolor sit amet consectetur. Dolor fringilla felis in faucibus urna nibh
						sit rhoncus. Viverra at lectus adipiscing bibendum congue. Curabitur porttitor ut sed
						justo aliquam velit tellus etelend.
					</p>
					<p>
						Viverra libero non semper nibh ipsum tellus consectetur. Curabitur porttitor ut sed
						justo aliquam velit tellus etelend.
					</p>
				</AnalysisAccordionItem>

				<AnalysisAccordionItem value="item-3" title="Exposure to Favoured Thematic Sectors">
					<p className="mb-4">
						Lorem ipsum dolor sit amet consectetur. Dolor fringilla felis in faucibus urna nibh
						sit rhoncus. Viverra at lectus adipiscing bibendum congue.
					</p>
					<p>
						Curabitur porttitor ut sed justo aliquam velit tellus etelend. Viverra libero non
						semper nibh ipsum tellus consectetur.
					</p>
				</AnalysisAccordionItem>

				<AnalysisAccordionItem value="item-4" title="China Policy Support">
					<p className="mb-4">
						Lorem ipsum dolor sit amet consectetur. Dolor fringilla felis in faucibus urna nibh
						sit rhoncus. Viverra at lectus adipiscing bibendum congue. Curabitur porttitor ut sed
						justo aliquam velit tellus etelend.
					</p>
					<p>
						Viverra libero non semper nibh ipsum tellus consectetur. Understanding policy support
						mechanisms and their impact on market dynamics.
					</p>
				</AnalysisAccordionItem>
			</Accordion>
		</div>
	);
};

export default AnalysisTab;
