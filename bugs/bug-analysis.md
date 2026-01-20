# Bug List Analysis - QA Round 1

**Analysis Date:** 2026-01-20
**Total Failed Test Cases:** 82

## Summary Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| Error | 42 | 51.2% |
| Closed | 11 | 13.4% |
| Unable to Test | 29 | 35.4% |

## Bug Categorization by Type

### 🎨 UI Bugs (Can Fix - 7 bugs)

| TC ID | Issue | Location | Fix Complexity |
|-------|-------|----------|----------------|
| TC-46 | Announcement text not truncated with ellipsis on wide screens | Home page - Announcement bar | Easy |
| TC-142 | Article description showing 4 lines instead of max 3 with ellipsis | Home page - CGSI Insights | Easy |
| TC-143 | Date format YYYY-MM-DD instead of DD-MMM-YYYY | Home page - CGSI Insights | Easy |
| TC-105 | Pop-up window height not scaled, footer with CTA blocked | Product Application Form | Medium |
| TC-124 | Button text shows "[View]" instead of "[View Application Note]" | My Applications - Mobile | Easy |
| TC-189 | Notification title text no new line display and no truncation (max 2 lines) | Notifications preview | Easy |
| TC-195 | Notification detail title formatting issues, placeholder image showing when no image | Notification detail view | Easy |

### ⚙️ Logic Bugs (Can Fix - 6 bugs)

| TC ID | Issue | Location | Fix Complexity |
|-------|-------|----------|----------------|
| TC-44 | Announcement bar remains visible after page refresh (should persist hidden state) | Home page - Announcement bar | Easy |
| TC-100 | First reason card expanded by default (all should be collapsed) | Product Details - Analysis tab | Easy |
| TC-102 | Reason card state resets when switching tabs (should persist within session) | Product Details - Analysis tab | Medium |
| TC-186 | Notifications displayed in incorrect order (should be newest to oldest) | Notifications | Easy |
| TC-118 | My Applications filter showing wrong category (Securities in Alternatives tab) | My Applications - Filter | Medium |
| TC-121/122 | Product name not clickable on Web (should redirect to Product Details) | My Applications | Easy |

### 🔌 Backend/API Issues (Cannot Fix - 24 bugs)

These require backend API changes or are authentication/session management issues:

**Authentication & Session (4 bugs)**
- TC-7: Session timeout handling incorrect
- TC-9: Logout function not working
- TC-16, TC-22: OTP validation (less than 6 digits) causing page refresh
- TC-17, TC-23: OTP expiry message incorrect

**Data Source & API (13 bugs)**
- TC-38: Announcement using wrong source (Corporate Website instead of iTrade)
- TC-81: Securities product count mismatch (home shows 1, IOP page shows 2)
- TC-89: Product card not greyed-out when closed
- TC-113: Terms & Conditions link does nothing
- TC-114, TC-115: Product application submission errors (invalid JSON)
- TC-125: Alternatives product count mismatch
- TC-126: AI account still blocked from CP Listing
- TC-129, TC-131: Access restriction popup not functional
- TC-158: PayNow popup not showing
- TC-163, TC-164: Trust Account donation errors
- TC-211: Trading Representative API missing

**Features & Navigation (7 bugs)**
- TC-174: Notification bell red dot not showing
- TC-188: Notification toast not working
- TC-196: Change Password redirects to prod site
- TC-219, TC-220: Central Dealing Desk navigation broken (goes to Client Service)
- TC-223: Email subject not pre-filled
- TC-224: Phone number click does nothing
- TC-225: Email subject not pre-filled

### ⚪ Closed Issues (Not Required - 11 bugs)

These are no longer relevant due to design changes or are not required:

- TC-30, TC-36: Rate-limit retrieval (not required)
- TC-52: Max 6 banners (verify after redesign)
- TC-59: Banner auto-rotate (no longer relevant)
- TC-63: Expired events (still showing, retained for now)
- TC-66: Max 8 events (now 6 after redesign)
- TC-79: Event banner auto-rotate (no longer relevant)
- TC-104: Document loading failures (need new file host)
- TC-138: Max 10 articles (now 6 after redesign)
- TC-146: Blurred carousel preview (no longer relevant)
- TC-149: Article carousel auto-rotate (no longer relevant)

### 🔒 Unable to Test (Blocked - 29 bugs)

These cannot be tested due to missing features, API access, or dependencies on other bugs:

**Blocked by Other Bugs (8 bugs)**
- TC-90, TC-91, TC-92: Blocked by TC-89 (closed product greyed-out state)
- TC-159, TC-160, TC-161, TC-162: Blocked by TC-158 (PayNow popup bug)
- TC-106: Need account with only one cash account

**Missing API/Data (2 bugs)**
- TC-47: Cannot unhighlight all announcements in CMS
- TC-53: Need new campaigns with different dates

**Change Password Flow (11 bugs)**
- TC-197 through TC-208: Entire Change Password flow needs implementation

**Notification Features (8 bugs)**
- TC-177 through TC-182, TC-185: Notification unread state, persistence, and mark as read features

## Priority Recommendations

### High Priority (Can Fix Now - 13 bugs)

These are frontend issues that can be fixed immediately:

1. **UI Fixes (7)**
   - TC-143: Date format correction
   - TC-46: Announcement truncation
   - TC-142: Article description truncation
   - TC-189, TC-195: Notification formatting
   - TC-124: Button text
   - TC-105: Modal height scaling

2. **Logic Fixes (6)**
   - TC-44: Announcement bar persistence
   - TC-186: Notification sorting
   - TC-121/122: Product name clickable
   - TC-100: Analysis tab default state
   - TC-102: Reason card state persistence
   - TC-118: Filter logic

### Medium Priority (Need Backend Support - 24 bugs)

Requires coordination with backend team.

### Low Priority (Blocked/Closed - 40 bugs)

Not actionable at this time.

## Files Likely Affected

Based on the bugs, these files will need updates:

### UI Component Files
- `app/(minimal)/sidebar/Notification.tsx` - TC-189, TC-195, TC-186
- `app/(with-layout)/(home)/_component/Investment.tsx` - TC-46, TC-142, TC-143
- `app/(with-layout)/(detail)/my-applications/*` - TC-124, TC-121/122, TC-118
- Product application modal components - TC-105

### State Management
- Local storage for announcement bar state - TC-44
- Product details state management - TC-100, TC-102

### CSS/Styling
- `app/globals.css` or component-specific styles for truncation
- Modal/dialog height constraints

## Next Steps

1. **Start with Easy Wins**: Fix the 7 UI bugs first (truncation, formatting, text)
2. **Then Logic Bugs**: Fix the 6 logic bugs (sorting, state persistence, filters)
3. **Document Backend Needs**: Create tickets for the 24 backend/API issues
4. **Unblock Testing**: Once PayNow and other core features work, retest the blocked issues
5. **Reassess Closed Items**: After redesign completion, verify closed items align with new design

## Effort Estimation

| Category | Easy (< 1 hour) | Medium (1-4 hours) | Hard (> 4 hours) |
|----------|-----------------|---------------------|------------------|
| UI Fixes | 6 bugs | 1 bug | 0 bugs |
| Logic Fixes | 3 bugs | 3 bugs | 0 bugs |
| **Total Fixable** | **9 bugs** | **4 bugs** | **0 bugs** |

**Estimated Total Effort**: 8-12 hours for all 13 frontend-fixable bugs
