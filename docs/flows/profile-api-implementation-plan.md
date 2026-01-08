# Profile API Implementation Guide

> **Implementation guide for Profile API endpoints following CGSI iTrade Portal conventions**
>
> This document provides step-by-step instructions for integrating Profile APIs using the established three-layer architecture pattern.

> **⚠️ NEW v2 APIs Available:** See [IMPLEMENTATION_PLAN_V2_APIs.md](./IMPLEMENTATION_PLAN_V2_APIs.md) for new Profile v2 endpoints including Trading Info, Update Info, and Acknowledgements.

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Implementation Steps](#implementation-steps)
3. [Endpoint Definitions](#endpoint-definitions)
4. [TypeScript Types](#typescript-types)
5. [Service Layer](#service-layer)
6. [Component Integration](#component-integration)
7. [State Management](#state-management)
8. [Testing Checklist](#testing-checklist)

---

## API Overview

**Base URL:** `https://stgitrade.cgsi.com.sg/portal` (configurable via `API_BASE_URL`)

**Base Path:** `/profile/api/v1`

**Authentication:** All authenticated endpoints require Bearer token in Authorization header

**Source:** `profile-api-0.0.1-snapshot.json` + `iTrade-ProfileAPI.yaml`

### Available Endpoints

| Category | Endpoint | Method | Auth | Status |
|----------|----------|--------|------|--------|
| **User Info** | `/userInfo` | GET | 🔒 | ❌ Not Implemented |
| **Trading Rep** | `/trInfo` | GET | 🔒 | ✅ Implemented |
| **Accounts** | `/accounts` | GET | 🔒 | ✅ Implemented |
| **Trading Info** | `/tradingInfo` | GET | 🔒 | ❌ Not Implemented |
| **BCAN Request** | `/tradingInfo/bcan/request` | POST | 🔒 | ✅ Implemented |
| **Donation Plan** | `/donation/plan` | GET | 🔒 | ✅ Implemented |
| **Submit Donation** | `/donation/submission` | POST | 🔒 | ✅ Implemented |
| **Cancel Donation** | `/donation/cancel` | POST | 🔒 | ✅ Implemented |
| **Client Service Contact** | `/contactUs/clientService` | GET | 🔓 | ✅ Implemented |
| **Dealing Desk Contact** | `/contactUs/centralDealingDesk` | GET | 🔓 | ✅ Implemented |

**Implementation Status:** 8/12 basic endpoints (67%)

---

## Implementation Steps

### Step 1: Define Endpoint Paths

**File:** `/lib/api/endpoints/profile.ts`

**Status:** ✅ Already exists, needs updates for missing endpoints

**Add Missing Endpoints:**

```typescript
/**
 * Profile API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Base Path: /profile/api/v1
 * Source: profile-api-0.0.1-snapshot.json + iTrade-ProfileAPI.yaml
 *
 * Authentication:
 * - Most endpoints require Bearer token (useAuth: true)
 * - Contact Us endpoints are public (useAuth: false)
 */
export const profileEndpoints = {
	// ============================================================================
	// User Information Endpoints
	// ============================================================================

	/**
	 * Get User Information
	 *
	 * GET /profile/api/v1/userInfo
	 *
	 * @returns UserInfoResponse - User profile information
	 * @requires Authentication - Bearer token (useAuth: true)
	 *
	 * @example
	 * const response = await fetchAPI<UserInfoResponse>(
	 *   ENDPOINTS.getUserInfo(),
	 *   { useAuth: true }
	 * );
	 */
	getUserInfo: () => `/profile/api/v1/userInfo`,

	/**
	 * Get Trading Information
	 *
	 * GET /profile/api/v1/tradingInfo
	 *
	 * @returns TradingInfoResponse - User trading information
	 * @requires Authentication - Bearer token (useAuth: true)
	 */
	getTradingInfo: () => `/profile/api/v1/tradingInfo`,

	// ... existing endpoints (trInfo, accounts, etc.)
} as const;
```

**Export in index.ts:**

```typescript
// File: /lib/api/endpoints/index.ts
import { profileEndpoints } from "./profile";

export const ENDPOINTS = {
	// ... existing endpoints
	...profileEndpoints,
};
```

---

### Step 2: Define TypeScript Types

**File:** `/types/index.ts`

**Add Missing Types:**

```typescript
// ============================================
// Profile API Types
// ============================================

/**
 * User Information Response
 * Returned from GET /profile/api/v1/userInfo
 */
export interface UserInfoResponse {
	profileId: string;
	name: string;
	email: string;
	mobile: string;
	icNumber?: string;
	nationality?: string;
	dateOfBirth?: string;
	address?: string;
	postalCode?: string;
	country?: string;
}

/**
 * Trading Information Response
 * Returned from GET /profile/api/v1/tradingInfo
 */
export interface TradingInfoResponse {
	accountNo: string;
	accountType: string;
	accountStatus: string;
	openDate?: string;
	trName?: string;
	bcanStatus?: string;
	bcanNumber?: string;
}

/**
 * BCAN Request
 * Used for POST /profile/api/v1/tradingInfo/bcan/request
 */
export interface BcanRequest {
	accountNo: string;
	requestType?: string;
}

/**
 * BCAN Response
 * Returned from POST /profile/api/v1/tradingInfo/bcan/request
 */
export interface BcanResponse {
	requestId: string;
	accountNo: string;
	status: string;
	message?: string;
	submittedDate?: string;
}

/**
 * Donation Plan Response
 * Returned from GET /profile/api/v1/donation/plan
 */
export interface DonationPlanResponse {
	planId: string;
	planName: string;
	beneficiary: string;
	amount: number;
	frequency: string;
	status: string;
	startDate?: string;
	endDate?: string;
}

/**
 * Donation Submission Request
 * Used for POST /profile/api/v1/donation/submission
 */
export interface DonationSubmissionRequest {
	planId?: string;
	beneficiary: string;
	amount: number;
	paymentMethod: string; // PLAN or LS_ACCSET
	accountNo: string;
	frequency?: string;
	startDate?: string;
}

/**
 * Donation Submission Response
 * Returned from POST /profile/api/v1/donation/submission
 */
export interface DonationSubmissionResponse {
	donationId: string;
	status: string;
	message?: string;
	submittedDate?: string;
}

/**
 * Donation Cancel Request
 * Used for POST /profile/api/v1/donation/cancel
 */
export interface DonationCancelRequest {
	donationId: number;
}

/**
 * Donation Cancel Response
 * Returned from POST /profile/api/v1/donation/cancel
 */
export interface DonationCancelResponse {
	donationId: number;
	status: string;
	message?: string;
	cancelledDate?: string;
}
```

**Key Points:**
- ✅ Use `interface` for all API types
- ✅ Add JSDoc comments describing the endpoint
- ✅ Use `?` for optional fields
- ✅ Use `string` for dates (API returns ISO strings)
- ✅ Match exact API response structure

---

### Step 3: Create/Update Service Layer

**File:** `/lib/services/profileService.ts`

**Status:** ✅ Already exists, needs to add missing functions

**Add Missing Service Functions:**

```typescript
/**
 * Profile Service
 *
 * Handles all profile-related API calls including:
 * - User information
 * - Trading accounts
 * - Trading representative info
 * - BCAN requests
 * - Donation management
 * - Contact information
 *
 * All functions return APIResponse<T> with consistent error handling.
 */

import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	UserInfoResponse,
	TradingInfoResponse,
	BcanRequest,
	BcanResponse,
	DonationPlanResponse,
	DonationSubmissionRequest,
	DonationSubmissionResponse,
	DonationCancelRequest,
	DonationCancelResponse,
} from "@/types";

// ============================================
// USER INFORMATION
// ============================================

/**
 * Get user profile information
 *
 * @returns User profile data including name, email, mobile, etc.
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getUserInfo();
 * if (response.success && response.data) {
 *   console.log('User:', response.data.name);
 * }
 */
export const getUserInfo = async (): Promise<
	APIResponse<UserInfoResponse>
> => {
	return await fetchAPI<UserInfoResponse>(ENDPOINTS.getUserInfo(), {
		useAuth: true,
	});
};

/**
 * Get user trading information
 *
 * @returns Trading information including account status, BCAN, etc.
 * @requires Authentication - Bearer token
 */
export const getTradingInfo = async (): Promise<
	APIResponse<TradingInfoResponse>
> => {
	return await fetchAPI<TradingInfoResponse>(ENDPOINTS.getTradingInfo(), {
		useAuth: true,
	});
};

// ============================================
// BCAN MANAGEMENT
// ============================================

/**
 * Create BCAN request for a trading account
 *
 * @param accountNo - Trading account number
 * @returns BCAN request details with status
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await createBcanRequest("1234567");
 * if (response.success && response.data) {
 *   toast.success('BCAN Request Submitted', {
 *     description: `Request ID: ${response.data.requestId}`
 *   });
 * }
 */
export const createBcanRequest = async (
	accountNo: string
): Promise<APIResponse<BcanResponse>> => {
	const requestData: BcanRequest = { accountNo };

	return await postAPI<BcanResponse, BcanRequest>(
		ENDPOINTS.createBcanRequest(),
		requestData,
		{ useAuth: true }
	);
};

// ============================================
// DONATION MANAGEMENT
// ============================================

/**
 * Get active donation plans
 *
 * @returns List of active donation plans
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getDonationPlans();
 * if (response.success && response.data) {
 *   setPlans(response.data);
 * }
 */
export const getDonationPlans = async (): Promise<
	APIResponse<DonationPlanResponse[]>
> => {
	return await fetchAPI<DonationPlanResponse[]>(
		ENDPOINTS.getDonationPlan(),
		{ useAuth: true }
	);
};

/**
 * Submit a new donation
 *
 * @param donationData - Donation submission details
 * @returns Submitted donation details with status
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await submitDonation({
 *   beneficiary: "Red Cross",
 *   amount: 100,
 *   paymentMethod: "PLAN",
 *   accountNo: "1234567"
 * });
 */
export const submitDonation = async (
	donationData: DonationSubmissionRequest
): Promise<APIResponse<DonationSubmissionResponse>> => {
	return await postAPI<DonationSubmissionResponse, DonationSubmissionRequest>(
		ENDPOINTS.submitDonation(),
		donationData,
		{ useAuth: true }
	);
};

/**
 * Cancel an existing donation
 *
 * @param donationId - ID of the donation to cancel
 * @returns Cancellation confirmation with status
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await cancelDonation(123);
 * if (response.success) {
 *   toast.success('Donation Cancelled');
 * }
 */
export const cancelDonation = async (
	donationId: number
): Promise<APIResponse<DonationCancelResponse>> => {
	const requestData: DonationCancelRequest = { donationId };

	return await postAPI<DonationCancelResponse, DonationCancelRequest>(
		ENDPOINTS.cancelDonation(),
		requestData,
		{ useAuth: true }
	);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get complete user profile with accounts and trading info
 *
 * Fetches user info, accounts, and trading info in parallel
 *
 * @returns Object containing all user profile data
 *
 * @example
 * const data = await getCompleteUserProfile();
 * if (data.userInfo?.success) {
 *   setUserData(data.userInfo.data);
 * }
 */
export const getCompleteUserProfile = async () => {
	const [userInfoRes, accountsRes, tradingInfoRes] = await Promise.allSettled([
		getUserInfo(),
		getUserAccounts(),
		getTradingInfo(),
	]);

	return {
		userInfo: userInfoRes.status === "fulfilled" ? userInfoRes.value : null,
		accounts: accountsRes.status === "fulfilled" ? accountsRes.value : null,
		tradingInfo: tradingInfoRes.status === "fulfilled" ? tradingInfoRes.value : null,
	};
};

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Profile service object containing all profile-related functions
 */
export const profileService = {
	// User information
	getUserInfo,
	getTradingInfo,
	getUserAccounts,
	getTrInfo,

	// BCAN management
	createBcanRequest,

	// Donation management
	getDonationPlans,
	submitDonation,
	cancelDonation,

	// Contact information
	getClientServiceContact,
	getCentralDealingDeskContact,

	// Helper functions
	getCompleteUserProfile,
};

export default profileService;
```

---

### Step 4: Component Integration Examples

#### Example 1: Fetch User Info on App Load

**File:** `app/layout.tsx` or `app/(with-layout)/layout.tsx`

**Pattern:** Fetch on mount, store in Zustand

```typescript
"use client";
import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { profileService } from '@/lib/services/profileService';

export default function RootLayout({ children }) {
	const setUserData = useUserStore((state) => state.setUserData);

	useEffect(() => {
		const fetchUserProfile = async () => {
			const response = await profileService.getUserInfo();

			if (response.success && response.data) {
				setUserData({
					name: response.data.name,
					email: response.data.email,
					mobile: response.data.mobile,
				});
			}
		};

		fetchUserProfile();
	}, [setUserData]);

	return <>{children}</>;
}
```

#### Example 2: Donation Submission Form

**File:** `app/(with-layout)/(detail)/donations/page.tsx`

**Pattern:** Form submission with loading/error states

```typescript
"use client";
import { useState } from 'react';
import { toast } from 'sonner';
import { profileService } from '@/lib/services/profileService';
import { useTradingAccountStore } from '@/stores/tradingAccountStore';
import type { DonationSubmissionRequest } from '@/types';

export default function DonationsPage() {
	const [submitting, setSubmitting] = useState(false);
	const selectedAccount = useTradingAccountStore((state) => state.selectedAccount);

	const handleSubmit = async (formData: DonationSubmissionRequest) => {
		setSubmitting(true);

		try {
			const response = await profileService.submitDonation({
				...formData,
				accountNo: selectedAccount?.accountNumber || "",
			});

			if (response.success && response.data) {
				toast.success('Donation Submitted', {
					description: `Thank you for your donation! Submission ID: ${response.data.donationId}`
				});

				// Reset form or navigate
				router.push('/donations/success');
			} else {
				toast.error('Submission Failed', {
					description: response.error || 'Please try again later.'
				});
			}
		} catch (error) {
			toast.error('Error', {
				description: 'Failed to submit donation. Please check your connection.'
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			handleSubmit({
				beneficiary: formData.get('beneficiary') as string,
				amount: Number(formData.get('amount')),
				paymentMethod: formData.get('paymentMethod') as string,
				accountNo: selectedAccount?.accountNumber || "",
			});
		}}>
			{/* Form fields */}
			<button type="submit" disabled={submitting}>
				{submitting ? 'Submitting...' : 'Submit Donation'}
			</button>
		</form>
	);
}
```

#### Example 3: Display Donation Plans

**File:** `app/(with-layout)/(detail)/donations/_components/DonationPlans.tsx`

**Pattern:** Fetch on mount with loading/error/empty states

```typescript
"use client";
import { useState, useEffect, useCallback } from 'react';
import { profileService } from '@/lib/services/profileService';
import { ErrorState } from '@/components/ErrorState';
import type { DonationPlanResponse } from '@/types';

export function DonationPlans() {
	const [plans, setPlans] = useState<DonationPlanResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlans = useCallback(async () => {
		setLoading(true);
		setError(null);

		const response = await profileService.getDonationPlans();

		if (response.success && response.data) {
			setPlans(response.data);
		} else {
			setError(response.error || 'Failed to load donation plans');
		}

		setLoading(false);
	}, []);

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	// Loading state
	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="h-20 bg-gray-200 rounded"></div>
					</div>
				))}
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<ErrorState
				title="Failed to Load Plans"
				description={error}
				type="error"
			>
				<button onClick={fetchPlans}>Retry</button>
			</ErrorState>
		);
	}

	// Empty state
	if (plans.length === 0) {
		return (
			<ErrorState
				title="No Active Donation Plans"
				description="You don't have any active donation plans yet."
				type="empty"
			/>
		);
	}

	// Success state
	return (
		<div className="space-y-4">
			{plans.map((plan) => (
				<div key={plan.planId} className="border rounded-lg p-4">
					<h3 className="font-semibold">{plan.planName}</h3>
					<p className="text-sm text-gray-600">
						Beneficiary: {plan.beneficiary}
					</p>
					<p className="text-sm">
						Amount: ${plan.amount} ({plan.frequency})
					</p>
					<span className="text-xs px-2 py-1 rounded bg-green-100">
						{plan.status}
					</span>
				</div>
			))}
		</div>
	);
}
```

#### Example 4: BCAN Request

**File:** `app/(with-layout)/portfolio/_components/BcanRequest.tsx`

**Pattern:** Action button with loading state

```typescript
"use client";
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { profileService } from '@/lib/services/profileService';

interface BcanRequestProps {
	accountNo: string;
}

export function BcanRequestButton({ accountNo }: BcanRequestProps) {
	const [submitting, setSubmitting] = useState(false);

	const handleRequest = async () => {
		setSubmitting(true);

		try {
			const response = await profileService.createBcanRequest(accountNo);

			if (response.success && response.data) {
				toast.success('BCAN Request Submitted', {
					description: `Request ID: ${response.data.requestId}. Status: ${response.data.status}`
				});
			} else {
				toast.error('Request Failed', {
					description: response.error || 'Unable to submit BCAN request.'
				});
			}
		} catch (error) {
			toast.error('Error', {
				description: 'Failed to submit request. Please try again.'
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Button
			onClick={handleRequest}
			disabled={submitting}
			variant="outline"
		>
			{submitting ? 'Requesting...' : 'Request BCAN'}
		</Button>
	);
}
```

---

## State Management

### User Store Updates

**File:** `/stores/userStore.ts`

**Add User Profile Fields:**

```typescript
import { create } from "zustand";
import type { UserInfoResponse } from "@/types";

interface UserState {
	// Existing fields
	email: string;
	mobile: string;

	// New fields from API
	profileId: string | null;
	name: string | null;
	icNumber: string | null;
	nationality: string | null;
	dateOfBirth: string | null;
	address: string | null;
	postalCode: string | null;
	country: string | null;

	// Methods
	setUserData: (data: Partial<UserInfoResponse>) => void;
	clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
	// Initial state
	email: "",
	mobile: "",
	profileId: null,
	name: null,
	icNumber: null,
	nationality: null,
	dateOfBirth: null,
	address: null,
	postalCode: null,
	country: null,

	// Set user data from API response
	setUserData: (data) => set((state) => ({
		...state,
		...data,
	})),

	// Clear user data on logout
	clearUserData: () => set({
		email: "",
		mobile: "",
		profileId: null,
		name: null,
		icNumber: null,
		nationality: null,
		dateOfBirth: null,
		address: null,
		postalCode: null,
		country: null,
	}),
}));
```

### Trading Account Store Updates

**File:** `/stores/tradingAccountStore.ts`

**Replace Mock Data with API Data:**

```typescript
import { create } from "zustand";
import { profileService } from "@/lib/services/profileService";
import type { TradingAccount } from "@/types";

interface TradingAccountState {
	accounts: TradingAccount[];
	selectedAccount: TradingAccount | null;
	loading: boolean;
	error: string | null;

	// Actions
	fetchAccounts: () => Promise<void>;
	setSelectedAccount: (account: TradingAccount) => void;
	clearAccounts: () => void;
}

export const useTradingAccountStore = create<TradingAccountState>((set) => ({
	accounts: [],
	selectedAccount: null,
	loading: false,
	error: null,

	// Fetch accounts from API
	fetchAccounts: async () => {
		set({ loading: true, error: null });

		try {
			const response = await profileService.getUserAccounts();

			if (response.success && response.data) {
				set({
					accounts: response.data,
					loading: false,
					error: null,
				});
			} else {
				set({
					loading: false,
					error: response.error || 'Failed to load accounts'
				});
			}
		} catch (error) {
			set({
				loading: false,
				error: 'Network error. Please try again.'
			});
		}
	},

	setSelectedAccount: (account) => set({ selectedAccount: account }),

	clearAccounts: () => set({
		accounts: [],
		selectedAccount: null,
		loading: false,
		error: null,
	}),
}));
```

---

## Testing Checklist

### API Integration Tests

- [ ] **getUserInfo** - Returns user profile data
- [ ] **getTradingInfo** - Returns trading information
- [ ] **getUserAccounts** - Returns list of trading accounts
- [ ] **createBcanRequest** - Submits BCAN request successfully
- [ ] **getDonationPlans** - Returns active donation plans
- [ ] **submitDonation** - Submits new donation successfully
- [ ] **cancelDonation** - Cancels existing donation
- [ ] **getClientServiceContact** - Returns contact info (no auth)
- [ ] **getCentralDealingDeskContact** - Returns contact info (no auth)

### Component Tests

- [ ] User info displays after app load
- [ ] Trading accounts load and display correctly
- [ ] Donation form submission works with loading state
- [ ] Donation form shows error on API failure
- [ ] Donation plans display with loading/error/empty states
- [ ] BCAN request button shows loading state
- [ ] BCAN request shows success toast
- [ ] Account store fetches and updates correctly

### Error Scenarios

- [ ] 401 Unauthorized - Shows login prompt
- [ ] 404 Not Found - Shows user-friendly error
- [ ] 500 Server Error - Shows retry option
- [ ] Network failure - Shows connection error
- [ ] Empty response - Shows empty state
- [ ] Partial failure in Promise.allSettled - Handles gracefully

### State Management Tests

- [ ] User store updates with API data
- [ ] Trading account store replaces mock data
- [ ] Selected account persists across navigation
- [ ] Store clears on logout
- [ ] Multiple components can access same store data

---

## Migration from Mock Data

### Current Mock Data Locations

1. **Trading Account Store** (`stores/tradingAccountStore.ts`)
   - Currently has hardcoded accounts array
   - Replace with `fetchAccounts()` API call

2. **User Store** (`stores/userStore.ts`)
   - Currently has minimal user data
   - Enhance with full user profile fields

### Migration Strategy

**Phase 1: Side-by-side**
- Keep mock data as fallback
- Add API integration with feature flag
- Test thoroughly in development

**Phase 2: Gradual rollout**
- Enable API integration for internal users
- Monitor for errors
- Keep mock data as emergency fallback

**Phase 3: Complete migration**
- Remove mock data completely
- API integration becomes primary source
- Keep error states for API failures

**Feature Flag Example:**

```typescript
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_PROFILE_API === "true";

const fetchData = async () => {
	if (USE_REAL_API) {
		const response = await profileService.getUserInfo();
		// ... handle API response
	} else {
		// Use mock data
		setData(mockUserData);
	}
};
```

---

## Summary

### Implementation Checklist

```
✅ Step 1: Define missing endpoints in /lib/api/endpoints/profile.ts
✅ Step 2: Add TypeScript types in /types/index.ts
✅ Step 3: Create service functions in /lib/services/profileService.ts
✅ Step 4: Update components to use service layer
✅ Step 5: Update Zustand stores with API integration
✅ Step 6: Replace mock data with API calls
✅ Step 7: Test all endpoints and error scenarios
✅ Step 8: Update documentation
```

### Core Principles

1. **Follow Three-Layer Architecture**: Components → Services → API Client
2. **Use Component State by Default**: Only Zustand for truly global data
3. **Consistent Error Handling**: Always handle loading/error/success states
4. **Type Safety**: Define all Request/Response types
5. **JSDoc Documentation**: Document all service functions and endpoints

### Reference Files

- **API Client:** `/lib/api/client.ts`
- **Endpoints:** `/lib/api/endpoints/profile.ts`
- **Service:** `/lib/services/profileService.ts`
- **Types:** `/types/index.ts`
- **Example Component:** `/app/(minimal)/sidebar/MySubscriptions.tsx`

---

**Last Updated:** 2025-12-28
**Status:** 8/12 endpoints implemented (67%)
**Next Steps:** Implement getUserInfo() and getTradingInfo() endpoints
