# Donation API Implementation Plan

**Status:** Ready for Implementation
**Created:** 2026-01-09
**Follows Pattern:** CGSI iTrade Portal API Architecture
**Reference:** API-INTEGRATION-GUIDE.md

---

## 📋 Overview

This plan outlines the **complete implementation** of the Donation feature, integrating with the existing Profile API donation endpoints:

1. **GET** `/profile/api/v1/donation/plan` - Retrieve active donation plans
2. **POST** `/profile/api/v1/donation/submission` - Submit donation (one-time or recurring)
3. **POST** `/profile/api/v1/donation/cancel` - Cancel recurring donation

### Current Status

**API Layer:**
- ✅ Endpoints defined in `lib/api/endpoints/profile.ts`
- ✅ Service methods implemented in `lib/services/profileService.ts`
- ✅ TypeScript types defined in `types/index.ts`

**UI Layer:**
- ✅ Donation page exists at `app/(with-layout)/(detail)/donations/page.tsx`
- ✅ Two form components: `OnetimeForm.tsx` and `RecurringForm.tsx`
- ✅ Custom hook `useDonationForm.ts` for form state management
- ⚠️ **NOT CONNECTED** - Forms do not call actual API endpoints

### Implementation Goal

**Connect UI to API:**
- Integrate `useDonationForm` hook with `profileService` donation methods
- Fetch donation plans on page load
- Submit donations with proper error handling
- Display success/error states with toast notifications
- Handle form validation and API responses

---

## 🎯 Implementation Checklist

### Phase 1: Service Integration ✅ (Already Complete)
- [x] Donation endpoints defined in `lib/api/endpoints/profile.ts`
- [x] Service methods in `lib/services/profileService.ts`:
  - `getDonationPlans()` - Fetch available plans
  - `submitDonation(data)` - Submit donation
  - `cancelDonation(id)` - Cancel recurring donation
- [x] TypeScript types in `types/index.ts`

### Phase 2: UI Enhancement (Needs Implementation)
- [ ] Fetch donation plans on mount
- [ ] Display available donation plans in UI
- [ ] Integrate `useDonationForm` with API calls
- [ ] Add loading states during API calls
- [ ] Add error handling with user-friendly messages
- [ ] Add success toast notifications
- [ ] Add amount validation against available plans
- [ ] Add account selection for multi-account users
- [ ] Test one-time donation flow
- [ ] Test recurring donation flow
- [ ] Test donation cancellation flow

### Phase 3: Testing & Validation
- [ ] Test with real API endpoints
- [ ] Validate form data before submission
- [ ] Test error scenarios (network failure, invalid data)
- [ ] Test loading states
- [ ] Test toast notifications
- [ ] Test on mobile devices

---

## 📁 File Structure

```
app/(with-layout)/(detail)/donations/
├── page.tsx                      ← UPDATE: Add plan fetching logic
├── _components/
│   ├── OnetimeForm.tsx          ← UPDATE: Connect to submitDonation API
│   └── RecurringForm.tsx        ← UPDATE: Connect to submitDonation API
└── _hooks/
    └── useDonationForm.ts       ← UPDATE: Add API integration

lib/
├── api/endpoints/
│   └── profile.ts               ✅ COMPLETE (donation endpoints exist)
├── services/
│   └── profileService.ts        ✅ COMPLETE (donation methods exist)
└── types/
    └── index.ts                 ✅ COMPLETE (donation types exist)
```

---

## 🔧 API Reference

### 1. Get Donation Plans

**Endpoint:** `GET /profile/api/v1/donation/plan`

**Service Method:**
```typescript
getDonationPlans(): Promise<APIResponse<DonationPlanResponse[]>>
```

**Response Type:**
```typescript
interface DonationPlanResponse {
  id: number;
  currency: string;
  amount: number;
  start: string;    // ISO date string
  end: string;      // ISO date string
}
```

**Usage:**
```typescript
const response = await profileService.getDonationPlans();

if (response.success && response.data) {
  // Plans available: response.data is DonationPlanResponse[]
  const plans = response.data;
} else {
  // Error: response.error contains error message
  console.error(response.error);
}
```

---

### 2. Submit Donation

**Endpoint:** `POST /profile/api/v1/donation/submission`

**Service Method:**
```typescript
submitDonation(data: DonationSubmissionRequest): Promise<APIResponse<DonationSubmissionResponse>>
```

