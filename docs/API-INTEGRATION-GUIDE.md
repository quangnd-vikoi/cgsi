# API Integration Guide

> **Quick Reference Guide for Implementing New API Endpoints**
>
> This document captures the established patterns, conventions, and rules for integrating APIs in the CGSI iTrade Portal codebase.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Pattern Reference](#pattern-reference)
5. [State Management Rules](#state-management-rules)
6. [Error Handling](#error-handling)
7. [TypeScript Conventions](#typescript-conventions)
8. [Testing Checklist](#testing-checklist)

---

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│     UI Components (React)           │
│  - Fetch data on mount              │
│  - Display loading/error/success    │
│  - Component-level useState         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Service Layer (/lib/services/)    │
│  - Business logic                   │
│  - API calls                        │
│  - Response normalization           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   API Client (/lib/api/client.ts)   │
│  - HTTP wrapper                     │
│  - Auth headers                     │
│  - Error handling                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│        Backend API                  │
└─────────────────────────────────────┘
```

### Why This Pattern?

- ✅ **Service Layer**: Reusable, testable, single source of truth
- ✅ **Component State**: Data freshness, no unnecessary global state
- ❌ **NOT Zustand**: Only for truly global state (user, auth, trading accounts)
- ❌ **NOT React Query/SWR**: Project doesn't use these libraries

---

## File Structure

### When Adding a New API Domain (e.g., "Subscription")

```
lib/
├── api/
│   ├── client.ts                          # ✅ Already exists - don't modify unless adding new features
│   ├── config.ts                          # ✅ Already exists - contains API_BASE_URL
│   ├── types.ts                           # ✅ Already exists - contains APIResponse<T>
│   └── endpoints/
│       ├── index.ts                       # ✅ Update: Export new endpoints
│       ├── subscription.ts                # 🆕 CREATE: New endpoint definitions
│       ├── profile.ts                     # ✅ Example reference
│       └── auth.ts                        # ✅ Example reference
├── services/
│   ├── subscriptionService.ts             # 🆕 CREATE: Service layer for subscription APIs
│   ├── profileService.ts                  # ✅ Example reference
│   └── authService.ts                     # ✅ Example reference
└── ...

types/
└── index.ts                               # ✅ Update: Add API response types

app/
└── (your-feature)/
    └── YourComponent.tsx                  # ✅ Update: Use the service
```

---

## Step-by-Step Implementation

### Step 1: Define Endpoint Paths

**File:** `/lib/api/endpoints/yourDomain.ts`

```typescript
/**
 * Your Domain API Endpoints
 * All paths are relative - base URL prepended in index.ts via withBaseUrl()
 *
 * Base URL: https://stgitrade.cgsi.com.sg/portal (from API_BASE_URL)
 * Source: your-api-spec.json
 *
 * Authentication:
 * - All endpoints require Bearer token (useAuth: true)
 */
export const yourDomainEndpoints = {
	/**
	 * Get all items
	 *
	 * GET /api/v1/items
	 *
	 * @returns ItemListResponse - Array of items
	 * @requires Authentication - Bearer token
	 *
	 * @example
	 * const response = await fetchAPI<ItemListResponse>(
	 *   ENDPOINTS.getItems(),
	 *   { useAuth: true }
	 * );
	 */
	getItems: () => `/api/v1/items`,

	/**
	 * Get item by ID
	 *
	 * GET /api/v1/items/{id}
	 *
	 * @param id - Item ID
	 * @returns ItemDetailResponse - Item details
	 * @requires Authentication - Bearer token
	 */
	getItemById: (id: string) => `/api/v1/items/${id}`,

	/**
	 * Create new item
	 *
	 * POST /api/v1/items
	 *
	 * @param body - ItemCreateRequest
	 * @returns ItemDetailResponse - Created item
	 */
	createItem: () => `/api/v1/items`,
} as const;
```

**Key Points:**
- ✅ Use arrow functions for endpoints
- ✅ Add JSDoc comments with HTTP method, path, params, returns
- ✅ Include `@example` for complex endpoints
- ✅ Use `as const` for type safety
- ✅ Document authentication requirements

**File:** `/lib/api/endpoints/index.ts`

```typescript
import { yourDomainEndpoints } from "./yourDomain";

export const ENDPOINTS = {
	// ... existing endpoints
	...yourDomainEndpoints,
};
```

---

### Step 2: Define TypeScript Types

**File:** `/types/index.ts`

```typescript
// ============================================
// Your Domain Types
// ============================================

/**
 * Request type for creating an item
 */
export interface ItemCreateRequest {
	name: string;
	description: string;
	amount: number;
}

/**
 * Response type for item details
 */
export interface ItemDetailResponse {
	id: string;
	name: string;
	description: string;
	amount: number;
	createdAt: string;
	updatedAt: string;
}

/**
 * Response type for item list
 */
export interface ItemListResponse {
	items: ItemDetailResponse[];
	total: number;
}
```

**Key Points:**
- ✅ Group types by domain with comment headers
- ✅ Use descriptive names ending in `Request`, `Response`, `Dto`
- ✅ Match exact API response structure
- ✅ Use `string` for dates (API returns ISO strings)
- ✅ Use `?` for optional fields

---

### Step 3: Create Service Layer

**File:** `/lib/services/yourDomainService.ts`

```typescript
/**
 * Your Domain Service
 *
 * Handles all your-domain-related API calls.
 *
 * All functions return APIResponse<T> with consistent error handling.
 */

import { fetchAPI, postAPI, putAPI, deleteAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";
import type {
	ItemListResponse,
	ItemDetailResponse,
	ItemCreateRequest,
} from "@/types";

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Get all items
 *
 * @returns Array of items
 * @requires Authentication - Bearer token
 *
 * @example
 * const response = await getItems();
 * if (response.success && response.data) {
 *   console.log('Items:', response.data.items);
 * }
 */
export const getItems = async (): Promise<APIResponse<ItemListResponse>> => {
	return await fetchAPI<ItemListResponse>(ENDPOINTS.getItems(), {
		useAuth: true,
	});
};

/**
 * Get item by ID
 *
 * @param id - Item ID
 * @returns Item details
 * @requires Authentication - Bearer token
 */
export const getItemById = async (
	id: string
): Promise<APIResponse<ItemDetailResponse>> => {
	return await fetchAPI<ItemDetailResponse>(ENDPOINTS.getItemById(id), {
		useAuth: true,
	});
};

/**
 * Create new item
 *
 * @param itemData - Item creation data
 * @returns Created item details
 * @requires Authentication - Bearer token
 */
export const createItem = async (
	itemData: ItemCreateRequest
): Promise<APIResponse<ItemDetailResponse>> => {
	return await postAPI<ItemDetailResponse, ItemCreateRequest>(
		ENDPOINTS.createItem(),
		itemData,
		{ useAuth: true }
	);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if item exists
 *
 * @param id - Item ID to check
 * @returns Boolean indicating if item exists
 */
export const itemExists = async (id: string): Promise<boolean> => {
	const response = await getItemById(id);
	return response.success && response.data !== null;
};

// ============================================
// DEFAULT EXPORT
// ============================================

/**
 * Service object containing all your-domain-related functions
 */
export const yourDomainService = {
	getItems,
	getItemById,
	createItem,
	itemExists,
};

export default yourDomainService;
```

**Key Points:**
- ✅ All functions are `async` and return `Promise<APIResponse<T>>`
- ✅ Always use `useAuth: true` for authenticated endpoints
- ✅ Use `fetchAPI` for GET, `postAPI` for POST, `putAPI` for PUT, `deleteAPI` for DELETE
- ✅ Add JSDoc comments with description, params, returns, example
- ✅ Group functions with comment headers
- ✅ Export both individual functions AND service object
- ✅ Helper functions can combine multiple API calls

---

### Step 4: Integrate in Component

**Pattern A: Simple Fetch on Mount**

```typescript
"use client";
import { useState, useEffect, useCallback } from 'react';
import { yourDomainService } from '@/lib/services/yourDomainService';
import type { ItemDetailResponse } from '@/types';

export default function YourComponent() {
	const [items, setItems] = useState<ItemDetailResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchItems = useCallback(async () => {
		setLoading(true);
		setError(null);

		const response = await yourDomainService.getItems();

		if (response.success && response.data) {
			setItems(response.data.items);
		} else {
			setError(response.error || 'Failed to load items');
		}

		setLoading(false);
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			{items.map(item => (
				<div key={item.id}>{item.name}</div>
			))}
		</div>
	);
}
```

**Pattern B: With Skeleton Loading**

```typescript
if (loading) {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="animate-pulse flex gap-4">
					<div className="h-12 bg-gray-200 rounded flex-1"></div>
				</div>
			))}
		</div>
	);
}
```

**Pattern C: With Retry Button**

```typescript
if (error) {
	return (
		<ErrorState
			title="Oops, Something Went Wrong"
			description={error}
			type="error"
		>
			<Button onClick={fetchItems}>Retry</Button>
		</ErrorState>
	);
}
```

**Pattern D: Form Submission**

```typescript
const handleSubmit = async (formData: ItemCreateRequest) => {
	setSubmitting(true);

	try {
		const response = await yourDomainService.createItem(formData);

		if (response.success && response.data) {
			toast.success('Item Created', {
				description: `Successfully created ${response.data.name}`
			});
			router.push('/success');
		} else {
			toast.error('Creation Failed', {
				description: response.error || 'Please try again'
			});
		}
	} catch (error) {
		toast.error('Error', {
			description: 'Failed to create item'
		});
	} finally {
		setSubmitting(false);
	}
};
```

**Key Points:**
- ✅ Use `useCallback` for fetch functions
- ✅ Always have loading, error, and success states
- ✅ Use `toast` (Sonner) for action feedback
- ✅ Use `ErrorState` component for errors
- ✅ Use skeleton screens for initial loads
- ✅ Always handle both `.success` and `.error` from APIResponse

---

## Pattern Reference

### API Client Usage

```typescript
// GET request
const response = await fetchAPI<ResponseType>(
	ENDPOINTS.yourEndpoint(),
	{ useAuth: true }
);

// POST request
const response = await postAPI<ResponseType, RequestType>(
	ENDPOINTS.yourEndpoint(),
	requestBody,
	{ useAuth: true }
);

// PUT request
const response = await putAPI<ResponseType, RequestType>(
	ENDPOINTS.yourEndpoint(),
	requestBody,
	{ useAuth: true }
);

// DELETE request
const response = await deleteAPI<ResponseType>(
	ENDPOINTS.yourEndpoint(),
	{ useAuth: true }
);
```

### APIResponse Structure

```typescript
interface APIResponse<T> {
	success: boolean;    // true if HTTP 2xx and no error
	data: T | null;      // Response data if success, null if error
	error: string | null; // Error message if failure, null if success
	statusCode: number;   // HTTP status code
}
```

**Always Check:**
```typescript
if (response.success && response.data) {
	// Success case - data is guaranteed to exist
	console.log(response.data);
} else {
	// Error case - show response.error
	console.error(response.error);
}
```

### Parallel API Calls

```typescript
// Method 1: Promise.allSettled (graceful partial failure)
const [result1, result2] = await Promise.allSettled([
	service.getItems(),
	service.getUsers(),
]);

if (result1.status === "fulfilled" && result1.value.success) {
	setItems(result1.value.data);
}

// Method 2: Promise.all (all or nothing)
const [response1, response2] = await Promise.all([
	service.getItems(),
	service.getUsers(),
]);

if (response1.success && response2.success) {
	// Both succeeded
}
```

**Use `Promise.allSettled` when:**
- One API failing shouldn't block the other
- Example: Fetching multiple subscription types

**Use `Promise.all` when:**
- All APIs must succeed together
- Example: Submitting a form that requires multiple API calls

---

## State Management Rules

### ✅ Use Component State (useState) When:

- Data is fetch-on-demand
- Data is page-specific
- No cross-component sharing needed
- Examples: subscription list, user profile details, form data

```typescript
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### ✅ Use Zustand Store When:

- Data is truly global (used across many components)
- Persistent across navigation
- Examples: authenticated user, trading accounts, theme

```typescript
// stores/yourStore.ts
import { create } from "zustand";

interface YourState {
	data: DataType | null;
	setData: (data: DataType) => void;
}

export const useYourStore = create<YourState>((set) => ({
	data: null,
	setData: (data) => set({ data }),
}));
```

### ❌ DON'T Use Zustand When:

- Data can be fetched on mount
- Only one component needs it
- Data changes frequently

---

## Error Handling

### Component-Level Error Handling

```typescript
const fetchData = async () => {
	setLoading(true);
	setError(null);

	try {
		const response = await service.getData();

		if (response.success && response.data) {
			setData(response.data);
		} else {
			setError(response.error || 'Failed to load data');
		}
	} catch (error) {
		// Network errors, parsing errors
		setError('Network error. Please try again.');
	} finally {
		setLoading(false);
	}
};
```

### Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Operation Successful', {
	description: 'Your changes have been saved.'
});

// Error
toast.error('Operation Failed', {
	description: response.error || 'Please try again later.'
});

// Info
toast.info('Please Note', {
	description: 'This action cannot be undone.'
});
```

### Error Messages

**Be specific but user-friendly:**
```typescript
// ❌ Bad
"Error"
"Failed"

// ✅ Good
"Failed to load subscriptions. Please try again."
"Unable to submit subscription. Please check your connection."
"Session expired. Please log in again."
```

---

## TypeScript Conventions

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Request DTO | `{Domain}{Action}Request` | `UserSubscriptionSubmissionRequest` |
| Response DTO | `{Domain}{Type}Response` | `UserProductSubsListResponse` |
| Data DTO | `{Domain}{Type}Dto` | `UserProductSubscriptionDto` |
| Endpoint Function | `{action}{Resource}` | `getUserSubscriptions()` |
| Service Function | `{action}{Resource}` | `submitProductSubscription()` |

### Type Imports

```typescript
// ✅ Use type imports
import type { UserSubscriptionResponse } from '@/types';
import type { APIResponse } from '@/lib/api/types';

// ❌ Don't import types as values
import { UserSubscriptionResponse } from '@/types';
```

### Optional vs Required

```typescript
// Backend always returns field
interface User {
	id: string;         // required
	email: string;      // required
}

// Backend may not return field
interface Subscription {
	id: string;
	endTime?: string;   // optional - use ?
}
```

---

## Testing Checklist

### Before Committing

- [ ] **Endpoints defined** in `/lib/api/endpoints/{domain}.ts`
- [ ] **Types defined** in `/types/index.ts`
- [ ] **Service created** in `/lib/services/{domain}Service.ts`
- [ ] **Components updated** to use service
- [ ] **JSDoc comments** added to all functions
- [ ] **Error handling** implemented (loading/error/success states)
- [ ] **Toast notifications** for user actions
- [ ] **TypeScript compiles** with no errors

### Test Scenarios

- [ ] Loading state displays correctly
- [ ] Error state displays correctly
- [ ] Empty state displays correctly (no data)
- [ ] Success state displays data
- [ ] Retry button works (refetches data)
- [ ] Form submission shows loading state
- [ ] Form submission handles errors
- [ ] Form submission shows success toast
- [ ] Network failure handled gracefully

---

## Common Patterns Checklist

### New API Domain Implementation

```
✅ Step 1: Create endpoint definitions
   📁 lib/api/endpoints/yourDomain.ts

✅ Step 2: Export endpoints
   📁 lib/api/endpoints/index.ts (add to ENDPOINTS)

✅ Step 3: Define TypeScript types
   📁 types/index.ts (add Request/Response types)

✅ Step 4: Create service layer
   📁 lib/services/yourDomainService.ts

✅ Step 5: Update component
   📁 app/(your-feature)/YourComponent.tsx
```

### Component Integration

```
✅ Import service
   import { yourDomainService } from '@/lib/services/yourDomainService';

✅ Define state
   const [data, setData] = useState(...);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

✅ Create fetch function
   const fetchData = useCallback(async () => { ... }, []);

✅ Fetch on mount
   useEffect(() => { fetchData(); }, [fetchData]);

✅ Render states
   if (loading) return <LoadingSkeleton />;
   if (error) return <ErrorState />;
   return <SuccessView />;
```

---

## Real Examples from Codebase

### Example 1: Subscription Service

**Endpoints:** `/lib/api/endpoints/subscription.ts`
**Service:** `/lib/services/subscriptionService.ts`
**Component:** `/app/(minimal)/sidebar/MySubscriptions.tsx`

**Pattern Used:**
- Component-level state (useState)
- Fetch on mount (useEffect + useCallback)
- Loading skeleton
- Error state with retry
- Empty state

### Example 2: Profile Service

**Endpoints:** `/lib/api/endpoints/profile.ts`
**Service:** `/lib/services/profileService.ts`
**Store:** `/stores/userStore.ts`

**Pattern Used:**
- Zustand store (global user profile)
- Service layer for API calls
- Store setters to cache profile data

### Example 3: Auth Service

**Endpoints:** `/lib/api/endpoints/auth.ts`
**Service:** `/lib/services/authService.ts`

**Pattern Used:**
- Token management
- No React state (pure service functions)
- Called from login forms

---

## Quick Reference: File Templates

### Endpoint Template

```typescript
export const yourDomainEndpoints = {
	getItems: () => `/api/v1/items`,
	getItemById: (id: string) => `/api/v1/items/${id}`,
	createItem: () => `/api/v1/items`,
} as const;
```

### Service Template

```typescript
import { fetchAPI, postAPI } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { APIResponse } from "@/lib/api/types";

export const getItems = async (): Promise<APIResponse<ItemListResponse>> => {
	return await fetchAPI<ItemListResponse>(ENDPOINTS.getItems(), {
		useAuth: true,
	});
};

export const yourDomainService = {
	getItems,
};

export default yourDomainService;
```

### Component Template

```typescript
"use client";
import { useState, useEffect, useCallback } from 'react';
import { yourDomainService } from '@/lib/services/yourDomainService';

export default function YourComponent() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		const response = await yourDomainService.getItems();

		if (response.success && response.data) {
			setData(response.data);
		} else {
			setError(response.error || 'Failed to load');
		}

		setLoading(false);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return <div>{/* Success state */}</div>;
}
```

---

## Summary

### Core Principles

1. **Three-Layer Architecture**: Components → Services → API Client
2. **Service Layer First**: Always create service functions, don't call API directly from components
3. **Component State by Default**: Use Zustand only for truly global data
4. **Consistent Error Handling**: Always handle loading/error/success states
5. **Type Safety**: Define all Request/Response types in `/types/index.ts`
6. **Documentation**: JSDoc all service functions and endpoints

### Golden Rule

> **If you're about to implement an API:**
>
> 1. Check if similar patterns exist (profile, auth, subscription)
> 2. Follow the same structure
> 3. Document with JSDoc
> 4. Test all states (loading/error/success)

---

## Need Help?

**Reference Files:**
- API Client: `/lib/api/client.ts`
- Example Endpoints: `/lib/api/endpoints/subscription.ts`
- Example Service: `/lib/services/subscriptionService.ts`
- Example Component: `/app/(minimal)/sidebar/MySubscriptions.tsx`

**Common Issues:**
- Endpoint returns 401: Check `useAuth: true` flag
- Type errors: Ensure types match exact API response structure
- Data not updating: Check `useCallback` dependencies
- Toast not showing: Import from `sonner` not `@/components/ui/toaster`
