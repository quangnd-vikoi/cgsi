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
import { CircleAlert, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ENDPOINT } from "@/constants/routes";
type RouteProps = {
	pathname: "alternatives" | "securities";
};

export default function ApplicationForm({ pathname }: RouteProps) {
	const [quantity, setQuantity] = useState<number | "">(""); // Allow empty string for placeholder
	const [agreed, setAgreed] = useState(false);
	const [account, setAccount] = useState("cash-0123456");
	const [paymentMode, setPaymentMode] = useState("");
	const [currency, setCurrency] = useState("sgd");
	const [showError, setShowError] = useState(false);
	const router = useRouter();

	const handleSubmit = () => {
		if (!isValid) {
			return;
		}
		if (quantity === "") {
			setQuantity(0);
			return;
		}
		if (!agreed) {
			setShowError(true);
			return;
		}
		setShowError(false);
		router.push(ENDPOINT.CGSI_INVOICE("helloKelvinCHAN"));
	};

	const issuePrice = 100.0;
	const minQuantity = 20;
	const unitIncremental = 10;

	const handleDecrease = () => {
		const currentQty = quantity === "" ? minQuantity : quantity;
		if (currentQty > minQuantity) {
			setQuantity(currentQty - unitIncremental);
		}
	};

	const handleIncrease = () => {
		const currentQty = quantity === "" ? minQuantity : quantity;
		setQuantity(currentQty + unitIncremental);
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Allow empty string (backspace to clear)
		if (value === "") {
			setQuantity("");
			return;
		}

		const numValue = parseInt(value);
		if (!isNaN(numValue) && numValue >= 0) {
			setQuantity(numValue);
		}
	};

	const currentQuantity = quantity === "" ? 0 : quantity;
	const isValidIncremental = currentQuantity % unitIncremental === 0;
	const isBiggerThanMinimum = currentQuantity >= minQuantity || quantity === "";

	const isValid = isValidIncremental && isBiggerThanMinimum;
	const estNetValue = (currentQuantity * issuePrice).toFixed(2);

	console.log("isValidIncremental ", isValidIncremental);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="bg-primary hover:bg-enhanced-blue/80 text-white px-6 py-2">Apply</Button>
			</DialogTrigger>
			<DialogContent className="p-0 gap-0 w-[346px] md:w-[530px]">
				<DialogHeader className=" p-4 md:p-6 pt-4">
					<DialogTitle className="text-lg font-bold text-typo-primary leading-[26px]">
						{pathname == "alternatives"
							? "Commercial Paper Application Form"
							: "IOP Application Form"}
					</DialogTitle>
				</DialogHeader>

				<div className="px-4 md:px-6">
					{/* Product Info */}
					<div className="bg-background-section rounded-lg p-4 mb-6">
						<h3 className="font-semibold text-base text-typo-primary mb-2 leading-6">
							CGS SG 3-month USD Commercial Paper Series 012
						</h3>
						<p className="text-xs px-3 rounded-full border border-stroke-secondary inline-block py-1 text-typo-secondary leading-4">
							C012USD.ADDX
						</p>
					</div>

					{/* Account */}
					<div className="mb-6">
						<Label htmlFor="account" className="text-sm font-semibold text-typo-primary mb-1.5">
							Account
						</Label>
						<Select value={account} onValueChange={setAccount}>
							<SelectTrigger id="account" className="w-full">
								<SelectValue placeholder="Select an account" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cash-0123456">(Cash) 0123456</SelectItem>
								<SelectItem value="cash-0123457">(Cash) 0123457</SelectItem>
								<SelectItem value="cash-0123458">(Cash) 0123458</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Preferred Payment Mode */}
					<div className="mb-6">
						<Label htmlFor="payment" className="text-sm font-semibold text-typo-primary mb-1.5">
							Preferred Payment Mode
						</Label>
						<Select value={paymentMode} onValueChange={setPaymentMode}>
							<SelectTrigger id="payment" className="w-full">
								<SelectValue placeholder="Select a payment option" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="bank-transfer">Bank Transfer</SelectItem>
								<SelectItem value="credit-card">Credit Card</SelectItem>
								<SelectItem value="debit-card">Debit Card</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Settlement Currency */}
					<div className="mb-6">
						<Label htmlFor="currency" className="text-sm font-semibold text-typo-primary mb-1.5">
							Settlement Currency
						</Label>
						<Select value={currency} onValueChange={setCurrency}>
							<SelectTrigger id="currency" className="w-full">
								<SelectValue placeholder="Select a currency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sgd">
									<div className="flex items-center gap-2">
										<span className="text-base">🇸🇬</span>
										<span className="text-typo-primary">Singapore Dollar (SGD)</span>
									</div>
								</SelectItem>
								<SelectItem value="usd">
									<div className="flex items-center gap-2">
										<span className="text-base">🇺🇸</span>
										<span className="text-typo-primary">US Dollar (USD)</span>
									</div>
								</SelectItem>
								<SelectItem value="eur">
									<div className="flex items-center gap-2">
										<span className="text-base">🇪🇺</span>
										<span className="text-typo-primary">Euro (EUR)</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Quantity Requested */}
					<div className={`border rounded-lg py-4 px-4 md:px-6 mb-6 border-stroke-secondary`}>
						<Label className="text-sm font-semibold text-typo-primary mb-1.5">
							Quantity Requested
						</Label>

						<div
							className={cn(
								"flex items-center justify-between mb-4 border-b border-stroke-secondary px-1.5 py-2.5",
								!isValid && "border-status-error bg-background-error"
							)}
						>
							<Button
								type="button"
								onClick={handleDecrease}
								disabled={quantity === "" || currentQuantity <= minQuantity}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-enhanced-blue text-enhanced-blue hover:bg-blue-50 hover:text-enhanced-blue disabled:opacity-30 disabled:cursor-not-allowed h-5 w-5"
							>
								<Minus className={cn("w-4 h-4", !isValid && "bg-background-error")} />
							</Button>
							<div className="flex-1 mx-4">
								<Input
									type="number"
									value={quantity}
									onChange={handleQuantityChange}
									placeholder={`Min. ${minQuantity} Unit(s)`}
									min={minQuantity}
									className={cn(
										`text-center border-0 text-sm font-normal focus-visible:ring-0 focus-visible:ring-offset-0 text-theme-neutral-07 shadow-none h-5`,
										!quantity && "cursor-none"
									)}
								/>
							</div>
							<Button
								type="button"
								onClick={handleIncrease}
								variant="outline"
								size="icon"
								className="rounded-full border-2 border-enhanced-blue text-enhanced-blue hover:bg-blue-50 hover:text-enhanced-blue h-5 w-5"
							>
								<Plus className={cn("w-4 h-4", !isValid && "bg-background-error")} />
							</Button>
						</div>

						<div className="space-y-3 text-xs">
							<div className="flex justify-between">
								<span className="text-typo-secondary">Issue Price</span>
								<span className="font-medium text-typo-primary">
									{issuePrice.toFixed(2)} USD
								</span>
							</div>
							<div className="flex justify-between">
								<span
									className={cn(
										isBiggerThanMinimum ? "text-typo-secondary" : "text-status-error"
									)}
								>
									Min. Quantity
								</span>
								<span
									className={cn(
										"font-medium",
										isBiggerThanMinimum ? "text-typo-primary" : "text-status-error"
									)}
								>
									{minQuantity.toLocaleString()} Unit(s)
								</span>
							</div>
							<div className="flex justify-between">
								<span
									className={cn(
										isValidIncremental ? "text-typo-secondary" : "text-status-error"
									)}
								>
									Unit Incremental
								</span>
								<span
									className={cn(
										"font-medium",
										isValidIncremental ? "text-typo-primary" : "text-status-error"
									)}
								>
									{unitIncremental.toLocaleString()} Unit(s)
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-typo-primary font-medium w-1/2">
									Est. Net Application Value
								</span>
								<span className="font-semibold text-typo-primary">
									{parseFloat(estNetValue).toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{" "}
									USD
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

						{/* Hiện lỗi */}
						{showError && (
							<p className="text-status-error text-xs mt-1 flex items-center gap-1">
								<CircleAlert
									size={15}
									className="fill-status-error border-status-error"
									color="#FFFFFF"
								/>{" "}
								Please acknowledge the Terms & Conditions to proceed
							</p>
						)}
					</div>
				</div>
				<DialogFooter className="bg-background-section px-4 md:px-6 py-4">
					<Button
						onClick={handleSubmit}
						// disabled={!agreed || !isValidIncremental || !isBiggerThanMinimum}
						className="bg-enhanced-blue hover:bg-enhanced-blue text-white px-3 py-2 rounded-sm font-normal text-base disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Submit Application
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
