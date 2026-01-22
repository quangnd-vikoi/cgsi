# Donation Submission - Account Selection Example

## Overview

Donation submissions require an `accountNo` parameter. The trading account store provides `getDefaultAccountNo()` method to automatically select the account.

## API Requirements

### One-Time Donation

```typescript
interface DonationSubmissionRequest {
  accountNo: string;      // 7-digit account number
  amount?: number;        // Donation amount (min: 0)
  currency: string;       // e.g., "SGD"
  paymentMethod: string;  // "PLAN" or "LS_ACCSET"
  paymentMode: string;    // "DONATE"
  months?: number;        // Optional: 1-12 months
}
```

### Recurring Donation

```typescript
interface DonationSubmissionRequest {
  accountNo: string;
  amount?: number;
  currency: string;
  paymentMethod: string;
  paymentMode: string;
  months: number;         // Required for recurring: 1-12
}
```

## Implementation

### One-Time Donation Form

```typescript
// app/(with-layout)/(detail)/donations/_components/OnetimeForm.tsx

import { submitDonation } from "@/lib/services/profileService";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

const OneTimeForm = () => {
  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

  const handleDonationSubmit = async (amount: number, paymentMethod: string) => {
    // Get default account
    const accountNo = getDefaultAccountNo();

    if (!accountNo) {
      toast.error("No trading account found");
      return;
    }

    // Submit donation
    const response = await submitDonation({
      accountNo,
      amount,
      currency: "SGD",
      paymentMethod: paymentMethod === "now" ? "PLAN" : "LS_ACCSET",
      paymentMode: "DONATE"
    });

    if (response.success && response.data?.isSuccess) {
      toast.success("Thank you for your donation!");
    } else {
      toast.error("Failed to process donation", response.error);
    }
  };
};
```

### Recurring Donation Form

```typescript
// app/(with-layout)/(detail)/donations/_components/RecurringForm.tsx

const RecurringForm = () => {
  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

  const handleRecurringSetup = async (amount: number, months: number) => {
    const accountNo = getDefaultAccountNo();

    if (!accountNo) {
      toast.error("No trading account found");
      return;
    }

    const response = await submitDonation({
      accountNo,
      amount,
      currency: "SGD",
      paymentMethod: "PLAN",
      paymentMode: "DONATE",
      months // Required for recurring donations
    });

    if (response.success) {
      toast.success("Recurring donation setup successfully!");
    }
  };
};
```

## Payment Methods

| Payment Method | API Value | Description |
|----------------|-----------|-------------|
| PayNow | `PLAN` | Immediate payment via PayNow |
| Trust Account | `LS_ACCSET` | Deduct from trading trust account |

## Validation

```typescript
// Validate before submission
if (!accountNo) {
  toast.error("No trading account", "Please set up your account first");
  return;
}

if (!amount || amount < 1.0) {
  toast.error("Invalid amount", "Minimum donation is SGD 1.00");
  return;
}

if (!paymentMethod) {
  toast.error("Payment method required");
  return;
}
```

## Complete Example

```typescript
import { useState } from "react";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { submitDonation } from "@/lib/services/profileService";
import { toast } from "@/components/ui/toaster";

function DonationForm() {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"now" | "trust">("now");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

  const handleSubmit = async () => {
    // Validate
    if (amount < 1.0) {
      toast.error("Minimum donation is SGD 1.00");
      return;
    }

    const accountNo = getDefaultAccountNo();
    if (!accountNo) {
      toast.error("No trading account found");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitDonation({
        accountNo,
        amount,
        currency: "SGD",
        paymentMethod: paymentMethod === "now" ? "PLAN" : "LS_ACCSET",
        paymentMode: "DONATE"
      });

      if (response.success && response.data?.isSuccess) {
        toast.success("Donation successful!");
        setAmount(0); // Reset form
      } else {
        toast.error("Failed to process donation", response.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Enter amount"
      />

      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
        <option value="now">PayNow</option>
        <option value="trust">Trust Account</option>
      </select>

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Donate"}
      </button>
    </div>
  );
}
```

## Error Handling

```typescript
// No account available
if (!accountNo) {
  return (
    <EmptyState
      title="No Trading Account"
      description="Please contact support to set up your trading account first"
      action={<Button>Contact Support</Button>}
    />
  );
}

// API error
if (!response.success) {
  toast.error("Donation failed", response.error || "Please try again");
}

// Network error
catch (error) {
  toast.error("Network error", "Please check your connection");
}
```

## Best Practices

1. **Always validate account**
   ```typescript
   const accountNo = getDefaultAccountNo();
   if (!accountNo) return;
   ```

2. **Show loading state**
   ```typescript
   <Button disabled={isSubmitting}>
     {isSubmitting ? <Loader2 /> : "Donate"}
   </Button>
   ```

3. **Handle errors gracefully**
   ```typescript
   if (!response.success) {
     toast.error(response.error);
   }
   ```

4. **Reset form after success**
   ```typescript
   if (response.success) {
     setAmount(0);
     setAgreed(false);
   }
   ```

5. **Validate minimum amount**
   ```typescript
   if (amount < 1.0) {
     toast.error("Minimum SGD 1.00");
     return;
   }
   ```

## Related Files

- **Component**: `app/(with-layout)/(detail)/donations/_components/OnetimeForm.tsx`
- **Component**: `app/(with-layout)/(detail)/donations/_components/RecurringForm.tsx`
- **Service**: `lib/services/profileService.ts` - `submitDonation()`
- **Store**: `stores/tradingAccountStore.ts` - `getDefaultAccountNo()`
- **Types**: `types/index.ts` - `DonationSubmissionRequest`

## Summary

- ✅ Use `getDefaultAccountNo()` to get account
- ✅ Always validate account exists before API call
- ✅ PayNow → `"PLAN"`, Trust Account → `"LS_ACCSET"`
- ✅ Minimum amount: SGD 1.00
- ✅ Currency: "SGD"
- ✅ Payment mode: "DONATE"
- ✅ Recurring donations require `months` parameter (1-12)
