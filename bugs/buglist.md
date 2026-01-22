# SG Client Portal - QA Round 1 Test Cases - Bug Report

**Date:** 2026-01-20

## Summary

- **Total Failed Test Cases:** 82
  - Error: 42
  - Closed: 11
  - Unable to Test: 29

---

## 🔴 Error Test Cases (42)

### 1. [ ] TC-7 - Session Timeout

**Feature:** N/A# SG Client Portal - QA Round 1 Test Cases - Bug Report

**Date:** 2026-01-20

## Summary

- **Total Failed Test Cases:** 82
  - Error: 42
  - Closed: 11
  - Unable to Test: 29

---

## 🔴 Error Test Cases (42)

### 1. [ ] TC-7 - Session Timeout

**Feature:** N/A

**Steps:**
```
1. Login with 2FA
2. Remain inactive until session timeout
```

**Expected Result:**
```
User auto logs out after session timeout
```

**Actual Result:**
```
Asking for Autorisation Code
```

**Status:** ❌ Error

**Comments:**
> Not sure of session timeout and handling of asking for auth code is not smooth

---

### 2. [ ] TC-9 - Logout

**Feature:** N/A

**Steps:**
```
1. Click Profile Centre (User icon)
2. Click 'Log Out'
```

**Expected Result:**
```
Session terminated & Redirected back to Login page
```

**Actual Result:**
```
No Response
```

**Status:** ❌ Error

**Notes:**
> Logout function does'nt work

---

### 3. [ ] TC-16 - Verify system validation when input is less than 6 digits

**Feature:** N/A

**Steps:**
```
1. Enter OTP less then 6 digits
```

**Expected Result:**
```
Unable to click  submit
```

**Actual Result:**
```
Please enter the 6 digit numbers that sent to your mobile number + Refreshed page
```

**Status:** ❌ Error

---

### 4. [ ] TC-17 - OTP expiry

**Feature:** N/A

**Steps:**
```
1. Wait until OTP TTL expires (2 mins)
2. Enter OTP
```

**Expected Result:**
```
Error 'Sorry, your entries do not match. Please try again.'
```

**Actual Result:**
```
Sorry, your entries do not match. Please try again.
```

**Status:** ❌ Error

**Comments:**
> Should be 'OTP has expired after 2 minutes, please request for a new one'

---

### 5. [ ] TC-22 - Verify system validation when input is less than 6 digits

**Feature:** N/A

**Steps:**
```
1. Enter OTP less then 6 digits
```

**Expected Result:**
```
Unable to click  submit
```

**Actual Result:**
```
Please enter the 6 digit numbers that sent to your mobile number + Refreshed page
```

**Status:** ❌ Error

---

### 6. [ ] TC-23 - OTP expiry

**Feature:** N/A

**Steps:**
```
1. Wait until OTP TTL expires
2. Enter OTP
```

**Expected Result:**
```
Error 'Sorry, your entries do not match. Please try again.'
```

**Actual Result:**
```
Sorry, your entries do not match. Please try again.
```

**Status:** ❌ Error

**Comments:**
> Should be 'OTP has expired after 2 minutes, please request for a new one'

---

### 7. [ ] TC-38 - Announcement preview

**Feature:** Announcement Bar

**Steps:**
```
1. Open home page
```

**Expected Result:**
```
Preview shows announcement title; formatted correctly.
```

**Actual Result:**
```
Preview shows announcement message from CGSI Corporate Website, not iTrade highlighted announcements
```

**Status:** ❌ Error

**Notes:**
> Source: https://www.cgsi.com.sg/our-offerings/platform/itrade?lang=EN

---

### 8. [ ] TC-44 - Verify announcement bar remains hidden after page refresh

**Feature:** N/A

**Steps:**
```
1. Right click and Reload or Short cut F5
```

**Expected Result:**
```
Announcement bar remains hidden 
```

**Actual Result:**
```
Annoucement bar still displayed
```

**Status:** ❌ Error

---

### 9. [ ] TC-46 - Verify announcement text is truncated with ellipsis when exceeding one line

**Feature:** N/A

**Steps:**
```
1. Open home page
```

**Expected Result:**
```
If the announcement text exceeds one line, the remaining text should be truncated and replaced with an ellipsis (…)
```

**Actual Result:**
```
No remaining text is truncated with an ellipsis at end of line when screen is wide
```

**Status:** ❌ Error

---

### 10. [ ] TC-81 - Verify Securities entry point displays available product count

**Feature:** Initial Offering Price (IOP)

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
The Securities entry point displays “[x] Available”.
[x] correctly reflects the total number of available Securities products open for subscription.
Products that are closed or unavailable are excluded from the count.
```

**Actual Result:**
```
The Home page shows only 1 available product, whereas the IOP page shows 2 available products still within application window.
```

**Status:** ❌ Error

---

### 11. [ ] TC-89 - Verify product card appearance when product is closed for subscription

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
Product card is displayed in a greyed-out (disabled) state.
```

**Actual Result:**
```
Product card didn't displayed in a greyed-out (disabled) state.
```

**Status:** ❌ Error

---

### 12. [ ] TC-100 - Verify Analysis tab default collapsed state

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Analysis' tab
```

**Expected Result:**
```
All reason cards are displayed in collapsed view by default.

Each collapsed card displays:
Reason Title
Drop-down arrow
```

**Actual Result:**
```
the first reason card is expanded view by default
```

**Status:** ❌ Error

---

### 13. [ ] TC-102 - Verify reason card state persistence when switching sub-tabs

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Analysis' tab
3. Click Second reason to expand
4. Select 'Overview' tab then switch back to 'Analysis'
```

**Expected Result:**
```
If a reason card is expanded:
Switching to another sub-tab (Overview/Documents) and back to Analysis retains the expanded state.

If user exits Product Details screen and re-enters:
All reason cards return to default collapsed state.
```

**Actual Result:**
```
reason card state reset such that only first one is pre-opened
```

**Status:** ❌ Error

---

### 14. [ ] TC-105 - Verify Product Application Form basic information display

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
4. Click 'Details ->' of first product list
5. Click Apply
```

**Expected Result:**
```
Product listing name is displayed correctly.
Product Listing Code.Exchange Code tag is displayed correctly.
```

**Actual Result:**
```
Pop-up window's height not scaled according to screen height, leading to footer with CTA being blocked
```

**Status:** ❌ Error

---

### 15. [ ] TC-113 - Verify Terms & Conditions link behavior

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Click Terms & Condition
```

**Expected Result:**
```
On mobile, T&Cs opens in in-app WebView.

On web and mobile web responsive, T&Cs opens in a new browser tab.
```

**Actual Result:**
```
Nothing happened
```

**Status:** ❌ Error

---

### 16. [ ] TC-114 - Verify successful product application submission

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Select default account
3. Select Debit card as payment
4. Select SGD as currenycy
5. Click (+)
6. Accept terms&condition
7. Sumbit application
```

**Expected Result:**
```
Application form is closed after successful submission.

Success toast message is displayed:

Title: Success!

Body: Your {Product type} Application for {Product Name} has been submitted successfully.

Application note is opened according to platform behavior.

Product card displays “Applied” tag after submission.
```

**Actual Result:**
```
Got error 'Submission failed'
Unexpected  token <>! Is not valid json
```

**Status:** ❌ Error

---

### 17. [ ] TC-115 - Verify unsuccessful product application submission

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Select default account
3. Select Debit card as payment
4. Select SGD as currenycy
5. Click (+)
6. Accept terms&condition
7. Sumbit application
```

**Expected Result:**
```
Application form remains open.

Error toast message is displayed:

Title: Error Encountered

Body: Something went wrong. Please try again later.
```

**Actual Result:**
```
Got error 'Submission failed'
Unexpected  token <>! Is not valid json
```

**Status:** ❌ Error

---

### 18. [ ] TC-118 - Verify My Applications filter options

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Select all
3. Select Securities
4. Select Alternatives
```

**Expected Result:**
```
Filter options “All”, “Securities”, and “Alternatives” are displayed.

Selecting a filter displays applications based on the selected category.
```

**Actual Result:**
```
My account MWLEONG12 have 1 securities but it display for Alternatives tab
```

**Status:** ❌ Error

**Notes:**
> Need applied one of each types to test filter options are correct.

---

### 19. [ ] TC-121 - Verify Product Name click behavior on Web

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click Profuct name
```

**Expected Result:**
```
Clicking Product Name on Web redirects user to the Product Details screen
```

**Actual Result:**
```
Unable to Click Product name
```

**Status:** ❌ Error

---

### 20. [ ] TC-122 - Verify Product Name behavior on Mobile

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click Profuct name
```

**Expected Result:**
```
Product Name is not clickable on Mobile.
```

**Actual Result:**
```
Unable to Click Product name
```

**Status:** ❌ Error

---

### 21. [ ] TC-124 - Verify Application Note access on Mobile

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click View application note
```

**Expected Result:**
```
Clicking [View Application Note] opens the Application Note in a new browser tab on Mobile.
```

**Actual Result:**
```
 it should be   [View Application Note] but it display as [View]
```

**Status:** ❌ Error

**Comments:**
> UI Error shouldn’t use table for mobile responsive version, refer to refined design on figma

---

### 22. [ ] TC-125 - Verify Alternatives entry point displays available product count for Accredited Investor (AI)

**Feature:** Commercial Papers (CP)

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
```

**Expected Result:**
```
The Securities entry point displays “[x] Available”.
[x] correctly reflects the total number of available Securities products open for subscription.
Products that are closed or unavailable are excluded from the count.
```

**Actual Result:**
```
The Home page shows only 0 available product, whereas the CP page shows 1 available products still within application window.
```

**Status:** ❌ Error

---

### 23. [ ] TC-126 - Verify Alternatives product catalog is displayed for Accredited Investor (AI)

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
```

**Expected Result:**
```
When an Accredited Investor (AI) clicks on “Alternatives”:

The system immediately displays the Alternatives product catalog.
```

**Actual Result:**
```
Logged in with AI account but still blocked from accessing CP Listing
```