**Request Type:**
```typescript
interface DonationSubmissionRequest {
  accountNo: string;      // 7-digit account number, pattern: ^[0-9]{7}$
  amount?: number;        // Optional if using plan (minimum: 0)
  currency: string;       // "SGD", "USD", etc.
  paymentMethod: string;  // "PLAN" or "LS_ACCSET" (case-insensitive)
  paymentMode: string;    // "DONATE" (case-insensitive)
  months?: number;        // For recurring donations (number of months)
}
```

**Response Type:**
```typescript
interface DonationSubmissionResponse {
  isSuccess: boolean;
}
```

**Usage - One-Time Donation:**
```typescript
const donationData: DonationSubmissionRequest = {
  accountNo: "1234567",
  amount: 100.00,
  currency: "SGD",
  paymentMethod: "LS_ACCSET",  // Trust Account
  paymentMode: "DONATE",
  // months is omitted for one-time
};

const response = await profileService.submitDonation(donationData);

if (response.success && response.data?.isSuccess) {
  toast.success("Thank you!", "Your donation has been processed.");
} else {
  toast.error("Donation Failed", response.error || "Please try again.");
}
```

**Usage - Recurring Donation:**
```typescript
const donationData: DonationSubmissionRequest = {
  accountNo: "1234567",
  amount: 50.00,
  currency: "SGD",
  paymentMethod: "PLAN",       // Recurring plan
  paymentMode: "DONATE",
  months: 12,                  // 12-month recurring donation
};

const response = await profileService.submitDonation(donationData);
```

---

### 3. Cancel Donation

**Endpoint:** `POST /profile/api/v1/donation/cancel`

**Service Method:**
```typescript
cancelDonation(donationId: number): Promise<APIResponse<DonationCancelResponse>>
```

**Request Type:**
```typescript
interface DonationCancelRequest {
  id: number;
}
```

**Response Type:**
```typescript
interface DonationCancelResponse {
  isSuccess: boolean;
}
```

**Usage:**
```typescript
const response = await profileService.cancelDonation(12345);

if (response.success && response.data?.isSuccess) {
  toast.success("Donation Cancelled", "Your recurring donation has been cancelled.");
} else {
  toast.error("Cancellation Failed", response.error || "Please try again.");
}
```

---

## 💡 Implementation Guide

### Step 1: Fetch Donation Plans on Page Load

**File:** `app/(with-layout)/(detail)/donations/page.tsx`

Add state management and data fetching:

```typescript
"use client";
import { useState, useEffect } from "react";
import { profileService } from "@/lib/services/profileService";
import type { DonationPlanResponse } from "@/types";

const Donations = () => {
  const [plans, setPlans] = useState<DonationPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const response = await profileService.getDonationPlans();

      if (response.success && response.data) {
        setPlans(response.data);
      } else {
        setError(response.error || "Failed to load donation plans");
      }

      setLoading(false);
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div>Loading donation plans...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // Pass plans to child components
    <Tabs defaultValue="onetime">
      <TabsContent value="onetime">
        <OneTimeForm plans={plans} />
      </TabsContent>
      <TabsContent value="recurring">
        <RecurringForm plans={plans} />
      </TabsContent>
    </Tabs>
  );
};
```

---

### Step 2: Enhance useDonationForm Hook

**File:** `app/(with-layout)/(detail)/donations/_hooks/useDonationForm.ts`

Add API integration option:

```typescript
import { profileService } from "@/lib/services/profileService";
import type { DonationSubmissionRequest } from "@/types";

export interface UseDonationFormOptions {
  onSuccess?: (values: DonationFormValues) => void;
  onError?: (error: Error) => void;
  minAmount?: number;
  accountNo?: string;           // NEW: Selected account number
  donationType?: "onetime" | "recurring";  // NEW: Type of donation
  submitToAPI?: boolean;        // NEW: Whether to submit to API
}

export function useDonationForm(options: UseDonationFormOptions = {}) {
  const {
    onSuccess,
    onError,
    minAmount = 1.0,
    accountNo,
    donationType = "onetime",
    submitToAPI = false,
  } = options;

  // ... existing state ...

  // Enhanced submit handler with API integration
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
      if (submitToAPI && accountNo) {
        const donationData: DonationSubmissionRequest = {
          accountNo,
          amount,
          currency: "SGD",
          paymentMethod: paymentMethod === "now" ? "LS_ACCSET" : "PLAN",
          paymentMode: "DONATE",
          ...(donationType === "recurring" && { months: 12 }), // Example: 12 months
        };

        const response = await profileService.submitDonation(donationData);

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
    submitToAPI,
    onSuccess,
    onError,
    setShowValidationErrors
  ]);

  // ... rest of hook ...
}
```

