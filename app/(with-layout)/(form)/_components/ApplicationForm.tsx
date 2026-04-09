"use client";
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Loader2 } from "lucide-react";
import { cn, convertTo2DigitsNumber } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import Image from "@/components/Image";
import { useProductDetails } from "./ProductDetailsContext";
import { subscriptionService } from "@/lib/services/subscriptionService";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";

type RouteProps = {
	pathname: "alternatives" | "securities";
};

// Payment field configuration (account field handled separately with dynamic data)
const PAYMENT_FIELD = {
	id: "payment",
	label: "Preferred Payment Mode",
	placeholder: "Select a payment option",
};

const CURRENCY_OPTIONS = [
	{
		value: "sgd",
		label: "Singapore Dollar (SGD)",
		flag: "https://flagcdn.com/sg.svg",
		flagAlt: "SG Flag",
		flagPosition: "object-left",
	},
	{
		value: "usd",
		label: "US Dollar (USD)",
		flag: "https://flagcdn.com/us.svg",
		flagAlt: "US Flag",
		flagPosition: "object-[20%-30%]",
	},
	{
		value: "eur",
		label: "Euro (EUR)",
		flag: "https://flagcdn.com/eu.svg",
		flagAlt: "EU Flag",
		flagPosition: "object-center",
	},
];

