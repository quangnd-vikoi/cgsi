# Recent Fixes Summary

**Date:** 2026-01-21
**Total Fixes:** 9 bugs fixed

---

## 🎯 Quick Summary

### Logic Bugs Fixed (6)
1. ✅ **TC-44** - Announcement bar persistence (localStorage)
2. ✅ **TC-186** - Notification sort order (newest first)
3. ✅ **TC-121/122** - Product name clickable on Web only
4. ✅ **TC-100** - Analysis tab default collapsed
5. ✅ **TC-102** - Accordion state persistence across tabs
6. ✅ **TC-118** - Application filter logic (Securities vs Alternatives)

### UI/UX Improvements (3)
7. ✅ **Sheet Mobile** - 64px offset below header on mobile
8. ✅ **OTP Validation** - Disable submit button, better errors
9. ✅ **Email Subject** - Pre-fill "iTrade Client Enquiry"

---

## 📝 Detailed Changes

### 1. TC-44: Announcement Bar Persistence
**File:** `components/Header.tsx:68-122`
```typescript
// Store in localStorage when closed
const storageKey = `announcement-hidden-${announcement.Anchor_Link}`;
localStorage.setItem(storageKey, "true");

// Check on mount
const wasHidden = localStorage.getItem(storageKey);
setIsVisible(!wasHidden);
```

### 2. TC-186: Notification Sort Order
**File:** `app/(minimal)/sidebar/Notification.tsx:102-107`
```typescript
const sortedNotifications = [...notifications].sort((a, b) => {
  const dateA = new Date(a.createdOn).getTime();
  const dateB = new Date(b.createdOn).getTime();
  return dateB - dateA; // Newest first
});
```

### 3. TC-121/122: Product Name Clickable
**File:** `app/(with-layout)/(detail)/my-applications/page.tsx:206-219`
```typescript
// Mobile: Plain text
<span className="font-medium text-cgs-blue md:hidden">
  {app.productName}
</span>

// Web: Clickable button
<button
  onClick={() => handleProductNameClick(app)}
  className="font-medium text-cgs-blue hidden md:inline cursor-pointer hover:underline"
>
  {app.productName}
</button>
```

### 4. TC-100: Analysis Tab Default State
**File:** `app/(with-layout)/(form)/_components/AnalysisTab.tsx:163`
```typescript
// Before: <Accordion defaultValue="item-0">
// After:  <Accordion type="single" collapsible>
```

### 5. TC-102: Accordion State Persistence
**Files:**
- `app/(with-layout)/(form)/_components/ProductDetailsContext.tsx`
- `app/(with-layout)/(form)/_components/AnalysisTab.tsx`

```typescript
// Context
const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>();

// AnalysisTab
<Accordion
  value={openAccordionValue}
  onValueChange={setOpenAccordionValue}
>
```

### 6. TC-118: Filter Logic
**File:** `app/(with-layout)/(detail)/my-applications/page.tsx:55-95`
```typescript
const normalizedType = sub.productType?.toLowerCase().trim();
let type: "securities" | "alternatives";

if (
  normalizedType === "securities" ||
  normalizedType === "security" ||
  normalizedType === "iop"  // ✅ Added
) {
  type = "securities";
} else if (
  normalizedType === "alternatives" ||
  normalizedType === "alternative" ||
  normalizedType === "structured products" ||
  normalizedType === "funds" ||
  normalizedType === "bonds" ||
  normalizedType === "ai"  // ✅ Added
) {
  type = "alternatives";
} else {
  console.warn(`Unknown product type: ${sub.productType}`);
  type = "securities";
}
```

### 7. Sheet Mobile Positioning
**Files:**
- `app/(with-layout)/layout.tsx:14`
- `components/ui/sheet.tsx:30, 55`
- `app/(minimal)/sidebar/SheetManager.tsx:96`

```typescript
// Overlay
<SheetOverlay className="fixed top-16 md:top-0 left-0 right-0 bottom-0" />

// Content
<SheetContent className="right-0 top-16 md:top-0 bottom-0" />
```

### 8. OTP Validation
**Files:**
- `app/(with-layout)/(detail)/update-mobile/page.tsx:44-48, 192-214, 284`
- `app/(with-layout)/(detail)/update-email/page.tsx:86-90, 222-244, 312`

```typescript
// Clear error on typing
const handleChange = (value: string) => {
  setOtp(value);
  if (error) setError("");
};

// Disable button
<Button disabled={isSubmitting || (step === 2 && otp.length < 6)}>

// Error messages
if (otp.length !== 6) {
  setError("Please enter the 6 digit numbers that sent to your mobile number");
}
// On failure
setError("Sorry, your entries do not match. Please try again.");
```

### 9. Email Subject Pre-fill
**Files:**
- `lib/utils.ts:27-30`
- `app/(minimal)/sidebar/TradingRepresentative.tsx:33-36`

```typescript
export const handleEmail = (email: string) => {
  const subject = encodeURIComponent("iTrade Client Enquiry");
  window.location.href = `mailto:${email}?subject=${subject}`;
};
```

---

## 📊 Files Modified (15 total)

```
components/
  Header.tsx              ✓ Announcement persistence
  ui/sheet.tsx            ✓ Mobile positioning

lib/
  utils.ts                ✓ Email subject

app/(with-layout)/
  layout.tsx              ✓ SheetManager positioning

app/(minimal)/sidebar/
  SheetManager.tsx        ✓ Height adjustment
  Notification.tsx        ✓ Sort order
  TradingRepresentative.tsx ✓ Email subject

app/(with-layout)/(detail)/
  my-applications/page.tsx ✓ Product click, filter
  update-mobile/page.tsx   ✓ OTP validation
  update-email/page.tsx    ✓ OTP validation

app/(with-layout)/(form)/_components/
  AnalysisTab.tsx         ✓ Default state, persistence
  ProductDetailsContext.tsx ✓ State management

bugs/
  fixable-bugs-summary.md ✓ Documentation
  RECENT-FIXES.md         ✓ This file
```

---

## ✅ Testing Checklist

- [x] Announcement bar: Close → Refresh → Stays closed
- [x] Notifications: Newest at top
- [x] Product name: Clickable on web, not on mobile
- [x] Analysis tab: All cards collapsed initially
- [x] Analysis tab: Expand card → Switch tab → Return → Still expanded
- [x] Applications: Securities in Securities tab, Alternatives in Alternatives tab
- [x] Sheet: Starts below header on mobile (64px offset)
- [x] Sheet: Full screen on desktop
- [x] OTP: Submit disabled when < 6 digits
- [x] OTP: Error clears when typing
- [x] Email: Opens with subject "iTrade Client Enquiry"

---

## 🔄 TODO: Backend Integration

**OTP Expiry Check:**
- Location: `update-mobile/page.tsx:197`, `update-email/page.tsx:227`
- Status: TODO comment added
- Action: Backend needs to return specific error code for expired OTP
- Current: Generic error message shown

---

## 📈 Impact

### User Experience
- ✅ Better mobile sheet interaction (header visible)
- ✅ More reliable OTP validation
- ✅ Professional email communication
- ✅ Predictable UI behavior (collapsed accordions)
- ✅ State preservation across navigation

### Code Quality
- ✅ Consistent error handling
- ✅ Type-safe product filtering
- ✅ Reusable state management patterns
- ✅ Clear localStorage keys

### Performance
- ✅ No impact (all client-side improvements)
- ✅ Minimal localStorage usage
- ✅ Efficient sorting with single pass

---

**For full details, see:** `bugs/fixable-bugs-summary.md`
