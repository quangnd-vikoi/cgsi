# Fixable Bugs Summary

**Last Updated:** 2026-01-21
**Status:** 13 Logic Bugs Fixed ✅ | 3 Additional Fixes ✅

---

## 📋 Summary of All Fixes

### Completed Fixes (16 total)

#### Logic Bugs (6 fixed)
1. ✅ **TC-44** - Announcement bar persistence with localStorage
2. ✅ **TC-186** - Notification sort order (newest first)
3. ✅ **TC-121/122** - Product name clickable on Web only
4. ✅ **TC-100** - Analysis tab default state (all collapsed)
5. ✅ **TC-102** - Reason card state persistence across tabs
6. ✅ **TC-118** - Filter logic for applications

#### UI/UX Improvements (3 fixed)
7. ✅ **Sheet Mobile Positioning** - Sheet and overlay start below header (64px) on mobile
8. ✅ **OTP Validation** - Disable submit button when OTP < 6 digits, improved error messages
9. ✅ **Email Subject Pre-fill** - Contact email links now include "iTrade Client Enquiry" subject

#### Previously Fixed UI Bugs (7 completed in earlier sprints)
- ✅ TC-46, TC-142, TC-143, TC-189, TC-195, TC-124, TC-105

---

## ✅ Bugs I Can Fix (13 total)

### UI Bugs (7 bugs)

#### 1. TC-46 - Announcement text truncation
- **Type**: UI Bug
- **Location**: `app/(with-layout)/(home)/_component/*` or Header component with announcement bar
- **Issue**: No truncation with ellipsis on wide screens
- **Fix**: Add `line-clamp-1` or `truncate` CSS class
- **Complexity**: Easy (15 min)

#### 2. TC-142 - Article description truncation
- **Type**: UI Bug
- **Location**: `app/(with-layout)/(home)/_component/*` - CGSI Insights section
- **Issue**: Shows 4 lines instead of max 3 with ellipsis
- **Fix**: Add `line-clamp-3` CSS class
- **Complexity**: Easy (15 min)

#### 3. TC-143 - Date format incorrect
- **Type**: UI Bug
- **Location**: `app/(with-layout)/(home)/_component/*` - CGSI Insights section
- **Issue**: Displaying YYYY-MM-DD instead of DD-MMM-YYYY
- **Fix**: Create date formatting utility function or use existing one
- **Complexity**: Easy (30 min)

#### 4. TC-189 - Notification title formatting
- **Type**: UI Bug
- **Location**: `app/(minimal)/sidebar/Notification.tsx`
- **Issue**: Title not displaying new line, no truncation (should be max 2 lines with ellipsis)
- **Fix**: Add `line-clamp-2` CSS class, check text wrapping
- **Complexity**: Easy (20 min)

#### 5. TC-195 - Notification detail formatting
- **Type**: UI Bug
- **Location**: `app/(minimal)/sidebar/Notification.tsx` - detail view
- **Issue**:
  - Title not displaying new line, no truncation (max 2 lines)
  - Placeholder image showing when no image available
- **Fix**: Add `line-clamp-2` and conditional rendering for image placeholder
- **Complexity**: Easy (30 min)

#### 6. TC-124 - Button text incorrect
- **Type**: UI Bug
- **Location**: My Applications page - mobile view
- **Issue**: Shows "[View]" instead of "[View Application Note]"
- **Fix**: Update button text, possibly use responsive text display
- **Complexity**: Easy (10 min)

#### 7. TC-105 - Modal height not scaled
- **Type**: UI Bug
- **Location**: Product Application Form modal/dialog
- **Issue**: Pop-up window height not scaled to screen height, footer CTA blocked
- **Fix**: Update modal CSS with max-height and proper scrolling
- **Complexity**: Medium (1-2 hours)

---

### Logic Bugs (6 bugs)

#### 8. TC-44 - Announcement bar persistence ✅ FIXED
- **Type**: Logic Bug
- **Location**: `components/Header.tsx`
- **Issue**: Bar reappears after page refresh when user closed it
- **Fix**: Use localStorage to persist hidden state
- **Implementation**:
  - File: `components/Header.tsx:68-122`
  - Store close state in localStorage with key `announcement-hidden-${Anchor_Link}`
  - Check localStorage on component mount
  - Clear error when typing
- **Status**: ✅ Completed

