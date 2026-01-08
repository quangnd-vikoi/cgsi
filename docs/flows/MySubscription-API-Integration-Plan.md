# Implementation Plan: Integrate Missing MySubscription APIs

> **📌 API Spec:** See `docs/swagger/api-doc-v2/subscription-api-0.0.1-snapshot.json` for v2 specification

## Overview

**Goal:** Integrate the 3 unused mySubscription APIs into the application to provide subscription detail views, product type filtering, and pre-populated resubscription flows.

**Current State:**
- 5 subscription APIs exist in `lib/services/subscriptionService.ts`
- Only `getUserProductSubscriptions()` is currently used in `MySubscriptions.tsx`
- `submitProductSubscription()` is already implemented in market-data flow (`TermsStep.tsx`)

**APIs to Implement:**
1. ✅ `submitProductSubscription()` - **Already implemented** in `TermsStep.tsx`
2. ❌ `getUserSubscriptionDetails(subscriptionId)` - **Not used**
3. ❌ `getProductSubscriptionsByType(productType)` - **Not used**
4. ❌ `getProductDetails(productCode)` - **Not used**

---

## Implementation Strategy

### Feature 1: Subscription Detail View
**API:** `getUserSubscriptionDetails(subscriptionId)`

**What:** Create a detail sheet that opens when clicking a subscription item, showing comprehensive subscription information.

**Why:** Users need to view full subscription details including financial breakdown, dates, and account information.

**How:**
- Create new `SubscriptionDetail.tsx` component in `app/(minimal)/sidebar/`
- Follow existing pattern from `DetailNotification.tsx`
- Use sheet navigation with `useSheetStore()` payload mechanism
- Add back button to navigate to MySubscriptions

**Files to Modify/Create:**
1. **CREATE:** `app/(minimal)/sidebar/SubscriptionDetail.tsx`
2. **MODIFY:** `app/(minimal)/sidebar/MySubscriptions.tsx` - Make items clickable
3. **MODIFY:** `app/(minimal)/sidebar/SheetManager.tsx` - Register new sheet
4. **MODIFY:** `types/index.ts` - Add `subscription_detail` to SheetType

**Key Features:**
- Display product info (name, type, code, stock code)
- Show account details (account number, tax note, client name)
- Display dates (application, payment due, note generation)
- Financial summary (units, price, commission, GST, total payable)
- Action buttons (Download Invoice, Extend, Unsubscribe)
- Loading skeleton, error state, empty state handling

---

### Feature 2: Product Type Filtering
**API:** `getProductSubscriptionsByType(productType)`

**What:** Add tab-based filtering to MySubscriptions to filter by product type (All, IPO, IOP, AI).

**Why:** Users with multiple subscription types need an easy way to filter and view specific product categories.

**How:**
- Add Shadcn Tabs component to MySubscriptions (following market-data page pattern)
- Use client-side filtering initially (fetch all, filter locally)
- Add option for future server-side filtering when users have 100+ subscriptions

**Approach Decision:**
- **Tabs (RECOMMENDED):** Better UX, follows existing market-data pattern, large touch targets
- **Alternative:** Dropdown filter (requires extra click, less discoverable)

**Files to Modify:**
1. **MODIFY:** `app/(minimal)/sidebar/MySubscriptions.tsx` - Add tabs and filtering logic

**Implementation:**
```typescript
// Add state for active tab
const [activeTab, setActiveTab] = useState<"all" | "IPO" | "IOP" | "AI">("all");

// Filter subscriptions based on tab
const filteredProductSubs = useMemo(() => {
  if (activeTab === "all") return productSubs;
  return productSubs.filter(sub => sub.productType === activeTab);
}, [productSubs, activeTab]);

// Render tabs before subscription list
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="w-full mb-4">
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="IPO">IPO</TabsTrigger>
    <TabsTrigger value="IOP">IOP</TabsTrigger>
    <TabsTrigger value="AI">AI</TabsTrigger>
  </TabsList>
</Tabs>
```

**Performance:**
- Client-side filtering for <100 subscriptions (instant tab switching)
- Future: Server-side filtering with `getProductSubscriptionsByType()` for larger datasets

---

### Feature 3: Product Details for Resubscribe/Extend
**API:** `getProductDetails(productCode)`

**What:** Fetch product details when user clicks "Resubscribe" or "Extend Subscription", then navigate to market-data page with pre-filled form.

**Why:** Users need a seamless flow to resubscribe or extend subscriptions without manually searching for products.

**How:**
- Fetch product details from API when dropdown action is clicked
- Navigate to market-data page with query parameters
- Market-data page reads query params and pre-fills subscription form

**Files to Modify:**
1. **MODIFY:** `app/(minimal)/sidebar/MySubscriptions.tsx` - Add product fetch handler
2. **MODIFY:** `app/(with-layout)/(detail)/market-data/page.tsx` - Add query param handling

**MySubscriptions.tsx Implementation:**
```typescript
const handleSubscriptionAction = async (
  productCode: string,
  action: "resubscribe" | "extend"
) => {
  setLoadingProductCode(productCode);

  try {
    const response = await getProductDetails(productCode);

    if (response.success && response.data) {
      const product = response.data;

      // Navigate with query params
      const params = new URLSearchParams({
        action,
        productCode: product.productCode,
        productName: product.productName,
        productType: product.productType,
        issuePrice: product.issuePrice.toString(),
        minQty: product.minQty.toString(),
        currency: product.baseCurrency || "",
      });

      router.push(`${INTERNAL_ROUTES.MARKET_DATA}?${params.toString()}`);
    } else {
      toast.error("Product Unavailable", response.error);
    }
  } finally {
    setLoadingProductCode(null);
  }
};
```

