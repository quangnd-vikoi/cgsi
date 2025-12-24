import React, { ReactNode, useState } from "react";
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
	tooltipContent: ReactNode;
	onRenew?: () => void;
	onDeclare?: () => void;
}

const TradingDeclartions = () => {
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertContent, setAlertContent] = useState({
		title: "",
		description: <></> as React.ReactNode,
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
			tooltipContent: (
				<p>
					Required to trade Listed/ Unlisted Specified Investment Products (SIPs), clients must
					complete a declaration to assess their investment knowledge or experience.
				</p>
			),
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
			tooltipContent: (
				<p>
					Required to trade US Stocks, non-US individuals will need to confirm their foreign status
					and claim reduced tax rates on US income under tax treaties.
				</p>
			),
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
			tooltipContent:
				"Required to trade on the Stock Exchange of Hong Kong (HKEX). Not applicable for Mainland Chinese nationals.",
			onDeclare: () => {
				setAlertContent({
					title: "You're Eligible for BCAN",
					description: (
						<p>
							To trade in the Stock Exchange Hong Kong (SEHK), a BCAN will be assigned to you. Do you wish to proceed?
						</p>
					),
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
			tooltipContent:
				"Financial institutions are required to collect and report account information to support international tax transparency and prevent tax evasion by foreign tax residents.",
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
			tooltipContent: (
				<div>
					<p>
						Required to access products available exclusively to Accredited Investors. To qualify,
						individuals must meet at least one of the following criteria:
					</p>
					<ul className="list-disc list-outside mt-3 pl-4 md:pl-6 space-y-1">
						<li>Annual income &gt; SGD 300,000</li>
						<li>Net personal assets (excl. properties) &gt; SGD 2,000,000</li>
						<li>Net financial assets &gt; SGD 1,000,000</li>
					</ul>
				</div>
			),
			onDeclare: () => {
				setAlertContent({
					title: "Accredited Investor Declaration",
					description: (
						<p>
							<span className="inline-block">
								Visit the <span className="text-enhanced-blue">iTrade Application Forms</span>{" "}
								website and download the “AI Declaration” form.
							</span>

							<br className="" />
							<span className="mt-6 inline-block">
								Complete and email the form to our Client Services team at
								<span className="text-enhanced-blue ml-1">sg.clientservices@cgsi.com</span>.
								You will receive an email notification once your request has been processed.
							</span>
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
									<TooltipContent side="bottom">{item.tooltipContent}</TooltipContent>
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
