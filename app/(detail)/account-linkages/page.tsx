"use client";
import Title from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Headset } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
interface TimelineItemProps {
	step: number;
	title: React.ReactNode;
	description: React.ReactNode;
	isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ step, title, description, isLast = false }) => {
	return (
		<div className="flex gap-4">
			{/* Timeline Line */}
			<div className="flex flex-col items-center">
				<div className="w-5 h-5 rounded-full border border-enhanced-blue bg-white flex items-center justify-center text-enborder-enhanced-blue font-semibold text-[10px] text-enhanced-blue shrink-0">
					{step}
				</div>
				{!isLast && <div className="w-[1px] h-full bg-status-disable-primary "></div>}
			</div>

			{/* Content */}
			<div className="bg-background-section p-3">
				<div className="mb-2">{title}</div>
				<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">{description}</div>
			</div>
		</div>
	);
};

const AccountLinkages = () => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const items = [
		{
			title: "Linking a Sub-CDP Account",
			description: (
				<div className="flex flex-col gap-2">
					<p>To link a Sub-CDP account, please follow these steps:</p>
					<ol className="list-decimal list-inside space-y-1">
						<li>Log in to your CGS-CIMB Securities account.</li>
						<li>Follow the on-screen instructions to complete the linkage process.</li>
					</ol>
					<p>For assistance, please contact our support team.</p>
				</div>
			),
		},
		{
			title: "Linking a Sub-CDP Account",
			description: (
				<div className="flex flex-col gap-2">
					<p>To link a Sub-CDP account, please follow these steps:</p>
					<ol className="list-decimal list-inside space-y-1">
						<li>Log in to your CGS-CIMB Securities account.</li>
						<li>Follow the on-screen instructions to complete the linkage process.</li>
					</ol>
					<p>For assistance, please contact our support team.</p>
				</div>
			),
		},
	];
	return (
		<div className="max-w-[480px] mx-auto flex-1 flex flex-col">
			<div className="shrink-0">
				<Title
					title="Account Linkages"
					rightContent={
						<Button
							onClick={() => setOpenSheet("trading_representative")}
							className="hidden md:inline-flex border-1 border-stroke-secondary text-typo-primary rounded-sm px-3 py-1.5 text-sm bg-transparent hover:bg-black/5 font-normal transition-colors h-8"
						>
							<Headset className="text-icon-light" size={24} />
							<p className="hidden md:inline-block">Contact us</p>
						</Button>
					}
				/>
			</div>

			{/* Content */}
			<div className="bg-white rounded-xl flex-1 flex flex-col">
				<Tabs defaultValue="onetime" className="flex flex-1 flex-col gap-0">
					{/* Thanh tab */}
					<div className="pad-x">
						<TabsList className="w-full pt-6 shrink-0">
							{[
								{ label: "Sub-CDP", value: "subcdp" },
								{ label: "CPF", value: "cpf" },
								{ label: "SRS", value: "srs" },
								{ label: "EPS", value: "ebp" },
								{ label: "GIRO", value: "giro" },
							].map((tab) => (
								<TabsTrigger key={tab.value} className="w-fit pb-2" value={tab.value}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{/* Nội dung co giãn */}
					<div className="flex-1 min-h-0 flex flex-col">
						<TabsContent value="subcdp" className="h-full flex flex-col m-0 flex-1">
							<div className="max-w-2xl">
								{items.map((item, index) => (
									<TimelineItem
										key={index}
										step={index + 1}
										title={item.title}
										description={item.description}
										isLast={index === items.length - 1}
									/>
								))}
							</div>
						</TabsContent>
						<TabsContent value="recurring" className="h-full flex flex-col m-0"></TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default AccountLinkages;
