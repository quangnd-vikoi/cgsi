"use client";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toaster";
import { CGSI } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useDonationForm } from "../_hooks/useDonationForm";
import PaynowIcon from "@/public/icons/discover/Paynow.svg";
import { Loader2, Wallet } from "lucide-react";
import { useRef, useState } from "react";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { depositPaynow } from "@/lib/services/portfolioService";
import { submitDonation } from "@/lib/services/profileService";
import { S2BPayButton } from "@/components/S2BPayButton";
import type { IS2BPayNotifyStatus } from "@/types";

const PAYNOW_SUCCESS_VALUES = new Set([
	"success",
	"successful",
	"succeeded",
	"paid",
	"completed",
	"complete",
]);

const getS2BNotifyStatusValues = (status: IS2BPayNotifyStatus): string[] =>
	[
		status.status,
		status.txnstatus,
		status.paymentStatus,
		status.transactionStatus,
		status.result,
	]
		.filter((value): value is string => typeof value === "string")
		.map((value) => value.trim().toLowerCase());

const isS2BPayNowSuccess = (status: IS2BPayNotifyStatus): boolean =>
	getS2BNotifyStatusValues(status).some((value) => PAYNOW_SUCCESS_VALUES.has(value));

const OneTimeForm = () => {
	const [inputValue, setInputValue] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [paynowSubmitFn, setPaynowSubmitFn] = useState<(() => Promise<{
		s2bPayUrl: string;
		corpId: string;
		encStr: string;
	} | null>) | null>(null);
	const paynowSuccessHandledRef = useRef(false);

	const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
	const accountNo = getDefaultAccountNo();

	const {
		amount,
		setAmount,
		paymentMethod,
		setPaymentMethod,
		agreed,
		setAgreed,
		errors,
		handleSubmit,
		reset,
	} = useDonationForm({
		accountNo: accountNo || undefined,
		donationType: "onetime",
		submitToAPI: false,
		minAmount: 1.0,
	});

	const handleDonate = async () => {
		if (!accountNo) {
			toast.error("No trading account found", "Please contact support to set up your account");
			return;
		}

		const valid = await handleSubmit();
		if (!valid) return;

		setIsSubmitting(true);

		if (paymentMethod === "now") {
			const donateAmount = amount!;
			paynowSuccessHandledRef.current = false;
			setPaynowSubmitFn(() => async () => {
				const response = await depositPaynow({
					accountNo,
					mode: "DONATE",
					amount: donateAmount,
					currency: "SGD",
					refNo: `DONATE-${Date.now()}`,
				});
				if (!response.success) return null;
				return response.data;
			});
			return;
		} else {
			const response = await submitDonation({
				accountNo,
				amount: amount!,
				currency: "SGD",
				paymentMethod: "LS_ACCSET",
				paymentMode: "DONATE",
			});

			if (!response.success || response.data?.success === false) {
				toast.error("Payment Unsuccessful", response.error ?? "We were unable to process your donation. Please try again later.");
			} else {
				toast.success(
					"Thank you!",
					"Your donation will go a long way in uplifting lives. We truly appreciate it.",
				);
				setInputValue("");
				reset();
			}
		}

		setIsSubmitting(false);
	};

	return (
		<>
			<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
				{/* Nội dung chính */}
				<div className="flex-1 space-y-6 pad-x py-6 overflow-y-auto">
					<div className="space-y-4 text-sm font-normal text-typo-secondary">
						<p>
							Make a quick one-time donation today and uplift the lives of individuals who need
							assistance!
						</p>
						<p>
							Note: For PayNow, the bank account holder must be LIM YI BIN. Transfers from other
							account holders will be rejected.
						</p>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="donationAmount" className="font-semibold text-typo-primary">
							Donation Amount (SGD)
						</Label>
						<Input
							placeholder="Enter an amount (min SGD 1.00)"
							id="donationAmount"
							value={inputValue}
							type="text"
							inputMode="decimal"
							error={errors.amount}
							onChange={(e) => {
								const value = e.target.value;
								if (value === "" || /^\d*\.?\d*$/.test(value)) {
									setInputValue(value);
									if (value && !isNaN(parseFloat(value))) {
										const numValue = parseFloat(value);
										setAmount(parseFloat(numValue.toFixed(2)));
									} else {
										setAmount(undefined);
									}
								}
							}}
							onBlur={(e) => {
								const value = e.target.value;
								if (value && !isNaN(parseFloat(value))) {
									const numValue = parseFloat(value);
									const formatted = numValue.toFixed(2);
									setInputValue(formatted);
									setAmount(parseFloat(formatted));
								}
							}}
							disabled={isSubmitting}
							className={cn(
								"focus-visible:bg-background-focus focus-visible:border-cgs-blue text-sm font-normal",
							)}
						/>
					</div>

					<div className="w-full">
						<Label className="font-semibold text-typo-primary ">Payment Method</Label>

						<RadioGroup
							value={paymentMethod}
							onValueChange={(value) => {
								setPaymentMethod(value as "now" | "trust");
							}}
							className="space-y-2 mt-1.5"
							disabled={isSubmitting}
						>
							<Label
								className={cn(
									"flex justify-between w-full px-4 py-2 border rounded cursor-pointer mb-0",
									paymentMethod === "now"
										? "border-cgs-blue bg-background-focus text-cgs-blue"
										: !paymentMethod && errors.paymentMethod
											? "border-status-error bg-background-error"
											: "border-stroke-secondary",
								)}
							>
								<div className="flex gap-3 items-center">
									<PaynowIcon />
									PayNow
								</div>
								<RadioGroupItem value="now" className="w-6 h-6" />
							</Label>

							<Label
								className={cn(
									"flex justify-between w-full px-4 py-2 border rounded cursor-pointer",
									paymentMethod === "trust"
										? "border-cgs-blue bg-background-focus text-cgs-blue"
										: !paymentMethod && errors.paymentMethod
											? "border-status-error bg-background-error"
											: "border-stroke-secondary",
								)}
							>
								<div className="flex gap-3 items-center">
									<Wallet
										size={24}
										className={
											paymentMethod === "trust" ? "text-cgs-blue" : "text-icon-light"
										}
									/>
									Trust Account
								</div>
								<RadioGroupItem value="trust" className="w-6 h-6" />
							</Label>
						</RadioGroup>

						{!paymentMethod && errors.paymentMethod && (
							<p className="text-status-error text-xs md:text-sm mt-1 flex items-center gap-1">
								<CustomCircleAlert />
								Field cannot be empty
							</p>
						)}
					</div>
				</div>

				{/* Footer form */}
				<div className="shrink-0">
					<TermsAndConditionsCheckbox
						id="terms"
						checked={agreed}
						onCheckedChange={(checked) => {
							setAgreed(checked);
						}}
						showError={errors.terms}
						labelText="I declare that I have fully read and understood the"
						termsUrl={CGSI.ONETIME_DONATION}
						additionalContent=" for this donation"
						className="pad-x py-6 border-y border-stroke-secondary"
					/>
					<div className="pad-x py-4">
						<Button
							className="w-full h-10 text-base font-normal"
							onClick={handleDonate}
							disabled={isSubmitting}
							aria-busy={isSubmitting}
						>
							{isSubmitting ? (
								<Loader2 className="animate-spin" />
							) : (
								<span>Donate</span>
							)}
						</Button>
					</div>
				</div>
			</div>

			{paynowSubmitFn && (
				<S2BPayButton
					submitFn={paynowSubmitFn}
					onReady={() => setIsSubmitting(false)}
					onNotify={(status) => {
						if (!isS2BPayNowSuccess(status) || paynowSuccessHandledRef.current) return;
						paynowSuccessHandledRef.current = true;
						setPaynowSubmitFn(null);
						setIsSubmitting(false);
						toast.success(
							"Thank you!",
							"Your donation will go a long way in uplifting lives. We truly appreciate it.",
						);
						setInputValue("");
						reset();
					}}
					onClose={() => {
						setPaynowSubmitFn(null);
						setIsSubmitting(false);
					}}
					onError={() => {
						setPaynowSubmitFn(null);
						setIsSubmitting(false);
						toast.error("Error Encountered", "Something went wrong. Please try again later.");
					}}
				/>
			)}
		</>
	);
};

export default OneTimeForm;
