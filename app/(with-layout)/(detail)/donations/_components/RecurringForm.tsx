"use client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
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
import { CirclePlusIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CGSI } from "@/constants/routes";
import CustomCircleAlert from "@/components/CircleAlertIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Alert from "@/components/Alert";
import { useFormErrors } from "@/hooks/form/useFormErrors";
import TermsAndConditionsCheckbox from "@/components/TermsAndConditionsCheckbox";
import { submitDonation, cancelDonation } from "@/lib/services/profileService";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import type { DonationPlanResponse } from "@/types";

interface RecurringFormProps {
	plans: DonationPlanResponse[];
	isLoadingPlans: boolean;
	onPlansChange: (plans: DonationPlanResponse[]) => void;
	onRefresh: () => Promise<void>;
}

const SELECT_FIELDS = [
	{
		id: "duration",
		label: "Duration",
		placeholder: "Select the active duration",
		defaultValue: "",
		options: Array.from({ length: 12 }, (_, i) => ({
			value: `${i + 1}`,
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

const RecurringForm = ({
	plans: recurringDonations,
	isLoadingPlans,
	onPlansChange: setRecurringDonations,
	onRefresh: fetchPlans,
}: RecurringFormProps) => {
	const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
	const accountNo = getDefaultAccountNo();
	const [formValues, setFormValues] = useState({ duration: "", amount: "" });
	const [agreed, setAgreed] = useState(false);
	const { hasError, setError, clearError, clearAllErrors, showValidationErrors, setShowValidationErrors } =
		useFormErrors();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateFormValue = (field: string, value: string) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));
		if (value) clearError(field);
	};

	const handleSetup = async () => {
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

		if (!accountNo) {
			toast.error("No trading account found", "Please contact support to set up your account");
			return;
		}

		setIsSubmitting(true);

		try {
			const months = parseInt(formValues.duration, 10);
			const amount = parseFloat(formValues.amount);

			const response = await submitDonation({
				accountNo,
				amount,
				currency: "SGD",
				paymentMethod: "PLAN",
				paymentMode: "DONATE",
				months,
			});

			if (response.success && response.data?.success !== false) {
				await fetchPlans();
				setOpen(false);
				toast.success(
					"Setup Success!",
					"Your recurring donation is now active. Thank you for your continued support!",
				);

				// Reset form state
				setFormValues({ duration: "", amount: "" });
				setAgreed(false);
				setShowValidationErrors(false);
				clearAllErrors();
			} else {
				toast.error(
					"Payment Unsuccessful",
					"We were unable to process your donation. Please try again later.",
				);
			}
		} catch {
			toast.error(
				"Payment Unsuccessful",
				"We were unable to process your donation. Please try again later.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancelDonations = async (plan: DonationPlanResponse) => {
		try {
			const response = await cancelDonation(plan.id);

			if (response.success) {
				setRecurringDonations(recurringDonations.filter((item) => item.id !== plan.id));
				toast.success("Donation Cancelled", "Thank you for your generous support thus far!");
			} else {
				toast.error(
					"Unable to Cancel",
					response.error ||
					"We could not cancel your donation at this time. Please try again later.",
				);
			}
		} catch {
			toast.error("Error Encountered", "Something went wrong. Please try again later.");
		}
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
							<div className="border border-dashed border-cgs-blue bg-background-section rounded w-full py-3 px-4 flex items-center justify-between shadow-light-blue cursor-pointer">
								<p className="text-base font-medium text-cgs-blue">
									Setup Recurring Donation
								</p>
								<CirclePlusIcon className="text-cgs-blue bg-background-section" size={20} />
							</div>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[530px] p-0 max-h-[730px] flex flex-col gap-0 ">
							<DialogHeader className="pad-x pt-4 md:pt-6">
								<DialogTitle className="text-left text-lg md:text-xl">Setup Recurring Donation</DialogTitle>
							</DialogHeader>
							<div className="flex flex-col gap-4 pad-x text-xs md:text-sm font-normal text-typo-secondary max-h-[450px] md:max-h-none overflow-auto my-4 md:my-6">
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
											className="text-sm md:text-base font-semibold text-typo-primary mb-1.5"
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
													fieldHasError &&
													"border-status-error bg-background-error",
												)}
											>
												<SelectValue placeholder={field.placeholder} />
											</SelectTrigger>
											<SelectContent className="max-h-80">
												{field.options.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														<p>{option.label}</p>
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

							<TermsAndConditionsCheckbox
								id="terms"
								checked={agreed}
								onCheckedChange={(checked) => {
									setAgreed(checked);
									if (checked) clearError("terms");
								}}
								showError={showValidationErrors && hasError("terms")}
								labelText="I declare that I have fully read and understood the"
								termsUrl={CGSI.ONETIME_DONATION}
								additionalContent=" for this donation"
								className="pad-x mb-4 md:mb-6"
							/>
							<DialogFooter className="justify-end rounded-b-lg pad-x flex-row">
								<Button
									type="button"
									onClick={handleSetup}
									className="px-3 py-2 rounded-sm font-normal"
									disabled={isSubmitting}
									aria-busy={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="animate-spin mr-2 h-4 w-4" />
											Setting up...
										</>
									) : (
										"Setup Now"
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			{/* List Donate  */}
			<div className="pad-x flex-shrink-0">
				<Separator className="my-6" />
				<p className="hidden md:inline-block text-base md:text-lg font-semibold text-typo-primary">
					Recurring Donation List
				</p>
				<p className="md:hidden text-base font-semibold text-typo-primary">Recurring Donation List</p>
			</div>
			{isLoadingPlans ? (
				<div className="mt-6 flex-1 flex justify-center items-center">
					<Loader2 className="animate-spin text-cgs-blue" size={24} />
				</div>
			) : recurringDonations.length === 0 ? (
				<div className="mt-6 flex-1 pad-x flex flex-col gap-6 justify-center items-center">
					<RecurringDonation />
					<p className="text-sm font-normal text-typo-tertiary text-center px-2">
						There are currently no active recurring donations. Setup one now to support our cause!
					</p>
				</div>
			) : (
				<div className="mt-6 pad-x flex-1 min-h-0 overflow-y-auto">
					<div className="w-full flex flex-col gap-3 pb-6">
						{recurringDonations.map((plan) => {
							const formattedEnd = formatDate(plan.end);
							const formattedStart = formatDate(plan.start);

							return (
								<div key={plan.id}>
									<div className="flex justify-between items-center font-normal gap-3">
										<div className="text-sm text-typo-primary">
											{plan.currency} {plan.amount.toFixed(2)}
										</div>
										<Alert
											trigger={
												<div className="text-status-error text-xs cursor-pointer">
													Cancel
												</div>
											}
											title="Cancel Recurring Donation?"
											description={
												<p>
													Are you sure you wish to Cancel your recurring donation?
													This action will permanently stop all future contributions
													associated with this donation.
												</p>
											}
											actionText="Cancel"
											cancelText="Close"
											onAction={() => handleCancelDonations(plan)}
										/>
									</div>
									<div className="flex justify-between items-center text-xs font-medium text-typo-tertiary mt-3">
										<p>Start: {formattedStart}</p>
										<p>End: {formattedEnd}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default RecurringForm;
