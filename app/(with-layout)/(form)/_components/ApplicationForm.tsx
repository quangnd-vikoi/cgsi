"use client";
import React, { useState } from "react";
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
import { Minus, Plus } from "lucide-react";
import { cn, convertTo2DigitsNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CGSI } from "@/constants/routes";
import { toast } from "@/components/ui/toaster";
import Image from "@/components/Image";
import CustomCircleAlert from "@/components/CircleAlertIcon";

type RouteProps = {
	pathname: "alternatives" | "securities";
};

// Configuration constants
const FORM_CONFIG = {
	issuePrice: 100.0,
	minQuantity: 20,
	unitIncremental: 10,
	productName: "CGS SG 3-month USD Commercial Paper Series 012",
	productCode: "C012USD.ADDX",
};

// Select field configurations
const SELECT_FIELDS = [
	{
		id: "account",
		label: "Account",
		placeholder: "Select an account",
		defaultValue: "cash-0123456",
		options: [
			{ value: "cash-0123456", label: "(Cash) 0123456" },
			{ value: "cash-0123457", label: "(Cash) 0123457" },
			{ value: "cash-0123458", label: "(Cash) 0123458" },
		],
	},
	{
		id: "payment",
		label: "Preferred Payment Mode",
		placeholder: "Select a payment option",
		defaultValue: "",
		options: [
			{ value: "bank-transfer", label: "Bank Transfer" },
			{ value: "credit-card", label: "Credit Card" },
			{ value: "debit-card", label: "Debit Card" },
		],
	},
];

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
	const [quantity, setQuantity] = useState<number | "">("");
	const [agreed, setAgreed] = useState(false);
	const [formValues, setFormValues] = useState({
		account: "cash-0123456",
		payment: "",
		currency: "sgd",
	});
	const [showError, setShowError] = useState(false);
	const [showValidationErrors, setShowValidationErrors] = useState(false);
	const router = useRouter();

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
	const handleSubmit = () => {
		if (!formValues.account || !formValues.payment || !formValues.currency || !isValid || !agreed) {
			setShowValidationErrors(true);
			if (!agreed) setShowError(true);
			return;
		}

		setShowError(false);
		setShowValidationErrors(false);

		if (pathname === "alternatives") {
			if (Math.random() < 0.5) {
				toast.success(
					"Application Success!",
					"Your Application for CGS Fullgoal CSI 1000 ETF has been submitted successfully."
				);

				openNoteTab();
			} else {
				toast.error("Error Encountered", "Something went wrong. Please try again later.");
			}
		} else {
			router.push(CGSI.INVOICE("itrade-token-12345"));
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
			value: `${FORM_CONFIG.issuePrice.toFixed(2)} USD`,
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
		<Dialog>
			<DialogTrigger asChild>
				<Button className="bg-primary hover:bg-enhanced-blue/80 text-white px-6 py-2">Apply</Button>
			</DialogTrigger>
			<DialogContent className="p-0 gap-0 w-[346px] md:w-[530px] rounded">
				<DialogHeader className="pad pt-4">
					<DialogTitle className="text-lg font-bold text-typo-primary leading-[26px]">
						{pathname === "alternatives"
							? "Commercial Paper Application Form"
							: "IOP Application Form"}
					</DialogTitle>
				</DialogHeader>

				<div className="pad-x">
					{/* Product Info */}
					<div className="bg-background-section rounded-lg p-4 mb-6">
						<h3 className="font-semibold text-base text-typo-primary mb-2 leading-6">
							{FORM_CONFIG.productName}
						</h3>
						<p className="text-xs px-3 rounded-full border border-stroke-secondary inline-block py-1 text-typo-secondary leading-4">
							{FORM_CONFIG.productCode}
						</p>
					</div>

					{/* Dynamic Select Fields */}
					{SELECT_FIELDS.map((field) => {
						const hasError =
							showValidationErrors && !formValues[field.id as keyof typeof formValues];
						return (
							<div key={field.id} className="mb-6">
								<Label
									htmlFor={field.id}
									className="text-sm font-semibold text-typo-primary mb-1.5"
								>
									{field.label}
								</Label>
								<Select
									value={formValues[field.id as keyof typeof formValues]}
									onValueChange={(value) => updateFormValue(field.id, value)}
								>
									<SelectTrigger
										id={field.id}
										className={cn(
											"w-full",
											hasError && "border-status-error bg-background-error"
										)}
									>
										<SelectValue placeholder={field.placeholder} />
									</SelectTrigger>
									<SelectContent>
										{field.options.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												<p>
													{option.label}
												</p>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						);
					})}

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
							<SelectContent>
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
					<div className="border rounded-lg py-4 pad-x mb-6 border-stroke-secondary">
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
								className="rounded-full border-2 border-enhanced-blue text-enhanced-blue hover:bg-blue-50 hover:text-enhanced-blue disabled:opacity-30 disabled:cursor-not-allowed h-5 w-5"
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
									className="text-center border-0 text-sm font-normal text-theme-neutral-07"
								/>
							</div>
							<Button
								type="button"
								onClick={() => handleQuantityChange(FORM_CONFIG.unitIncremental)}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-enhanced-blue text-enhanced-blue hover:bg-blue-50 hover:text-enhanced-blue h-5 w-5"
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
									{convertTo2DigitsNumber(estNetValue)} USD
								</span>
							</div>
						</div>
					</div>

					{/* Terms & Conditions */}
					<div className="mb-4">
						<div className="flex items-start gap-2">
							<Checkbox
								id="terms"
								checked={agreed}
								onCheckedChange={(checked) => {
									setAgreed(checked as boolean);
									if (checked) setShowError(false);
								}}
								className={cn("mt-0.5 shrink-0", showError && "border-status-error")}
							/>
							<Label
								htmlFor="terms"
								className="text-sm text-typo-secondary cursor-pointer leading-5"
							>
								<span>
									By checking this box, you acknowledge that you have read and agree to
									abide by the underlying{" "}
									<a
										href="#"
										className="inline text-enhanced-blue hover:underline font-medium"
									>
										Terms & Conditions
									</a>
								</span>
							</Label>
						</div>

						{showError && (
							<p className="text-status-error text-xs mt-1 flex items-center gap-1">
								<CustomCircleAlert />
								Please acknowledge the Terms & Conditions to proceed
							</p>
						)}
					</div>
				</div>

				<DialogFooter className="">
					<Button
						onClick={handleSubmit}
						className="bg-enhanced-blue hover:bg-enhanced-blue text-white px-3 py-2 rounded-sm font-normal text-base disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Submit Application
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
