"use client";

import { useState, useCallback } from "react";
import { useFormErrors } from "@/hooks/form/useFormErrors";
import { submitDonation } from "@/lib/services/profileService";
import type { DonationSubmissionRequest } from "@/types";

/**
 * Payment method types for donations
 */
export type PaymentMethod = "now" | "trust" | "";

/**
 * Donation form values
 */
export interface DonationFormValues {
	amount?: number;
	paymentMethod: PaymentMethod;
	agreed: boolean;
}

/**
 * Options for configuring the donation form hook
 */
export interface UseDonationFormOptions {
	/**
	 * Callback function called when form is successfully submitted
	 */
	onSuccess?: (values: DonationFormValues) => void;

	/**
	 * Callback function called when form submission fails
	 */
	onError?: (error: Error) => void;

	/**
	 * Minimum donation amount (default: 1.0)
	 */
	minAmount?: number;

	/**
	 * Selected account number for donation
	 */
	accountNo?: string;

	/**
	 * Type of donation (onetime or recurring)
	 */
	donationType?: "onetime" | "recurring";

	/**
	 * Number of months for recurring donations (default: 12)
	 */
	months?: number;

	/**
	 * Whether to submit to API (default: false for testing)
	 */
	submitToAPI?: boolean;
}

/**
 * Return type for the useDonationForm hook
 */
export interface UseDonationFormReturn {
	/**
	 * Current donation amount
	 */
	amount?: number;

	/**
	 * Selected payment method
	 */
	paymentMethod: PaymentMethod;

	/**
	 * Whether user has agreed to terms
	 */
	agreed: boolean;

	/**
	 * Set donation amount
	 */
	setAmount: (amount: number | undefined) => void;

	/**
	 * Set payment method
	 */
	setPaymentMethod: (method: PaymentMethod) => void;

	/**
	 * Set agreed to terms
	 */
	setAgreed: (agreed: boolean) => void;

	/**
	 * Form errors
	 */
	errors: {
		amount: boolean;
		paymentMethod: boolean;
		terms: boolean;
	};

	/**
	 * Validate and submit the form (async when API integration is enabled)
	 */
	handleSubmit: () => Promise<boolean>;

	/**
	 * Whether form is currently submitting
	 */
	isSubmitting: boolean;

	/**
	 * Reset form to initial state
	 */
	reset: () => void;

	/**
	 * Get all form values
	 */
	getValues: () => DonationFormValues;
}

/**
 * Custom hook for managing donation form state and validation
 *
 * Provides centralized donation form logic used by both
 * OnetimeForm and RecurringForm components.
 *
 * @example
 * ```tsx
 * const {
 *   amount,
 *   setAmount,
 *   paymentMethod,
 *   setPaymentMethod,
 *   agreed,
 *   setAgreed,
 *   errors,
 *   handleSubmit,
 *   isSubmitting
 * } = useDonationForm({
 *   onSuccess: (values) => {
 *     toast.success("Thank you!", "Your donation has been processed.");
 *   },
 *   minAmount: 1.0
 * });
 * ```
 */
export function useDonationForm(
	options: UseDonationFormOptions = {}
): UseDonationFormReturn {
	const {
		onSuccess,
		onError,
		minAmount = 1.0,
		accountNo,
		donationType = "onetime",
		months = 12,
		submitToAPI = false,
	} = options;

	// Form state
	const [amount, setAmount] = useState<number | undefined>();
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
	const [agreed, setAgreed] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Error management
	const {
		hasError,
		setError,
		clearError,
		clearAllErrors,
		showValidationErrors,
		setShowValidationErrors,
	} = useFormErrors();

	// Validate form
	const validateForm = useCallback((): boolean => {
		let isValid = true;

		// Validate amount
		if (!amount || amount < minAmount) {
			setError("amount", `Please enter a valid amount (min SGD ${minAmount.toFixed(2)})`);
			isValid = false;
		} else {
			clearError("amount");
		}

		// Validate payment method
		if (!paymentMethod) {
			setError("paymentMethod", "Please select a payment method");
			isValid = false;
		} else {
			clearError("paymentMethod");
		}

		// Validate terms agreement
		if (!agreed) {
			setError("terms", "Please acknowledge the Terms & Conditions to proceed");
			isValid = false;
		} else {
			clearError("terms");
		}

		return isValid;
	}, [amount, paymentMethod, agreed, minAmount, setError, clearError]);

	// Handle form submission
	const handleSubmit = useCallback(async (): Promise<boolean> => {
		setShowValidationErrors(true);
		if (!validateForm()) {
			return false;
		}

		setIsSubmitting(true);

		try {
			const values: DonationFormValues = {
				amount,
				paymentMethod,
				agreed,
			};

			// If submitToAPI is true, call the actual API
			if (submitToAPI) {
				if (!accountNo) {
					throw new Error("Account number is required for API submission");
				}

				if (!amount) {
					throw new Error("Donation amount is required");
				}

				const donationData: DonationSubmissionRequest = {
					accountNo,
					amount,
					currency: "SGD",
					paymentMethod: paymentMethod === "now" ? "LS_ACCSET" : paymentMethod === "trust" ? "LS_ACCSET" : "PLAN",
					paymentMode: "DONATE",
					...(donationType === "recurring" && { months }),
				};

				const response = await submitDonation(donationData);

				if (!response.success || !response.data?.isSuccess) {
					throw new Error(response.error || "Donation submission failed");
				}
			}

			// Call success callback
			if (onSuccess) {
				onSuccess(values);
			}

			return true;
		} catch (error) {
			// Call error callback
			if (onError) {
				onError(error as Error);
			}
			return false;
		} finally {
			setIsSubmitting(false);
		}
	}, [
		validateForm,
		amount,
		paymentMethod,
		agreed,
		accountNo,
		donationType,
		months,
		submitToAPI,
		onSuccess,
		onError,
		setShowValidationErrors,
	]);

	// Reset form
	const reset = useCallback(() => {
		setAmount(undefined);
		setPaymentMethod("");
		setAgreed(false);
		setIsSubmitting(false);
		setShowValidationErrors(false);
		clearAllErrors();
	}, [clearAllErrors, setShowValidationErrors]);

	// Get all form values
	const getValues = useCallback((): DonationFormValues => {
		return {
			amount,
			paymentMethod,
			agreed,
		};
	}, [amount, paymentMethod, agreed]);

	// Expose errors as boolean flags for easier consumption
	// Only show errors after first submit attempt
	const errors = {
		amount: showValidationErrors && hasError("amount"),
		paymentMethod: showValidationErrors && hasError("paymentMethod"),
		terms: showValidationErrors && hasError("terms"),
	};

	return {
		amount,
		setAmount,
		paymentMethod,
		setPaymentMethod,
		agreed,
		setAgreed,
		errors,
		handleSubmit,
		isSubmitting,
		reset,
		getValues,
	};
}
