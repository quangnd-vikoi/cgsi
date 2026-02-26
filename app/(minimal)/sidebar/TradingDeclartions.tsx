"use client";

import React, { ReactNode, useState, useEffect } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, ChevronRight, CircleCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import WaringIcon from "@/public/icons/Warning.svg";
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import { redirectToEW8, redirectToECRS } from "@/lib/services/ssoService";
import { getTradingInfo, createBcanRequest } from "@/lib/services/profileService";
import type { TradingInfoResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

type DeclarationStatus = "inactive" | "success" | "expiring";

interface DeclarationItem {
	id: string;
	title: string;
	status: DeclarationStatus;
	exp?: string;
	tooltipContent: ReactNode;
	toDisplay: boolean;
	onRenew?: () => void;
	onDeclare?: () => void;
}

const parseDate = (dateString: string | null): Date | null => {
	if (!dateString) return null;
	try {
		// Handle dd/MM/yyyy format from API
		if (dateString.includes("/")) {
			const [day, month, year] = dateString.split("/");
			return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		}
		// Handle ISO format as fallback
		return new Date(dateString);
	} catch {
		return null;
	}
};

const formatDate = (dateString: string | null): string => {
	const date = parseDate(dateString);
	if (!date || isNaN(date.getTime())) return "-";
	const day = date.getDate().toString().padStart(2, "0");
	const month = date.toLocaleDateString("en-US", { month: "short" });
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

const isExpiringSoon = (dateString: string | null): boolean => {
	const expDate = parseDate(dateString);
	if (!expDate || isNaN(expDate.getTime())) return false;
	const now = new Date();
	const daysUntilExpiry = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
	return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
};

const TradingDeclartions = () => {
	const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);
	const [alertOpen, setAlertOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [tradingInfo, setTradingInfo] = useState<TradingInfoResponse | null>(null);
	const [alertContent, setAlertContent] = useState({
		title: "",
		description: <></> as React.ReactNode,
		onCancel: () => { },
		onAction: () => { },
		actionText: "Proceed",
		cancelText: "Cancel",
	});

	useEffect(() => {
		const fetchTradingInfo = async () => {
			setLoading(true);
			try {
				const response = await getTradingInfo();
				if (response.success && response.data) {
					setTradingInfo(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch trading info:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTradingInfo();
	}, []);

	const handleBcanDeclare = async () => {
		setAlertContent({
			title: "You're Eligible for BCAN",
			description: (
				<p>
					To trade in the Stock Exchange Hong Kong (SEHK), a BCAN will be assigned to you. Do you
					wish to proceed?
				</p>
			),
			actionText: "Proceed",
			cancelText: "Cancel",
			onCancel: () => {
				setAlertOpen(false);
			},
			onAction: async () => {
				try {
					// Get default account number
					const accountNo = getDefaultAccountNo();

					if (!accountNo) {
						toast.error("No trading account found", "Please contact support to set up your trading account");
						setAlertOpen(false);
						return;
					}

					const response = await createBcanRequest(accountNo);
					if (response.data?.isSuccess === true) {
						toast.success("BCAN Application Successful", "You can now trade in the Stock Exchange of Hong Kong (HKEX).");
						// Refresh trading info
						const updatedInfo = await getTradingInfo();
						if (updatedInfo.success && updatedInfo.data) {
							setTradingInfo(updatedInfo.data);
						}
					} else {
						toast.error(response.error || "Failed to submit BCAN request");
					}
				} catch {
					toast.error("Failed to submit BCAN request");
				}
				setAlertOpen(false);
			},
		});
		setAlertOpen(true);
	};

	const handleAccreditedInvestorDeclare = () => {
		setAlertContent({
			title: "Accredited Investor Declaration",
			description: (
				<p>
					<span className="inline-block">
						Visit the <span className="text-cgs-blue  font-medium underline underline-offset-2">iTrade Application Forms</span> website and
						download the &quot;AI Declaration&quot; form.
					</span>

					<br className="" />
					<span className="mt-6 inline-block">
						Complete and email the form to our Client Services team at
						<span className="text-cgs-blue font-medium underline underline-offset-2 ml-1">sg.clientservices@cgsi.com</span>. You will receive
						an email notification once your request has been processed.
					</span>
				</p>
			),
			onCancel: () => {
				setAlertOpen(false);
			},
			onAction: () => {
				setAlertOpen(false);
			},
			actionText: "Close",
			cancelText: "",
		});
		setAlertOpen(true);
	};

	const getW8BenStatus = (): DeclarationStatus => {
		if (!tradingInfo?.w8ben.toDisplay) return "inactive";
		if (isExpiringSoon(tradingInfo.w8ben.expireDate)) return "expiring";
		if (tradingInfo.w8ben.expireDate) return "success";
		return "inactive";
	};

	const getCrsStatus = (): DeclarationStatus => {
		if (!tradingInfo?.crs.certified) return "inactive";
		if (isExpiringSoon(tradingInfo.crs.validationDate)) return "expiring";
		return "success";
	};

	const getBcanStatus = (): DeclarationStatus => {
		if (!tradingInfo?.bcan.toDisplay) return "inactive";
		if (tradingInfo.bcan.requestStatus === "APPROVED") return "success";
		if (tradingInfo.bcan.requestStatus === "PENDING") return "expiring";
		return "inactive";
	};

	const getSipStatus = (): DeclarationStatus => {
		if (!tradingInfo?.sip.toDisplay) return "inactive";
		if (tradingInfo.sip.passed) return "success";
		if (tradingInfo.sip.dueForSubmission) return "expiring";
		return "inactive";
	};

	const items: DeclarationItem[] = [
		{
			id: "sip",
			title: "SIP",
			status: getSipStatus(),
			exp: "-",
			toDisplay: tradingInfo?.sip.toDisplay ?? true,
			tooltipContent: (
				<p>
					Specified Investment Products (SIP) declaration is required to trade SIPs. Clients must
					complete a declaration to assess their investment knowledge and experience.
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
			id: "w8ben",
			title: "W8-BEN",
			status: getW8BenStatus(),
			exp: formatDate(tradingInfo?.w8ben.expireDate ?? null),
			toDisplay: tradingInfo?.w8ben.toDisplay ?? true,
			tooltipContent: (
				<p>
					Required to trade US Stocks, non-US individuals will need to confirm their foreign status
					and claim reduced tax rates on US income under tax treaties.
				</p>
			),
			onDeclare: async () => {
				setLoadingId("w8ben");
				try { await redirectToEW8(); } finally { setLoadingId(null); }
			},
			onRenew: async () => {
				setLoadingId("w8ben");
				try { await redirectToEW8(); } finally { setLoadingId(null); }
			},
		},
		{
			id: "bcan",
			title: "BCAN",
			status: getBcanStatus(),
			exp: "-",
			toDisplay: tradingInfo?.bcan.toDisplay ?? true,
			tooltipContent:
				"Required to trade on the Stock Exchange of Hong Kong (HKEX). Not applicable for Mainland Chinese nationals.",
			onDeclare: handleBcanDeclare,
		},
		{
			id: "crs",
			title: "CRS",
			status: getCrsStatus(),
			exp: formatDate(tradingInfo?.crs.validationDate ?? null),
			toDisplay: tradingInfo?.crs.certified !== undefined ? true : true,
			tooltipContent:
				"Financial institutions are required to collect and report account information to support international tax transparency and prevent tax evasion by foreign tax residents.",
			onDeclare: async () => {
				setLoadingId("crs");
				try { await redirectToECRS(); } finally { setLoadingId(null); }
			},
			onRenew: async () => {
				setLoadingId("crs");
				try { await redirectToECRS(); } finally { setLoadingId(null); }
			},
		},
		{
			id: "accredited",
			title: "Accredited Investor",
			status: selectedAccount?.accreditedInvestor === "Yes" ? "success" : "inactive",
			exp: "-",
			toDisplay: true,
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
			onDeclare: handleAccreditedInvestorDeclare,
		},
	];

	const visibleItems = items.filter((item) => item.toDisplay);

	if (loading) {
		return (
			<div>
				<CustomSheetTitle backTo={"profile"} title="Trading Declarations" />
				<div className="w-full max-w-md space-y-4 mt-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i}>
							<div className="flex items-center justify-between mb-2">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-8 w-28" />
							</div>
							<div className="flex items-center justify-between gap-2 mt-1">
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-4 w-16" />
							</div>
							{i < 6 && <Separator className="my-4 bg-stroke-secondary" />}
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div>
			<CustomSheetTitle backTo={"profile"} title="Trading Declarations" />

			<div className="w-full max-w-md space-y-4 mt-6">
				{visibleItems.map((item, index) => (
					<div key={item.id}>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2 font-normal text-sm">
								{item.title}
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="cursor-help">
											<WaringIcon />
										</span>
									</TooltipTrigger>
									<TooltipContent side="bottom" className="z-[110]">{item.tooltipContent}</TooltipContent>
								</Tooltip>
							</div>
							<Button
								onClick={item.status === "inactive" ? item.onDeclare : item.onRenew}
								disabled={loadingId === item.id}
								variant={"outline"}
								className="text-cgs-blue border-cgs-blue text-sm h-8 px-3 hover:bg-white hover:text-cgs-blue/75 hover:border-cgs-blue/75 disabled:cursor-wait disabled:opacity-50"
							>
								{item.status === "inactive" ? "Declare Now" : "Renew"}
								<ChevronRight className="size-4 -ml-0.5 text-cgs-blue" />
							</Button>
						</div>

						<div className="flex items-center justify-between gap-2 mt-4">
							<Badge variant={item.status} className="capitalize">
								{item.status === "expiring" ? <AlarmClock /> : <CircleCheck />}
								{item.status === "success" ? "Active" : item.status}
							</Badge>
							<span className="text-xs text-gray-400">Exp: {item.exp}</span>
						</div>

						{index < visibleItems.length - 1 && (
							<Separator className="my-4 bg-stroke-secondary" />
						)}
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
				onAction={alertContent.onAction}
			/>
		</div>
	);
};

export default TradingDeclartions;
