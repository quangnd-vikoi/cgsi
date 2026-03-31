import React, { useEffect, useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { ArrowRightCircle, ChevronDown, ChevronRight, CircleCheck, Copy } from "lucide-react";
import WaringIcon from "@/public/icons/Warning.svg";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { handleCopy, handleCall, handleEmail } from "@/lib/utils";
import { ACCOUNT_TYPE_LABELS } from "@/constants/accounts";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSheetStore } from "@/stores/sheetStore";
import { Separator } from "@radix-ui/react-separator";
import { getTradingRepInfoByAccount } from "@/lib/services/profileService";
import { Skeleton } from "@/components/ui/skeleton";
import type { ITrInfo } from "@/types";

interface LinkageItemProps {
	label: string;
	tooltipContent: string;
	value?: string;
	isLinked?: boolean;
	onUnlink?: () => void;
	actionContent?: React.ReactNode;
	showSeparator?: boolean;
}

const LinkageItem: React.FC<LinkageItemProps> = ({
	label,
	tooltipContent,
	value,
	isLinked = false,
	onUnlink,
	actionContent,
	showSeparator = true,
}) => {
	return (
		<>
			<div className="p-4">
				<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-rsp-xs">
					{label}
					<Tooltip>
						<TooltipTrigger>
							<WaringIcon />
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>{tooltipContent}</p>
						</TooltipContent>
					</Tooltip>
				</div>

				<div className="flex justify-between items-center gap-2">
					{value ? (
						<>
							<p className="font-medium text-typo-primary text-rsp-sm truncate flex-1">
								{value}
							</p>
							{isLinked ? (
								<Badge variant="success" className="relative overflow-visible shrink-0">
									<CircleCheck
										size={12}
										className="border-tone-green-04 text-tone-green-04"
									/>
									Linked
									{onUnlink && (
										<Link
											href="#"
											onClick={(e) => {
												e.preventDefault();
												onUnlink();
											}}
											className="absolute text-status-error -top-7 right-0 text-rsp-xs hover:underline"
										>
											Unlink
										</Link>
									)}
								</Badge>
							) : (
								actionContent
							)}
						</>
					) : (
						<>
							<p className="text-typo-tertiary">-</p>
							{actionContent}
						</>
					)}
				</div>

				{showSeparator && <Separator className="h-[1px] bg-stroke-secondary mt-4 -mb-4" />}
			</div>
		</>
	);
};