**Status:** ❌ Error

---

### 24. [ ] TC-129 - Verify closing the access restriction pop-up

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
4. Click Cancel or x icon
```

**Expected Result:**
```
Closes the pop-up window.

Returns the user to the previous screen without navigating away.
```

**Actual Result:**
```
Function doesn't work cant click close or x
```

**Status:** ❌ Error

---

### 25. [ ] TC-131 - Verify Declaration Form link from access restriction pop-up

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
4. Click Declaration Form
```

**Expected Result:**
```
Opens the declaration form PDF in a new web browser tab.

The correct document is loaded from the URL:
https://itrade.cgsi.com.sg/app/download/AccreditedInvestor_Declare.pdf
```

**Actual Result:**
```
Function doesn't work , Nothing happen
```

**Status:** ❌ Error

---

### 26. [ ] TC-142 - Verify article description is limited to three lines with ellipsis

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The article description is displayed with a maximum of three lines.
If the description exceeds three lines, the remaining text is truncated with an ellipsis (…) at the end of the last visible line.
```

**Actual Result:**
```
Card has 4 lines
```

**Status:** ❌ Error

**Comments:**
> Check truncated logic again after redesign

---

### 27. [ ] TC-143 - Verify article date is displayed in DD-MMM-YYYY format

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
T he article date is displayed in DD-MMM-YYYY format.
```

**Actual Result:**
```
Posted Date if YYYY-MM-DD format, should be DD-mmm-YYYY
```

**Status:** ❌ Error

---

### 28. [ ] TC-158 - Verify PayNow payment gateway pop-up is displayed

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"
```

**Expected Result:**
```
When PayNow is selected and T&Cs are acknowledged, the PayNow payment gateway pop-up is displayed.
```

**Actual Result:**
```
Success Message shown instead
```

**Status:** ❌ Error

---

### 29. [ ] TC-163 - Verify Trust Account donation success flow

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Trust account
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After successful Trust Account donation:
User is returned to One-Time Donation form
A “Thank you!” notification is displayed
```

**Actual Result:**
```
Got error instead
```

**Status:** ❌ Error

---

### 30. [ ] TC-164 - Verify Trust Account donation unsuccess flow

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Trust account
4. Select accept 'Terms & Conditions'
5. Click 'Donation'

```

**Expected Result:**
```
a “Donation Payment Failedl” notification is displayed.
```

**Actual Result:**
```
Got error instead
```

**Status:** ❌ Error

---

### 31. [ ] TC-174 - Verify notification bell displays red dot when there are new notifications

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
When there are new notifications since the user’s last session, the notification bell is displayed with a red dot.
```

**Actual Result:**
```
There is no red dot, profile is highlighted instead when the notification drawer is opened 
```

**Status:** ❌ Error

---

### 32. [ ] TC-186 - Verify notifications are displayed in correct order

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Notifications are displayed from newest (top) to oldest (bottom).
```

**Actual Result:**
```
Incorrect order
```

**Status:** ❌ Error

---

### 33. [ ] TC-188 - Verify notification toast is displayed when notification is received while logged in

**Feature:** N/A

**Steps:**
```
1.Open home page 
```

**Expected Result:**
```
When a notification is received while the user is logged in:

A toast message is displayed
Title is displayed in max 1 line
Body is displayed in max 3 lines
Excess text is truncated with ellipsis (…)
```

**Actual Result:**
```
This function doesn't work there is no notification toast
```

**Status:** ❌ Error

---

### 34. [ ] TC-189 - Verify notification preview title format and truncation

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Title is displayed in bold
Maximum 2 lines
Excess text is truncated with ellipsis (…)
```

**Actual Result:**
```
The title text is not display a new line and no truncated text
```

**Status:** ❌ Error

---

### 35. [ ] TC-195 - Verify notification detail displays correct information

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click first notification
```

**Expected Result:**
```
The notification detail view displays:

Notification banner (if available).
Notification title in bold (max 2 lines, truncated with …).
Date and time in DD-MMM-YYYY • HH:mm SGT format.
Full notification body content.
```

**Actual Result:**
```
The title text is not display a new line and no truncated text. If there's no image then the placeholder rectangle for image shouldnt be shown
```

**Status:** ❌ Error

---

### 36. [ ] TC-196 - Verify user can access Change Password via Profile menu

**Feature:** Change Password

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password

```

**Expected Result:**
```
User can navigate to Profile > Password & Security > Change Password successfully.
```

**Actual Result:**
```
Directed to prod iTrade site https://itrade.cgsi.com.sg/app/trade.z
```

**Status:** ❌ Error

**Comments:**
> Need to add Change Password flow and do redirection

---

### 37. [ ] TC-211 - Verify Trading Representative section is displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'

```

**Expected Result:**
```
The Trading Representative(s) section is displayed with a navigation indicator (>).
```

**Actual Result:**
```
N/A
```

**Status:** ❌ Error

**Comments:**
> Need API to populate TR Contact Info

---

### 38. [ ] TC-219 - Verify Central Dealing Desk operating hours information is displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Central Dealing Desk'

```

**Expected Result:**
```
The following text is displayed:

Available 08:30 – 17:30 SGT, 21:30 – 04:00 SGT (Mon–Fri)
For immediate assistance, you may contact your Trading Representative
```

**Actual Result:**
```
System navigate to 'Client Service' instead of Central Dealing Desk
```

**Status:** ❌ Error

---

### 39. [ ] TC-220 - Verify Central Dealing Desk contact details are displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Central Dealing Desk'

```

**Expected Result:**
```
The following details are displayed:

Central Dealing Number: +65 6232 5888
Company Address:
10 Marina Boulevard, #09-01 Marina Bay Financial Centre Tower 2, Singapore 018983
```

**Actual Result:**
```
System navigate to 'Client Service' instead of Central Dealing Desk
```

**Status:** ❌ Error

---

### 40. [ ] TC-223 - Verify clicking an email address opens email app on mobile

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for email
```

**Expected Result:**
```
Clicking an email address opens the default email app, creates a new email, pre-fills the To field with the selected email address, and sets the subject to “iTrade Client Enquiry”.
```

**Actual Result:**
```
There is no auto pre-fill subjects to 'Itrade Client Enquiry'
```

**Status:** ❌ Error

---

### 41. [ ] TC-224 - Verify clicking a mobile number opens phone app on desktop

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for mobile number 
```

**Expected Result:**
```
Clicking a mobile number on web triggers the phone application on desktop with the number prefilled.
```

**Actual Result:**
```
No Response
```

**Status:** ❌ Error

---

### 42. [ ] TC-225 - Verify clicking an email address opens email client on web

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for email
```

**Expected Result:**
```
Clicking an email address opens the default email client, creates a new email, pre-fills the To field with the selected email address, and sets the subject to “iTrade Client Enquiry”.
```

**Actual Result:**
```
There is no auto pre-fill subjects to 'Itrade Client Enquiry'
```

**Status:** ❌ Error

---

## ⚠️ Closed Test Cases (11)

### 1. [ ] TC-30 - Rate-limit retrieval

**Feature:** N/A

**Steps:**
```
1. Submit multiple times rapidly
```

**Expected Result:**
```
Throttle/cooldown enforced; audit log recorded
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Not required

---

### 2. [ ] TC-36 - Rate-limit retrieval

**Feature:** N/A

**Steps:**
```
1. Submit multiple times rapidly
```

**Expected Result:**
```
Throttle/cooldown enforced; audit log recorded
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Not required

---

### 3. [ ] TC-52 - Verify banner section supports a maximum of six banners

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
The banner section displays up to six banners only.
If more than six banners are available, only the latest six banners are shown.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max banners displayed of 6 after redesign

---

### 4. [ ] TC-59 - Verify banners auto-rotate every 6 seconds

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
Banners automatically rotate every 6 seconds without user interaction.
```

**Actual Result:**
```
No banner automatically rotate every 6 sec.
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 5. [ ] TC-63 - Expired events excluded by default

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
3. Cross check with Corporate Website Source
```

**Expected Result:**
```
Expired Events & Seminars should not be visible on homepage
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Still showing events past their end date retain for now

---

### 6. [ ] TC-66 - Verify Events & Seminars section displays up to eight events

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
```

**Expected Result:**
```
A maximum of eight (8) event or seminar tiles are displayed
```

**Actual Result:**
```
Only six (6) event or seminar tiles are displayed
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max cards displayed of 6 after redesign

---

### 7. [ ] TC-79 - Verify event banners auto rotate every 6 seconds on mobile

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
```

**Expected Result:**
```
Event banners automatically rotate every 6 seconds.
```

**Actual Result:**
```
No banner automatically rotate every 6 sec.
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 8. [ ] TC-104 - Verify document open behaviour

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Documents' tab
3. Click one of documents list
```

**Expected Result:**
```
Clicking a document opens the PDF in a new browser tab.
Document content loads successfully.
```

**Actual Result:**
```
Multiple documents failed to load.
```

**Status:** ⚠️ Closed

**Comments:**
> Will need to start porting over doc uploads to either corporate website or another file host

---

### 9. [ ] TC-138 - Verify CGSI Insights carousel displays up to ten articles

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The carousel displays a maximum of ten (10) most recent articles.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max insight cards displayed of 6 after redesign

---

### 10. [ ] TC-146 - Verify blurred preview of articles is visible at both ends of the carousel

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
Blurred previews of adjacent articles are visible at both ends of the carousel
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 11. [ ] TC-149 - Verify article carousel auto rotates every 6 seconds on mobile

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The article carousel automatically rotates every 6 seconds.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

## 🟡 Unable to Test (29)

### 1. [ ] TC-47 - Unhighlighted Announcements

**Feature:** N/A

**Steps:**
```
1. Go to Strapi CMS and unhighlight all CMS
2. Login
3. Highlight 1 announcement
4. Refresh page
```

**Expected Result:**
```
Announcement preview should not appear until an announcement has been highlighted on Strapi CMS
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Unable to test due to wrong source used for announcement displayed

---

