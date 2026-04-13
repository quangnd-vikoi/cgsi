"use client";

import React, { ReactNode, useState, useEffect, useRef } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, ChevronRight, CircleCheck, Clock, EyeOff, Loader2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import WaringIcon from "@/public/icons/Warning.svg";
import Alert from "@/components/Alert";
import { Separator } from "@/components/ui/separator";
import { getEW8SSO, getECRSSSO, redirectToSSO } from "@/lib/services/ssoService";
import { formatDate, handleEmail } from "@/lib/utils";
import { CGSI } from "@/constants/routes";
import { getTradingInfo, createBcanRequest } from "@/lib/services/profileService";
import type { TradingInfoResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { usePermissions } from "@/hooks/usePermission";
import { FEATURE_ACCESS } from "@/constants/accessControl";

type DeclarationStatus = "inactive" | "success" | "expiring" | "expired" | "processing" | "not-eligible";

interface DeclarationButton {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	loading?: boolean;
}

interface DeclarationItem {
	id: string;
	title: string;
	status: DeclarationStatus;
	exp?: string;
	tooltipContent: ReactNode;
	button: DeclarationButton | null;
	feature?: string;
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


const getDaysUntilExpiry = (dateString: string | null): number | null => {
	if (!dateString) return null;
	const expDate = dateString.includes("/")
		? (() => { const [d, m, y] = dateString.split("/"); return new Date(+y, +m - 1, +d); })()
		: new Date(dateString);
	if (isNaN(expDate.getTime())) return null;
	const now = new Date();
	return Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const TradingDeclartions = () => {
	const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);
	const { permissions: declPerms } = usePermissions({
		trading_decl_sip: FEATURE_ACCESS.trading_decl_sip,
		trading_decl_w8ben: FEATURE_ACCESS.trading_decl_w8ben,
		trading_decl_bcan: FEATURE_ACCESS.trading_decl_bcan,
		trading_decl_crs: FEATURE_ACCESS.trading_decl_crs,
		trading_decl_ai: FEATURE_ACCESS.trading_decl_ai,
	});
	const [alertOpen, setAlertOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [tradingInfo, setTradingInfo] = useState<TradingInfoResponse | null>(null);
	const [loadingDeclarationId, setLoadingDeclarationId] = useState<DeclarationItem["id"] | null>(null);
	const [alertContent, setAlertContent] = useState({
		title: "",
		description: <></> as React.ReactNode,
		onCancel: () => { },
		onAction: () => { },
		actionText: "Proceed",
		cancelText: "Cancel",
	});

	const hasFetched = useRef(false);

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		const fetchAll = async () => {
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
					if (response.data?.success === true) {
						toast.success("BCAN Application Submitted", "You can trade on the Hong Kong Stock Exchange (HKEX) once your application is approved.");
						const updatedInfo = await getTradingInfo();
						if (updatedInfo.success && updatedInfo.data) {
							setTradingInfo(updatedInfo.data);
						}
					} else {
						toast.error(response.error || "We were unable to submit your BCAN request. Please try again later.");
					}
				} catch {
					toast.error("Unable to Submit", "We were unable to submit your BCAN request. Please try again later.");
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
						Visit the{" "}
						<a
							href={CGSI.ITRADE_APPLICATION_FORMS}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cgs-blue font-medium underline underline-offset-2"
						>
							iTrade Application Forms
						</a>{" "}
						website and download the &quot;AI Declaration&quot; form.
					</span>
					<br />
					<span className="mt-6 inline-block">
						Complete and email the form to our Client Services team at{" "}
						<button
							type="button"
							onClick={() => handleEmail("clientservices.sg@cgsi.com", "Accredited Investor Declaration")}
							className="text-cgs-blue font-medium underline underline-offset-2"
						>
							clientservices.sg@cgsi.com
						</button>
						. You will receive an email notification once your request has been processed.
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

	// SIP: !toDisplay || !isPassed => inactive; expireDate past => expired; within 90d => expiring; else => success
	const getSipStatus = (): DeclarationStatus => {
		if (!tradingInfo?.sip.toDisplay || !tradingInfo.sip.isPassed) return "inactive";
		const days = getDaysUntilExpiry(tradingInfo.sip.expireDate);
		if (days === null) return "inactive";
		if (days <= 0) return "expired";
		if (days <= 90) return "expiring";
		return "success";
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

	// CRS: certified => success; else => inactive
	const getCrsStatus = (): DeclarationStatus => {
		if (tradingInfo?.crs.certified) return "success";
		return "inactive";
	};

	// BCAN: toDisplay=false => not-eligible; Enabled => success; else => inactive
	const getBcanStatus = (): DeclarationStatus => {
		if (!tradingInfo?.bcan.toDisplay) return "not-eligible";
		if (tradingInfo.bcan.requestStatus === "Enabled") return "success";
		if (tradingInfo.bcan.requestStatus?.startsWith("Requested")) return "processing";
		return "inactive";
	};

	const sipStatus = getSipStatus();
	const w8benStatus = getW8BenStatus();
	const crsStatus = getCrsStatus();
	const bcanStatus = getBcanStatus();

	const getSipExpDisplay = (): string => {
		if (sipStatus === "inactive") return "-";
		const dateStr = formatDate(tradingInfo?.sip.expireDate ?? null);

		const isCAR = Boolean(tradingInfo?.sip.car);
		const isCKA = Boolean(
			tradingInfo?.sip.ckaCfd ||
			tradingInfo?.sip.ckaFx ||
			tradingInfo?.sip.ckaUt ||
			tradingInfo?.sip.ckaSp
		);

		if (isCKA && isCAR) return `${dateStr} (CKA, CAR)`;
		if (isCKA) return `${dateStr} (CKA Only)`;
		if (isCAR) return `${dateStr} (CAR Only)`;
		return dateStr;
	};

	const handleEW8Click = async () => {
		if (loadingDeclarationId) return;

		setLoadingDeclarationId("w8ben");
		try {
			const response = await getEW8SSO();
			if (response.success && response.data?.redirectUrl) {
				redirectToSSO(response.data.redirectUrl);
				return;
			}

			toast.error(response.error || "Unable to open W8-BEN. Please try again later.");
		} catch {
			toast.error("Unable to open W8-BEN. Please try again later.");
		} finally {
			setLoadingDeclarationId(null);
		}
	};

	const handleECRSClick = async () => {
		if (loadingDeclarationId) return;

		setLoadingDeclarationId("crs");
		try {
			const response = await getECRSSSO();
			if (response.success && response.data?.redirectUrl) {
				redirectToSSO(response.data.redirectUrl);
				return;
			}

			toast.error(response.error || "Unable to open CRS. Please try again later.");
		} catch {
			toast.error("Unable to open CRS. Please try again later.");
		} finally {
			setLoadingDeclarationId(null);
		}
	};

	const items: DeclarationItem[] = [
		{
			id: "sip",
			title: "SIP",
			feature: "trading_decl_sip",
			status: sipStatus,
			exp: getSipExpDisplay(),
			tooltipContent: (
				<p>
					Required to trade Listed/ Unlisted Specified Investment Products (SIPs), clients must
					complete a declaration to assess their investment knowledge or experience.
				</p>
			),
			button: {
				label: sipStatus === "inactive" ? "Declare Now" : "Renew",
				onClick: () => {
					window.open(
						"https://stgitrade.cgsi.com.sg/app/common.home.sip.z",
						"_blank"
					);
				},
			},
		},
		{
			id: "w8ben",
			title: "W8-BEN",
			feature: "trading_decl_w8ben",
			status: w8benStatus,
			exp: formatDate(tradingInfo?.w8ben.expireDate ?? null),
			tooltipContent: (
				<p>
					Required to trade US Stocks, non-US individuals will need to confirm their foreign status
					and claim reduced tax rates on US income under tax treaties.
				</p>
			),
			button: w8benStatus === "success" || w8benStatus === "expiring"
				? { label: "Renew", onClick: handleEW8Click, loading: loadingDeclarationId === "w8ben" }
				: { label: "Declare Now", onClick: handleEW8Click, loading: loadingDeclarationId === "w8ben" },
		},
		{
			id: "bcan",
			title: "BCAN",
			feature: "trading_decl_bcan",
			status: bcanStatus,
			exp: bcanStatus === "not-eligible" ? "-"
				: tradingInfo?.bcan.requestStatus === "Enabled" ? "NIL"
				: tradingInfo?.bcan.requestStatus?.startsWith("Requested")
					? tradingInfo.bcan.requestStatus.replace("Requested on", "Requested on:")
					: "-",
			tooltipContent:
				"Required to trade on the Stock Exchange of Hong Kong (HKEX). Not applicable for Mainland Chinese nationals.",
			button: bcanStatus === "inactive"
				? { label: "Declare Now", onClick: handleBcanDeclare }
				: bcanStatus === "processing"
					? { label: "Declare Now", onClick: handleBcanDeclare, disabled: true }
					: null,
		},
		{
			id: "crs",
			title: "CRS",
			feature: "trading_decl_crs",
			status: crsStatus,
			exp: formatDate(tradingInfo?.crs.validationDate ?? null),
			tooltipContent:
				"Required for Financial institutions to collect and report account information between countries to prevent tax evasion by foreign residents.",
			button: { label: "Declare Now", onClick: handleECRSClick, loading: loadingDeclarationId === "crs" },
		},
		{
			id: "accredited",
			title: "Accredited Investor",
			feature: "trading_decl_ai",
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
				{items.filter((item) => !item.feature || declPerms[item.feature as keyof typeof declPerms]).map((item, index, filtered) => (
						<div key={item.id}>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2 text-sm md:text-base font-semibold text-typo-primary">
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
							{item.button ? (
								<Button
									onClick={item.button.onClick}
									disabled={item.button.disabled || item.button.loading}
									aria-busy={item.button.loading}
									variant={"outline"}
									className="text-cgs-blue !border-cgs-blue text-sm h-8 px-3 hover:bg-white hover:text-cgs-blue/75 hover:!border-cgs-blue/75 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{item.button.loading && <Loader2 className="size-4 animate-spin" />}
									{item.button.label}
									{!item.button.loading && <ChevronRight className="size-4 -ml-0.5 text-cgs-blue" />}
								</Button>
							) : item.id === "bcan" && !item.button ? (
								<span className="flex items-center gap-1 text-sm text-gray-400">
									<EyeOff className="size-4" />
									{item.status === "not-eligible" ? "Not Applicable" : "Declare Now"}
									<ChevronRight className="size-4 -ml-0.5" />
								</span>
							) : null}
						</div>

						<div className="flex items-center justify-between gap-2 mt-4">
							<Badge variant={STATUS_BADGE_VARIANT[item.status]} className="capitalize">
								<StatusIcon status={item.status} />
								{STATUS_LABEL[item.status]}
							</Badge>
							<span className="text-sm font-medium text-[#8492A2]">
								{item.id === "bcan" && item.status === "processing" ? item.exp : `Exp: ${item.exp}`}
							</span>
						</div>

						{index < filtered.length - 1 && (
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
