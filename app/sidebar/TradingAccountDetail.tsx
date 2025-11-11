import React, { useState } from "react";
import CustomSheetTitle from "./_components/CustomSheetTitle";
import Group from "./_components/Group";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { ArrowRightCircle, ChevronDown, ChevronRight, Copy } from "lucide-react";
import WaringIcon from "@/public/icons/Warning.svg";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn, handleCopy } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

const TradingAccountDetail = () => {
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);
	const [isSubCdpLinked, setIsSubCdpLinked] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleUpdateSubCdp = () => {
		setIsSubCdpLinked(true);
	};

	if (selectedAccount) {
		return (
			<div className="flex flex-col h-full">
				<CustomSheetTitle backTo={"trading_accounts"} title="Account Details" />

				<div className="flex-1 mt-6 pb-4 overflow-y-auto scrollbar-offset-laptop">
					<div className="mb-9">
						<p className="text-typo-secondary text-xs">{selectedAccount.type}</p>
						<div className="flex items-center gap-2">
							<p className="font-semibold text-typo-primary text-lg">{selectedAccount.id}</p>
							<Copy className="text-enhanced-blue" size={20} />
						</div>
					</div>

					<Group title="Account Linkages" childrenClassName="gap-4">
						<div className="">
							<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs">
								{isSubCdpLinked ? "CDP" : "Sub-CDP"}
								<Tooltip>
									<TooltipTrigger asChild>
										<WaringIcon />
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>
											Your SGX-listed securities are held in your personal CDP account.
											For greater convenience and smoother trade settlement, consider
											switching to a Sub-CDP with CGSI.
										</p>
									</TooltipContent>
								</Tooltip>
							</div>

							<div className="flex justify-between items-center">
								{selectedAccount.details.cdp ? (
									<p className="font-medium text-typo-primary text-sm">
										{isSubCdpLinked ? "SUB_CDP12345678" : selectedAccount.details.cdp}
									</p>
								) : (
									<p className="text-typo-tertiary">-</p>
								)}
								{!isSubCdpLinked && (
									<div
										onClick={handleUpdateSubCdp}
										className="flex items-center gap-1 text-enhanced-blue text-xs cursor-pointer"
									>
										Update to SUB-CDP
										<ChevronRight size={16} />
									</div>
								)}
							</div>
						</div>

						<Separator />

						<div className="">
							<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs">
								CPF
								<Tooltip>
									<TooltipTrigger asChild>
										<WaringIcon />
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>
											Link your CPF Investment Account to start investing in eligible
											assets under the CPF Investment Scheme (CPFIS).
										</p>
									</TooltipContent>
								</Tooltip>
							</div>

							<div className="flex justify-between items-center">
								{selectedAccount.details.cpfAccount ? (
									<p className="font-medium text-typo-primary text-sm">
										{selectedAccount.details.cpfAccount}
									</p>
								) : (
									<p className="text-typo-tertiary">-</p>
								)}
								<p className="flex gap-1 text-enhanced-blue text-xs cursor-pointer">
									Link Now
									<ChevronRight size={16} />
								</p>
							</div>
						</div>

						<Separator />

						<div className="">
							<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs">
								SRS
								<Tooltip>
									<TooltipTrigger asChild>
										<WaringIcon />
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>
											Link your SRS account to your trading account to invest in
											approved products and enjoy potential tax savings under the
											Supplementary Retirement Scheme.
										</p>
									</TooltipContent>
								</Tooltip>
							</div>

							<div className="flex justify-between items-center">
								{selectedAccount.details.srsAccount ? (
									<p className="font-medium text-typo-primary text-sm">
										{selectedAccount.details.srsAccount}
									</p>
								) : (
									<p className="text-typo-tertiary">-</p>
								)}
								<p className="flex gap-1 text-enhanced-blue text-xs cursor-pointer">
									Link Now
									<ChevronRight size={16} />
								</p>
							</div>
						</div>

						<Separator />

						<div className="">
							<div className="flex items-center gap-1.5 mb-2 text-typo-secondary text-xs">
								Payment Method
								<Tooltip>
									<TooltipTrigger asChild>
										<WaringIcon />
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>
											Set up electronic fund transfers via EPS or GIRO to seamlessly pay
											for share purchases and receive sale proceeds directly from your
											bank account to CGSI
										</p>
									</TooltipContent>
								</Tooltip>
							</div>

							<div className="flex justify-between items-center">
								{selectedAccount.details.srsAccount ? (
									<p className="font-medium text-typo-primary text-sm">
										{selectedAccount.details.srsAccount}
									</p>
								) : (
									<p className="text-typo-tertiary">-</p>
								)}
								<DropdownMenu onOpenChange={setIsOpen}>
									<DropdownMenuTrigger asChild>
										<p className="flex gap-1 text-enhanced-blue text-xs cursor-pointer">
											{isOpen ? "Set Up Now" : "Payment Method"}
											<ChevronDown size={16} />
										</p>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-36 px-0 py-2 relative right-10 text-sm"
										align="start"
									>
										<DropdownMenuItem
											className={cn(
												"cursor-pointer px-3 py-[10px] rounded-none",
												isActive
													? "text-enhanced-blue bg-status-selected"
													: "hover:bg-background-focus"
											)}
										>
											EPS
										</DropdownMenuItem>
										<DropdownMenuItem
											className={cn(
												"cursor-pointer px-3 py-[10px] rounded-none",
												isActive
													? "text-enhanced-blue bg-status-selected"
													: "hover:bg-background-focus"
											)}
										>
											GIRO
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</Group>

					<div className="mt-9">
						<Group title="Trading Representative">
							<div className="flex justify-between text-sm">
								<p className="text-typo-secondary">TR Name</p>
								<p className="font-medium text-typo-primary">{selectedAccount.trName}</p>
							</div>
							<div className="flex justify-between text-sm">
								<p className="text-typo-secondary">Department</p>
								<p className="font-medium text-typo-primary">
									{selectedAccount.details.representative.department}
								</p>
							</div>
							<div className="flex justify-between text-sm">
								<p className="text-typo-secondary">Rep. No.</p>
								<p className="font-medium text-typo-primary">
									{selectedAccount.details.representative.repNo}
								</p>
							</div>
							<div className="flex justify-between text-sm">
								<p className="text-typo-secondary">Phone Number</p>
								<p className="flex gap-2 font-medium text-typo-primary">
									{selectedAccount.details.representative.phone}

									<Copy
										onClick={() =>
											handleCopy(selectedAccount.details.representative.phone)
										}
										className="text-enhanced-blue cursor-pointer"
										size={16}
									/>
									<ArrowRightCircle className="text-enhanced-blue" size={16} />
								</p>
							</div>
							<div className="flex justify-between text-sm">
								<p className="text-typo-secondary">Email Add.</p>
								<p className="flex gap-2 font-medium text-typo-primary">
									{selectedAccount.details.representative.email}
									<Copy
										onClick={() =>
											handleCopy(selectedAccount.details.representative.email)
										}
										className="text-enhanced-blue cursor-pointer"
										size={16}
									/>
									<ArrowRightCircle className="text-enhanced-blue" size={16} />
								</p>
							</div>
						</Group>
					</div>
				</div>
			</div>
		);
	}
};

export default TradingAccountDetail;
