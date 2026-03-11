/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { useUserTypeStore } from "@/stores/userTypeStore";
import { getUserProfile, getUserAccounts } from "@/lib/services/profileService";
import { deriveUserType } from "@/constants/userTypes";

/**
 * DataInitializer Component
 *
 * Fetches critical user data as soon as the user accesses the application:
 * 1. User Profile (name, email, mobile, userCategory)
 * 2. Trading Accounts (accountNo, accountType)
 *
 * After both resolve, derives and persists the user type for route access control.
 */
export function DataInitializer() {
	const profile = useUserStore((state) => state.profile);
	const tradingAccountsInitialized = useTradingAccountStore((state) => state.isInitialized);
	const setAccounts = useTradingAccountStore((state) => state.setAccounts);
	const setSelectedAccount = useTradingAccountStore((state) => state.setSelectedAccount);

	useEffect(() => {
		if (profile && tradingAccountsInitialized) return;

		const initializeData = async () => {
			try {
				const [profileResponse, accountsResponse] = await Promise.all([
					profile ? Promise.resolve(null) : getUserProfile(),
					tradingAccountsInitialized ? Promise.resolve(null) : getUserAccounts(),
				]);

				if (profileResponse && !profileResponse.success) {
					console.error("Failed to fetch user profile:", profileResponse.error);
				}

				let normalizedAccounts = useTradingAccountStore.getState().accounts;

				if (accountsResponse?.success && accountsResponse.data) {
					const ACCOUNT_TYPE_MAP: Record<string, string> = { ICASH: "iCash" };
					normalizedAccounts = accountsResponse.data.map((acc) => ({
						...acc,
						accountType: acc.accountType
							? (ACCOUNT_TYPE_MAP[acc.accountType] ?? acc.accountType)
							: acc.accountType,
					})) as typeof accountsResponse.data;

					setAccounts(normalizedAccounts);

					if (normalizedAccounts.length > 0) {
						setSelectedAccount(normalizedAccounts[0]);
					}
				} else if (accountsResponse && !accountsResponse.success) {
					console.error("Failed to fetch trading accounts:", accountsResponse.error);
				}

				// Derive user type from combined data
				const userCategory =
					profileResponse?.data?.userCategory ??
					useUserStore.getState().profile?.userCategoryId;
				const derived = deriveUserType(userCategory, normalizedAccounts);
				useUserTypeStore.getState().setUserType(derived);
			} catch (err) {
				console.error("Error initializing data:", err);
			}
		};

		initializeData();
	}, []);

	return null;
}
