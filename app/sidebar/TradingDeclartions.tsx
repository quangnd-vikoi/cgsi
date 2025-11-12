import React, { useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, ChevronRight, CircleCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import WaringIcon from "@/public/icons/Warning.svg";
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";

interface DeclarationItem {
	title: string;
	status: "inactive" | "success" | "expiring";
	exp?: string;
	tooltipContent: string;
	onRenew?: () => void;
	onDeclare?: () => void;
}

const TradingDeclartions = () => {
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertContent, setAlertContent] = useState({
		title: "",
		description: "" as string | React.ReactNode,
		onCancel: () => {},
		onAction: () => {},
		actionText: "Proceed",
		cancelText: "Cancel",
	});

	const items: DeclarationItem[] = [
		{
			title: "CKA/ CAR",
			status: "inactive",
			exp: "-",
			tooltipContent: "Required to trade Listed/ Unlisted Specified Investment Products (SIPs)...",
			onDeclare: () => {
				window.open(
					"/images/declaration/CKA.png",
					"TradeNow",
					`width=${975},height=${700},screenX=${500},screenY=${400},resizable=yes,scrollbars=yes`
				);
			},
		},
		{
			title: "W8-BEN",
			status: "expiring",
			exp: "-",
			tooltipContent: "Required to trade US Stocks...",
			onDeclare: () => {
				window.open(
					"/images/declaration/W8-BEN.png",
					"TradeNow",
					`width=${975},height=${700},screenX=${500},screenY=${400},resizable=yes,scrollbars=yes`
				);
			},
		},
		{
			title: "BCAN",
			status: "inactive",
			exp: "-",
			tooltipContent: "Required to trade on the Stock Exchange of Hong Kong (HKEX)...",
			onDeclare: () => {
				setAlertContent({
					title: "You’re Eligible for BCAN",
					description:
						"To trade in the Stock Exchange Hong Kong (SEHK), a BCAN will be assigned to you. Do you wish to proceed?",
					actionText: "Proceed",
					cancelText: "Cancel",
					onCancel: () => {
						setAlertOpen(false);
					},
					onAction: () => {
						window.open(
							"/images/declaration/BCAN.png",
							"TradeNow",
							`width=${975},height=${700},screenX=${500},screenY=${400},resizable=yes,scrollbars=yes`
						);
					},
				});
				setAlertOpen(true);
			},
		},
		{
			title: "CRS",
			status: "inactive",
			exp: "-",
			tooltipContent: "Financial institutions are required to collect...",
			onDeclare: () => {
				window.open(
					"/images/declaration/CRS.png",
					"TradeNow",
					`width=${975},height=${700},screenX=${500},screenY=${400},resizable=yes,scrollbars=yes`
				);
			},
		},
		{
			title: "Accredited Investor",
			status: "inactive",
			exp: "-",
			tooltipContent: "Required to access products available exclusively...",
			onDeclare: () => {
				setAlertContent({
					title: "Accredited Investor Declaration",
					description: (
						<p>
							<p>
								Visit the <span className="text-enhanced-blue">iTrade Application Forms</span>{" "}
								website and download the “AI Declaration” form.
							</p>
							<p className="mt-4">
								Complete and email the form to our Client Services team at
								<span className="text-enhanced-blue ml-1">sg.clientservices@cgsi.com</span>.
								You will receive an email notification once your request has been processed.
							</p>
						</p>
					),
					onCancel: () => {
						setAlertOpen(false);
					},
					onAction: () => {
						window.open(
							"/images/declaration/BCAN.png",
							"TradeNow",
							`width=${975},height=${700},screenX=${500},screenY=${400},resizable=yes,scrollbars=yes`
						);
					},
					actionText: "Cancel",
					cancelText: "",
				});
				setAlertOpen(true);
			},
		},
	];

	return (
		<div>
			<CustomSheetTitle backTo={"profile"} title="Trading Declarations" />

			<div className="w-full max-w-md space-y-4 mt-6">
				{items.map((item, index) => (
					<div key={item.title}>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2 font-normal text-sm">
								{item.title}
								<Tooltip>
									<TooltipTrigger asChild>
										<WaringIcon />
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>{item.tooltipContent}</p>
									</TooltipContent>
								</Tooltip>
							</div>
							<Button
								onClick={item.status === "inactive" ? item.onDeclare : item.onRenew}
								variant={"link"}
								className="text-enhanced-blue !p-0 text-sm hover:underline h-fit"
							>
								{item.status === "inactive" ? "Declare Now" : "Renew"}
								<ChevronRight className="size-4 -ml-1 text-enhanced-blue" />
							</Button>
						</div>

						<div className="flex items-center justify-between gap-2 mt-1">
							<Badge variant={item.status} className="capitalize">
								{item.status === "expiring" ? <AlarmClock /> : <CircleCheck />}
								{item.status}
							</Badge>
							<span className="text-xs text-gray-400">Exp: {item.exp}</span>
						</div>

						{index < items.length - 1 && <Separator className="my-4 bg-stroke-secondary" />}
					</div>
				))}
			</div>

			<Alert
				open={alertOpen}
				onOpenChange={setAlertOpen}
				title={alertContent.title}
				description={alertContent.description}
				actionText={alertContent.actionText}
				cancelText={alertContent.cancelText}
				onAction={() => {
					setAlertOpen(false);
				}}
			/>
		</div>
	);
};

export default TradingDeclartions;