---

### Step 3: Update OnetimeForm Component

**File:** `app/(with-layout)/(detail)/donations/_components/OnetimeForm.tsx`

Connect to API:

```typescript
"use client";
import { useDonationForm } from "../_hooks/useDonationForm";
import { toast } from "sonner";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import type { DonationPlanResponse } from "@/types";

interface OnetimeFormProps {
  plans: DonationPlanResponse[];
}

const OneTimeForm = ({ plans }: OnetimeFormProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const { selectedAccount } = useTradingAccountStore();

  const {
    setAmount,
    paymentMethod,
    setPaymentMethod,
    agreed,
    setAgreed,
    errors,
    handleSubmit,
    isSubmitting,
  } = useDonationForm({
    accountNo: selectedAccount?.accountNo,
    donationType: "onetime",
    submitToAPI: true,  // Enable API submission
    onSuccess: (values) => {
      toast.success(
        "Thank you!",
        "Your donation will go a long way in uplifting lives. We truly appreciate it."
      );
      // Reset form
      setInputValue("");
      setAmount(undefined);
      setPaymentMethod("");
      setAgreed(false);
    },
    onError: (error) => {
      toast.error(
        "Donation Failed",
        error.message || "Something went wrong. Please try again later."
      );
    },
    minAmount: 1.0,
  });

  const handleDonate = async () => {
    const success = await handleSubmit();
    if (!success && !errors.amount && !errors.paymentMethod && !errors.terms) {
      toast.error("Error", "Please complete all required fields.");
    }
  };

  // Display available plans
  const displayPlans = plans.filter(plan =>
    new Date(plan.start) <= new Date() && new Date(plan.end) >= new Date()
  );

  return (
    <div className="donation-form">
      {/* Display available plans */}
      {displayPlans.length > 0 && (
        <div className="suggested-amounts">
          <Label>Suggested Amounts:</Label>
          <div className="flex gap-2">
            {displayPlans.map(plan => (
              <Button
                key={plan.id}
                variant="outline"
                onClick={() => {
                  setAmount(plan.amount);
                  setInputValue(plan.amount.toString());
                }}
              >
                {plan.currency} ${plan.amount}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div className="amount-input">
        <Label>Donation Amount (SGD)</Label>
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setAmount(parseFloat(e.target.value) || undefined);
          }}
          placeholder="Enter amount"
          className={cn(errors.amount && "border-status-error")}
        />
        {errors.amount && (
          <p className="text-status-error text-sm">
            Please enter a valid amount (min SGD 1.00)
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="payment-method">
        <Label>Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="now" id="paynow" />
            <Label htmlFor="paynow">PayNow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trust" id="trust" />
            <Label htmlFor="trust">Trust Account</Label>
          </div>
        </RadioGroup>
        {errors.paymentMethod && (
          <p className="text-status-error text-sm">
            Please select a payment method
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="terms-agreement">
        <Checkbox checked={agreed} onCheckedChange={setAgreed} />
        <Label>I agree to the Terms & Conditions</Label>
        {errors.terms && (
          <p className="text-status-error text-sm">
            Please acknowledge the Terms & Conditions to proceed
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleDonate}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Donate Now"
        )}
      </Button>
    </div>
  );
};

export default OneTimeForm;
```

---

### Step 4: Update RecurringForm Component

**File:** `app/(with-layout)/(detail)/donations/_components/RecurringForm.tsx`

Similar pattern to OnetimeForm, but with `donationType: "recurring"`:

```typescript
const {
  // ... form state
} = useDonationForm({
  accountNo: selectedAccount?.accountNo,
  donationType: "recurring",  // Different type
  submitToAPI: true,
  onSuccess: (values) => {
    toast.success(
      "Recurring Donation Set Up",
      "Thank you for your commitment to giving back to the community!"
    );
  },
  onError: (error) => {
    toast.error("Setup Failed", error.message || "Please try again.");
  },
  minAmount: 1.0,
});
```

Add fields for:
- **Months selection** (dropdown or radio buttons for 6/12/24 months)
- **Start date** (optional)
- **End date** (calculated from months)

---

## 🎨 UI/UX Enhancements