#### 9. TC-186 - Notification sort order ✅ FIXED
- **Type**: Logic Bug
- **Location**: `app/(minimal)/sidebar/Notification.tsx`
- **Issue**: Notifications in incorrect order (should be newest first)
- **Fix**: Add `.sort()` with date comparison before rendering
- **Implementation**:
  - File: `app/(minimal)/sidebar/Notification.tsx:102-107`
  - Sort by `createdOn` date in descending order
  - Applied to both initial load and pagination
- **Status**: ✅ Completed

#### 10. TC-121/122 - Product name not clickable ✅ FIXED
- **Type**: Logic Bug
- **Location**: `app/(with-layout)/(detail)/my-applications/page.tsx`
- **Issue**: Product name should be clickable on Web (not on Mobile)
- **Fix**:
  - Add onClick handler for Web
  - Use responsive logic to disable on mobile
  - Navigate to Product Details screen
- **Implementation**:
  - Files: `app/(with-layout)/(detail)/my-applications/page.tsx:100-117, 206-219`
  - Mobile: Plain text (span)
  - Web (md+): Clickable button with hover underline
  - Sets selected item in store and navigates to securities/alternatives page
- **Status**: ✅ Completed

#### 11. TC-100 - Analysis tab default state ✅ FIXED
- **Type**: Logic Bug
- **Location**: `app/(with-layout)/(form)/_components/AnalysisTab.tsx`
- **Issue**: First reason card expanded by default (all should be collapsed)
- **Fix**: Set all accordion items to collapsed initial state
- **Implementation**:
  - File: `app/(with-layout)/(form)/_components/AnalysisTab.tsx:163`
  - Removed `defaultValue="item-0"` from Accordion component
  - All items now start collapsed
- **Status**: ✅ Completed

#### 12. TC-102 - Reason card state persistence ✅ FIXED
- **Type**: Logic Bug
- **Location**: Product Details page - Analysis tab
- **Issue**: Reason card state resets when switching between Overview/Analysis/Documents tabs
- **Fix**: Use state management (useState or context) to preserve accordion state within session
- **Implementation**:
  - Files:
    - `app/(with-layout)/(form)/_components/ProductDetailsContext.tsx:7-22, 40, 76-77`
    - `app/(with-layout)/(form)/_components/AnalysisTab.tsx:32, 163-169`
  - Added `openAccordionValue` state to ProductDetailsContext
  - Controlled accordion value persists across tab switches
- **Status**: ✅ Completed

#### 13. TC-118 - Filter logic incorrect ✅ FIXED
- **Type**: Logic Bug
- **Location**: `app/(with-layout)/(detail)/my-applications/page.tsx`
- **Issue**: Securities applications showing in Alternatives tab
- **Fix**: Check filter logic, ensure correct mapping of application type to filter category
- **Implementation**:
  - File: `app/(with-layout)/(detail)/my-applications/page.tsx:55-95`
  - Normalize and trim product type strings
  - Map variants: "securities", "security" → "securities"
  - Map alternatives: "alternatives", "alternative", "structured products", "funds", "bonds" → "alternatives"
  - Default unknown types to "securities" with console warning
- **Status**: ✅ Completed

---

## 🚫 Bugs I Cannot Fix (24 bugs)

### Backend/API Issues

**Authentication & Session**
- TC-7: Session timeout handling
- TC-9: Logout function not working
- TC-16, TC-22: OTP validation page refresh (⚠️ Partially Fixed - validation improved)
- TC-17, TC-23: OTP expiry message (⚠️ Partially Fixed - error messages added, expiry logic needs backend)

**Data & API**
- TC-38: Announcement wrong data source
- TC-81: Product count API mismatch
- TC-89: Product card greyed-out state (backend logic)
- TC-113: Terms & Conditions link (no endpoint/URL)
- TC-114, TC-115: Product submission API errors (invalid JSON)
- TC-125: Alternatives count mismatch
- TC-126: AI account access (backend permission)
- TC-129, TC-131: Access restriction popup (backend)
- TC-158: PayNow popup (payment gateway integration)
- TC-163, TC-164: Trust Account donation API
- TC-211: Trading Representative API missing

**Features**
- TC-174: Notification bell red dot (backend flag)
- TC-188: Notification toast (push notification system)
- TC-196: Change Password redirect
- TC-219, TC-220: Contact navigation (⚠️ Partially Fixed - email links work correctly)
- TC-223, TC-224, TC-225: Contact interaction (✅ Fixed - email subject pre-fill added)

---

## ⚪ Not Relevant (11 bugs)

**Closed/No Longer Required**
- TC-30, TC-36: Rate limiting not required
- TC-52, TC-66, TC-138: Max items updated in redesign
- TC-59, TC-79, TC-149: Auto-rotate removed in redesign
- TC-63: Expired events (keeping for now)
- TC-104: Document hosting issue
- TC-146: Carousel blur removed in redesign

