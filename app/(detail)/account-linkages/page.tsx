"use client";
import Title from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Headset } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
import { cn } from "@/lib/utils";
import { cpf, eps, giro, srs, subcdp } from "./data";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
				{!isLast && <div className="w-[1px] h-full relative bg-status-disable-primary"></div>}
			</div>

			{/* Content */}
			<div className="bg-background-section p-3 rounded-lg mb-6 flex-1 min-w-0">
				<div className={cn("text-typo-primary font-normal text-sm break-words")}>{title}</div>
				{description && (
					<div className="mt-2 bg-white rounded-lg p-3 border border-stroke-secondary break-words">
						{description}
					</div>
				)}
			</div>
		</div>
	);
};

const tabData = {
	subcdp: subcdp,
	cpf: cpf,
	srs: srs,
	eps: eps,
	giro: giro,
};

const AccountLinkages = () => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const searchParams = useSearchParams();
	const router = useRouter();

	const tabParam = searchParams.get("tab") || "subcdp";
	const [activeTab, setActiveTab] = useState(tabParam);

	useEffect(() => {
		const validTabs = ["subcdp", "cpf", "srs", "eps", "giro"];
		const tab = searchParams.get("tab");

		if (tab && validTabs.includes(tab)) {
			setActiveTab(tab);
		} else {
			setActiveTab("subcdp");
		}
	}, [searchParams]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		router.push(`?tab=${value}`, { scroll: false });
	};

	return (
		<div className="w-full max-w-[480px] mx-auto flex-1 flex flex-col">
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
			<div className="bg-white rounded-xl flex-1 flex flex-col overflow-hidden">
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="flex flex-1 flex-col gap-0"
				>
					<div className="pad-x overflow-x-auto">
						<TabsList className="w-full pt-6 shrink-0 min-w-max">
							{[
								{ label: "Sub-CDP", value: "subcdp" },
								{ label: "CPF", value: "cpf" },
								{ label: "SRS", value: "srs" },
								{ label: "EPS", value: "eps" },
								{ label: "GIRO", value: "giro" },
							].map((tab) => (
								<TabsTrigger
									key={tab.value}
									className="w-fit pb-2 cursor-pointer whitespace-nowrap"
									value={tab.value}
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
						{Object.entries(tabData).map(([key, data]) => (
							<TabsContent key={key} value={key} className="h-full flex flex-col m-0 flex-1">
								<div className="w-full">
									<div className="pad-x">
										<div className="text-base font-semibold my-6 break-words">
											{data.mainTitle}
										</div>
										{data.items.map((item, index) => (
											<TimelineItem
												key={index}
												step={index + 1}
												title={item.title}
												description={item.description}
												isLast={index === data.items.length - 1}
											/>
										))}
									</div>
								</div>
							</TabsContent>
						))}
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default AccountLinkages;
