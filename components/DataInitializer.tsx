/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { getUserProfile, getUserAccounts } from "@/lib/services/profileService";
import { USER_CATEGORY } from "@/constants/accessControl";

/**
 * DataInitializer Component
 *
 * Fetches critical user data as soon as the user accesses the application:
 * 1. User Profile (name, email, mobile, userCategory)
 * 2. Trading Accounts (only for retail users — DEMO/TR have no accounts)
 *
 * Accounts fetch is sequential: waits for profile to determine userCategory,
 * then skips the call entirely for DEMO (2) and TR (8) users.
 */
export function DataInitializer() {
	const profile = useUserStore((state) => state.profile);
	const tradingAccountsInitialized = useTradingAccountStore((state) => state.isInitialized);
	const setAccounts = useTradingAccountStore((state) => state.setAccounts);
	const setSelectedAccount = useTradingAccountStore((state) => state.setSelectedAccount);
	const setInitialized = useTradingAccountStore((state) => state.setInitialized);

	useEffect(() => {
		if (!profile) {
			getUserProfile().catch((err) => {
				console.error("Error fetching user profile:", err);
			});
		}
	}, []);

	// Fetch trading accounts after profile is available with userCategoryId
	useEffect(() => {
		if (!profile?.userCategoryId || tradingAccountsInitialized) return;

		// DEMO and TR users have no trading accounts — skip API call
		if (profile.userCategoryId === USER_CATEGORY.DEMO || profile.userCategoryId === USER_CATEGORY.TR) {
			setAccounts([]);
			return;
		}

		const fetchTradingAccounts = async () => {
			try {
				const response = await getUserAccounts();

				if (response.success && response.data) {
					const ACCOUNT_TYPE_MAP: Record<string, string> = { ICASH: "iCash" };
					const normalized = response.data.map((acc) => ({
						...acc,
						accountType: acc.accountType
							? (ACCOUNT_TYPE_MAP[acc.accountType] ?? acc.accountType)
							: acc.accountType,
					}));
					setAccounts(normalized as typeof response.data);

					// Auto-select first account as default
					if (normalized.length > 0) {
						setSelectedAccount(normalized[0] as (typeof response.data)[0]);
					}
				} else {
					console.error("Failed to fetch trading accounts:", response.error);
					setInitialized(true);
				}
			} catch (err) {
				console.error("Error fetching trading accounts:", err);
				setInitialized(true);
			}
		};

		fetchTradingAccounts();
	}, [profile]);

	// This component doesn't render anything
	return null;
}