### 2. [ ] TC-53 - Verify banners are displayed in descending order of posting date and time

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
Banners are displayed with the most recently published banner shown first, and the oldest banner shown last.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Wait for new Camapign with Starting Date that's not 1 Jan 2026

---

### 3. [ ] TC-90 - Verify product card details for closed product

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
The following details are displayed on the greyed-out product card:
Applied tag (if the user has applied before)
Product Name
“Detail ->” CTA
{Product Listing Code.Exchange Code} tag
Closing Date | dd-MMM-yyyy, HH:mm SGT

The following fields are not displayed:
Issue Price
Trading Currency
Minimum Number of Units
Opening Date
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 4. [ ] TC-91 - Verify Applied tag visibility for closed product

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
Applied tag is displayed on closed product cards only if the user has applied previously.

If no prior application exists, the Applied tag is not shown.
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 5. [ ] TC-92 - Verify Detail CTA behaviour for closed product

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
4. Click 'Details ->' of closed product
```

**Expected Result:**
```
“Detail ->” remains visible and clickable.
Clicking “Detail ->” allows the user to view product details in read-only mode.
User is not able to perform any subscription actions.
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 6. [ ] TC-106 - Verify account auto-fill behavior when user has only one cash account

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
```

**Expected Result:**
```
Account field is auto-filled with the only available cash account.
Account field is disabled.
Tapping the account field displays toast message:
“Account currently only has 1 Cash Account”.
```

**Actual Result:**
```
Need user login for user has only one cash account
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need API to populate Account field with client's accounts instead of placeholders

---

### 7. [ ] TC-159 - Verify user is returned to Donation screen after closing PayNow pop-up

**Feature:** N/A

**Steps:**
```
1. Perform steps 1-5 from [Verify PayNow payment gateway pop-up is displayed]
2. Click 'Back'
```

**Expected Result:**
```
Closing the PayNow pop-up returns user to the Donation screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 8. [ ] TC-160 - Verify PayNow payment check status

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"
6. Click 'Check Status'
```

**Expected Result:**
```
Display current payment status
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 9. [ ] TC-161 - Verify success message is shown after PayNow donation

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After successful PayNow donation, a “Payment Successful” notification is displayed.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 10. [ ] TC-162 - Verify unsuccess message is shown after PayNow donation

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After unsuccessful PayNow donation, a “Donation Payment Failedl” notification is displayed.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 11. [ ] TC-177 - Verify Notification Centre displays notifications since last logged-out session

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
The Notification Centre displays 3 notifications sent after the user’s last logged-out session.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 12. [ ] TC-178 - Verify unread notifications remain unread across sessions

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
Notifications left unread since the last session remain marked as unread and are displayed in the Recent Notifications list.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 13. [ ] TC-179 - Verify unread notification count is displayed correctly

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
The Notification Centre displays 3 Unread Notification(s)
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 14. [ ] TC-180 - Verify Mark All as Read pop-up is displayed

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3. Click Mark all as Read
```

**Expected Result:**
```
When click Mark all as Read displays a confirmation pop-up with Confirm and Cancel options.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 15. [ ] TC-181 - Verify cancelling Mark All as Read keeps notifications unchanged

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click Mark all as Read
4.Click Cancel
```

**Expected Result:**
```
Clicking Cancel or closing the pop-up leaves all notifications unchanged and keeps the Notification Centre drawer open.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 16. [ ] TC-182 - Verify all notifications are marked as read after confirmation

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click Mark all as Read
4.Click Confirm
```

**Expected Result:**
```
The pop-up is closed.
All notifications under the selected tab are marked as read.
Blue highlights and red dots are removed.
A toast message is displayed to confirm the action.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 17. [ ] TC-185 - Verify unread notifications are highlighted

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Unread notifications are highlighted in blue and display a red dot beside the notification title.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 18. [ ] TC-197 - Verify Change Password opens in a new browser tab

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password

```

**Expected Result:**
```
A new browser tab is opened and user is redirected to the CGSI iTrade pre-login Change Password screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 19. [ ] TC-198 - Verify error message is displayed for invalid  current password

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Continue'

```

**Expected Result:**
```
Input field is highlighted in red
An error message is displayed above the input field''Sorry,your entry is invalid,Please try again'
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 20. [ ] TC-199 - Verify Cancel action shows Session Complete screen from current password step

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Cancel'

```

**Expected Result:**
```
Clicking Cancel displays the Session Complete screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 21. [ ] TC-200 - Verify Close page

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Cancel'
6. Click 'Close Page'

```

**Expected Result:**
```
User can click on ‘Close Page’ to close the web browser tab
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 22. [ ] TC-201 - Verify user proceeds to Reset Password screen with correct current password

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input valid password
5. Click 'Continue'

```

**Expected Result:**
```
After entering the correct current password and clicking Continue, user is navigated to the Reset Password screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 23. [ ] TC-202 - Verify real-time password validation rules are displayed

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
```

**Expected Result:**
```
The following real-time validation rules are displayed:

Includes at least 1 alphabet
Includes at least 1 number
Minimum 8 characters
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 24. [ ] TC-203 - Verify password validation indicators update in real time

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input A
3. Input 8
4. Input d23191
```

**Expected Result:**
```
As the user types:
Met criteria turn green with a green tick
Unmet criteria remain greyed out
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 25. [ ] TC-204 - Verify user cannot reuse last three passwords

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input one of last tree previously used passwords
```

**Expected Result:**
```
If the new password matches any of the last three previously used passwords, the system rejects the password and displays an error message.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 26. [ ] TC-205 - Verify error message is displayed when passwords do not match

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS12345678!
```

**Expected Result:**
```
If the Confirm New Password does not match the New Password:

Input field is highlighted in red.
Error message “Passwords do not match.” is displayed above the input field.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 27. [ ] TC-206 - Verify password visibility toggle works correctly

**Feature:** N/A

**Steps:**
```
1. Perform steps 1-3 from [Verify error message is displayed when passwords do not match]
```

**Expected Result:**
```
Password input is masked by default.
Clicking the eye icon reveals the entered password
Clicking again hides the password
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 28. [ ] TC-207 - Verify successful password reset

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS123456789!
```

**Expected Result:**
```
Upon successful submission:

Message “Password reset successful.” is displayed
User can click Close Page to close the browser tab
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 29. [ ] TC-208 - Verify email notification is sent after successful password change

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS123456789!
```

**Expected Result:**
```
An email notification is sent to the user confirming the successful password change.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---# SG Client Portal - QA Round 1 Test Cases - Bug Report

**Date:** 2026-01-20

## Summary

- **Total Failed Test Cases:** 82
  - Error: 42
  - Closed: 11
  - Unable to Test: 29

---

## 🔴 Error Test Cases (42)

### 1. [ ] TC-7 - Session Timeout

**Feature:** N/A

**Steps:**
```
1. Login with 2FA
2. Remain inactive until session timeout
```

**Expected Result:**
```
User auto logs out after session timeout
```

**Actual Result:**
```
Asking for Autorisation Code
```

**Status:** ❌ Error

**Comments:**
> Not sure of session timeout and handling of asking for auth code is not smooth

---

### 2. [ ] TC-9 - Logout

**Feature:** N/A

**Steps:**
```
1. Click Profile Centre (User icon)
2. Click 'Log Out'
```

**Expected Result:**
```
Session terminated & Redirected back to Login page
```

**Actual Result:**
```
No Response
```

**Status:** ❌ Error

**Notes:**
> Logout function does'nt work

---

### 3. [ ] TC-16 - Verify system validation when input is less than 6 digits

**Feature:** N/A

**Steps:**
```
1. Enter OTP less then 6 digits
```

**Expected Result:**
```
Unable to click  submit
```

**Actual Result:**
```
Please enter the 6 digit numbers that sent to your mobile number + Refreshed page
```

**Status:** ❌ Error

---

### 4. [ ] TC-17 - OTP expiry

**Feature:** N/A

**Steps:**
```
1. Wait until OTP TTL expires (2 mins)
2. Enter OTP
```

**Expected Result:**
```
Error 'Sorry, your entries do not match. Please try again.'
```

**Actual Result:**
```
Sorry, your entries do not match. Please try again.
```

**Status:** ❌ Error

**Comments:**
> Should be 'OTP has expired after 2 minutes, please request for a new one'

---

### 5. [ ] TC-22 - Verify system validation when input is less than 6 digits

**Feature:** N/A

**Steps:**
```
1. Enter OTP less then 6 digits
```

**Expected Result:**
```
Unable to click  submit
```

**Actual Result:**
```
Please enter the 6 digit numbers that sent to your mobile number + Refreshed page
```

**Status:** ❌ Error

---

### 6. [ ] TC-23 - OTP expiry

**Feature:** N/A

**Steps:**
```
1. Wait until OTP TTL expires
2. Enter OTP
```

**Expected Result:**
```
Error 'Sorry, your entries do not match. Please try again.'
```

**Actual Result:**
```
Sorry, your entries do not match. Please try again.
```

**Status:** ❌ Error

**Comments:**
> Should be 'OTP has expired after 2 minutes, please request for a new one'

---

### 7. [ ] TC-38 - Announcement preview

**Feature:** Announcement Bar

**Steps:**
```
1. Open home page
```

**Expected Result:**
```
Preview shows announcement title; formatted correctly.
```

**Actual Result:**
```
Preview shows announcement message from CGSI Corporate Website, not iTrade highlighted announcements
```

**Status:** ❌ Error

**Notes:**
> Source: https://www.cgsi.com.sg/our-offerings/platform/itrade?lang=EN

---

### 8. [ ] TC-44 - Verify announcement bar remains hidden after page refresh

**Feature:** N/A

**Steps:**
```
1. Right click and Reload or Short cut F5
```

**Expected Result:**
```
Announcement bar remains hidden 
```

**Actual Result:**
```
Annoucement bar still displayed
```

**Status:** ❌ Error

---

### 9. [ ] TC-46 - Verify announcement text is truncated with ellipsis when exceeding one line

**Feature:** N/A

**Steps:**
```
1. Open home page
```

