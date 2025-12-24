"use client";
import { useState, useCallback, useMemo } from "react";

export type ErrorState = Record<string, string>;

export interface UseFormErrorsReturn {
	errors: ErrorState;
	hasError: (field: string) => boolean;
	getError: (field: string) => string;
	setError: (field: string, message: string) => void;
	clearError: (field: string) => void;
	clearAllErrors: () => void;
	hasAnyError: boolean;
	showValidationErrors: boolean;
	setShowValidationErrors: (show: boolean) => void;
}

export function useFormErrors(initialErrors: ErrorState = {}): UseFormErrorsReturn {
	const [errors, setErrors] = useState<ErrorState>(initialErrors);
	const [showValidationErrors, setShowValidationErrors] = useState(false);

	// Check if a specific field has an error
	const hasError = useCallback(
		(field: string): boolean => {
			return !!errors[field];
		},
		[errors]
	);

	// Get error message for a field
	const getError = useCallback(
		(field: string): string => {
			return errors[field] || "";
		},
		[errors]
	);

	const setError = useCallback((field: string, message: string) => {
		setErrors((prev) => ({
			...prev,
			[field]: message,
		}));
	}, []);

	const clearError = useCallback((field: string) => {
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[field];
			return newErrors;
		});
	}, []);

	// Clear all errors
	const clearAllErrors = useCallback(() => {
		setErrors({});
	}, []);

	// Check if any field has an error
	const hasAnyError = useMemo(() => {
		return Object.keys(errors).length > 0;
	}, [errors]);

	return {
		errors,
		hasError,
		getError,
		setError,
		clearError,
		clearAllErrors,
		hasAnyError,
		showValidationErrors,
		setShowValidationErrors,
	};
}
