"use client";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toaster";
import { CGSI } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useDonationForm } from "../_hooks/useDonationForm";
import PaynowIcon from "@/public/icons/discover/Paynow.svg";
import { Loader2, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";
import { submitDonation } from "@/lib/services/profileService";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

const OneTimeForm = () => {
	const [inputValue, setInputValue] = useState<string>("");
	const [isApiSubmitting, setIsApiSubmitting] = useState(false);
	const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

	const {
		setAmount,
		amount,
		paymentMethod,
		setPaymentMethod,
		agreed,
		setAgreed,
		errors,
		handleSubmit,
		isSubmitting,
	} = useDonationForm({
		onSuccess: async (values) => {
			// Validate and call actual API
			const accountNo = getDefaultAccountNo();

			if (!accountNo) {
				toast.error("No trading account found", "Please contact support to set up your account");
				return;
			}

			if (!values.amount) {
				toast.error("Invalid amount", "Please enter a valid donation amount");
				return;
			}

			setIsApiSubmitting(true);

			try {
				const response = await submitDonation({
					accountNo,
					amount: values.amount,
					currency: "SGD",
					paymentMethod: values.paymentMethod === "now" ? "PLAN" : "LS_ACCSET",
					paymentMode: "DONATE",
				});

				if (response.success && response.data?.isSuccess) {
					toast.success(
						"Thank you!",
						"Your donation will go a long way in uplifting lives. We truly appreciate it."
					);
				} else {
					toast.error("Error Encountered", response.error || "Something went wrong. Please try again later.");
				}
			} catch (error) {
				toast.error("Error Encountered", "Something went wrong. Please try again later.");
			} finally {
				setIsApiSubmitting(false);
			}
		},
		minAmount: 1.0,
	});

	const handleDonate = () => {
		handleSubmit();
	};

	return (
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
					<Label htmlFor="donationAmount" className="text-sm font-semibold text-typo-primary">
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
							// Chỉ cho phép số và dấu chấm thập phân
							if (value === "" || /^\d*\.?\d*$/.test(value)) {
								setInputValue(value);
								// Parse và convert sang number với 2 chữ số thập phân khi có giá trị hợp lệ
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
							// Format lại với 2 chữ số thập phân khi blur
							if (value && !isNaN(parseFloat(value))) {
								const numValue = parseFloat(value);
								const formatted = numValue.toFixed(2);
								setInputValue(formatted);
								setAmount(parseFloat(formatted));
							}
						}}
						className={cn(
							"focus-visible:bg-background-focus focus-visible:border-cgs-blue text-sm font-normal"
						)}
					/>
				</div>

				<div className="w-full">
					<Label className="text-sm font-semibold text-typo-primary ">Payment Method</Label>

					<RadioGroup
						value={paymentMethod}
						onValueChange={(value) => {
							setPaymentMethod(value as "now" | "trust");
						}}
						className="space-y-2 mt-1.5"
					>
						<Label
							className={cn(
								"flex justify-between w-full px-4 py-2 border rounded cursor-pointer mb-0",
								paymentMethod === "now"
									? "border-cgs-blue bg-background-focus text-cgs-blue"
									: !paymentMethod && errors.paymentMethod
										? "border-status-error bg-background-error"
										: "border-stroke-secondary"
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
										: "border-stroke-secondary"
							)}
						>
							<div className="flex gap-3 items-center">
								<Wallet size={24} className={paymentMethod === "trust" ? "text-cgs-blue" : "text-icon-light"} />
								Trust Account
							</div>
							<RadioGroupItem value="trust" className="w-6 h-6" />
						</Label>
					</RadioGroup>

					{!paymentMethod && errors.paymentMethod && (
						<p className="text-status-error text-xs mt-1 flex items-center gap-1">
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
						disabled={isSubmitting || isApiSubmitting}
						aria-busy={isSubmitting || isApiSubmitting}
					>
						{(isSubmitting || isApiSubmitting) ? (
							<>
								<Loader2 className="animate-spin" />
							</>
						) : (
							<span>Donate</span>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default OneTimeForm;