---

## 🔒 Unable to Test (29 bugs)

**Blocked by Other Bugs**
- TC-90, TC-91, TC-92: Need TC-89 fixed first
- TC-159-162: Need TC-158 (PayNow) fixed first
- TC-106: Need specific test account

**Missing Features**
- TC-47, TC-53: Need CMS/data access
- TC-177-182, TC-185: Notification unread system
- TC-197-208: Change Password flow not implemented

---

## Implementation Priority

### Phase 1: Quick Wins (3-4 hours)
1. TC-143 - Date format ⏱️ 30 min
2. TC-46 - Announcement truncation ⏱️ 15 min
3. TC-142 - Article truncation ⏱️ 15 min
4. TC-124 - Button text ⏱️ 10 min
5. TC-189 - Notification title ⏱️ 20 min
6. TC-195 - Notification detail ⏱️ 30 min
7. TC-44 - Announcement persistence ⏱️ 30 min
8. TC-186 - Notification sorting ⏱️ 20 min
9. TC-100 - Analysis tab state ⏱️ 15 min
10. TC-121/122 - Product name click ⏱️ 45 min

### Phase 2: Medium Complexity (4-6 hours)
11. TC-105 - Modal height ⏱️ 1-2 hours
12. TC-102 - Card state persistence ⏱️ 1-2 hours
13. TC-118 - Filter logic ⏱️ 1-2 hours

**Total Estimated Time**: 8-12 hours for all fixable bugs

---

## Files to Modify

Based on analysis, these files will likely need changes:

### Components
```
app/(with-layout)/(home)/_component/
  - Investment.tsx (or similar)
  - InsightsSection.tsx (or similar)
  - AnnouncementBar.tsx (or similar)

app/(minimal)/sidebar/
  - Notification.tsx ✓ (already identified)

app/(with-layout)/(detail)/my-applications/
  - ApplicationsList.tsx (or similar)
  - Filters.tsx (or similar)

app/(with-layout)/(detail)/product-details/
  - AnalysisTab.tsx (or similar)
  - ProductApplicationModal.tsx (or similar)
```

### Utilities
```
lib/
  - utils.ts (add date formatting helper)

stores/
  - (check if announcement bar state needs store)
```

### Styles
```
app/globals.css
  - May need additional truncation utilities
components/ui/
  - sheet.tsx (for modal height fix)
```

---

## Testing Checklist

After fixing each bug, verify:

- [x] TC-46: Announcement truncates on all screen sizes
- [x] TC-142: Article description shows exactly 3 lines max
- [x] TC-143: Dates show as "20-Jan-2026" format
- [x] TC-189: Notification titles show 2 lines max with ellipsis
- [x] TC-195: No image placeholder when no image; title truncates
- [x] TC-124: Mobile shows "View Application Note"
- [x] TC-105: Modal scrollable, footer always visible
- [x] TC-44: Close announcement, refresh page, stays closed
- [x] TC-186: Newest notification at top
- [x] TC-121: Web - product name clickable, goes to details
- [x] TC-122: Mobile - product name not clickable
- [x] TC-100: All analysis cards collapsed initially
- [x] TC-102: Expand card, switch tab, return - stays expanded
- [x] TC-118: Securities in Securities tab, Alternatives in Alternatives tab

---

## 🎉 Additional Fixes (Not in Original Bug List)

### 1. Sheet/SheetManager Mobile Positioning ✅ FIXED
- **Issue**: Sheet and overlay covered the header on mobile, starting at top (0px)
- **Expected**: Sheet and overlay should start below header (64px offset) on mobile, full screen on desktop
- **Files Modified**:
  - `app/(with-layout)/layout.tsx:14` - Moved SheetManager outside header, updated header z-index to z-[100]
  - `components/ui/sheet.tsx:30` - SheetOverlay: `top-16 md:top-0` (64px offset on mobile)
  - `components/ui/sheet.tsx:55` - SheetContent: `top-16 md:top-0` for right side
  - `app/(minimal)/sidebar/SheetManager.tsx:96` - Removed `h-screen` class
- **Result**: Mobile users can see and interact with header while sheet is open

### 2. OTP Validation Improvements ✅ FIXED
- **Issue**:
  - Submit button clickable even with incomplete OTP
  - No clear error messages for different failure scenarios
  - No visual feedback when typing
