"use client";

import { useState, useCallback, useMemo } from "react";
export interface UseMultiStepFormOptions<T extends string | number> {
	initialStep: T;

	steps: T[];
	onStepChange?: (step: T) => void;
}
export interface UseMultiStepFormReturn<T extends string | number> {
	currentStep: T;
	stepIndex: number;
	isFirstStep: boolean;
	isLastStep: boolean;
	goToStep: (step: T) => void;
	nextStep: () => void;
	previousStep: () => void;
	reset: () => void;
}
export function useMultiStepForm<T extends string | number>(
	options: UseMultiStepFormOptions<T>
): UseMultiStepFormReturn<T> {
	const { initialStep, steps, onStepChange } = options;

	const [currentStep, setCurrentStep] = useState<T>(initialStep);

	const stepIndex = useMemo(() => {
		return steps.indexOf(currentStep);
	}, [steps, currentStep]);

	const isFirstStep = useMemo(() => {
		return stepIndex === 0;
	}, [stepIndex]);

	const isLastStep = useMemo(() => {
		return stepIndex === steps.length - 1;
	}, [stepIndex, steps.length]);

	const goToStep = useCallback(
		(step: T) => {
			if (!steps.includes(step)) {
				console.warn(`Step "${step}" not found in steps array`);
				return;
			}
			setCurrentStep(step);
			if (onStepChange) {
				onStepChange(step);
			}
		},
		[steps, onStepChange]
	);

	const nextStep = useCallback(() => {
		if (stepIndex < steps.length - 1) {
			const nextStepValue = steps[stepIndex + 1];
			setCurrentStep(nextStepValue);
			if (onStepChange) {
				onStepChange(nextStepValue);
			}
		}
	}, [stepIndex, steps, onStepChange]);

	const previousStep = useCallback(() => {
		if (stepIndex > 0) {
			const prevStepValue = steps[stepIndex - 1];
			setCurrentStep(prevStepValue);
			if (onStepChange) {
				onStepChange(prevStepValue);
			}
		}
	}, [stepIndex, steps, onStepChange]);

	const reset = useCallback(() => {
		setCurrentStep(initialStep);
		if (onStepChange) {
			onStepChange(initialStep);
		}
	}, [initialStep, onStepChange]);

	return {
		currentStep,
		stepIndex,
		isFirstStep,
		isLastStep,
		goToStep,
		nextStep,
		previousStep,
		reset,
	};
}
