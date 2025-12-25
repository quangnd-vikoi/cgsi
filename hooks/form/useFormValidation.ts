"use client";

import { useState, useCallback } from "react";
export type ValidationRule<T> = {
	validator: (value: T, allValues?: Record<string, unknown>) => boolean;
	message: string;
};
export type ValidationSchema<T extends Record<string, unknown>> = {
	[K in keyof T]?: ValidationRule<T[K]>[];
};

export interface UseFormValidationReturn<T extends Record<string, unknown>> {
	values: T;
	errors: Partial<Record<keyof T, string>>;

	isValid: boolean;

	validateField: (field: keyof T) => boolean;
	validateForm: () => boolean;
	setFieldValue: (field: keyof T, value: T[keyof T]) => void;
	handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
	reset: () => void;
	clearError: (field: keyof T) => void;
	setError: (field: keyof T, message: string) => void;
}

export const validators = {
	required: <T>(message = "This field is required"): ValidationRule<T> => ({
		validator: (value) => {
			if (typeof value === "string") {
				return value.trim().length > 0;
			}
			if (typeof value === "number") {
				return !isNaN(value);
			}
			return value != null && value !== "";
		},
		message,
	}),

	email: (message = "Please enter a valid email address"): ValidationRule<string> => ({
		validator: (value) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(value);
		},
		message,
	}),

	phone: (
		minLength = 8,
		message = `Please enter a valid phone number (min ${minLength} digits)`
	): ValidationRule<string> => ({
		validator: (value) => value.replace(/\D/g, "").length >= minLength,
		message,
	}),

	min: (min: number, message = `Value must be at least ${min}`): ValidationRule<number> => ({
		validator: (value) => value >= min,
		message,
	}),

	max: (max: number, message = `Value must not exceed ${max}`): ValidationRule<number> => ({
		validator: (value) => value <= max,
		message,
	}),

	minQuantity: (
		minQty: number,
		message = `Minimum quantity is ${minQty}`
	): ValidationRule<number> => ({
		validator: (value) => value >= minQty,
		message,
	}),

	increment: (
		increment: number,
		message = `Value must be in increments of ${increment}`
	): ValidationRule<number> => ({
		validator: (value) => value % increment === 0,
		message,
	}),

	custom: <T>(
		validator: (value: T, allValues?: Record<string, unknown>) => boolean,
		message: string
	): ValidationRule<T> => ({
		validator,
		message,
	}),
};

export function useFormValidation<T extends Record<string, unknown>>(options: {
	initialValues: T;
	schema: ValidationSchema<T>;
}): UseFormValidationReturn<T> {
	const { initialValues, schema } = options;

	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

	// Validate a specific field
	const validateField = useCallback(
		(field: keyof T): boolean => {
			const rules = schema[field];
			if (!rules || rules.length === 0) {
				// No validation rules for this field
				return true;
			}

			const value = values[field];

			// Run through all validation rules
			for (const rule of rules) {
				if (!rule.validator(value as never, values)) {
					// Validation failed
					setErrors((prev) => ({
						...prev,
						[field]: rule.message,
					}));
					return false;
				}
			}

			// All validations passed - clear error
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});

			return true;
		},
		[schema, values]
	);

	// Validate all fields
	const validateForm = useCallback((): boolean => {
		let isFormValid = true;
		const newErrors: Partial<Record<keyof T, string>> = {};

		// Validate each field that has validation rules
		for (const field in schema) {
			const rules = schema[field];
			if (!rules || rules.length === 0) continue;

			const value = values[field];

			// Run through all validation rules for this field
			for (const rule of rules) {
				if (!rule.validator(value as never, values)) {
					// Validation failed
					newErrors[field] = rule.message;
					isFormValid = false;
					break; // Stop at first failed rule for this field
				}
			}
		}

		setErrors(newErrors);
		return isFormValid;
	}, [schema, values]);

	// Set value for a specific field
	const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
		setValues((prev) => ({
			...prev,
			[field]: value,
		}));
	}, []);

	// Get change handler for input
	const handleChange = useCallback(
		(field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setFieldValue(field, value as T[keyof T]);
		},
		[setFieldValue]
	);

	// Reset form
	const reset = useCallback(() => {
		setValues(initialValues);
		setErrors({});
	}, [initialValues]);

	// Clear error for a field
	const clearError = useCallback((field: keyof T) => {
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[field];
			return newErrors;
		});
	}, []);

	// Set error for a field
	const setError = useCallback((field: keyof T, message: string) => {
		setErrors((prev) => ({
			...prev,
			[field]: message,
		}));
	}, []);

	// Check if form is valid
	const isValid = Object.keys(errors).length === 0;

	return {
		values,
		errors,
		isValid,
		validateField,
		validateForm,
		setFieldValue,
		handleChange,
		reset,
		clearError,
		setError,
	};
}