**Expected Result:**
```
If the announcement text exceeds one line, the remaining text should be truncated and replaced with an ellipsis (…)
```

**Actual Result:**
```
No remaining text is truncated with an ellipsis at end of line when screen is wide
```

**Status:** ❌ Error

---

### 10. [ ] TC-81 - Verify Securities entry point displays available product count

**Feature:** Initial Offering Price (IOP)

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
The Securities entry point displays “[x] Available”.
[x] correctly reflects the total number of available Securities products open for subscription.
Products that are closed or unavailable are excluded from the count.
```

**Actual Result:**
```
The Home page shows only 1 available product, whereas the IOP page shows 2 available products still within application window.
```

**Status:** ❌ Error

---

### 11. [ ] TC-89 - Verify product card appearance when product is closed for subscription

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
Product card is displayed in a greyed-out (disabled) state.
```

**Actual Result:**
```
Product card didn't displayed in a greyed-out (disabled) state.
```

**Status:** ❌ Error

---

### 12. [ ] TC-100 - Verify Analysis tab default collapsed state

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Analysis' tab
```

**Expected Result:**
```
All reason cards are displayed in collapsed view by default.

Each collapsed card displays:
Reason Title
Drop-down arrow
```

**Actual Result:**
```
the first reason card is expanded view by default
```

**Status:** ❌ Error

---

### 13. [ ] TC-102 - Verify reason card state persistence when switching sub-tabs

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Analysis' tab
3. Click Second reason to expand
4. Select 'Overview' tab then switch back to 'Analysis'
```

**Expected Result:**
```
If a reason card is expanded:
Switching to another sub-tab (Overview/Documents) and back to Analysis retains the expanded state.

If user exits Product Details screen and re-enters:
All reason cards return to default collapsed state.
```

**Actual Result:**
```
reason card state reset such that only first one is pre-opened
```

**Status:** ❌ Error

---

### 14. [ ] TC-105 - Verify Product Application Form basic information display

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
4. Click 'Details ->' of first product list
5. Click Apply
```

**Expected Result:**
```
Product listing name is displayed correctly.
Product Listing Code.Exchange Code tag is displayed correctly.
```

**Actual Result:**
```
Pop-up window's height not scaled according to screen height, leading to footer with CTA being blocked
```

**Status:** ❌ Error

---

### 15. [ ] TC-113 - Verify Terms & Conditions link behavior

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Click Terms & Condition
```

**Expected Result:**
```
On mobile, T&Cs opens in in-app WebView.

On web and mobile web responsive, T&Cs opens in a new browser tab.
```

**Actual Result:**
```
Nothing happened
```

**Status:** ❌ Error

---

### 16. [ ] TC-114 - Verify successful product application submission

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Select default account
3. Select Debit card as payment
4. Select SGD as currenycy
5. Click (+)
6. Accept terms&condition
7. Sumbit application
```

**Expected Result:**
```
Application form is closed after successful submission.

Success toast message is displayed:

Title: Success!

Body: Your {Product type} Application for {Product Name} has been submitted successfully.

Application note is opened according to platform behavior.

Product card displays “Applied” tag after submission.
```

**Actual Result:**
```
Got error 'Submission failed'
Unexpected  token <>! Is not valid json
```

**Status:** ❌ Error

---

### 17. [ ] TC-115 - Verify unsuccessful product application submission

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Select default account
3. Select Debit card as payment
4. Select SGD as currenycy
5. Click (+)
6. Accept terms&condition
7. Sumbit application
```

**Expected Result:**
```
Application form remains open.

Error toast message is displayed:

Title: Error Encountered

Body: Something went wrong. Please try again later.
```

**Actual Result:**
```
Got error 'Submission failed'
Unexpected  token <>! Is not valid json
```

**Status:** ❌ Error

---

### 18. [ ] TC-118 - Verify My Applications filter options

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Select all
3. Select Securities
4. Select Alternatives
```

**Expected Result:**
```
Filter options “All”, “Securities”, and “Alternatives” are displayed.

Selecting a filter displays applications based on the selected category.
```

**Actual Result:**
```
My account MWLEONG12 have 1 securities but it display for Alternatives tab
```

**Status:** ❌ Error

**Notes:**
> Need applied one of each types to test filter options are correct.

---

### 19. [ ] TC-121 - Verify Product Name click behavior on Web

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click Profuct name
```

**Expected Result:**
```
Clicking Product Name on Web redirects user to the Product Details screen
```

**Actual Result:**
```
Unable to Click Product name
```

**Status:** ❌ Error

---

### 20. [ ] TC-122 - Verify Product Name behavior on Mobile

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click Profuct name
```

**Expected Result:**
```
Product Name is not clickable on Mobile.
```

**Actual Result:**
```
Unable to Click Product name
```

**Status:** ❌ Error

---

### 21. [ ] TC-124 - Verify Application Note access on Mobile

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click View application note
```

**Expected Result:**
```
Clicking [View Application Note] opens the Application Note in a new browser tab on Mobile.
```

**Actual Result:**
```
 it should be   [View Application Note] but it display as [View]
```

**Status:** ❌ Error

**Comments:**
> UI Error shouldn’t use table for mobile responsive version, refer to refined design on figma

---

### 22. [ ] TC-125 - Verify Alternatives entry point displays available product count for Accredited Investor (AI)

**Feature:** Commercial Papers (CP)

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
```

**Expected Result:**
```
The Securities entry point displays “[x] Available”.
[x] correctly reflects the total number of available Securities products open for subscription.
Products that are closed or unavailable are excluded from the count.
```

**Actual Result:**
```
The Home page shows only 0 available product, whereas the CP page shows 1 available products still within application window.
```

**Status:** ❌ Error

---

### 23. [ ] TC-126 - Verify Alternatives product catalog is displayed for Accredited Investor (AI)

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
```

**Expected Result:**
```
When an Accredited Investor (AI) clicks on “Alternatives”:

The system immediately displays the Alternatives product catalog.
```

**Actual Result:**
```
Logged in with AI account but still blocked from accessing CP Listing
```

**Status:** ❌ Error

---

### 24. [ ] TC-129 - Verify closing the access restriction pop-up

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
4. Click Cancel or x icon
```

**Expected Result:**
```
Closes the pop-up window.

Returns the user to the previous screen without navigating away.
```

**Actual Result:**
```
Function doesn't work cant click close or x
```

**Status:** ❌ Error

---

### 25. [ ] TC-131 - Verify Declaration Form link from access restriction pop-up

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
4. Click Declaration Form
```

**Expected Result:**
```
Opens the declaration form PDF in a new web browser tab.

The correct document is loaded from the URL:
https://itrade.cgsi.com.sg/app/download/AccreditedInvestor_Declare.pdf
```

**Actual Result:**
```
Function doesn't work , Nothing happen
```

**Status:** ❌ Error

---

### 26. [ ] TC-142 - Verify article description is limited to three lines with ellipsis

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The article description is displayed with a maximum of three lines.
If the description exceeds three lines, the remaining text is truncated with an ellipsis (…) at the end of the last visible line.
```

**Actual Result:**
```
Card has 4 lines
```

**Status:** ❌ Error

**Comments:**
> Check truncated logic again after redesign

---

### 27. [ ] TC-143 - Verify article date is displayed in DD-MMM-YYYY format

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
T he article date is displayed in DD-MMM-YYYY format.
```

**Actual Result:**
```
Posted Date if YYYY-MM-DD format, should be DD-mmm-YYYY
```

**Status:** ❌ Error

---

### 28. [ ] TC-158 - Verify PayNow payment gateway pop-up is displayed

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"
```

**Expected Result:**
```
When PayNow is selected and T&Cs are acknowledged, the PayNow payment gateway pop-up is displayed.
```

**Actual Result:**
```
Success Message shown instead
```

**Status:** ❌ Error

---

### 29. [ ] TC-163 - Verify Trust Account donation success flow

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Trust account
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After successful Trust Account donation:
User is returned to One-Time Donation form
A “Thank you!” notification is displayed
```

**Actual Result:**
```
Got error instead
```

**Status:** ❌ Error

---

### 30. [ ] TC-164 - Verify Trust Account donation unsuccess flow

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Trust account
4. Select accept 'Terms & Conditions'
5. Click 'Donation'

```

**Expected Result:**
```
a “Donation Payment Failedl” notification is displayed.
```

**Actual Result:**
```
Got error instead
```

**Status:** ❌ Error

---

### 31. [ ] TC-174 - Verify notification bell displays red dot when there are new notifications

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
When there are new notifications since the user’s last session, the notification bell is displayed with a red dot.
```

**Actual Result:**
```
There is no red dot, profile is highlighted instead when the notification drawer is opened 
```

**Status:** ❌ Error

---

### 32. [ ] TC-186 - Verify notifications are displayed in correct order

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Notifications are displayed from newest (top) to oldest (bottom).
```

**Actual Result:**
```
Incorrect order
```

**Status:** ❌ Error

---

### 33. [ ] TC-188 - Verify notification toast is displayed when notification is received while logged in

**Feature:** N/A

**Steps:**
```
1.Open home page 
```

**Expected Result:**
```
When a notification is received while the user is logged in:

A toast message is displayed
Title is displayed in max 1 line
Body is displayed in max 3 lines
Excess text is truncated with ellipsis (…)
```

**Actual Result:**
```
This function doesn't work there is no notification toast
```

**Status:** ❌ Error

---

### 34. [ ] TC-189 - Verify notification preview title format and truncation

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Title is displayed in bold
Maximum 2 lines
Excess text is truncated with ellipsis (…)
```

**Actual Result:**
```
The title text is not display a new line and no truncated text
```

**Status:** ❌ Error

---

### 35. [ ] TC-195 - Verify notification detail displays correct information

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click first notification
```

**Expected Result:**
```
The notification detail view displays:

Notification banner (if available).
Notification title in bold (max 2 lines, truncated with …).
Date and time in DD-MMM-YYYY • HH:mm SGT format.
Full notification body content.
```

**Actual Result:**
```
The title text is not display a new line and no truncated text. If there's no image then the placeholder rectangle for image shouldnt be shown
```

**Status:** ❌ Error

---

### 36. [ ] TC-196 - Verify user can access Change Password via Profile menu

**Feature:** Change Password

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password

```