### Loading State
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-enhanced-blue" />
      <p className="ml-2">Loading donation plans...</p>
    </div>
  );
}
```

### Error State
```typescript
if (error) {
  return (
    <ErrorState
      title="Unable to Load Donation Plans"
      description={error}
      type="error"
    >
      <Button onClick={fetchPlans}>Retry</Button>
    </ErrorState>
  );
}
```

### Success Toast
```typescript
toast.success("Thank you!", {
  description: "Your donation will go a long way in uplifting lives.",
  duration: 5000,
});
```

### Error Toast
```typescript
toast.error("Donation Failed", {
  description: "Something went wrong. Please try again later.",
  duration: 5000,
});
```

---

## 🧪 Testing Scenarios

### 1. One-Time Donation Flow
1. Navigate to Donations page
2. Select "One-Time Donation" tab
3. Enter amount (e.g., $100)
4. Select payment method (PayNow or Trust Account)
5. Check "I agree to Terms & Conditions"
6. Click "Donate Now"
7. **Expected:** Loading state → Success toast → Form reset

### 2. Recurring Donation Flow
1. Navigate to Donations page
2. Select "Recurring Donation" tab
3. Enter amount (e.g., $50)
4. Select duration (e.g., 12 months)
5. Select payment method
6. Check terms agreement
7. Click "Set Up Recurring Donation"
8. **Expected:** Loading state → Success toast → Form reset

### 3. Validation Errors
1. Click "Donate Now" without filling form
2. **Expected:** Error messages under each field
3. Fill amount but not payment method
4. **Expected:** Payment method error only
5. Fill all but don't check terms
6. **Expected:** Terms agreement error only

### 4. API Error Handling
1. Submit donation with invalid account number
2. **Expected:** Error toast with message from API
3. Submit donation while offline
4. **Expected:** Network error toast

### 5. Loading States
1. Submit donation
2. **Expected:** Button shows "Processing..." with spinner
3. **Expected:** Button is disabled during submission
4. **Expected:** User cannot interact with form

---

## 📝 Validation Rules

### Amount
- **Minimum:** SGD 1.00
- **Type:** Positive number
- **Pattern:** Accept decimals (e.g., 100.50)

### Account Number
- **Pattern:** `^[0-9]{7}$` (7 digits)
- **Required:** Yes
- **Source:** Selected trading account from store

### Payment Method
- **Values:** `"PLAN"` (recurring) or `"LS_ACCSET"` (trust account)
- **Required:** Yes
- **Case-insensitive:** API accepts both cases

### Payment Mode
- **Value:** `"DONATE"`
- **Required:** Yes
- **Fixed:** Always "DONATE"

### Currency
- **Default:** `"SGD"`
- **Options:** SGD, USD (based on available plans)

### Months (Recurring Only)
- **Type:** Integer
- **Options:** 6, 12, 24
- **Required:** Only for recurring donations

---

## 🔐 Authentication

All donation endpoints require authentication:
```typescript
const response = await profileService.submitDonation(data);
// Internally uses: useAuth: true
```

**Bearer Token:**
- Retrieved from `authService.getAccessToken()`
- Automatically attached to requests by `fetchAPI()` and `postAPI()`
- Token refresh handled by API client

**No Token:**
- API returns 401 Unauthorized
- User redirected to login page (handled by middleware)

---

## ⚠️ Error Handling

### Common Errors

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| 400 | Invalid Request | "Invalid donation details. Please check your input." |
| 401 | Unauthorized | "Session expired. Please log in again." |
| 404 | No Accounts Linked | "No trading account found. Please link an account first." |
| 422 | Validation Exception | "Please check your donation details and try again." |
| 500 | Server Error | "System error. Please try again later." |

### Error Handling Pattern
```typescript
const response = await profileService.submitDonation(data);

if (!response.success) {
  // response.error contains error message
  const errorMessage = response.error || "An unexpected error occurred";

  // response.statusCode contains HTTP status code
  if (response.statusCode === 401) {
    // Redirect to login
    router.push("/login");
  } else if (response.statusCode === 404) {
    toast.error("No Account Found", "Please link a trading account first.");
  } else {
    toast.error("Donation Failed", errorMessage);
  }

  return;
}

