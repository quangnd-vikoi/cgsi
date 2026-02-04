/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
// import { useUserStore } from "@/stores/userStore";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
// import { getUserProfile, getUserAccounts } from "@/lib/services/profileService";
import { getUserAccounts } from "@/lib/services/profileService";

/**
 * DataInitializer Component
 *
 * Fetches critical user data as soon as the user accesses the application:
 * 1. User Profile (name, email, mobile, etc.)
 * 2. Trading Accounts (accountNo is used everywhere)
 *
 * Similar to NotificationPolling, this component:
 * - Runs on mount
 * - Fetches data once and stores in Zustand
 * - Prevents duplicate API calls with initialization flags
 *
 * Usage: Add to root layout alongside NotificationPolling
 */
export function DataInitializer() {
	// const profile = useUserStore((state) => state.profile);
	const tradingAccountsInitialized = useTradingAccountStore((state) => state.isInitialized);
	const setAccounts = useTradingAccountStore((state) => state.setAccounts);
	const setSelectedAccount = useTradingAccountStore((state) => state.setSelectedAccount);

	// TODO: Re-enable when profile API is ready
	// const fetchUserProfile = async () => {
	// 	try {
	// 		const response = await getUserProfile();

	// 		if (!response.success) {
	// 			console.error("Failed to fetch user profile:", response.error);
	// 		}
	// 		// Note: getUserProfile automatically syncs to userStore (see profileService.ts:38)
	// 	} catch (err) {
	// 		console.error("Error fetching user profile:", err);
	// 	}
	// };

	// Fetch trading accounts on mount (if not already loaded)
	const fetchTradingAccounts = async () => {
		try {
			const response = await getUserAccounts();

			if (response.success && response.data) {
				setAccounts(response.data);

				// Auto-select first account as default
				if (response.data.length > 0) {
					setSelectedAccount(response.data[0]);
				}
			} else {
				console.error("Failed to fetch trading accounts:", response.error);
			}
		} catch (err) {
			console.error("Error fetching trading accounts:", err);
		}
	};

	// TODO: Re-enable when profile API is ready
	// useEffect(() => {
	// 	if (!profile) {
	// 		fetchUserProfile();
	// 	}
	// }, []);

	// Initialize trading accounts on mount
	useEffect(() => {
		if (!tradingAccountsInitialized) {
			fetchTradingAccounts();
		}
	}, []);

	// This component doesn't render anything
	return null;
}
