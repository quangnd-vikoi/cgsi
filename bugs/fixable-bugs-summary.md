# Fixable Bugs Summary

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

#### 8. TC-44 - Announcement bar persistence
- **Type**: Logic Bug
- **Location**: Announcement bar component
- **Issue**: Bar reappears after page refresh when user closed it
- **Fix**: Use localStorage to persist hidden state
- **Complexity**: Easy (30 min)

#### 9. TC-186 - Notification sort order
- **Type**: Logic Bug
- **Location**: `app/(minimal)/sidebar/Notification.tsx`
- **Issue**: Notifications in incorrect order (should be newest first)
- **Fix**: Add `.sort()` with date comparison before rendering
- **Complexity**: Easy (20 min)

#### 10. TC-121/122 - Product name not clickable
- **Type**: Logic Bug
- **Location**: My Applications page
- **Issue**: Product name should be clickable on Web (not on Mobile)
- **Fix**:
  - Add onClick handler for Web
  - Use responsive logic to disable on mobile
  - Navigate to Product Details screen
- **Complexity**: Easy (45 min)

#### 11. TC-100 - Analysis tab default state
- **Type**: Logic Bug
- **Location**: Product Details page - Analysis tab
- **Issue**: First reason card expanded by default (all should be collapsed)
- **Fix**: Set all accordion items to collapsed initial state
- **Complexity**: Easy (15 min)

#### 12. TC-102 - Reason card state persistence
- **Type**: Logic Bug
- **Location**: Product Details page - Analysis tab
- **Issue**: Reason card state resets when switching between Overview/Analysis/Documents tabs
- **Fix**: Use state management (useState or context) to preserve accordion state within session
- **Complexity**: Medium (1-2 hours)

#### 13. TC-118 - Filter logic incorrect
- **Type**: Logic Bug
- **Location**: My Applications page - Filter tabs
- **Issue**: Securities applications showing in Alternatives tab
- **Fix**: Check filter logic, ensure correct mapping of application type to filter category
- **Complexity**: Medium (1-2 hours)

---

## 🚫 Bugs I Cannot Fix (24 bugs)

### Backend/API Issues

**Authentication & Session**
- TC-7: Session timeout handling
- TC-9: Logout function not working
- TC-16, TC-22: OTP validation page refresh
- TC-17, TC-23: OTP expiry message

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
- TC-219, TC-220: Contact navigation
- TC-223, TC-224, TC-225: Contact interaction

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
