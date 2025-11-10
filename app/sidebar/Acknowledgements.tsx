import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";

interface AgreementRecord {
	title: string;
	version: string;
	accepted: string;
	link: string;
}

interface AgreementCategory {
	category: string;
	records: AgreementRecord[];
}

const agreementsData: AgreementCategory[] = [
	{
		category: "Text Based Agreements",
		records: [
			{
				title: "Thailand Live Feed Agreement",
				version: "Version No. 24",
				accepted: "01-Jun-2025",
				link: "https://example.com/",
			},
			{
				title: "US Live Non-Professional Agreement",
				version: "Version No. 24",
				accepted: "01-Jun-2025",
				link: "https://example.com/",
			},
		],
	},
	{
		category: "Online Based Agreements",
		records: [
			{
				title: "Risk Warning Statements for Overseas Lister Investment Products",
				version: "Version No. 24",
				accepted: "01-Jun-2025",
				link: "https://example.com/",
			},
			{
				title: "HK Live Feed",
				version: "Version No. 24",
				accepted: "01-Jun-2025",
				link: "https://example.com/",
			},
		],
	},
	{
		category: "Interactive Based Agreements",
		records: [],
	},
	{
		category: "PDF Based Agreements",
		records: [],
	},
	{
		category: "Online Based Agreements",
		records: [
			{
				title: "Risk Warning Statements for Overseas Lister Investment Products",
				version: "Version No. 24",
				accepted: "01-Jun-2025",
				link: "https://example.com/",
			},
			{
				title: "HK Live Feed",
				version: "Version No. 24",
				accepted: "01-Jun-2025",
				link: "https://example.com/",
			},
		],
	},
	{
		category: "Interactive Based Agreements",
		records: [],
	},
	{
		category: "PDF Based Agreements",
		records: [],
	},
];

const AgreementItem = ({ record }: { record: AgreementRecord }) => {
	return (
		<Link href={record.link} target="_blank" className="hover:opacity-80 transition-opacity">
			<div className="flex justify-between items-start mb-3">
				<div className="text-sm font-normal text-typo-primary">{record.title}</div>
				<ChevronRight className="w-5 h-5 text-enhanced-blue flex-shrink-0 mt-0.5" strokeWidth={2} />
			</div>

			<div className="flex justify-between text-xs text-typo-tertiary font-normal">
				<span>{record.version}</span>
				<span>Accepted: {record.accepted}</span>
			</div>
		</Link>
	);
};

const Acknowledgements = () => {
	return (
		<div className="h-full flex flex-col">
			<div className="flex-shrink-0 mb-6">
				<CustomSheetTitle backTo={"profile"} title="Acknowledgements" />
			</div>
			<div className="pb-6 pt-3 flex flex-col gap-10 overflow-y-auto flex-1">
				{agreementsData.map((categoryData, index) => (
					<Group key={index} title={categoryData.category}>
						{categoryData.records.length > 0 ? (
							categoryData.records.map((record, idx) => (
								<AgreementItem key={idx} record={record} />
							))
						) : (
							<div className="text-xs text-typo-tertiary text-center font-normal">
								No Records Retrieved
							</div>
						)}
					</Group>
				))}
			</div>
		</div>
	);
};

export default Acknowledgements;