**Expected Result:**
```
User can navigate to Profile > Password & Security > Change Password successfully.
```

**Actual Result:**
```
Directed to prod iTrade site https://itrade.cgsi.com.sg/app/trade.z
```

**Status:** ❌ Error

**Comments:**
> Need to add Change Password flow and do redirection

---

### 37. [ ] TC-211 - Verify Trading Representative section is displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'

```

**Expected Result:**
```
The Trading Representative(s) section is displayed with a navigation indicator (>).
```

**Actual Result:**
```
N/A
```

**Status:** ❌ Error

**Comments:**
> Need API to populate TR Contact Info

---

### 38. [ ] TC-219 - Verify Central Dealing Desk operating hours information is displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Central Dealing Desk'

```

**Expected Result:**
```
The following text is displayed:

Available 08:30 – 17:30 SGT, 21:30 – 04:00 SGT (Mon–Fri)
For immediate assistance, you may contact your Trading Representative
```

**Actual Result:**
```
System navigate to 'Client Service' instead of Central Dealing Desk
```

**Status:** ❌ Error

---

### 39. [ ] TC-220 - Verify Central Dealing Desk contact details are displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Central Dealing Desk'

```

**Expected Result:**
```
The following details are displayed:

Central Dealing Number: +65 6232 5888
Company Address:
10 Marina Boulevard, #09-01 Marina Bay Financial Centre Tower 2, Singapore 018983
```

**Actual Result:**
```
System navigate to 'Client Service' instead of Central Dealing Desk
```

**Status:** ❌ Error

---

### 40. [ ] TC-223 - Verify clicking an email address opens email app on mobile

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for email
```

**Expected Result:**
```
Clicking an email address opens the default email app, creates a new email, pre-fills the To field with the selected email address, and sets the subject to “iTrade Client Enquiry”.
```

**Actual Result:**
```
There is no auto pre-fill subjects to 'Itrade Client Enquiry'
```

**Status:** ❌ Error

---

### 41. [ ] TC-224 - Verify clicking a mobile number opens phone app on desktop

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for mobile number 
```

**Expected Result:**
```
Clicking a mobile number on web triggers the phone application on desktop with the number prefilled.
```

**Actual Result:**
```
No Response
```

**Status:** ❌ Error

---

### 42. [ ] TC-225 - Verify clicking an email address opens email client on web

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for email
```

**Expected Result:**
```
Clicking an email address opens the default email client, creates a new email, pre-fills the To field with the selected email address, and sets the subject to “iTrade Client Enquiry”.
```

**Actual Result:**
```
There is no auto pre-fill subjects to 'Itrade Client Enquiry'
```

**Status:** ❌ Error

---

## ⚠️ Closed Test Cases (11)

### 1. [ ] TC-30 - Rate-limit retrieval

**Feature:** N/A

**Steps:**
```
1. Submit multiple times rapidly
```

**Expected Result:**
```
Throttle/cooldown enforced; audit log recorded
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Not required

---

### 2. [ ] TC-36 - Rate-limit retrieval

**Feature:** N/A

**Steps:**
```
1. Submit multiple times rapidly
```

**Expected Result:**
```
Throttle/cooldown enforced; audit log recorded
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Not required

---

### 3. [ ] TC-52 - Verify banner section supports a maximum of six banners

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
The banner section displays up to six banners only.
If more than six banners are available, only the latest six banners are shown.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max banners displayed of 6 after redesign

---

### 4. [ ] TC-59 - Verify banners auto-rotate every 6 seconds

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
Banners automatically rotate every 6 seconds without user interaction.
```

**Actual Result:**
```
No banner automatically rotate every 6 sec.
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 5. [ ] TC-63 - Expired events excluded by default

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
3. Cross check with Corporate Website Source
```

**Expected Result:**
```
Expired Events & Seminars should not be visible on homepage
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Still showing events past their end date retain for now

---

### 6. [ ] TC-66 - Verify Events & Seminars section displays up to eight events

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
```

**Expected Result:**
```
A maximum of eight (8) event or seminar tiles are displayed
```

**Actual Result:**
```
Only six (6) event or seminar tiles are displayed
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max cards displayed of 6 after redesign

---

### 7. [ ] TC-79 - Verify event banners auto rotate every 6 seconds on mobile

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
```

**Expected Result:**
```
Event banners automatically rotate every 6 seconds.
```

**Actual Result:**
```
No banner automatically rotate every 6 sec.
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 8. [ ] TC-104 - Verify document open behaviour

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Documents' tab
3. Click one of documents list
```

**Expected Result:**
```
Clicking a document opens the PDF in a new browser tab.
Document content loads successfully.
```

**Actual Result:**
```
Multiple documents failed to load.
```

**Status:** ⚠️ Closed

**Comments:**
> Will need to start porting over doc uploads to either corporate website or another file host

---

### 9. [ ] TC-138 - Verify CGSI Insights carousel displays up to ten articles

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The carousel displays a maximum of ten (10) most recent articles.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max insight cards displayed of 6 after redesign

---

### 10. [ ] TC-146 - Verify blurred preview of articles is visible at both ends of the carousel

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
Blurred previews of adjacent articles are visible at both ends of the carousel
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 11. [ ] TC-149 - Verify article carousel auto rotates every 6 seconds on mobile

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The article carousel automatically rotates every 6 seconds.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

## 🟡 Unable to Test (29)

### 1. [ ] TC-47 - Unhighlighted Announcements

**Feature:** N/A

**Steps:**
```
1. Go to Strapi CMS and unhighlight all CMS
2. Login
3. Highlight 1 announcement
4. Refresh page
```

**Expected Result:**
```
Announcement preview should not appear until an announcement has been highlighted on Strapi CMS
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Unable to test due to wrong source used for announcement displayed

---

### 2. [ ] TC-53 - Verify banners are displayed in descending order of posting date and time

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
Banners are displayed with the most recently published banner shown first, and the oldest banner shown last.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Wait for new Camapign with Starting Date that's not 1 Jan 2026

---

### 3. [ ] TC-90 - Verify product card details for closed product

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
The following details are displayed on the greyed-out product card:
Applied tag (if the user has applied before)
Product Name
“Detail ->” CTA
{Product Listing Code.Exchange Code} tag
Closing Date | dd-MMM-yyyy, HH:mm SGT

The following fields are not displayed:
Issue Price
Trading Currency
Minimum Number of Units
Opening Date
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 4. [ ] TC-91 - Verify Applied tag visibility for closed product

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
Applied tag is displayed on closed product cards only if the user has applied previously.

If no prior application exists, the Applied tag is not shown.
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 5. [ ] TC-92 - Verify Detail CTA behaviour for closed product

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
4. Click 'Details ->' of closed product
```

**Expected Result:**
```
“Detail ->” remains visible and clickable.
Clicking “Detail ->” allows the user to view product details in read-only mode.
User is not able to perform any subscription actions.
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 6. [ ] TC-106 - Verify account auto-fill behavior when user has only one cash account

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
```

**Expected Result:**
```
Account field is auto-filled with the only available cash account.
Account field is disabled.
Tapping the account field displays toast message:
“Account currently only has 1 Cash Account”.
```

**Actual Result:**
```
Need user login for user has only one cash account
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need API to populate Account field with client's accounts instead of placeholders

---

### 7. [ ] TC-159 - Verify user is returned to Donation screen after closing PayNow pop-up

**Feature:** N/A

**Steps:**
```
1. Perform steps 1-5 from [Verify PayNow payment gateway pop-up is displayed]
2. Click 'Back'
```

**Expected Result:**
```
Closing the PayNow pop-up returns user to the Donation screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 8. [ ] TC-160 - Verify PayNow payment check status

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"
6. Click 'Check Status'
```

**Expected Result:**
```
Display current payment status
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 9. [ ] TC-161 - Verify success message is shown after PayNow donation

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After successful PayNow donation, a “Payment Successful” notification is displayed.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 10. [ ] TC-162 - Verify unsuccess message is shown after PayNow donation

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After unsuccessful PayNow donation, a “Donation Payment Failedl” notification is displayed.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 11. [ ] TC-177 - Verify Notification Centre displays notifications since last logged-out session

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
The Notification Centre displays 3 notifications sent after the user’s last logged-out session.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 12. [ ] TC-178 - Verify unread notifications remain unread across sessions

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
Notifications left unread since the last session remain marked as unread and are displayed in the Recent Notifications list.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 13. [ ] TC-179 - Verify unread notification count is displayed correctly

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
The Notification Centre displays 3 Unread Notification(s)
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 14. [ ] TC-180 - Verify Mark All as Read pop-up is displayed

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3. Click Mark all as Read
```

**Expected Result:**
```
When click Mark all as Read displays a confirmation pop-up with Confirm and Cancel options.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 15. [ ] TC-181 - Verify cancelling Mark All as Read keeps notifications unchanged

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click Mark all as Read
4.Click Cancel
```

**Expected Result:**
```
Clicking Cancel or closing the pop-up leaves all notifications unchanged and keeps the Notification Centre drawer open.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 16. [ ] TC-182 - Verify all notifications are marked as read after confirmation

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click Mark all as Read
4.Click Confirm
```

**Expected Result:**
```
The pop-up is closed.
All notifications under the selected tab are marked as read.
Blue highlights and red dots are removed.
A toast message is displayed to confirm the action.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 17. [ ] TC-185 - Verify unread notifications are highlighted

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Unread notifications are highlighted in blue and display a red dot beside the notification title.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 18. [ ] TC-197 - Verify Change Password opens in a new browser tab

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password

```

**Expected Result:**
```
A new browser tab is opened and user is redirected to the CGSI iTrade pre-login Change Password screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 19. [ ] TC-198 - Verify error message is displayed for invalid  current password

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Continue'

```