const TradingAccountDetail = () => {
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);
	const router = useRouter();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);
	const [trInfo, setTrInfo] = useState<ITrInfo | null>(null);
	const [isTrLoading, setIsTrLoading] = useState(false);
	const fetchedAccountNo = React.useRef<string | null>(null);

	useEffect(() => {
		const accountNo = selectedAccount?.accountNo;
		if (!accountNo || accountNo === fetchedAccountNo.current) return;
		fetchedAccountNo.current = accountNo;

		const fetchTrInfo = async () => {
			try {
				setIsTrLoading(true);
				setTrInfo(null);
				const res = await getTradingRepInfoByAccount(accountNo);
				if (res.success && res.data && res.data.length > 0) {
					setTrInfo(res.data[0]);
				}
			} catch (error) {
				console.error("Failed to fetch TR info:", error);
			} finally {
				setIsTrLoading(false);
			}
		};
		fetchTrInfo();
	}, [selectedAccount?.accountNo]);

	const handleUnlink = (accountType: "sub-cdp" | "cpf" | "srs" | "giro" | "eps") => {
		setOpenSheet(null);
		router.push(`/account-linkages?tab=${accountType}&action=unlink`);
	};

	const handleLink = (accountType: "sub-cdp" | "cpf" | "srs" | "giro" | "eps") => {
		setOpenSheet(null);
		router.push(`/account-linkages?tab=${accountType}`);
	};

	const isSubCDP = useTradingAccountStore((s) => s.isSubCDP());

	if (!selectedAccount) return null;

	const accountType = selectedAccount.accountType;
	const isCTA = accountType === "CTA";
	const isCUT = accountType === "CUT";
	const isSBL = accountType === "SBL";
	const showCpfSrs = isCTA || isCUT;
	const accountTypeLabel = accountType ? (ACCOUNT_TYPE_LABELS[accountType] ?? accountType) : "";
	return (
		<div className="flex flex-col h-full">
			<CustomSheetTitle backTo="trading_accounts" title="Account Details" />

			<div className="flex-1 mt-6 pb-4 overflow-y-auto scrollbar-offset-laptop">
				<div className="mb-9">
					<p className="text-typo-secondary text-xs">{accountTypeLabel}</p>
					<div className="flex items-center gap-2">
						<p className="font-semibold text-typo-primary text-lg">{selectedAccount.accountNo}</p>
						<Copy
							className="text-cgs-blue cursor-pointer"
							size={20}
							onClick={() => handleCopy(selectedAccount.accountNo)}
						/>
					</div>
				</div>

				{!isSBL && (
					<Group showSeparator={false} title="Account Linkages" childrenClassName="gap-0">
						<LinkageItem
							label={isSubCDP ? "Sub-CDP" : "CDP"}
							tooltipContent={
								isSubCDP
									? "An arrangement where your SGX-listed securities are held in custody under CGSI, offering greater convenience and smoother trade settlements."
									: "Your SGX-listed securities are held in your personal CDP account. For greater convenience and smoother trade settlement, consider switching to a Sub-CDP with CGSI."
							}
							value={selectedAccount.cdp || undefined}
							actionContent={
								!isSubCDP && (
									<div
										className="flex items-center gap-1 text-cgs-blue text-rsp-xs font-medium cursor-pointer shrink-0"
										onClick={() => handleLink("sub-cdp")}
									>
										Update to SUB-CDP
										<ChevronRight size={18} />
									</div>
								)
							}
							showSeparator={showCpfSrs}
						/>

						{showCpfSrs && (
							<>
								<LinkageItem
									label="CPF"
									tooltipContent="Link your CPF Investment Account to start investing in eligible assets under the CPF Investment Scheme (CPFIS)."
									value={selectedAccount.cpf || undefined}
									isLinked={selectedAccount.cpf != null}
									onUnlink={() => handleUnlink("cpf")}
									actionContent={
										<div
											className="flex items-center gap-1 text-cgs-blue text-xs font-medium cursor-pointer shrink-0"
											onClick={() => handleLink("cpf")}
										>
											Link Now
											<ChevronRight size={16} />
										</div>
									}
								/>

								<LinkageItem
									label="SRS"
									tooltipContent="Link your SRS account to your trading account to invest in approved products and enjoy potential tax savings under the Supplementary Retirement Scheme."
									value={selectedAccount.srs || undefined}
									isLinked={selectedAccount.srs != null}
									onUnlink={() => handleUnlink("srs")}
									actionContent={
										<div
											className="flex items-center gap-1 text-cgs-blue text-xs font-medium cursor-pointer shrink-0"
											onClick={() => handleLink("srs")}
										>
											Link Now
											<ChevronRight size={16} />
										</div>
									}
								/>

								{isCTA && (
									<LinkageItem
										label={
											selectedAccount.giro
												? "Payment Method (GIRO)"
												: selectedAccount.eps
													? "Payment Method (EPS)"
													: "Payment Method"
										}
										tooltipContent="Set up electronic fund transfers via EPS or GIRO to seamlessly pay for share purchases and receive sale proceeds directly from your bank account to CGSI"
										value={selectedAccount.giro || selectedAccount.eps || undefined}
										isLinked={!!(selectedAccount.giro || selectedAccount.eps)}
										onUnlink={() => handleUnlink(selectedAccount.giro ? "giro" : "eps")}
										actionContent={
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<p className="flex items-center gap-1 text-cgs-blue text-xs font-medium cursor-pointer shrink-0 whitespace-nowrap">
														Setup Now
														<ChevronDown size={16} />
													</p>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className="w-36 px-0 py-2 text-sm"
													align="end"
												>
													<DropdownMenuItem
														onClick={() => handleLink("eps")}
														className="cursor-pointer px-3 py-[10px] rounded-none hover:bg-background-focus"
													>
														EPS
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleLink("giro")}
														className="cursor-pointer px-3 py-[10px] rounded-none hover:bg-background-focus"
													>
														GIRO
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										}
										showSeparator={false}
									/>
								)}
							</>
						)}
					</Group>
				)}

				<div className="mt-9">
					<Group title="Trading Representative" showSeparator={false}>
						{isTrLoading ? (
							<div className="flex flex-col gap-4 p-4">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="flex justify-between items-center">
										<Skeleton className="h-4 w-1/4" />
										<Skeleton className="h-4 w-1/3" />
									</div>
								))}
							</div>
						) : trInfo ? (
							<div className="flex flex-col gap-4 p-4">
								<div className="flex justify-between items-center text-rsp-sm gap-2">
									<p className="text-typo-secondary shrink-0">TR Name</p>
									<p className="font-medium text-typo-primary truncate">{trInfo.trName}</p>
								</div>
								<div className="flex justify-between items-center text-rsp-sm">
									<p className="text-typo-secondary">Rep. No.</p>
									<p className="font-medium text-typo-primary truncate">{trInfo.trCode}</p>
								</div>
								{trInfo.trContact && (
									<div className="flex justify-between items-center text-rsp-sm">
										<p className="text-typo-secondary">Phone Number</p>
										<div className="flex items-center gap-2 min-w-0">
											<p className="font-medium text-typo-primary truncate">
												{trInfo.trContact}
											</p>
											<Copy
												onClick={() => handleCopy(trInfo.trContact)}
												className="text-cgs-blue cursor-pointer shrink-0"
												size={16}
											/>
											<ArrowRightCircle
												onClick={() => handleCall(trInfo.trContact)}
												className="text-cgs-blue cursor-pointer shrink-0"
												size={16}
											/>
										</div>
									</div>
								)}
								{trInfo.trEmail && (
									<div className="flex justify-between items-center text-rsp-sm">
										<p className="text-typo-secondary">Email Add.</p>
										<div className="flex items-center gap-2 min-w-0">
											<p className="font-medium text-typo-primary truncate">
												{trInfo.trEmail}
											</p>
											<Copy
												onClick={() => handleCopy(trInfo.trEmail)}
												className="text-cgs-blue cursor-pointer shrink-0"
												size={16}
											/>
											<ArrowRightCircle
												onClick={() => handleEmail(trInfo.trEmail)}
												className="text-cgs-blue cursor-pointer shrink-0"
												size={16}
											/>
										</div>
									</div>
								)}
							</div>
						) : (
							<p className="text-sm text-typo-secondary p-4">
								No trading representative information available.
							</p>
						)}
					</Group>
				</div>
			</div>
		</div>
	);
};

export default TradingAccountDetail;
