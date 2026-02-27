"use client";

import React, { ReactNode, useState, useEffect } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, ChevronRight, CircleCheck, Clock, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import WaringIcon from "@/public/icons/Warning.svg";
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import { getEW8SSO, getECRSSSO, redirectToSSO, redirectToEW8, redirectToECRS } from "@/lib/services/ssoService";
import { getTradingInfo, createBcanRequest } from "@/lib/services/profileService";
import type { TradingInfoResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

type DeclarationStatus = "inactive" | "success" | "expiring" | "expired" | "processing" | "not-eligible";

interface DeclarationButton {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
}

interface DeclarationItem {
	id: string;
	title: string;
	status: DeclarationStatus;
	exp?: string;
	tooltipContent: ReactNode;
	button: DeclarationButton | null;
}

const STATUS_LABEL: Record<DeclarationStatus, string> = {
	inactive: "Inactive",
	success: "Active",
	expiring: "Expiring Soon",
	expired: "Expired",
	processing: "Processing",
	"not-eligible": "Inactive",
};

type BadgeVariant = "inactive" | "success" | "expiring" | "destructive" | "default";

const STATUS_BADGE_VARIANT: Record<DeclarationStatus, BadgeVariant> = {
	inactive: "inactive",
	success: "success",
	expiring: "expiring",
	expired: "destructive",
	processing: "default",
	"not-eligible": "inactive",
};

const StatusIcon = ({ status }: { status: DeclarationStatus }) => {
	if (status === "success") return <CircleCheck />;
	if (status === "expiring") return <AlarmClock />;
	if (status === "expired") return <XCircle />;
	if (status === "processing") return <Clock />;
	return null;
};

const parseDate = (dateString: string | null): Date | null => {
	if (!dateString) return null;
	try {
		if (dateString.includes("/")) {
			const [day, month, year] = dateString.split("/");
			return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		}
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

const getDaysUntilExpiry = (dateString: string | null): number | null => {
	const expDate = parseDate(dateString);
	if (!expDate || isNaN(expDate.getTime())) return null;
	const now = new Date();
	return Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const TradingDeclartions = () => {
	const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);
	const [alertOpen, setAlertOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [tradingInfo, setTradingInfo] = useState<TradingInfoResponse | null>(null);
	const [ew8Url, setEw8Url] = useState<string | null>(null);
	const [ecrsUrl, setEcrsUrl] = useState<string | null>(null);
	const [alertContent, setAlertContent] = useState({
		title: "",
		description: <></> as React.ReactNode,
		onCancel: () => { },
		onAction: () => { },
		actionText: "Proceed",
		cancelText: "Cancel",
	});

	useEffect(() => {
		const fetchAll = async () => {
			setLoading(true);
			try {
				const response = await getTradingInfo();
				if (response.success && response.data) {
					setTradingInfo(response.data);

					// Prefetch EW8 and ECRS SSO URLs concurrently in the background
					getEW8SSO().then((res) => {
						if (res.success && res.data) setEw8Url(res.data.redirectUrl);
					});
					getECRSSSO().then((res) => {
						if (res.success && res.data) setEcrsUrl(res.data.redirectUrl);
					});
				}
			} catch (error) {
				console.error("Failed to fetch trading info:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAll();
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
					const accountNo = getDefaultAccountNo();
					if (!accountNo) {
						toast.error("No trading account found", "Please contact support to set up your trading account");
						setAlertOpen(false);
						return;
					}
					const response = await createBcanRequest(accountNo);
					if (response.data?.isSuccess === true) {
						toast.success("BCAN Application Successful", "You can now trade in the Stock Exchange of Hong Kong (HKEX).");
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
						Visit the <span className="text-cgs-blue font-medium underline underline-offset-2">iTrade Application Forms</span> website and
						download the &quot;AI Declaration&quot; form.
					</span>
					<br />
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

	// SIP: toDisplay=false => inactive; toDisplay=true + passed=true => success; else => inactive
	const getSipStatus = (): DeclarationStatus => {
		if (!tradingInfo?.sip.toDisplay) return "inactive";
		if (tradingInfo.sip.passed) return "success";
		return "inactive";
	};

	// W8BEN: toDisplay=false => inactive; else by expireDate: >90d => success, 1-90d => expiring, <=0d => expired
	const getW8BenStatus = (): DeclarationStatus => {
		if (!tradingInfo?.w8ben.toDisplay) return "inactive";
		const days = getDaysUntilExpiry(tradingInfo.w8ben.expireDate);
		if (days === null) return "inactive";
		if (days > 90) return "success";
		if (days > 0) return "expiring";
		return "expired";
	};

	// CRS: toDisplay=false => inactive; toDisplay=true => success
	const getCrsStatus = (): DeclarationStatus => {
		if (!tradingInfo?.crs.toDisplay) return "inactive";
		return "success";
	};

	// BCAN: toDisplay=false => inactive; "Enabled" => success; "Requested on ..." => processing; null => not-eligible
	const getBcanStatus = (): DeclarationStatus => {
		if (!tradingInfo?.bcan.toDisplay) return "inactive";
		if (tradingInfo.bcan.requestStatus === "Enabled") return "success";
		if (tradingInfo.bcan.requestStatus?.startsWith("Requested on")) return "processing";
		return "not-eligible";
	};

	const sipStatus = getSipStatus();
	const w8benStatus = getW8BenStatus();
	const crsStatus = getCrsStatus();
	const bcanStatus = getBcanStatus();

	const handleEW8Click = () => {
		if (ew8Url) {
			redirectToSSO(ew8Url);
		} else {
			redirectToEW8();
		}
	};

	const handleECRSClick = () => {
		if (ecrsUrl) {
			redirectToSSO(ecrsUrl);
		} else {
			redirectToECRS();
		}
	};

	const items: DeclarationItem[] = [
		{
			id: "sip",
			title: "SIP",
			status: sipStatus,
			exp: "-",
			tooltipContent: (
				<p>
					Specified Investment Products (SIP) declaration is required to trade SIPs. Clients must
					complete a declaration to assess their investment knowledge and experience.
				</p>
			),
			button: sipStatus === "inactive" && tradingInfo?.sip.toDisplay
				? {
					label: "Declare Now",
					onClick: () => {
						window.open(
							"/images/declaration/CKA.png",
							"TradeNow",
							`width=${975},height=${700},screenX=${500},screenY=${400},resizable=yes,scrollbars=yes`
						);
					},
				}
				: null,
		},
		{
			id: "w8ben",
			title: "W8-BEN",
			status: w8benStatus,
			exp: formatDate(tradingInfo?.w8ben.expireDate ?? null),
			tooltipContent: (
				<p>
					Required to trade US Stocks, non-US individuals will need to confirm their foreign status
					and claim reduced tax rates on US income under tax treaties.
				</p>
			),
			button: w8benStatus === "success" || w8benStatus === "expiring"
				? { label: "Renew", onClick: handleEW8Click }
				: { label: "Declare Now", onClick: handleEW8Click },
		},
		{
			id: "bcan",
			title: "BCAN",
			status: bcanStatus,
			exp: "-",
			tooltipContent:
				"Required to trade on the Stock Exchange of Hong Kong (HKEX). Not applicable for Mainland Chinese nationals.",
			button: {
				label: "Declare Now",
				onClick: bcanStatus === "inactive" || bcanStatus === "not-eligible" || bcanStatus === "processing" ? undefined : handleBcanDeclare,
				disabled: bcanStatus === "processing" || bcanStatus === "not-eligible",
			},
		},
		{
			id: "crs",
			title: "CRS",
			status: crsStatus,
			exp: formatDate(tradingInfo?.crs.validationDate ?? null),
			tooltipContent:
				"Financial institutions are required to collect and report account information to support international tax transparency and prevent tax evasion by foreign tax residents.",
			button: { label: "Declare Now", onClick: handleECRSClick },
		},
		{
			id: "accredited",
			title: "Accredited Investor",
			status: selectedAccount?.accreditedInvestor === "Yes" ? "success" : "inactive",
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
			button: selectedAccount?.accreditedInvestor !== "Yes"
				? { label: "Declare Now", onClick: handleAccreditedInvestorDeclare }
				: null,
		},
	];

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
				{items.map((item, index) => (
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
							{item.button && (
								<Button
									onClick={item.button.onClick}
									disabled={item.button.disabled}
									variant={"outline"}
									className="text-cgs-blue border-cgs-blue text-sm h-8 px-3 hover:bg-white hover:text-cgs-blue/75 hover:border-cgs-blue/75 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{item.button.label}
									<ChevronRight className="size-4 -ml-0.5 text-cgs-blue" />
								</Button>
							)}
						</div>

						<div className="flex items-center justify-between gap-2 mt-4">
							<Badge variant={STATUS_BADGE_VARIANT[item.status]} className="capitalize">
								<StatusIcon status={item.status} />
								{STATUS_LABEL[item.status]}
							</Badge>
							<span className="text-xs text-gray-400">Exp: {item.exp}</span>
						</div>

						{index < items.length - 1 && (
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