**Expected Result:**
```
Input field is highlighted in red
An error message is displayed above the input field''Sorry,your entry is invalid,Please try again'
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 20. [ ] TC-199 - Verify Cancel action shows Session Complete screen from current password step

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Cancel'

```

**Expected Result:**
```
Clicking Cancel displays the Session Complete screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 21. [ ] TC-200 - Verify Close page

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Cancel'
6. Click 'Close Page'

```

**Expected Result:**
```
User can click on ‘Close Page’ to close the web browser tab
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 22. [ ] TC-201 - Verify user proceeds to Reset Password screen with correct current password

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input valid password
5. Click 'Continue'

```

**Expected Result:**
```
After entering the correct current password and clicking Continue, user is navigated to the Reset Password screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 23. [ ] TC-202 - Verify real-time password validation rules are displayed

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
```

**Expected Result:**
```
The following real-time validation rules are displayed:

Includes at least 1 alphabet
Includes at least 1 number
Minimum 8 characters
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 24. [ ] TC-203 - Verify password validation indicators update in real time

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input A
3. Input 8
4. Input d23191
```

**Expected Result:**
```
As the user types:
Met criteria turn green with a green tick
Unmet criteria remain greyed out
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 25. [ ] TC-204 - Verify user cannot reuse last three passwords

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input one of last tree previously used passwords
```

**Expected Result:**
```
If the new password matches any of the last three previously used passwords, the system rejects the password and displays an error message.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 26. [ ] TC-205 - Verify error message is displayed when passwords do not match

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS12345678!
```

**Expected Result:**
```
If the Confirm New Password does not match the New Password:

Input field is highlighted in red.
Error message “Passwords do not match.” is displayed above the input field.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 27. [ ] TC-206 - Verify password visibility toggle works correctly

**Feature:** N/A

**Steps:**
```
1. Perform steps 1-3 from [Verify error message is displayed when passwords do not match]
```

**Expected Result:**
```
Password input is masked by default.
Clicking the eye icon reveals the entered password
Clicking again hides the password
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 28. [ ] TC-207 - Verify successful password reset

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS123456789!
```

**Expected Result:**
```
Upon successful submission:

Message “Password reset successful.” is displayed
User can click Close Page to close the browser tab
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 29. [ ] TC-208 - Verify email notification is sent after successful password change

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS123456789!
```

**Expected Result:**
```
An email notification is sent to the user confirming the successful password change.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

**Steps:**
```
1. Login with 2FA
2. Remain inactive until session timeout
```

**Expected Result:**
```
User auto logs out after session timeout
```

**Actual Result:**
```
Asking for Autorisation Code
```

**Status:** ❌ Error

**Comments:**
> Not sure of session timeout and handling of asking for auth code is not smooth

---

### 2. [ ] TC-9 - Logout

**Feature:** N/A

**Steps:**
```
1. Click Profile Centre (User icon)
2. Click 'Log Out'
```

**Expected Result:**
```
Session terminated & Redirected back to Login page
```

**Actual Result:**
```
No Response
```

**Status:** ❌ Error

**Notes:**
> Logout function does'nt work

---

### 3. [ ] TC-16 - Verify system validation when input is less than 6 digits

**Feature:** N/A

**Steps:**
```
1. Enter OTP less then 6 digits
```

**Expected Result:**
```
Unable to click  submit
```

**Actual Result:**
```
Please enter the 6 digit numbers that sent to your mobile number + Refreshed page
```

**Status:** ❌ Error

---

### 4. [ ] TC-17 - OTP expiry

**Feature:** N/A

**Steps:**
```
1. Wait until OTP TTL expires (2 mins)
2. Enter OTP
```

**Expected Result:**
```
Error 'Sorry, your entries do not match. Please try again.'
```

**Actual Result:**
```
Sorry, your entries do not match. Please try again.
```

**Status:** ❌ Error

**Comments:**
> Should be 'OTP has expired after 2 minutes, please request for a new one'

---

### 5. [ ] TC-22 - Verify system validation when input is less than 6 digits

**Feature:** N/A

**Steps:**
```
1. Enter OTP less then 6 digits
```

**Expected Result:**
```
Unable to click  submit
```

**Actual Result:**
```
Please enter the 6 digit numbers that sent to your mobile number + Refreshed page
```

**Status:** ❌ Error

---

### 6. [ ] TC-23 - OTP expiry

**Feature:** N/A

**Steps:**
```
1. Wait until OTP TTL expires
2. Enter OTP
```

**Expected Result:**
```
Error 'Sorry, your entries do not match. Please try again.'
```

**Actual Result:**
```
Sorry, your entries do not match. Please try again.
```

**Status:** ❌ Error

**Comments:**
> Should be 'OTP has expired after 2 minutes, please request for a new one'

---

### 7. [ ] TC-38 - Announcement preview

**Feature:** Announcement Bar

**Steps:**
```
1. Open home page
```

**Expected Result:**
```
Preview shows announcement title; formatted correctly.
```

**Actual Result:**
```
Preview shows announcement message from CGSI Corporate Website, not iTrade highlighted announcements
```

**Status:** ❌ Error

**Notes:**
> Source: https://www.cgsi.com.sg/our-offerings/platform/itrade?lang=EN

---

### 8. [ ] TC-44 - Verify announcement bar remains hidden after page refresh

**Feature:** N/A

**Steps:**
```
1. Right click and Reload or Short cut F5
```

**Expected Result:**
```
Announcement bar remains hidden 
```

**Actual Result:**
```
Annoucement bar still displayed
```

**Status:** ❌ Error

---

### 9. [ ] TC-46 - Verify announcement text is truncated with ellipsis when exceeding one line

**Feature:** N/A

**Steps:**
```
1. Open home page
```

**Expected Result:**
```
If the announcement text exceeds one line, the remaining text should be truncated and replaced with an ellipsis (…)
```

**Actual Result:**
```
No remaining text is truncated with an ellipsis at end of line when screen is wide
```

**Status:** ❌ Error

---

### 10. [ ] TC-81 - Verify Securities entry point displays available product count

**Feature:** Initial Offering Price (IOP)

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
The Securities entry point displays “[x] Available”.
[x] correctly reflects the total number of available Securities products open for subscription.
Products that are closed or unavailable are excluded from the count.
```

**Actual Result:**
```
The Home page shows only 1 available product, whereas the IOP page shows 2 available products still within application window.
```

**Status:** ❌ Error

---

### 11. [ ] TC-89 - Verify product card appearance when product is closed for subscription

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
Product card is displayed in a greyed-out (disabled) state.
```

**Actual Result:**
```
Product card didn't displayed in a greyed-out (disabled) state.
```

**Status:** ❌ Error

---

### 12. [ ] TC-100 - Verify Analysis tab default collapsed state

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Analysis' tab
```

**Expected Result:**
```
All reason cards are displayed in collapsed view by default.

Each collapsed card displays:
Reason Title
Drop-down arrow
```

**Actual Result:**
```
the first reason card is expanded view by default
```

**Status:** ❌ Error

---

### 13. [ ] TC-102 - Verify reason card state persistence when switching sub-tabs

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Analysis' tab
3. Click Second reason to expand
4. Select 'Overview' tab then switch back to 'Analysis'
```

**Expected Result:**
```
If a reason card is expanded:
Switching to another sub-tab (Overview/Documents) and back to Analysis retains the expanded state.

If user exits Product Details screen and re-enters:
All reason cards return to default collapsed state.
```

**Actual Result:**
```
reason card state reset such that only first one is pre-opened
```

**Status:** ❌ Error

---

### 14. [ ] TC-105 - Verify Product Application Form basic information display

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
4. Click 'Details ->' of first product list
5. Click Apply
```

**Expected Result:**
```
Product listing name is displayed correctly.
Product Listing Code.Exchange Code tag is displayed correctly.
```

**Actual Result:**
```
Pop-up window's height not scaled according to screen height, leading to footer with CTA being blocked
```

**Status:** ❌ Error

---

### 15. [ ] TC-113 - Verify Terms & Conditions link behavior

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Click Terms & Condition
```

**Expected Result:**
```
On mobile, T&Cs opens in in-app WebView.

On web and mobile web responsive, T&Cs opens in a new browser tab.
```

**Actual Result:**
```
Nothing happened
```

**Status:** ❌ Error

---

### 16. [ ] TC-114 - Verify successful product application submission

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Select default account
3. Select Debit card as payment
4. Select SGD as currenycy
5. Click (+)
6. Accept terms&condition
7. Sumbit application
```

**Expected Result:**
```
Application form is closed after successful submission.

Success toast message is displayed:

Title: Success!

Body: Your {Product type} Application for {Product Name} has been submitted successfully.

Application note is opened according to platform behavior.

Product card displays “Applied” tag after submission.
```

**Actual Result:**
```
Got error 'Submission failed'
Unexpected  token <>! Is not valid json
```

**Status:** ❌ Error

---

### 17. [ ] TC-115 - Verify unsuccessful product application submission

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
2. Select default account
3. Select Debit card as payment
4. Select SGD as currenycy
5. Click (+)
6. Accept terms&condition
7. Sumbit application
```

**Expected Result:**
```
Application form remains open.

Error toast message is displayed:

Title: Error Encountered

Body: Something went wrong. Please try again later.
```

**Actual Result:**
```
Got error 'Submission failed'
Unexpected  token <>! Is not valid json
```

**Status:** ❌ Error

---

### 18. [ ] TC-118 - Verify My Applications filter options

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Select all
3. Select Securities
4. Select Alternatives
```

**Expected Result:**
```
Filter options “All”, “Securities”, and “Alternatives” are displayed.

Selecting a filter displays applications based on the selected category.
```

**Actual Result:**
```
My account MWLEONG12 have 1 securities but it display for Alternatives tab
```

**Status:** ❌ Error

**Notes:**
> Need applied one of each types to test filter options are correct.

---

### 19. [ ] TC-121 - Verify Product Name click behavior on Web

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click Profuct name
```

**Expected Result:**
```
Clicking Product Name on Web redirects user to the Product Details screen
```

**Actual Result:**
```
Unable to Click Product name
```

