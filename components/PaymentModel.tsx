"use client";

import React from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaynowIcon from "@/public/icons/discover/Paynow.svg";
import Image from "./Image";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { useUserStore } from "@/stores/userStore";
import { depositPaynow } from "@/lib/services/portfolioService";
import { S2BPayButton } from "@/components/S2BPayButton";
import { toast } from "@/components/ui/toaster";

interface PaymentMethod {
	id: string;
	name: string;
	description: string;
	icon: React.ReactNode;
	available: boolean;
}

interface PaymentModelProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const BankIcon = () => (
	<Image src={"/icons/Banking.svg"} alt="" height={24} width={24} className="w-6 h-6 text-typo-secondary" />
);

const paymentMethods: PaymentMethod[] = [
	{
		id: "paynow",
		name: "PayNow",
		description: "Available only for deposits in SGD currency",
		icon: <PaynowIcon />,
		available: true,
	},
	{
		id: "bank-transfer",
		name: "Bank Transfer",
		description: "Supports deposits in all available currencies",
		icon: <BankIcon />,
		available: true,
	},
];

interface PayNowDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onProceed: (accountNo: string, amount: number, accountType: string) => void;
	isProcessing: boolean;
}

function PayNowDialog({ open, onOpenChange, onProceed, isProcessing }: PayNowDialogProps) {
	const accounts = useTradingAccountStore((s) => s.accounts);
	const getDefaultAccountNo = useTradingAccountStore((s) => s.getDefaultAccountNo);
	const userName = useUserStore((s) => s.profile?.name ?? "");

	const [selectedAccount, setSelectedAccount] = React.useState<string>("");
	const [amount, setAmount] = React.useState("");
	const [confirmed, setConfirmed] = React.useState(false);

	React.useEffect(() => {
		if (open) {
			const defaultNo = getDefaultAccountNo();
			setSelectedAccount(defaultNo ?? accounts[0]?.accountNo ?? "");
			setAmount("");
			setConfirmed(false);
		}
	}, [open, accounts, getDefaultAccountNo]);

	const accountLabel = (accountNo: string) => {
		const acc = accounts.find((a) => a.accountNo === accountNo);
		if (!acc) return accountNo;
		return acc.accountType ? `(${acc.accountType}) ${accountNo}` : accountNo;
	};

	const handleProceed = () => {
		const acc = accounts.find((a) => a.accountNo === selectedAccount);
		onProceed(selectedAccount, parseFloat(amount), acc?.accountType ?? "");
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!isProcessing) onOpenChange(v); }}>
			<DialogContent className="sm:max-w-[530px] p-0 gap-0" showCloseButton={!isProcessing}>
				<DialogHeader className="p-6 pb-4">
					<DialogTitle className="text-base font-semibold text-typo-primary text-left">
						Deposit via PayNow
					</DialogTitle>
				</DialogHeader>

				<div className="pad-x pb-6 space-y-5">
					<div className="space-y-1.5">
						<p className="text-sm font-medium text-typo-primary">Account</p>
						<Select value={selectedAccount} onValueChange={setSelectedAccount} disabled={isProcessing}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select account">
									{selectedAccount ? accountLabel(selectedAccount) : "Select account"}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{accounts.map((acc) => (
									<SelectItem key={acc.accountNo} value={acc.accountNo}>
										{acc.accountType
											? `(${acc.accountType}) ${acc.accountNo}`
											: acc.accountNo}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<p className="text-sm font-medium text-typo-primary">Deposit Amount (SGD)</p>
						<Input
							type="number"
							placeholder="Enter an amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							disabled={isProcessing}
						/>
					</div>

					<div className="flex items-start gap-3">
						<Checkbox
							id="paynow-confirm"
							checked={confirmed}
							onCheckedChange={(v) => setConfirmed(!!v)}
							className="mt-0.5"
							disabled={isProcessing}
						/>
						<label
							htmlFor="paynow-confirm"
							className="text-xs text-typo-secondary leading-relaxed cursor-pointer"
						>
							By checking this box, you confirm that your trading account is funded in your name
							{userName ? ` - ${userName}` : ""}
						</label>
					</div>
				</div>

				<DialogFooter>
					<div className="flex justify-end pt-1">
						<Button
							onClick={handleProceed}
							disabled={!selectedAccount || !amount || !confirmed || isProcessing}
							className="bg-cgs-blue hover:bg-cgs-blue/90 text-white px-3 py-2"
						>
							{isProcessing ? <Loader2 className="animate-spin" /> : "Proceed"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function PaymentModel({ open, onOpenChange }: PaymentModelProps) {
	const [showPayNow, setShowPayNow] = React.useState(false);
	const [submitFn, setSubmitFn] = React.useState<(() => Promise<{
		s2bPayUrl: string;
		corpId: string;
		encStr: string;
	} | null>) | null>(null);

	const handleSelectMethod = (id: string) => {
		if (id === "paynow") {
			onOpenChange(false);
			setShowPayNow(true);
		} else if (id === "bank-transfer") {
			window.open("https://www.cgsi.com.sg/uploads/CGSI_Remittance_Details_8fc969c302.pdf", "_blank");
		} else {
			onOpenChange(false);
		}
	};

	const handleProceed = (accountNo: string, amount: number, accountType: string) => {
		const mode = accountType === "iCash" ? "ICASH" : "DEPOSIT";
		setSubmitFn(() => async () => {
			const response = await depositPaynow({
				accountNo,
				mode,
				amount,
				currency: "SGD",
				refNo: `PAYNOW-${Date.now()}`,
			});
			if (!response.success) return null;
			return response.data;
		});
	};

	const handleS2BDone = () => {
		setSubmitFn(null);
		setShowPayNow(false);
	};

	const handleS2BError = () => {
		setSubmitFn(null);
		toast.error("PayNow Failed", "Failed to initiate PayNow deposit. Please try again.");
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[530px] p-0 gap-0">
					<DialogHeader className="p-6">
						<DialogTitle className="text-base font-semibold text-typo-primary text-left ">
							Deposit Methods
						</DialogTitle>
					</DialogHeader>

					<div className="pad-x pb-6 space-y-6">
						{paymentMethods.map((method) => (
							<button
								key={method.id}
								onClick={() => handleSelectMethod(method.id)}
								disabled={!method.available}
								className="w-full flex items-center gap-4 py-2 px-4 rounded border border-theme-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
							>
								<div className="flex-shrink-0">{method.icon}</div>

								<div className="flex-1 text-left">
									<h3 className="text-sm font-semibold text-typo-primary mb-1">
										{method.name}
									</h3>
									<p className="text-xs text-typo-secondary">{method.description}</p>
								</div>

								<ChevronRight
									size={16}
									className="text-typo-tertiary group-hover:text-cgs-blue transition-colors"
								/>
							</button>
						))}
					</div>
				</DialogContent>
			</Dialog>

			<PayNowDialog
				open={showPayNow}
				onOpenChange={setShowPayNow}
				onProceed={handleProceed}
				isProcessing={!!submitFn}
			/>

			{submitFn && (
				<S2BPayButton
					submitFn={submitFn}
					onReady={() => setShowPayNow(false)}
					onClose={handleS2BDone}
					onError={handleS2BError}
				/>
			)}
		</>
	);
}