export default function ApplicationForm({ pathname }: RouteProps) {
	const { productDetails, refetch } = useProductDetails();
	const accounts = useTradingAccountStore((state) => state.accounts);

	// Filter CTA accounts
	const cashAccounts = accounts.filter((acc) => acc.accountType === "CTA");
	const hasCTAAccount = cashAccounts.length > 0;
	const hasOnlySingleCashAccount = cashAccounts.length === 1;
	const defaultAccountNo = cashAccounts[0]?.accountNo ?? "";

	const [quantity, setQuantity] = useState<number | "">("");
	const [agreed, setAgreed] = useState(false);
	const [formValues, setFormValues] = useState({
		account: defaultAccountNo,
		payment: "",
		currency: "sgd",
	});
	const [showError, setShowError] = useState(false);
	const [showValidationErrors, setShowValidationErrors] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDialogOpenChange = (open: boolean) => {
		if (isSubmitting) return;

		if (open && !hasCTAAccount) {
			toast.warning(
				"Warning",
				"You will need at least 1 CTA Account to proceed with the application",
			);
			return;
		}

		setDialogOpen(open);
	};

	// Handle click on disabled account field
	const handleDisabledAccountClick = () => {
		toast.info("Notice", "You only have 1 CTA");
	};

	// Auto-fill account when there's only one CTA
	useEffect(() => {
		if (hasOnlySingleCashAccount && formValues.account !== cashAccounts[0].accountNo) {
			setFormValues((prev) => ({ ...prev, account: cashAccounts[0].accountNo }));
		}
	}, [hasOnlySingleCashAccount, cashAccounts, formValues.account]);

	// Default settlement currency to product's base currency
	useEffect(() => {
		if (productDetails?.baseCurrency) {
			const val = productDetails.baseCurrency.toLowerCase();
			if (CURRENCY_OPTIONS.some((c) => c.value === val)) {
				setFormValues((prev) => ({ ...prev, currency: val }));
			}
		}
	}, [productDetails?.baseCurrency]);

	// If no product details, don't render
	if (!productDetails) {
		return null;
	}

	// Configuration from API
	const FORM_CONFIG = {
		issuePrice: productDetails.issuePrice,
		minQuantity: productDetails.minQty,
		unitIncremental: productDetails.incrementQty,
		productName: productDetails.productName,
		productCode: `${productDetails.stockCode}.${productDetails.exchangeCode}`,
		baseCurrency: productDetails.baseCurrency || "USD",
	};

	// Filter settlement currency: always SGD, plus baseCurrency if different
	const baseCurrencyLower = FORM_CONFIG.baseCurrency.toLowerCase();
	const availableCurrencies = CURRENCY_OPTIONS.filter(
		(c) => c.value === "sgd" || c.value === baseCurrencyLower,
	);

	// Validation logic
	const currentQuantity = quantity === "" ? 0 : quantity;
	const isValidIncremental = quantity === "" || currentQuantity % FORM_CONFIG.unitIncremental === 0;
	const isBiggerThanMinimum = quantity === "" || currentQuantity >= FORM_CONFIG.minQuantity;
	const isQuantityFilled = quantity !== "";
	const isValid = isValidIncremental && isBiggerThanMinimum && isQuantityFilled;
	const estNetValue = (currentQuantity * FORM_CONFIG.issuePrice).toFixed(2);
	const hasQuantityError = showValidationErrors && !isQuantityFilled;

	const handleSubmit = async () => {
		// Validate form
		if (!formValues.account || !formValues.payment || !formValues.currency || !isValid || !agreed) {
			setShowValidationErrors(true);
			if (!agreed) setShowError(true);
			return;
		}

		setShowError(false);
		setShowValidationErrors(false);
		setIsSubmitting(true);

		try {
			// Prepare submission data
			const submissionData = {
				productCode: productDetails.productCode,
				accountNo: formValues.account.replace(/[^0-9]/g, ""), // Extract only numbers from account
				totalUnit: currentQuantity,
				paymentCurrency: formValues.currency.toUpperCase(),
				paymentMode: formValues.payment,
			};

			// Call API
			const result = await subscriptionService.submitProductSubscription(submissionData);

			if (result.success && result.data) {
				// Success
				toast.success(
					"Success!",
					`Your ${productDetails.productType} Application for ${FORM_CONFIG.productName} has been submitted successfully.`,
				);

				// Refetch product details to update subscription status
				await refetch();

				// Close dialog
				setDialogOpen(false);

				// Reset form
				setQuantity("");
				setAgreed(false);
				setFormValues({
					account: defaultAccountNo,
					payment: "",
					currency: productDetails.baseCurrency?.toLowerCase() ?? "sgd",
				});
			} else {
				// Error from API
				toast.error(
					"Submission Failed",
					result.error || "Unable to submit your application. Please try again.",
				);
			}
		} catch (error) {
			// Unexpected error
			console.error("Submission error:", error);
			toast.error("Error Encountered", "Something went wrong. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleQuantityChange = (direction: 1 | -1) => {
		const increment = FORM_CONFIG.unitIncremental;
		if (quantity === "") {
			if (direction === 1) setQuantity(FORM_CONFIG.minQuantity);
			return;
		}
		if (direction === 1) {
			const next =
				quantity % increment === 0
					? quantity + increment
					: Math.ceil(quantity / increment) * increment;
			setQuantity(next);
		} else {
			const prev =
				quantity % increment === 0
					? quantity - increment
					: Math.floor(quantity / increment) * increment;
			if (prev >= 0) setQuantity(prev);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "") {
			setQuantity("");
			return;
		}
		const numValue = parseInt(value.replace(/,/g, ""));
		if (!isNaN(numValue) && numValue >= 0) {
			setQuantity(numValue);
		}
	};

	const updateFormValue = (field: string, value: string) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
		setShowValidationErrors(false);
	};

	const quantityDetails = [
		{
			label: "Issue Price",
			value: `${FORM_CONFIG.issuePrice.toFixed(2)} ${FORM_CONFIG.baseCurrency}`,
			isError: false,
		},
		{
			label: "Min. Quantity",
			value: `${FORM_CONFIG.minQuantity.toLocaleString()} Unit(s)`,
			isError: isQuantityFilled && !isBiggerThanMinimum,
		},
		{
			label: "Unit Incremental",
			value: `${FORM_CONFIG.unitIncremental.toLocaleString()} Unit(s)`,
			isError: isQuantityFilled && !isValidIncremental,
		},
	];

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<Button className="bg-cgs-blue hover:bg-cgs-blue/80 text-white px-6 py-2">Apply</Button>
			</DialogTrigger>
			<DialogContent
				className="p-0 gap-0 w-[346px] md:w-[530px] rounded max-h-[90vh] flex flex-col"
				onInteractOutside={(e) => isSubmitting && e.preventDefault()}
				onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
			>
				<DialogHeader className="pad flex-shrink-0">
					<DialogTitle className="text-base md:text-lg font-semibold text-typo-primary leading-[26px]">
						{pathname === "alternatives"
							? "Commercial Paper Application Form"
							: "IOP Application Form"}
					</DialogTitle>
				</DialogHeader>

				<div className="pad-x overflow-y-auto flex-1 min-h-0">
					{/* Product Info */}
					<div className="bg-background-section rounded p-4 mb-6">
						<h3 className="font-semibold text-sm md:text-base text-typo-primary mb-2 leading-6">
							{FORM_CONFIG.productName}
						</h3>
						<p className="text-xs md:text-sm px-3 rounded-full border border-stroke-secondary inline-block py-1 text-typo-secondary leading-4">
							{FORM_CONFIG.productCode}
						</p>
					</div>

					{/* Account Field */}
					<div className="mb-6">
						<Label
							htmlFor="account"
							className="text-sm md:text-base font-semibold text-typo-primary mb-1.5"
						>
							Account
						</Label>
						<div onClick={hasOnlySingleCashAccount ? handleDisabledAccountClick : undefined}>
							<Select
								value={formValues.account}
								onValueChange={(value) => updateFormValue("account", value)}
								disabled={hasOnlySingleCashAccount}
							>
								<SelectTrigger
									id="account"
									className={cn(
										"w-full text-sm md:text-base disabled:bg-status-disable-secondary disabled:border-stroke-secondary disabled:pointer-events-none disabled:text-typo-tertiary disabled:opacity-100",
										showValidationErrors &&
										!formValues.account &&
										"border-status-error bg-background-error",
									)}
								>
									<SelectValue placeholder="Select an account" />
								</SelectTrigger>
								<SelectContent className="z-[105]">
									{cashAccounts.map((account) => (
										<SelectItem
											key={account.accountNo}
											value={account.accountNo}
											className="text-sm md:text-base font-normal"
										>
											<p>(CTA) {account.accountNo}</p>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Payment Field */}
					<div className="mb-6">
						<Label
							htmlFor={PAYMENT_FIELD.id}
							className="text-sm md:text-base font-semibold text-typo-primary mb-1.5"
						>
							{PAYMENT_FIELD.label}
						</Label>
						<Select
							value={formValues.payment}
							onValueChange={(value) => updateFormValue(PAYMENT_FIELD.id, value)}
						>
							<SelectTrigger
								id={PAYMENT_FIELD.id}
								className={cn(
									"w-full text-sm md:text-base",
									showValidationErrors &&
									!formValues.payment &&
									"border-status-error bg-background-error",
								)}
							>
								<SelectValue placeholder={PAYMENT_FIELD.placeholder} />
							</SelectTrigger>
							<SelectContent className="z-[105]">
								{(productDetails.paymentMode ?? "")
									.split(",")
									.map((mode) => mode.trim())
									.filter(Boolean)
									.map((mode) => (
										<SelectItem
											key={mode}
											value={mode}
											className="text-sm md:text-base font-normal"
										>
											<p>{mode}</p>
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Currency Select */}
					<div className="mb-6">
						<Label
							htmlFor="currency"
							className="text-sm md:text-base font-semibold text-typo-primary mb-1.5"
						>
							Settlement Currency
						</Label>
						<Select
							value={formValues.currency}
							onValueChange={(value) => updateFormValue("currency", value)}
						>
							<SelectTrigger
								id="currency"
								className={cn(
									"w-full text-sm md:text-base py-4",
									showValidationErrors &&
									!formValues.currency &&
									"border-status-error bg-background-error",
								)}
							>
								<SelectValue placeholder="Select a currency" />
							</SelectTrigger>
							<SelectContent className="z-[105]">
								{availableCurrencies.map((currency) => (
									<SelectItem
										key={currency.value}
										value={currency.value}
										className="px-3 py-2.5 text-sm md:text-base font-normal"
									>
										<div className="flex items-center gap-2">
											<Image
												src={currency.flag}
												alt={currency.flagAlt}
												width={20}
												height={20}
												className={cn(
													"rounded-full object-cover aspect-square",
													currency.flagPosition,
												)}
											/>
											<span className="text-typo-primary">{currency.label}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Quantity Requested */}
					<div className="border rounded py-4 px-4 mb-6 border-stroke-secondary">
						<Label className="text-sm md:text-base font-semibold text-typo-primary mb-1.5">
							Quantity Requested
						</Label>

						<div
							className={cn(
								"flex items-center justify-between mb-4 border-b border-stroke-secondary px-1.5 py-2.5",
								(hasQuantityError || (isQuantityFilled && !isValid)) &&
								"border-status-error bg-background-error",
							)}
						>
							<Button
								type="button"
								onClick={() => handleQuantityChange(-1)}
								disabled={quantity === "" || currentQuantity <= 0}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-cgs-blue text-cgs-blue hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 disabled:opacity-30 disabled:cursor-not-allowed h-5 w-5"
							>
								<Minus className="w-4 h-4" />
							</Button>
							<div className="flex-1 mx-4">
								<Input
									type="text"
									value={quantity === "" ? "" : quantity.toLocaleString()}
									onChange={handleInputChange}
									placeholder={`Min. ${FORM_CONFIG.minQuantity} Unit(s)`}
									min={FORM_CONFIG.minQuantity}
									className="text-center border-0 text-sm md:text-base font-normal text-typo-primary w-full focus:ring-0"
								/>
							</div>
							<Button
								type="button"
								onClick={() => handleQuantityChange(1)}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-cgs-blue text-cgs-blue hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 disabled:opacity-30 disabled:cursor-not-allowed h-5 w-5"
							>
								<Plus className="w-5 h-5" />
							</Button>
						</div>

						<div className="space-y-3 text-xs md:text-sm">
							{quantityDetails.map((detail) => (
								<div key={detail.label} className="flex justify-between">
									<span
										className={cn(
											detail.isError ? "text-status-error" : "text-typo-secondary",
										)}
									>
										{detail.label}
									</span>
									<span
										className={cn(
											"font-medium",
											detail.isError ? "text-status-error" : "text-typo-primary",
										)}
									>
										{detail.value}
									</span>
								</div>
							))}
							<div className="flex justify-between text-xs md:text-sm">
								<span className="text-typo-secondary font-medium w-1/2">
									Est. Net Application Value
								</span>
								<span className="font-medium text-typo-primary">
									{convertTo2DigitsNumber(estNetValue)} {FORM_CONFIG.baseCurrency}
								</span>
							</div>
						</div>
					</div>

					{/* Terms & Conditions */}
					<TermsAndConditionsCheckbox
						id="terms"
						checked={agreed}
						onCheckedChange={(checked) => {
							setAgreed(checked);
							if (checked) setShowError(false);
						}}
						showError={showError}
						errorMessage="Please confirm the declaration to submit application"
						labelText="By checking this box, you acknowledge that you have read and agree to abide by the underlying"
						termsUrl={productDetails.tncUrl}
						className="mb-4"
					/>
				</div>

				<DialogFooter className="flex-shrink-0 border-t border-stroke-secondary px-6 py-6">
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="bg-cgs-blue hover:bg-cgs-blue px-3 py-2 rounded-sm text-white font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting && <Loader2 className="animate-spin" />}
						Submit Application
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