// Success case
if (response.data?.isSuccess) {
  toast.success("Thank you!", "Your donation has been processed.");
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interaction                        │
│  (OnetimeForm.tsx / RecurringForm.tsx)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              useDonationForm Hook                           │
│  - Form state management                                    │
│  - Validation                                               │
│  - API call orchestration                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           profileService.submitDonation()                   │
│  (lib/services/profileService.ts)                          │
│  - Prepare request payload                                  │
│  - Call postAPI() with auth                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│               postAPI() - API Client                        │
│  (lib/api/client.ts)                                       │
│  - Attach Bearer token                                      │
│  - Send HTTP POST request                                   │
│  - Handle response/errors                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│        Backend API: POST /donation/submission               │
│  - Validate request                                         │
│  - Process donation                                         │
│  - Return success/failure                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                APIResponse<T> Returned                      │
│  { success: true, data: {...}, error: null }               │
│  OR                                                         │
│  { success: false, data: null, error: "..." }              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              UI Updates                                     │
│  - Show success toast / error toast                         │
│  - Reset form / maintain form state                         │
│  - Update loading state                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All TypeScript compiles without errors
- [ ] No console errors or warnings
- [ ] All forms submit successfully in dev environment
- [ ] Toast notifications display correctly
- [ ] Loading states work properly
- [ ] Error handling tested with mock errors
- [ ] Mobile responsive design verified

### Testing
- [ ] Test with real API endpoints (staging)
- [ ] Test all validation rules
- [ ] Test with multiple accounts
- [ ] Test offline behavior
- [ ] Test with expired token (401 handling)
- [ ] Test with invalid data (422 handling)

### Post-Deployment
- [ ] Monitor API error logs
- [ ] Verify donation submissions in backend
- [ ] Check analytics for completion rate
- [ ] Gather user feedback

---

## 📖 Key Differences: One-Time vs Recurring

| Feature | One-Time Donation | Recurring Donation |
|---------|-------------------|-------------------|
| **Payment Method** | `"LS_ACCSET"` (Trust Account) | `"PLAN"` (Recurring Plan) |
| **Months Field** | Not included | Required (6/12/24) |
| **UI Flow** | Simple one-step | Multi-step with duration |
| **Success Message** | "Thank you for your donation" | "Recurring donation set up" |
| **Cancel Option** | N/A | Can be cancelled later |

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ User can view available donation plans
- ✅ User can submit one-time donation
- ✅ User can set up recurring donation
- ✅ User can select payment method
- ✅ User receives confirmation toast
- ✅ Form validates before submission
- ✅ Errors display user-friendly messages

### Non-Functional Requirements
- ✅ Response time < 3 seconds
- ✅ Mobile-responsive UI
- ✅ Accessible (keyboard navigation, screen readers)
- ✅ Loading states prevent double submission
- ✅ Graceful error handling
- ✅ Secure token handling

---

## 📚 Reference Files

### Existing Implementation
- **Endpoints:** `/lib/api/endpoints/profile.ts` (lines 97-153)
- **Service:** `/lib/services/profileService.ts` (lines 63-87)
- **Types:** `/types/index.ts` (Donation types section)
- **UI:** `/app/(with-layout)/(detail)/donations/`

### API Documentation
- **Swagger Spec:** `/docs/swagger/demo-api/iTrade-ProfileAPI.yaml`
- **Complete API List:** `/docs/rules/API-Complete-List.md`
- **API Integration Guide:** `/docs/flows/API-INTEGRATION-GUIDE.md`

### Design Patterns
- **Service Layer Pattern:** Three-layer architecture (Component → Service → API Client)
- **Error Handling:** Consistent APIResponse<T> pattern
- **State Management:** Component-level state (no Zustand needed)

---

## 💡 Pro Tips

1. **Use Existing Patterns:**
   - Follow the same pattern as subscription/profile implementations
   - Reuse error handling logic
   - Use consistent toast notifications

2. **Account Selection:**
   - Get selected account from `useTradingAccountStore()`
   - Validate account number before submission
   - Handle users with no linked accounts

3. **Form Reset:**
   - Clear form after successful submission
   - Don't reset on error (let user retry)
   - Provide visual feedback for reset

4. **Testing:**
   - Test with Postman first before UI integration
   - Use mock data for development
   - Test edge cases (zero amount, special characters)

5. **Performance:**
   - Fetch plans once on mount (not on every render)
   - Debounce amount input for validation
   - Disable submit button during submission

---

## ✅ Acceptance Criteria

### Must Have
- [ ] User can donate via one-time or recurring methods
- [ ] Form validates all required fields
- [ ] Success/error toasts display correctly
- [ ] API integration works end-to-end
- [ ] Loading states prevent double submission
- [ ] Mobile-responsive design

### Nice to Have
- [ ] Suggested donation amounts from plans
- [ ] Donation history view
- [ ] Cancel recurring donation UI
- [ ] Email confirmation
- [ ] Tax receipt download

---

**Implementation Time Estimate:** 4-6 hours
**Testing Time Estimate:** 2-3 hours
**Total:** ~8 hours

---

**End of Implementation Plan**