**Status:** ❌ Error

---

### 20. [ ] TC-122 - Verify Product Name behavior on Mobile

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click Profuct name
```

**Expected Result:**
```
Product Name is not clickable on Mobile.
```

**Actual Result:**
```
Unable to Click Product name
```

**Status:** ❌ Error

---

### 21. [ ] TC-124 - Verify Application Note access on Mobile

**Feature:** N/A

**Steps:**
```
1. Perform step 1-4 from [Verify access to My Applications from Product Listing Catalog]
2. Click View application note
```

**Expected Result:**
```
Clicking [View Application Note] opens the Application Note in a new browser tab on Mobile.
```

**Actual Result:**
```
 it should be   [View Application Note] but it display as [View]
```

**Status:** ❌ Error

**Comments:**
> UI Error shouldn’t use table for mobile responsive version, refer to refined design on figma

---

### 22. [ ] TC-125 - Verify Alternatives entry point displays available product count for Accredited Investor (AI)

**Feature:** Commercial Papers (CP)

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
```

**Expected Result:**
```
The Securities entry point displays “[x] Available”.
[x] correctly reflects the total number of available Securities products open for subscription.
Products that are closed or unavailable are excluded from the count.
```

**Actual Result:**
```
The Home page shows only 0 available product, whereas the CP page shows 1 available products still within application window.
```

**Status:** ❌ Error

---

### 23. [ ] TC-126 - Verify Alternatives product catalog is displayed for Accredited Investor (AI)

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
```

**Expected Result:**
```
When an Accredited Investor (AI) clicks on “Alternatives”:

The system immediately displays the Alternatives product catalog.
```

**Actual Result:**
```
Logged in with AI account but still blocked from accessing CP Listing
```

**Status:** ❌ Error

---

### 24. [ ] TC-129 - Verify closing the access restriction pop-up

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
4. Click Cancel or x icon
```

**Expected Result:**
```
Closes the pop-up window.

Returns the user to the previous screen without navigating away.
```

**Actual Result:**
```
Function doesn't work cant click close or x
```

**Status:** ❌ Error

---

### 25. [ ] TC-131 - Verify Declaration Form link from access restriction pop-up

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Alternatives
4. Click Declaration Form
```

**Expected Result:**
```
Opens the declaration form PDF in a new web browser tab.

The correct document is loaded from the URL:
https://itrade.cgsi.com.sg/app/download/AccreditedInvestor_Declare.pdf
```

**Actual Result:**
```
Function doesn't work , Nothing happen
```

**Status:** ❌ Error

---

### 26. [ ] TC-142 - Verify article description is limited to three lines with ellipsis

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The article description is displayed with a maximum of three lines.
If the description exceeds three lines, the remaining text is truncated with an ellipsis (…) at the end of the last visible line.
```

**Actual Result:**
```
Card has 4 lines
```

**Status:** ❌ Error

**Comments:**
> Check truncated logic again after redesign

---

### 27. [ ] TC-143 - Verify article date is displayed in DD-MMM-YYYY format

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
T he article date is displayed in DD-MMM-YYYY format.
```

**Actual Result:**
```
Posted Date if YYYY-MM-DD format, should be DD-mmm-YYYY
```

**Status:** ❌ Error

---

### 28. [ ] TC-158 - Verify PayNow payment gateway pop-up is displayed

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"
```

**Expected Result:**
```
When PayNow is selected and T&Cs are acknowledged, the PayNow payment gateway pop-up is displayed.
```

**Actual Result:**
```
Success Message shown instead
```

**Status:** ❌ Error

---

### 29. [ ] TC-163 - Verify Trust Account donation success flow

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Trust account
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After successful Trust Account donation:
User is returned to One-Time Donation form
A “Thank you!” notification is displayed
```

**Actual Result:**
```
Got error instead
```

**Status:** ❌ Error

---

### 30. [ ] TC-164 - Verify Trust Account donation unsuccess flow

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Trust account
4. Select accept 'Terms & Conditions'
5. Click 'Donation'

```

**Expected Result:**
```
a “Donation Payment Failedl” notification is displayed.
```

**Actual Result:**
```
Got error instead
```

**Status:** ❌ Error

---

### 31. [ ] TC-174 - Verify notification bell displays red dot when there are new notifications

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
When there are new notifications since the user’s last session, the notification bell is displayed with a red dot.
```

**Actual Result:**
```
There is no red dot, profile is highlighted instead when the notification drawer is opened 
```

**Status:** ❌ Error

---

### 32. [ ] TC-186 - Verify notifications are displayed in correct order

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Notifications are displayed from newest (top) to oldest (bottom).
```

**Actual Result:**
```
Incorrect order
```

**Status:** ❌ Error

---

### 33. [ ] TC-188 - Verify notification toast is displayed when notification is received while logged in

**Feature:** N/A

**Steps:**
```
1.Open home page 
```

**Expected Result:**
```
When a notification is received while the user is logged in:

A toast message is displayed
Title is displayed in max 1 line
Body is displayed in max 3 lines
Excess text is truncated with ellipsis (…)
```

**Actual Result:**
```
This function doesn't work there is no notification toast
```

**Status:** ❌ Error

---

### 34. [ ] TC-189 - Verify notification preview title format and truncation

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Title is displayed in bold
Maximum 2 lines
Excess text is truncated with ellipsis (…)
```

**Actual Result:**
```
The title text is not display a new line and no truncated text
```

**Status:** ❌ Error

---

### 35. [ ] TC-195 - Verify notification detail displays correct information

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click first notification
```

**Expected Result:**
```
The notification detail view displays:

Notification banner (if available).
Notification title in bold (max 2 lines, truncated with …).
Date and time in DD-MMM-YYYY • HH:mm SGT format.
Full notification body content.
```

**Actual Result:**
```
The title text is not display a new line and no truncated text. If there's no image then the placeholder rectangle for image shouldnt be shown
```

**Status:** ❌ Error

---

### 36. [ ] TC-196 - Verify user can access Change Password via Profile menu

**Feature:** Change Password

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password

```

**Expected Result:**
```
User can navigate to Profile > Password & Security > Change Password successfully.
```

**Actual Result:**
```
Directed to prod iTrade site https://itrade.cgsi.com.sg/app/trade.z
```

**Status:** ❌ Error

**Comments:**
> Need to add Change Password flow and do redirection

---

### 37. [ ] TC-211 - Verify Trading Representative section is displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'

```

**Expected Result:**
```
The Trading Representative(s) section is displayed with a navigation indicator (>).
```

**Actual Result:**
```
N/A
```

**Status:** ❌ Error

**Comments:**
> Need API to populate TR Contact Info

---

### 38. [ ] TC-219 - Verify Central Dealing Desk operating hours information is displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Central Dealing Desk'

```

**Expected Result:**
```
The following text is displayed:

Available 08:30 – 17:30 SGT, 21:30 – 04:00 SGT (Mon–Fri)
For immediate assistance, you may contact your Trading Representative
```

**Actual Result:**
```
System navigate to 'Client Service' instead of Central Dealing Desk
```

**Status:** ❌ Error

---

### 39. [ ] TC-220 - Verify Central Dealing Desk contact details are displayed

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Central Dealing Desk'

```

**Expected Result:**
```
The following details are displayed:

Central Dealing Number: +65 6232 5888
Company Address:
10 Marina Boulevard, #09-01 Marina Bay Financial Centre Tower 2, Singapore 018983
```

**Actual Result:**
```
System navigate to 'Client Service' instead of Central Dealing Desk
```

**Status:** ❌ Error

---

### 40. [ ] TC-223 - Verify clicking an email address opens email app on mobile

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for email
```

**Expected Result:**
```
Clicking an email address opens the default email app, creates a new email, pre-fills the To field with the selected email address, and sets the subject to “iTrade Client Enquiry”.
```

**Actual Result:**
```
There is no auto pre-fill subjects to 'Itrade Client Enquiry'
```

**Status:** ❌ Error

---

### 41. [ ] TC-224 - Verify clicking a mobile number opens phone app on desktop

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for mobile number 
```

**Expected Result:**
```
Clicking a mobile number on web triggers the phone application on desktop with the number prefilled.
```

**Actual Result:**
```
No Response
```

**Status:** ❌ Error

---

### 42. [ ] TC-225 - Verify clicking an email address opens email client on web

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Click 'Contact Us'
3. Click 'Trading Representative or Client Service or Central Dealing Desk'
4. Click (->) icon for email
```

**Expected Result:**
```
Clicking an email address opens the default email client, creates a new email, pre-fills the To field with the selected email address, and sets the subject to “iTrade Client Enquiry”.
```

**Actual Result:**
```
There is no auto pre-fill subjects to 'Itrade Client Enquiry'
```

**Status:** ❌ Error

---

## ⚠️ Closed Test Cases (11)

### 1. [ ] TC-30 - Rate-limit retrieval

**Feature:** N/A

**Steps:**
```
1. Submit multiple times rapidly
```

**Expected Result:**
```
Throttle/cooldown enforced; audit log recorded
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Not required

---

### 2. [ ] TC-36 - Rate-limit retrieval

**Feature:** N/A

**Steps:**
```
1. Submit multiple times rapidly
```

**Expected Result:**
```
Throttle/cooldown enforced; audit log recorded
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Not required

---

### 3. [ ] TC-52 - Verify banner section supports a maximum of six banners

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
The banner section displays up to six banners only.
If more than six banners are available, only the latest six banners are shown.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max banners displayed of 6 after redesign

---

### 4. [ ] TC-59 - Verify banners auto-rotate every 6 seconds

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
Banners automatically rotate every 6 seconds without user interaction.
```

**Actual Result:**
```
No banner automatically rotate every 6 sec.
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 5. [ ] TC-63 - Expired events excluded by default

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
3. Cross check with Corporate Website Source
```

**Expected Result:**
```
Expired Events & Seminars should not be visible on homepage
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Still showing events past their end date retain for now

---

### 6. [ ] TC-66 - Verify Events & Seminars section displays up to eight events

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
```

