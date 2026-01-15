"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toaster";
import { useState } from "react";
import RecurringDonation from "@/public/icons/discover/RecurringDonation.svg";
import { CirclePlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CGSI } from "@/constants/routes";
import { Checkbox } from "@/components/ui/checkbox";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Alert from "@/components/Alert";
import { useFormErrors } from "@/hooks/form/useFormErrors";

const SELECT_FIELDS = [
	{
		id: "duration",
		label: "Duration",
		placeholder: "Select the active duration",
		defaultValue: "",
		options: Array.from({ length: 12 }, (_, i) => ({
			value: `${i + 1}-month`,
			label: `${i + 1} Month${i + 1 > 1 ? "s" : ""}`,
		})),
	},
	{
		id: "amount",
		label: "Donation Amount (SGD)",
		placeholder: "Select an amount (min SGD 1.00)",
		defaultValue: "",
		options: Array.from({ length: 10 }, (_, i) => {
			const amount = (i + 1).toFixed(2);
			return { value: amount, label: `${amount}` };
		}),
	},
];

const RecurringForm = () => {
	// Align state naming and structure with ApplicationForm
	const [formValues, setFormValues] = useState({ duration: "", amount: "" });
	const [agreed, setAgreed] = useState(false);
	const {
		hasError,
		setError,
		clearError,
		clearAllErrors,
		showValidationErrors,
		setShowValidationErrors,
	} = useFormErrors();
	const [open, setOpen] = useState(false);
	const [recurringDonations, setRecurringDonations] = useState<{ duration: string; amount: string }[]>([]);

	const updateFormValue = (field: string, value: string) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
		if (value) clearError(field);
	};

	const handleSetup = () => {
		setShowValidationErrors(true);

		let hasValidationError = false;

		if (!formValues.duration) {
			setError("duration", "Field cannot be empty");
			hasValidationError = true;
		}

		if (!formValues.amount) {
			setError("amount", "Field cannot be empty");
			hasValidationError = true;
		}

		if (!agreed) {
			setError("terms", "Please acknowledge the Terms & Conditions to proceed");
			hasValidationError = true;
		}

		if (hasValidationError) {
			return;
		}

		if (Math.random() < 0.5) {
			// Add to Rec array, close dialog, notify
			setRecurringDonations((prev) => [...prev, { ...formValues }]);
			setOpen(false);
			toast.success(
				"Setup Success!",
				"Your recurring donation is now active. Thank you for your continued support!"
			);
			// Reset form state
			setFormValues({ duration: "", amount: "" });
			setAgreed(false);
			setShowValidationErrors(false);
			clearAllErrors();
		} else {
			toast.error("Error Encountered", "Something went wrong. Please try again later.");
		}
	};

	const handleCancelDonations = (index: number) => {
		setRecurringDonations((prev) => prev.filter((_, i) => i !== index));

		toast.success("Donation Cancelled", "Thank you for your generous support thus far!");
	};
	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
			{/* Nội dung chính */}
			<div className="space-y-6 pad-x flex-shrink-0">
				<div className="space-y-4 text-sm font-normal text-typo-secondary mt-6">
					<p className="md:hidden">
						Automatically donate a portion every time you execute a trade within your chosen time
						period.
					</p>
					<p className="hidden md:inline-block">
						Automatically donate a fixed amount every time you execute a trade within your chosen
						time period. You may view your donation transactions on your monthly account
						statements.
					</p>
				</div>

				<div className="space-y-1.5">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<div className="border border-dashed border-cgs-blue bg-background-section rounded-lg w-full py-4 flex flex-col items-center justify-center gap-1.5 shadow-[0px_3px_16px_0px_rgba(0,108,235,0.20)] cursor-pointer">
								<CirclePlusIcon
									className="text-cgs-blue bg-background-section"
									size={16}
								/>
								<p className="text-xs font-normal text-cgs-blue">
									Setup Recurring Donation
								</p>
							</div>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[530px] p-0 max-h-[730px] flex flex-col gap-0 ">
							<DialogHeader className="pad-x pt-4">
								<DialogTitle className="text-left">Setup Recurring Donation</DialogTitle>
							</DialogHeader>
							<div className="flex flex-col gap-4 pad-x text-sm md:text-sm font-normal text-typo-secondary max-h-[450px] md:max-h-none overflow-auto my-4 md:my-6">
								<p>
									Your recurring donation will remain active for the selected duration.
									During this period, each trade you make will automatically contribute the
									chosen donation amount.
								</p>
							</div>

							{/* Select  */}

							{SELECT_FIELDS.map((field) => {
								const fieldHasError = showValidationErrors && hasError(field.id);
								return (
									<div key={field.id} className="pad-x mb-6">
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
													fieldHasError && "border-status-error bg-background-error"
												)}
											>
												<SelectValue placeholder={field.placeholder} />
											</SelectTrigger>
											<SelectContent className="max-h-80">
												{field.options.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														<p>
															{option.label}
														</p>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldHasError && (
											<p className="text-status-error text-xs mt-1 flex items-center gap-1">
												<CustomCircleAlert size={15} />
												Field cannot be empty
											</p>
										)}
									</div>
								);
							})}

							<div className="pad-x mb-4 md:mb-6">
								<div className="flex items-start gap-2">
									<Checkbox
										id="terms"
										checked={agreed}
										error={showValidationErrors && hasError("terms")}
										onCheckedChange={(checked) => {
											setAgreed(checked as boolean);
											if (checked) clearError("terms");
										}}
										className="mt-0.5 shrink-0"
									/>

									<Label
										htmlFor="terms"
										className="text-xs md:text-sm text-typo-secondary cursor-pointer leading-5 font-normal"
									>
										<span>
											I declare that I have fully read and understood the
											<Link
												target="_blank"
												href={CGSI.ONETIME_DONATION}
												className="inline text-cgs-blue mx-1 hover:underline font-medium"
											>
												Terms & Conditions
											</Link>
											for this donation
										</span>
									</Label>
								</div>

								{showValidationErrors && hasError("terms") && (
									<p className="text-status-error text-xs mt-1 flex items-center gap-1">
										<CustomCircleAlert />
										Please acknowledge the Terms & Conditions to proceed
									</p>
								)}
							</div>
							<DialogFooter className="justify-end rounded-b-lg pad-x flex-row">
								<Button
									type="button"
									onClick={handleSetup}
									className="px-3 py-2 rounded-sm font-normal"
								>
									Setup Now
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			{/* List Donate  */}
			<div className="pad-x flex-shrink-0">
				<Separator className="my-6" />
				<p className="hidden md:inline-block text-base font-semibold text-typo-primary">
					Active Recurring Donations
				</p>
				<p className="md:hidden text-base font-semibold text-typo-primary">Recurring Donation List</p>
			</div>
			{recurringDonations.length === 0 ? (
				<div className="mt-6 flex-1 pad-x flex flex-col gap-6 justify-center items-center">
					<RecurringDonation />
					<p className="text-sm font-normal text-typo-tertiary text-center md:w-[65%]">
						There are currently no active recurring donations. Setup one now to support our cause!
					</p>
				</div>
			) : (
				<div className="mt-6 pad-x flex-1 min-h-0 overflow-y-auto">
					<div className="w-full flex flex-col gap-3 pb-6">
						{recurringDonations.map((item, index) => (
							<div key={`${item.duration}-${item.amount}-${index}`}>
								<div className="flex justify-between items-center font-normal gap-3">
									<div className="text-sm text-typo-primary">SGD {item.amount}</div>
									<Alert
										trigger={
											<div className="text-status-error text-xs cursor-pointer">
												Cancel
											</div>
										}
										title="Cancel Recurring Donation?"
										description={<p>
											Are you sure you wish to Cancel your recurring donation? This action will permanently stop all future contributions associated with this donation.
										</p>}
										actionText="Cancel"
										cancelText="Close"
										onAction={() => handleCancelDonations(index)}
									/>
								</div>
								<div className="flex justify-between items-center text-xs font-medium text-typo-tertiary">
									<p>{item.duration.replace("-", " ")}</p>
									<p>End Date: 15-Jan-2026</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default RecurringForm;
