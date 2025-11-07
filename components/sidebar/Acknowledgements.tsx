import React from "react";
import Title from "../Title";
import { X, ChevronRight } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
import Link from "next/link";

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

const AgreementGroup = ({ category, records }: AgreementCategory) => {
	return (
		<div className="w-full border rounded-xl p-4 pt-6 relative">
			<div className="absolute px-[18px] py-1 bg-theme-blue-09 text-xs font-normal text-typo-secondary top-0 -left-0.5 -translate-y-1/2 rounded-sm">
				{category}
			</div>
			<div className="flex flex-col gap-6">
				{records.length > 0 ? (
					records.map((record, index) => <AgreementItem key={index} record={record} />)
				) : (
					<div className="text-xs text-typo-tertiary text-center font-normal">
						No Records Retrieved
					</div>
				)}
			</div>
		</div>
	);
};

const Acknowledgements = () => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const closeSheet = useSheetStore((state) => state.closeSheet);

	return (
		<div className="h-full flex flex-col">
			<div className="pad-x flex-shrink-0">
				<Title
					showBackButton={true}
					title="Acknowledgements"
					rightContent={
						<button onClick={closeSheet} className="hover:opacity-80 transition-opacity">
							<X />
						</button>
					}
					onBack={() => setOpenSheet("profile")}
					className=""
				/>
			</div>
			<div className="pb-6 pt-3 flex flex-col gap-10 overflow-y-auto flex-1">
				{agreementsData.map((categoryData, index) => (
					<AgreementGroup
						key={index}
						category={categoryData.category}
						records={categoryData.records}
					/>
				))}
			</div>
		</div>
	);
};

export default Acknowledgements;
