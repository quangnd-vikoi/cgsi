import React, { useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { ArrowRightCircle, ChevronDown, ChevronRight, CircleCheck, Copy } from "lucide-react";
import WaringIcon from "@/public/icons/Warning.svg";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { handleCopy } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSheetStore } from "@/stores/sheetStore";

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
			<div>
				<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs">
					{label}
					<Tooltip>
						<TooltipTrigger asChild>
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
							<p className="font-medium text-typo-primary text-sm truncate flex-1">{value}</p>
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
											className="absolute text-status-error -top-5 right-0 text-xs hover:underline"
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
			</div>
			{showSeparator && <Separator />}
		</>
	);
};

const TradingAccountDetail = () => {
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);
	const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
	const router = useRouter();
	const setOpenSheet = useSheetStore((state) => state.setOpenSheet);

	const handleUnlink = (accountType: "cpf" | "srs" | "payment") => {
		setOpenSheet(null);
		router.push(`/account-linkages?tab=${accountType}&action=unlink`);
	};

	const handleLink = (accountType: "cpf" | "srs" | "giro" | "eps") => {
		setOpenSheet(null);
		router.push(`/account-linkages?tab=${accountType}`);
	};

	if (!selectedAccount) return null;

	const isCashAccount = selectedAccount.accountType === "Cash Trading Account";
	const isSharesBorrowing = selectedAccount.accountType === "Shares Borrowing Account";

	return (
		<div className="flex flex-col h-full">
			<CustomSheetTitle backTo="trading_accounts" title="Account Details" />

			<div className="flex-1 mt-6 pb-4 overflow-y-auto scrollbar-offset-laptop">
				<div className="mb-9">
					<p className="text-typo-secondary text-xs">{selectedAccount.accountType}</p>
					<div className="flex items-center gap-2">
						<p className="font-semibold text-typo-primary text-lg">{selectedAccount.accountNo}</p>
						<Copy
							className="text-enhanced-blue cursor-pointer"
							size={20}
							onClick={() => handleCopy(selectedAccount.accountNo)}
						/>
					</div>
				</div>

				{!isSharesBorrowing && (
					<Group title="Account Linkages" childrenClassName="gap-4">
						<LinkageItem
							label="CDP"
							tooltipContent="Your SGX-listed securities are held in your personal CDP account. For greater convenience and smoother trade settlement, consider switching to a Sub-CDP with CGSI."
							value={selectedAccount.cdp || undefined}
							actionContent={
								<div className="flex items-center gap-1 text-enhanced-blue text-xs cursor-pointer shrink-0">
									Update to SUB-CDP
									<ChevronRight size={16} />
								</div>
							}
							showSeparator={isCashAccount}
						/>

						{isCashAccount && (
							<>
								<LinkageItem
									label="CPF"
									tooltipContent="Link your CPF Investment Account to start investing in eligible assets under the CPF Investment Scheme (CPFIS)."
									value={selectedAccount.cpf || undefined}
									isLinked={selectedAccount.cpf != null}
									onUnlink={() => handleUnlink("cpf")}
									actionContent={
										<div
											className="flex items-center gap-1 text-enhanced-blue text-xs cursor-pointer shrink-0"
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
											className="flex items-center gap-1 text-enhanced-blue text-xs cursor-pointer shrink-0"
											onClick={() => handleLink("srs")}
										>
											Link Now
											<ChevronRight size={16} />
										</div>
									}
								/>

								<LinkageItem
									label={selectedAccount.giro ? "GIRO" : selectedAccount.eps ? "EPS" : "Payment method"}
									tooltipContent="Set up electronic fund transfers via EPS or GIRO to seamlessly pay for share purchases and receive sale proceeds directly from your bank account to CGSI"
									value={selectedAccount.giro || selectedAccount.eps || undefined}
									isLinked={!!(selectedAccount.giro || selectedAccount.eps)}
									onUnlink={() => handleUnlink("payment")}
									actionContent={
										<DropdownMenu onOpenChange={setIsPaymentMethodOpen}>
											<DropdownMenuTrigger asChild>
												<p className="flex items-center gap-1 text-enhanced-blue text-xs cursor-pointer shrink-0 whitespace-nowrap">
													{isPaymentMethodOpen ? "Set Up Now" : "Payment Method"}
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
							</>
						)}
					</Group>
				)}

				<div className="mt-9">
					<Group title="Trading Representative">
						{[
							{ label: "TR Name", value: selectedAccount.trName },
							{
								label: "Department",
								value: "Wealth Solutions",
							},
							{ label: "Rep. No.", value: selectedAccount.trCode },
							{
								label: "Phone Number",
								value: "",
								hasCopy: true,
								hasArrow: true,
							},
							{
								label: "Email Add.",
								value: "",
								hasCopy: true,
								hasArrow: true,
							},
						].map((item, index) => (
							<div key={index} className="flex justify-between items-center text-sm gap-2">
								<p className="text-typo-secondary">{item.label}</p>
								<div className="flex items-center gap-2 min-w-0">
									<p className="font-medium text-typo-primary truncate">{item.value}</p>
									{item.hasCopy && (
										<Copy
											onClick={() => handleCopy(item.value)}
											className="text-enhanced-blue cursor-pointer shrink-0"
											size={16}
										/>
									)}
									{item.hasArrow && (
										<ArrowRightCircle className="text-enhanced-blue shrink-0" size={16} />
									)}
								</div>
							</div>
						))}
					</Group>
				</div>
			</div>
		</div>
	);
};

export default TradingAccountDetail;
