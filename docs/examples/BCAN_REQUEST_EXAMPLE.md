# BCAN Request - Account Selection Example

## Overview

BCAN (Broker Client Account Number) requests require an `accountNo` parameter. The trading account store provides `getDefaultAccountNo()` method that automatically selects the account using priority logic.

## Priority Logic

```
CTA (Cash Trading Account)     ← Highest priority
CUT (Cash Upfront Trading)
iCash (iCash Account)
MTA (Margin Trading Account)
SBL (Shares Borrowing & Lending) ← Lowest priority

Special case: If only 1 account exists, select it regardless of type
```

## Store Method

```typescript
// stores/tradingAccountStore.ts

getDefaultAccountNo: () => string | null

// Returns:
// - Account number (string) if accounts exist
// - null if no accounts available
```

## Usage Examples

### Example 1: BCAN Request (Basic)

```typescript
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { createBcanRequest } from "@/lib/services/profileService";
import { toast } from "@/components/ui/toaster";

async function handleBcanRequest() {
  // Get default account number
  const accountNo = useTradingAccountStore.getState().getDefaultAccountNo();

  if (!accountNo) {
    toast.error("No trading account found", "Please contact support");
    return;
  }

  // Submit BCAN request
  const response = await createBcanRequest(accountNo);

  if (response.success && response.data?.isSuccess) {
    toast.success("BCAN request submitted successfully");
  } else {
    toast.error("BCAN request failed", response.error);
  }
}
```

### Example 2: BCAN Request (React Component)

```typescript
"use client";
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { createBcanRequest } from "@/lib/services/profileService";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function BcanRequestButton() {
  const [loading, setLoading] = useState(false);
  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

  const handleClick = async () => {
    setLoading(true);

    const accountNo = getDefaultAccountNo();

    if (!accountNo) {
      alert("No trading account available");
      setLoading(false);
      return;
    }

    const response = await createBcanRequest(accountNo);

    if (response.success) {
      alert("BCAN request submitted!");
    } else {
      alert("Failed: " + response.error);
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Submitting..." : "Request BCAN"}
    </Button>
  );
}
```

### Example 3: Trading Declarations Page

```typescript
// app/(minimal)/sidebar/TradingDeclarations.tsx
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { createBcanRequest } from "@/lib/services/profileService";

function TradingDeclarations() {
  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBcanClick = async () => {
    const accountNo = getDefaultAccountNo();

    if (!accountNo) {
      toast.error("No account", "Please set up a trading account first");
      return;
    }

    setIsSubmitting(true);

    const response = await createBcanRequest(accountNo);

    setIsSubmitting(false);

    if (response.success) {
      toast.success("BCAN request created successfully");
    } else {
      toast.error("Failed to create BCAN request", response.error);
    }
  };

  return (
    <div>
      <h2>BCAN Status</h2>
      <p>Request BCAN for your trading account</p>
      <Button onClick={handleBcanClick} disabled={isSubmitting}>
        Request BCAN
      </Button>
    </div>
  );
}
```

### Example 4: With Account Display

```typescript
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

function BcanRequestForm() {
  const accounts = useTradingAccountStore((state) => state.accounts);
  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

  const defaultAccountNo = getDefaultAccountNo();
  const defaultAccount = accounts.find(acc => acc.accountNo === defaultAccountNo);

  const handleSubmit = async () => {
    if (!defaultAccountNo) return;

    await createBcanRequest(defaultAccountNo);
  };

  return (
    <div>
      <h3>BCAN Request</h3>

      {defaultAccount ? (
        <div>
          <p>Account: {defaultAccount.accountNo}</p>
          <p>Type: {defaultAccount.accountType}</p>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </div>
      ) : (
        <p>No trading account available</p>
      )}
    </div>
  );
}
```

### Example 5: Donation Submission

