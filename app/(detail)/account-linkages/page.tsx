"use client";
import Title from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Headset } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";

const AccountLinkages = () => {
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
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
						<TabsContent
							value="onetime"
							className="h-full flex flex-col m-0 flex-1"
						></TabsContent>
						<TabsContent value="recurring" className="h-full flex flex-col m-0"></TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default AccountLinkages;
