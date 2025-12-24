"use client";

import { useState, useEffect, useCallback, useRef } from "react";
export interface UseOTPCountdownOptions {
	initialSeconds?: number;
	onComplete?: () => void;
}
export interface UseOTPCountdownReturn {
	countdown: number;
	formattedTime: string;
	isActive: boolean;
	reset: (seconds?: number) => void;
	pause: () => void;
	resume: () => void;
}

export function useOTPCountdown(
	options: UseOTPCountdownOptions = {}
): UseOTPCountdownReturn {
	const { initialSeconds = 120, onComplete } = options;

	const [countdown, setCountdown] = useState(initialSeconds);
	const [isPaused, setIsPaused] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const initialSecondsRef = useRef(initialSeconds);

	// Format time as MM:SS
	const formatTime = useCallback((seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}, []);

	// Cleanup interval on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	// Countdown logic
	useEffect(() => {
		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// Don't start interval if paused or countdown is 0
		if (isPaused || countdown <= 0) {
			return;
		}

		// Start countdown interval
		intervalRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					// Countdown reached zero
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
					}
					if (onComplete) {
						onComplete();
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [countdown, isPaused, onComplete]);

	// Reset countdown
	const reset = useCallback((seconds?: number) => {
		const newCountdown = seconds ?? initialSecondsRef.current;
		setCountdown(newCountdown);
		setIsPaused(false);
	}, []);

	// Pause countdown
	const pause = useCallback(() => {
		setIsPaused(true);
	}, []);

	// Resume countdown
	const resume = useCallback(() => {
		setIsPaused(false);
	}, []);

	return {
		countdown,
		formattedTime: formatTime(countdown),
		isActive: countdown > 0,
		reset,
		pause,
		resume,
	};
}
