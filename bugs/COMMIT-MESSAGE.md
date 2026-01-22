# Suggested Commit Message

```
fix: resolve 9 bugs including logic issues, OTP validation, and mobile UX

Logic Bugs Fixed:
- TC-44: Add announcement bar localStorage persistence
- TC-186: Sort notifications by date (newest first)
- TC-121/122: Make product names clickable on web only
- TC-100: Set analysis accordion default to collapsed
- TC-102: Persist accordion state across tab switches
- TC-118: Fix application filter logic for securities/alternatives

UI/UX Improvements:
- Fix sheet mobile positioning (64px offset below header)
- Improve OTP validation (disable submit, better errors)
- Add email subject pre-fill ("iTrade Client Enquiry")

Files Changed:
- components/Header.tsx
- components/ui/sheet.tsx
- lib/utils.ts
- app/(with-layout)/layout.tsx
- app/(minimal)/sidebar/SheetManager.tsx
- app/(minimal)/sidebar/Notification.tsx
- app/(minimal)/sidebar/TradingRepresentative.tsx
- app/(with-layout)/(detail)/my-applications/page.tsx
- app/(with-layout)/(detail)/update-mobile/page.tsx
- app/(with-layout)/(detail)/update-email/page.tsx
- app/(with-layout)/(form)/_components/AnalysisTab.tsx
- app/(with-layout)/(form)/_components/ProductDetailsContext.tsx

Breaking Changes: None

JIRA Tickets: TC-44, TC-186, TC-121, TC-122, TC-100, TC-102, TC-118
```

---

## Alternative (Detailed) Commit Message

```
fix(ui): announcement bar persistence and notification sorting

- feat(announcement): persist closed state in localStorage (TC-44)
  Store announcement close state using anchor_link as key
  Check localStorage on mount to prevent re-showing

- fix(notifications): sort by date descending (TC-186)
  Apply sort to both initial load and pagination
  Newest notifications now appear at top

- feat(applications): make product names clickable on web (TC-121/122)
  Responsive design: clickable button on desktop, plain text on mobile
  Navigate to securities/alternatives page with pre-selected item

- fix(analysis): set accordion default to collapsed (TC-100)
  Remove defaultValue prop from Accordion component

- feat(analysis): persist accordion state across tabs (TC-102)
  Add openAccordionValue state to ProductDetailsContext
  Accordion expansion state preserved when switching tabs

- fix(applications): correct filter logic for product types (TC-118)
  Normalize product type strings
  Map variants correctly to securities/alternatives
  Add warning for unknown types

- fix(sheet): mobile positioning below header (64px offset)
  Sheet and overlay start at top-16 (64px) on mobile
  Full screen (top-0) on desktop (md+)
  Users can see header while sheet is open on mobile

- feat(otp): improve validation and error handling
  Disable submit button when OTP < 6 digits
  Clear errors automatically when user types
  Better error messages for validation failures
  TODO added for backend OTP expiry integration

- feat(email): pre-fill subject line for contact emails
  All contact email links include subject "iTrade Client Enquiry"
  Applies to Trading Representative and Client Services

Co-authored-by: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## For Squash Merge

```
fix: resolve 9 critical bugs (TC-44, TC-186, TC-121/122, TC-100, TC-102, TC-118)

Includes OTP validation improvements, mobile sheet positioning, and email subject pre-fill.

See bugs/RECENT-FIXES.md for detailed changelog.
```

---

## Branch Name Suggestions

```bash
# By feature type
fix/ui-logic-bugs-sprint-6
fix/tc-44-tc-186-tc-118
refactor/otp-validation-ux

# By component
fix/announcements-notifications-filters
fix/sheet-positioning-mobile
feat/contact-email-improvements

# Recommended
fix/sprint-6-bug-fixes
```