**Expected Result:**
```
A maximum of eight (8) event or seminar tiles are displayed
```

**Actual Result:**
```
Only six (6) event or seminar tiles are displayed
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max cards displayed of 6 after redesign

---

### 7. [ ] TC-79 - Verify event banners auto rotate every 6 seconds on mobile

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Events & Seminar
```

**Expected Result:**
```
Event banners automatically rotate every 6 seconds.
```

**Actual Result:**
```
No banner automatically rotate every 6 sec.
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 8. [ ] TC-104 - Verify document open behaviour

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-4 from [Verify Overview tab is the default selected sub-tab]
2. Select 'Documents' tab
3. Click one of documents list
```

**Expected Result:**
```
Clicking a document opens the PDF in a new browser tab.
Document content loads successfully.
```

**Actual Result:**
```
Multiple documents failed to load.
```

**Status:** ⚠️ Closed

**Comments:**
> Will need to start porting over doc uploads to either corporate website or another file host

---

### 9. [ ] TC-138 - Verify CGSI Insights carousel displays up to ten articles

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The carousel displays a maximum of ten (10) most recent articles.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> Verify max insight cards displayed of 6 after redesign

---

### 10. [ ] TC-146 - Verify blurred preview of articles is visible at both ends of the carousel

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
Blurred previews of adjacent articles are visible at both ends of the carousel
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

### 11. [ ] TC-149 - Verify article carousel auto rotates every 6 seconds on mobile

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to "CGSI Insights"

```

**Expected Result:**
```
The article carousel automatically rotates every 6 seconds.
```

**Actual Result:**
```
N/A
```

**Status:** ⚠️ Closed

**Comments:**
> No longer relevant due to redesign logic

---

## 🟡 Unable to Test (29)

### 1. [ ] TC-47 - Unhighlighted Announcements

**Feature:** N/A

**Steps:**
```
1. Go to Strapi CMS and unhighlight all CMS
2. Login
3. Highlight 1 announcement
4. Refresh page
```

**Expected Result:**
```
Announcement preview should not appear until an announcement has been highlighted on Strapi CMS
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Unable to test due to wrong source used for announcement displayed

---

### 2. [ ] TC-53 - Verify banners are displayed in descending order of posting date and time

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Promos & Campaigns
```

**Expected Result:**
```
Banners are displayed with the most recently published banner shown first, and the oldest banner shown last.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Wait for new Camapign with Starting Date that's not 1 Jan 2026

---

### 3. [ ] TC-90 - Verify product card details for closed product

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
The following details are displayed on the greyed-out product card:
Applied tag (if the user has applied before)
Product Name
“Detail ->” CTA
{Product Listing Code.Exchange Code} tag
Closing Date | dd-MMM-yyyy, HH:mm SGT

The following fields are not displayed:
Issue Price
Trading Currency
Minimum Number of Units
Opening Date
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 4. [ ] TC-91 - Verify Applied tag visibility for closed product

**Feature:** N/A

**Steps:**
```
 1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
```

**Expected Result:**
```
Applied tag is displayed on closed product cards only if the user has applied previously.

If no prior application exists, the Applied tag is not shown.
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 5. [ ] TC-92 - Verify Detail CTA behaviour for closed product

**Feature:** N/A

**Steps:**
```
1. Open home page
2. Scroll down to Investment Products 
3. Click on Securties
4. Click 'Details ->' of closed product
```

**Expected Result:**
```
“Detail ->” remains visible and clickable.
Clicking “Detail ->” allows the user to view product details in read-only mode.
User is not able to perform any subscription actions.
```

**Actual Result:**
```
Need to fixed  TC [Verify product card appearance when product is closed for subscription] first
```

**Status:** 🟡 Unable to Test

---

### 6. [ ] TC-106 - Verify account auto-fill behavior when user has only one cash account

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify Product Application Form basic information display]
```

**Expected Result:**
```
Account field is auto-filled with the only available cash account.
Account field is disabled.
Tapping the account field displays toast message:
“Account currently only has 1 Cash Account”.
```

**Actual Result:**
```
Need user login for user has only one cash account
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need API to populate Account field with client's accounts instead of placeholders

---

### 7. [ ] TC-159 - Verify user is returned to Donation screen after closing PayNow pop-up

**Feature:** N/A

**Steps:**
```
1. Perform steps 1-5 from [Verify PayNow payment gateway pop-up is displayed]
2. Click 'Back'
```

**Expected Result:**
```
Closing the PayNow pop-up returns user to the Donation screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 8. [ ] TC-160 - Verify PayNow payment check status

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"
6. Click 'Check Status'
```

**Expected Result:**
```
Display current payment status
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 9. [ ] TC-161 - Verify success message is shown after PayNow donation

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After successful PayNow donation, a “Payment Successful” notification is displayed.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 10. [ ] TC-162 - Verify unsuccess message is shown after PayNow donation

**Feature:** N/A

**Steps:**
```
1. Go to Donations
2. Input donation amount 1
3. Payment Method : Pay now
4. Select accept 'Terms & Conditions"
5. Click 'Donation"

```

**Expected Result:**
```
After unsuccessful PayNow donation, a “Donation Payment Failedl” notification is displayed.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

**Comments:**
> Need to fix paynow popup bug

---

### 11. [ ] TC-177 - Verify Notification Centre displays notifications since last logged-out session

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
The Notification Centre displays 3 notifications sent after the user’s last logged-out session.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 12. [ ] TC-178 - Verify unread notifications remain unread across sessions

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
Notifications left unread since the last session remain marked as unread and are displayed in the Recent Notifications list.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 13. [ ] TC-179 - Verify unread notification count is displayed correctly

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Verify on Notification Bell
```

**Expected Result:**
```
The Notification Centre displays 3 Unread Notification(s)
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 14. [ ] TC-180 - Verify Mark All as Read pop-up is displayed

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3. Click Mark all as Read
```

**Expected Result:**
```
When click Mark all as Read displays a confirmation pop-up with Confirm and Cancel options.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 15. [ ] TC-181 - Verify cancelling Mark All as Read keeps notifications unchanged

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click Mark all as Read
4.Click Cancel
```

**Expected Result:**
```
Clicking Cancel or closing the pop-up leaves all notifications unchanged and keeps the Notification Centre drawer open.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 16. [ ] TC-182 - Verify all notifications are marked as read after confirmation

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell
3.Click Mark all as Read
4.Click Confirm
```

**Expected Result:**
```
The pop-up is closed.
All notifications under the selected tab are marked as read.
Blue highlights and red dots are removed.
A toast message is displayed to confirm the action.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 17. [ ] TC-185 - Verify unread notifications are highlighted

**Feature:** N/A

**Steps:**
```
1.Open home page 
2.Click on Notification Bell

```

**Expected Result:**
```
Unread notifications are highlighted in blue and display a red dot beside the notification title.
```

**Actual Result:**
```
Can't make sure that function work properly
```

**Status:** 🟡 Unable to Test

---

### 18. [ ] TC-197 - Verify Change Password opens in a new browser tab

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password

```

**Expected Result:**
```
A new browser tab is opened and user is redirected to the CGSI iTrade pre-login Change Password screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 19. [ ] TC-198 - Verify error message is displayed for invalid  current password

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Continue'

```

**Expected Result:**
```
Input field is highlighted in red
An error message is displayed above the input field''Sorry,your entry is invalid,Please try again'
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 20. [ ] TC-199 - Verify Cancel action shows Session Complete screen from current password step

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Cancel'

```

**Expected Result:**
```
Clicking Cancel displays the Session Complete screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 21. [ ] TC-200 - Verify Close page

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input invalid password
5. Click 'Cancel'
6. Click 'Close Page'

```

**Expected Result:**
```
User can click on ‘Close Page’ to close the web browser tab
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 22. [ ] TC-201 - Verify user proceeds to Reset Password screen with correct current password

**Feature:** N/A

**Steps:**
```
1. Profile Sidebar
2. Password & Security
3. Click Change Password
4. Input valid password
5. Click 'Continue'

```

**Expected Result:**
```
After entering the correct current password and clicking Continue, user is navigated to the Reset Password screen.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 23. [ ] TC-202 - Verify real-time password validation rules are displayed

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
```

**Expected Result:**
```
The following real-time validation rules are displayed:

Includes at least 1 alphabet
Includes at least 1 number
Minimum 8 characters
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 24. [ ] TC-203 - Verify password validation indicators update in real time

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input A
3. Input 8
4. Input d23191
```

**Expected Result:**
```
As the user types:
Met criteria turn green with a green tick
Unmet criteria remain greyed out
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 25. [ ] TC-204 - Verify user cannot reuse last three passwords

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input one of last tree previously used passwords
```

**Expected Result:**
```
If the new password matches any of the last three previously used passwords, the system rejects the password and displays an error message.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 26. [ ] TC-205 - Verify error message is displayed when passwords do not match

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS12345678!
```

**Expected Result:**
```
If the Confirm New Password does not match the New Password:

Input field is highlighted in red.
Error message “Passwords do not match.” is displayed above the input field.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 27. [ ] TC-206 - Verify password visibility toggle works correctly

**Feature:** N/A

**Steps:**
```
1. Perform steps 1-3 from [Verify error message is displayed when passwords do not match]
```

**Expected Result:**
```
Password input is masked by default.
Clicking the eye icon reveals the entered password
Clicking again hides the password
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 28. [ ] TC-207 - Verify successful password reset

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS123456789!
```

**Expected Result:**
```
Upon successful submission:

Message “Password reset successful.” is displayed
User can click Close Page to close the browser tab
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---

### 29. [ ] TC-208 - Verify email notification is sent after successful password change

**Feature:** N/A

**Steps:**
```
1.Perform steps 1-5 from [Verify user proceeds to Reset Password screen with correct current password]
2. Input 'Confirm new password' with CGS123456789!
3. Input 'New password' with CGS123456789!
```

**Expected Result:**
```
An email notification is sent to the user confirming the successful password change.
```

**Actual Result:**
```
N/A
```

**Status:** 🟡 Unable to Test

---