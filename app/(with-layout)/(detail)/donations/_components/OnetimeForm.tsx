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

const OneTimeForm = () => {
	const [inputValue, setInputValue] = useState<string>("");

	const {
		setAmount,
		paymentMethod,
		setPaymentMethod,
		agreed,
		setAgreed,
		errors,
		handleSubmit,
		isSubmitting,
	} = useDonationForm({
		onSuccess: (values) => {
			if (values.paymentMethod === "now") {
				setTimeout(() => {
					toast.success(
						"Thank you!",
						"Your donation will go a long way in uplifting lives. We truly appreciate it."
					);
				}, 2000);
			} else {
				setTimeout(() => {
					toast.error("Error Encountered", "Something went wrong. Please try again later.");
				}, 2000);
			}
		},
		minAmount: 1.0,
	});

	const handleDonate = () => {
		handleSubmit();
	};

	return (
		<div className="flex flex-col justify-between flex-1 min-h-0">
			{/* Nội dung chính */}
			<div className="space-y-6 pad-x py-6 overflow-auto">
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
							"focus-visible:bg-background-focus focus-visible:border-enhanced-blue text-sm font-normal"
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
						<Label className="flex justify-between w-full px-4 py-2 border border-stroke-secondary rounded-lg cursor-pointer mb-0">
							<div className="flex gap-3 items-center">
								<PaynowIcon />
								PayNow
							</div>
							<RadioGroupItem value="now" className="w-6 h-6" />
						</Label>

						<Label className="flex justify-between w-full px-4 py-2 border border-stroke-secondary rounded-lg cursor-pointer">
							<div className="flex gap-3 items-center">
								<Wallet size={24} className="text-icon-light" />
								Trust Account
							</div>
							<RadioGroupItem value="trust" className="w-6 h-6" />
						</Label>
					</RadioGroup>

					{errors.paymentMethod && (
						<p className="text-status-error text-xs mt-1 flex items-center gap-1">
							<CustomCircleAlert />
							Please select a Payment Method
						</p>
					)}
				</div>
			</div>

			{/* Footer form */}
			<div>
				<div className="pad-x py-6 border-y border-stroke-secondary">
					<div className="flex items-start gap-2">
						<Checkbox
							id="terms"
							checked={agreed}
							error={errors.terms}
							onCheckedChange={(checked) => {
								setAgreed(checked as boolean);
							}}
							className="mt-0.5 shrink-0"
						/>

						<Label
							htmlFor="terms"
							className="text-sm text-typo-secondary cursor-pointer leading-5"
						>
							<span>
								I declare that I have fully read and understood the
								<Link
									target="_blank"
									href={CGSI.ONETIME_DONATION}
									className="inline text-enhanced-blue mx-1 hover:underline font-medium"
								>
									Terms & Conditions
								</Link>
								for this donation
							</span>
						</Label>
					</div>

					{errors.terms && (
						<p className="text-status-error text-xs mt-1 flex items-center gap-1">
							<CustomCircleAlert />
							Please acknowledge the Terms & Conditions to proceed
						</p>
					)}
				</div>
				<div className="pad-x py-4">
					<Button
						className="w-full h-10 text-base font-normal"
						onClick={handleDonate}
						disabled={isSubmitting}
						aria-busy={isSubmitting}
					>
						{isSubmitting ? (
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
