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
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Loader2 } from "lucide-react";
import { cn, convertTo2DigitsNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CGSI } from "@/constants/routes";
import { toast } from "@/components/ui/toaster";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import Image from "@/components/Image";
import CustomCircleAlert from "@/components/CircleAlertIcon";
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
	defaultValue: "",
	options: [
		{ value: "bank-transfer", label: "Bank Transfer" },
		{ value: "giro", label: "Giro" },
		{ value: "margin-account", label: "Margin Account" },
		{ value: "paynow", label: "Paynow" },
		{ value: "telegraphic-transfer", label: "Telegraphic Transfer" },
		{ value: "trust-account", label: "Trust Account" },
	],
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

	// Filter cash accounts (CTA = Cash Trading Account)
	console.log("All Accounts:", accounts);
	const cashAccounts = accounts.filter((acc) => acc.accountType === null);
	console.log("Cash Accounts:", cashAccounts);
	console.log("hasOnlySingleCashAccount:", cashAccounts.length === 1);
	const hasOnlySingleCashAccount = cashAccounts.length === 1;
	const defaultAccountNo = cashAccounts[0].accountNo

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
	const router = useRouter();

	// Handle click on disabled account field
	const handleDisabledAccountClick = () => {
		if (hasOnlySingleCashAccount) {
			toast.info("Account currently only has 1 Cash Account");
		}
	};

	// Auto-fill account when there's only one cash account
	useEffect(() => {
		if (hasOnlySingleCashAccount && formValues.account !== cashAccounts[0].accountNo) {
			setFormValues((prev) => ({ ...prev, account: cashAccounts[0].accountNo }));
		}
	}, [hasOnlySingleCashAccount, cashAccounts, formValues.account]);

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

	// Validation logic
	const currentQuantity = quantity === "" ? 0 : quantity;
	const isValidIncremental = quantity === "" || currentQuantity % FORM_CONFIG.unitIncremental === 0;
	const isBiggerThanMinimum = quantity === "" || currentQuantity >= FORM_CONFIG.minQuantity;
	const isQuantityFilled = quantity !== "";
	const isValid = isValidIncremental && isBiggerThanMinimum && isQuantityFilled;
	const estNetValue = (currentQuantity * FORM_CONFIG.issuePrice).toFixed(2);
	const hasQuantityError = showValidationErrors && !isQuantityFilled;

	const openNoteTab = () => {
		window.open("/application-note", "_blank", "noopener,noreferrer");
	};

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
					"Application Submitted Successfully!",
					`Your application for ${FORM_CONFIG.productName} has been submitted.`
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
					currency: "sgd",
				});

				// Open note tab or redirect based on pathname
				if (pathname === "alternatives") {
					openNoteTab();
				} else {
					// For IOP, check if we have subscriptionId to generate invoice token
					if (result.data.subscriptionId) {
						router.push(CGSI.INVOICE(result.data.subscriptionId));
					} else {
						openNoteTab();
					}
				}
			} else {
				// Error from API
				toast.error(
					"Submission Failed",
					result.error || "Unable to submit your application. Please try again."
				);
			}
		} catch (error) {
			// Unexpected error
			console.error("Submission error:", error);
			toast.error(
				"Error Encountered",
				"An unexpected error occurred. Please try again later."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleQuantityChange = (delta: number) => {
		const currentQty = quantity === "" ? FORM_CONFIG.minQuantity : quantity;
		const newQty = currentQty + delta;
		if (newQty >= FORM_CONFIG.minQuantity) {
			setQuantity(newQty);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "") {
			setQuantity("");
			return;
		}
		const numValue = parseInt(value);
		if (!isNaN(numValue) && numValue >= 0) {
			setQuantity(numValue);
		}
	};

	const updateFormValue = (field: string, value: string) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
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
		<Dialog open={dialogOpen} onOpenChange={(open) => !isSubmitting && setDialogOpen(open)}>
			<DialogTrigger asChild>
				<Button className="bg-cgs-blue hover:bg-cgs-blue/80 text-white px-6 py-2">Apply</Button>
			</DialogTrigger>
			<DialogContent
				className="p-0 gap-0 w-[346px] md:w-[530px] rounded max-h-[90vh] flex flex-col"
				onInteractOutside={(e) => isSubmitting && e.preventDefault()}
				onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
			>
				<DialogHeader className="pad pt-4 flex-shrink-0">
					<DialogTitle className="text-lg font-bold text-typo-primary leading-[26px]">
						{pathname === "alternatives"
							? "Commercial Paper Application Form"
							: "IOP Application Form"}
					</DialogTitle>
				</DialogHeader>

				<div className="pad-x overflow-y-auto flex-1 min-h-0">
					{/* Product Info */}
					<div className="bg-background-section rounded p-4 mb-6">
						<h3 className="font-semibold text-base text-typo-primary mb-2 leading-6">
							{FORM_CONFIG.productName}
						</h3>
						<p className="text-xs px-3 rounded-full border border-stroke-secondary inline-block py-1 text-typo-secondary leading-4">
							{FORM_CONFIG.productCode}
						</p>
					</div>

					{/* Account Field */}
					<div className="mb-6">
						<Label
							htmlFor="account"
							className="text-sm font-semibold text-typo-primary mb-1.5"
						>
							Account
						</Label>
						{hasOnlySingleCashAccount ? (
							// Single cash account - show disabled field with toast on click
							<div
								onClick={handleDisabledAccountClick}
								className="w-full cursor-not-allowed"
							>
								<div
									className={cn(
										"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-xs",
										"text-typo-secondary opacity-70",
										showValidationErrors && !formValues.account && "border-status-error bg-background-error"
									)}
								>
									<span>(Cash) {cashAccounts[0].accountNo}</span>
								</div>
							</div>
						) : (
							// Multiple cash accounts - show select dropdown
							<Select
								value={formValues.account}
								onValueChange={(value) => updateFormValue("account", value)}
							>
								<SelectTrigger
									id="account"
									className={cn(
										"w-full",
										showValidationErrors && !formValues.account && "border-status-error bg-background-error"
									)}
								>
									<SelectValue placeholder="Select an account" />
								</SelectTrigger>
								<SelectContent className="z-[105]">
									{cashAccounts.map((account) => (
										<SelectItem key={account.accountNo} value={account.accountNo}>
											<p>(Cash) {account.accountNo}</p>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>

					{/* Payment Field */}
					<div className="mb-6">
						<Label
							htmlFor={PAYMENT_FIELD.id}
							className="text-sm font-semibold text-typo-primary mb-1.5"
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
									"w-full",
									showValidationErrors && !formValues.payment && "border-status-error bg-background-error"
								)}
							>
								<SelectValue placeholder={PAYMENT_FIELD.placeholder} />
							</SelectTrigger>
							<SelectContent className="z-[105]">
								{PAYMENT_FIELD.options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										<p>{option.label}</p>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Currency Select */}
					<div className="mb-6">
						<Label htmlFor="currency" className="text-sm font-semibold text-typo-primary mb-1.5">
							Settlement Currency
						</Label>
						<Select
							value={formValues.currency}
							onValueChange={(value) => updateFormValue("currency", value)}
						>
							<SelectTrigger
								id="currency"
								className={cn(
									"w-full",
									showValidationErrors &&
									!formValues.currency &&
									"border-status-error bg-background-error"
								)}
							>
								<SelectValue placeholder="Select a currency" />
							</SelectTrigger>
							<SelectContent className="z-[105]">
								{CURRENCY_OPTIONS.map((currency) => (
									<SelectItem
										key={currency.value}
										value={currency.value}
										className="px-3 py-2.5"
									>
										<div className="flex items-center gap-2">
											<Image
												src={currency.flag}
												alt={currency.flagAlt}
												width={20}
												height={20}
												className={cn(
													"rounded-full object-cover aspect-square",
													currency.flagPosition
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
					<div className="border rounded py-4 pad-x mb-6 border-stroke-secondary">
						<Label className="text-sm font-semibold text-typo-primary mb-1.5">
							Quantity Requested
						</Label>

						<div
							className={cn(
								"flex items-center justify-between mb-4 border-b border-stroke-secondary px-1.5 py-2.5",
								(hasQuantityError || (isQuantityFilled && !isValid)) &&
								"border-status-error bg-background-error"
							)}
						>
							<Button
								type="button"
								onClick={() => handleQuantityChange(-FORM_CONFIG.unitIncremental)}
								disabled={quantity === "" || currentQuantity <= FORM_CONFIG.minQuantity}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-cgs-blue text-cgs-blue hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 disabled:opacity-30 disabled:cursor-not-allowed h-5 w-5"
							>
								<Minus className="w-4 h-4" />
							</Button>
							<div className="flex-1 mx-4">
								<Input
									type="number"
									value={quantity}
									onChange={handleInputChange}
									placeholder={`Min. ${FORM_CONFIG.minQuantity} Unit(s)`}
									min={FORM_CONFIG.minQuantity}
									className="text-center border-0 text-sm font-normal text-typo-primary w-full focus:ring-0"
								/>
							</div>
							<Button
								type="button"
								onClick={() => handleQuantityChange(FORM_CONFIG.unitIncremental)}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-cgs-blue text-cgs-blue hover:bg-transparent hover:border-cgs-blue/75 hover:text-cgs-blue/75 disabled:opacity-30 disabled:cursor-not-allowed h-5 w-5"
							>
								<Plus className="w-4 h-4" />
							</Button>
						</div>

						<div className="space-y-3 text-xs">
							{quantityDetails.map((detail) => (
								<div key={detail.label} className="flex justify-between">
									<span
										className={cn(
											detail.isError ? "text-status-error" : "text-typo-secondary"
										)}
									>
										{detail.label}
									</span>
									<span
										className={cn(
											"font-medium",
											detail.isError ? "text-status-error" : "text-typo-primary"
										)}
									>
										{detail.value}
									</span>
								</div>
							))}
							<div className="flex justify-between text-sm">
								<span className="text-typo-primary font-medium w-1/2">
									Est. Net Application Value
								</span>
								<span className="font-semibold text-typo-primary">
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
						labelText="By checking this box, you acknowledge that you have read and agree to abide by the underlying"
						className="mb-4"
					/>
				</div>

				<DialogFooter className="flex-shrink-0 border-t border-stroke-secondary">
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="bg-cgs-blue hover:bg-cgs-blue text-white px-3 py-2 rounded-sm font-normal text-base disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Submitting...
							</>
						) : (
							"Submit Application"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