```typescript
// app/(with-layout)/(detail)/donations/page.tsx
import { useTradingAccountStore } from "@/stores/tradingAccountStore";
import { submitDonation } from "@/lib/services/profileService";

async function handleDonationSubmit(amount: number) {
  const accountNo = useTradingAccountStore.getState().getDefaultAccountNo();

  if (!accountNo) {
    toast.error("No trading account");
    return;
  }

  const response = await submitDonation({
    accountNo,
    amount,
    currency: "SGD",
    paymentMethod: "PLAN",
    paymentMode: "DONATE",
    months: 12
  });

  if (response.success) {
    toast.success("Donation submitted");
  }
}
```

### Example 6: Market Data Subscription

```typescript
// app/(with-layout)/(detail)/market-data/TermsStep.tsx
import { useTradingAccountStore } from "@/stores/tradingAccountStore";

function TermsStep() {
  const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);

  const handleSubscribe = async () => {
    const accountNo = getDefaultAccountNo();

    if (!accountNo) {
      alert("Please add a trading account first");
      return;
    }

    await subscribeToMarketData({
      accountNo,
      subscriptionId: "premium-data"
    });
  };

  return (
    <div>
      <Button onClick={handleSubscribe}>Subscribe</Button>
    </div>
  );
}
```

## Error Handling

### Always check for null

```typescript
// ❌ BAD - Will crash if no account
const accountNo = getDefaultAccountNo();
await createBcanRequest(accountNo); // TypeError if null

// ✅ GOOD - Safe with null check
const accountNo = getDefaultAccountNo();
if (!accountNo) {
  toast.error("No account available");
  return;
}
await createBcanRequest(accountNo);
```

### Provide user feedback

```typescript
const accountNo = getDefaultAccountNo();

if (!accountNo) {
  return (
    <EmptyState
      title="No Trading Account"
      description="Please contact support to set up your account"
      action={
        <Button onClick={() => router.push("/contact")}>
          Contact Support
        </Button>
      }
    />
  );
}
```

## Priority Selection Examples

### Scenario 1: User has only CTA
```
Accounts: [{ accountNo: "1234567", accountType: "CTA" }]
getDefaultAccountNo() → "1234567" ✅
```

### Scenario 2: User has MTA and CTA
```
Accounts: [
  { accountNo: "1111111", accountType: "MTA" },
  { accountNo: "2222222", accountType: "CTA" }
]
getDefaultAccountNo() → "2222222" ✅ (CTA priority)
```

### Scenario 3: User has only MTA
```
Accounts: [{ accountNo: "9999999", accountType: "MTA" }]
getDefaultAccountNo() → "9999999" ✅ (only 1 account)
```

### Scenario 4: No accounts
```
Accounts: []
getDefaultAccountNo() → null ❌
```

## Related APIs

All these APIs require `accountNo`:

```typescript
// Profile APIs
createBcanRequest(accountNo)
submitDonation({ accountNo, ... })
getDonationPlans() // Uses selected account

// Subscription APIs
submitMarketDataSubscription({ accountNo, ... })
submitProductSubscription({ accountNo, ... })
```

## Best Practices

1. **Always check for null**
   ```typescript
   const accountNo = getDefaultAccountNo();
   if (!accountNo) return;
   ```

2. **Use in React components with store selector**
   ```typescript
   const getDefaultAccountNo = useTradingAccountStore((state) => state.getDefaultAccountNo);
   ```

3. **Use in utility/service code with getState()**
   ```typescript
   const accountNo = useTradingAccountStore.getState().getDefaultAccountNo();
   ```

4. **Show which account is selected**
   ```typescript
   const accountNo = getDefaultAccountNo();
   const account = accounts.find(a => a.accountNo === accountNo);
   <p>Using account: {account?.accountNo} ({account?.accountType})</p>
   ```

## Summary

- ✅ Use `getDefaultAccountNo()` from `useTradingAccountStore`
- ✅ Always check for null before API calls
- ✅ Priority: CTA > CUT > iCash > MTA > SBL
- ✅ Single account → auto-select regardless of type
- ✅ Apply to: BCAN, Donations, Subscriptions, etc.