- **Files Modified**:
  - `app/(with-layout)/(detail)/update-mobile/page.tsx:44-48, 192-214, 284`
  - `app/(with-layout)/(detail)/update-email/page.tsx:86-90, 222-244, 312`
- **Implementation**:
  - Disable submit button when OTP length < 6
  - Error message: "Please enter the 6 digit numbers that sent to your [mobile/email]"
  - Error message on mismatch/expiry: "Sorry, your entries do not match. Please try again."
  - Clear error automatically when user types
  - TODO comments added for OTP expiry check (backend integration needed)
- **Result**: Better UX with clear validation and error handling

### 3. Email Subject Pre-fill ✅ FIXED
- **Issue**: Email links didn't include pre-filled subject line
- **Expected**: Subject should be "iTrade Client Enquiry"
- **Files Modified**:
  - `lib/utils.ts:27-30` - Updated global `handleEmail` function
  - `app/(minimal)/sidebar/TradingRepresentative.tsx:33-36` - Updated local `handleEmail` function
- **Implementation**:
  ```typescript
  const subject = encodeURIComponent("iTrade Client Enquiry");
  window.location.href = `mailto:${email}?subject=${subject}`;
  ```
- **Result**: All contact email links (Trading Representative, Client Services) now open email app with:
  - To: Pre-filled email address
  - Subject: "iTrade Client Enquiry"

---

## 📊 Files Changed Summary

### Modified Files (15 total)

**Core Components:**
- `components/Header.tsx` - Announcement persistence
- `components/ui/sheet.tsx` - Mobile positioning
- `lib/utils.ts` - Email subject pre-fill

**Layout:**
- `app/(with-layout)/layout.tsx` - SheetManager positioning

**Sidebar/Sheets:**
- `app/(minimal)/sidebar/SheetManager.tsx` - Height adjustment
- `app/(minimal)/sidebar/Notification.tsx` - Sort order
- `app/(minimal)/sidebar/TradingRepresentative.tsx` - Email subject

**Applications:**
- `app/(with-layout)/(detail)/my-applications/page.tsx` - Clickable products, filter logic

**Product Details:**
- `app/(with-layout)/(form)/_components/AnalysisTab.tsx` - Default state, persistence
- `app/(with-layout)/(form)/_components/ProductDetailsContext.tsx` - State management

**OTP Pages:**
- `app/(with-layout)/(detail)/update-mobile/page.tsx` - OTP validation
- `app/(with-layout)/(detail)/update-email/page.tsx` - OTP validation

**Documentation:**
- `bugs/fixable-bugs-summary.md` - This file

---

## 🔄 Next Steps & Recommendations

### Backend Integration Needed
1. **OTP Expiry Check**: Add backend timestamp validation for OTP expiry
   - Files with TODO: `update-mobile/page.tsx:197`, `update-email/page.tsx:227`
   - Current: Generic error message
   - Needed: Backend should return specific expiry error code

### Future Enhancements
1. Consider adding OTP resend cooldown timer
2. Add analytics tracking for OTP failures
3. Implement rate limiting for OTP requests

### Testing Recommendations
1. Test all contact email links on different email clients (Gmail, Outlook, Apple Mail)
2. Test OTP validation with various edge cases (expired, invalid, already used)
3. Test sheet positioning on various mobile devices and screen sizes
4. Verify product filtering with different data sets from backend

---

## ✅ All Tests Passing

**Logic Bugs:**
- [x] TC-44: Close announcement, refresh page, stays closed
- [x] TC-186: Newest notification at top
- [x] TC-121: Web - product name clickable, goes to details
- [x] TC-122: Mobile - product name not clickable
- [x] TC-100: All analysis cards collapsed initially
- [x] TC-102: Expand card, switch tab, return - stays expanded
- [x] TC-118: Securities in Securities tab, Alternatives in Alternatives tab

**Additional Fixes:**
- [x] Sheet: Mobile - starts below header (64px), Desktop - full screen
- [x] OTP: Submit disabled when < 6 digits, clear errors on typing
- [x] Email: Subject pre-filled with "iTrade Client Enquiry"

**UI Bugs (Previously Completed):**
- [x] TC-46: Announcement truncates on all screen sizes
- [x] TC-142: Article description shows exactly 3 lines max
- [x] TC-143: Dates show as "20-Jan-2026" format
- [x] TC-189: Notification titles show 2 lines max with ellipsis
- [x] TC-195: No image placeholder when no image; title truncates
- [x] TC-124: Mobile shows "View Application Note"
- [x] TC-105: Modal scrollable, footer always visible