**Market-Data Page Implementation:**
```typescript
// Read query params on mount
useEffect(() => {
  const action = searchParams.get("action");
  const productCode = searchParams.get("productCode");
  // ... other params

  if (action && productCode) {
    // Auto-add to selectedItems
    setSelectedItems([preFilledItem]);
    setCurrentStep("cart");

    toast.info(
      action === "resubscribe" ? "Resubscribe" : "Extend Subscription",
      `Product "${productName}" has been added to your cart.`
    );
  }
}, [searchParams]);
```

---

### Feature 4: Documentation Update
**API:** `submitProductSubscription()` - Already implemented

**What:** Add documentation noting this API is already integrated.

**Files to Modify:**
1. **MODIFY:** `lib/services/subscriptionService.ts` - Add detailed comments

**Update:**
```typescript
/**
 * Submit a product subscription application
 *
 * ✅ IMPLEMENTATION STATUS: COMPLETE
 * Already implemented in TermsStep.tsx (lines 29-80)
 * Used in market-data subscription flow
 */
```

---

## Implementation Order

### Phase 1: Foundation
1. Update TypeScript types - Add `subscription_detail` to SheetType
2. Create SubscriptionDetail component
3. Register sheet in SheetManager
4. Make subscription items clickable in MySubscriptions
5. Test detail view navigation and data fetching

### Phase 2: Filtering
6. Add Tabs component to MySubscriptions
7. Implement client-side filtering with useMemo
8. Test all tabs and edge cases (empty tabs, etc.)

### Phase 3: Pre-population
9. Add handleSubscriptionAction to MySubscriptions
10. Implement product details fetch with loading states
11. Add query param handling to market-data page
12. Test full Resubscribe/Extend flow

### Phase 4: Polish
13. Add all loading indicators and error states
14. Handle edge cases (expired products, API errors, etc.)
15. Update documentation in subscriptionService.ts
16. End-to-end testing

---

## Critical Files

### Files to CREATE:
- `app/(minimal)/sidebar/SubscriptionDetail.tsx` - New detail view component

### Files to MODIFY:
- `app/(minimal)/sidebar/MySubscriptions.tsx` - Add tabs, clickable items, product fetch handler
- `app/(minimal)/sidebar/SheetManager.tsx` - Register subscription_detail sheet
- `app/(with-layout)/(detail)/market-data/page.tsx` - Add query param handling
- `types/index.ts` - Add subscription_detail to SheetType enum
- `lib/services/subscriptionService.ts` - Add documentation comments

### Files to REFERENCE:
- `lib/services/subscriptionService.ts` - API functions and types
- `app/(minimal)/sidebar/DetailNotification.tsx` - Detail view pattern
- `app/(with-layout)/(detail)/market-data/_components/TermsStep.tsx` - Existing submission implementation

---

## Edge Cases to Handle

### Subscription Detail View:
- Missing subscriptionId → Show error state
- API failure → Show retry button
- Expired subscriptions → Adjust available actions
- Pending payment → Show payment reminder banner
- No invoice available → Disable download button

### Product Type Filtering:
- Empty tab → Show "No [type] subscriptions found"
- Unknown productType → Map to "All" tab
- Single type only → Still show all tabs for consistency

### Resubscribe/Extend Flow:
- Product no longer available → Show error toast, don't navigate
- Product details incomplete → Use defaults, show warning
- Network timeout → Show retry option
- Multiple concurrent clicks → Disable dropdown while loading
- Product expired → Show "Product no longer available" error

---

## Key Design Decisions

1. **Sheet Navigation Pattern:** Use existing `sheetStore` pattern (consistent with NotificationDetail, TradingAccountDetail)

2. **Filtering Approach:** Tabs over dropdown (better UX, follows market-data pattern, no extra clicks)

3. **API Call Strategy:** Client-side filtering initially (fewer API calls, instant switching), with future option for server-side

4. **Pre-population Method:** URL query params (clean separation, allows bookmarking, follows Next.js best practices)

5. **State Management:** Leverage existing stores, no new global state needed

---

## Testing Checklist

- [ ] Click subscription item opens detail sheet with correct data
- [ ] Back button returns to MySubscriptions list
- [ ] All tabs filter subscriptions correctly
- [ ] Empty tabs show appropriate messages
- [ ] "Resubscribe" fetches product details and navigates
- [ ] "Extend" fetches product details and navigates
- [ ] Market-data form pre-fills with product data
- [ ] Loading states show correctly (skeleton, "Loading..." text)
- [ ] Error states show with retry options
- [ ] API errors handled gracefully with user-friendly messages
- [ ] All action buttons work (Download, Extend, Unsubscribe)

---

## Estimated Effort

**Total Time:** 2-3 days

- Phase 1 (Foundation): 1 day
- Phase 2 (Filtering): 0.5 days
- Phase 3 (Pre-population): 0.5 days
- Phase 4 (Polish & Testing): 1 day

---

## Success Criteria

1. Users can view detailed subscription information by clicking any subscription item
2. Users can filter subscriptions by product type using tabs
3. Users can resubscribe or extend subscriptions with pre-filled product information
4. All loading states, error states, and edge cases are handled gracefully
5. Implementation follows existing codebase patterns and conventions
