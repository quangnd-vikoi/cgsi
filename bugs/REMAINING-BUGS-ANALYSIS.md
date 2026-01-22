# Phân Tích Bug Chưa Fix - iTrade Portal

**Ngày phân tích:** 2026-01-21
**Tổng số bugs còn lại:** 7 bugs (từ 13 bugs có thể fix, đã fix 6 logic bugs)

---

## 📊 Tổng Quan

### ✅ Đã Fix (9 bugs)
- **6 Logic Bugs**: TC-44, TC-186, TC-121/122, TC-100, TC-102, TC-118
- **3 UI/UX Improvements**: Sheet positioning, OTP validation, Email subject

### ⚠️ Chưa Fix (7 bugs UI)
Tất cả đều là **UI bugs** có thể fix được, không cần backend.

---

## 🎯 BUGS CHƯA FIX - CẦN XỬ LÝ

### 1. TC-46: Announcement Text Truncation

**📍 Location:** `components/Header.tsx` (Announcement bar component)

**❌ Current Behavior:**
- Text thông báo không bị cắt với ellipsis (...) khi màn hình rộng
- Text có thể bị overflow hoặc wrap xuống nhiều dòng

**✅ Expected Behavior:**
- Text thông báo chỉ hiển thị 1 dòng
- Nếu text dài hơn, phải cắt với ellipsis (...)
- Phải responsive trên mọi kích thước màn hình

**🔧 Plan to Fix:**

```typescript
// File: components/Header.tsx
// Tìm phần render announcement text, thêm CSS classes:

<div className="text-sm truncate">
  {announcement.title}
</div>

// Hoặc nếu cần giới hạn width:
<div className="text-sm max-w-[600px] truncate">
  {announcement.title}
</div>

// Nếu dùng flex layout:
<div className="flex items-center gap-2">
  <span className="truncate flex-1">
    {announcement.title}
  </span>
  <button>Close</button>
</div>
```

**⏱️ Estimated Time:** 15 minutes
**🎚️ Complexity:** Easy
**📁 Files to Change:**
- `components/Header.tsx`

---

### 2. TC-142: Article Description Line Clamp

**📍 Location:** `app/(with-layout)/(home)/_component/*` - CGSI Insights section

**❌ Current Behavior:**
- Mô tả bài viết hiển thị 4 dòng
- Không có ellipsis khi text dài

**✅ Expected Behavior:**
- Mô tả bài viết chỉ hiển thị **tối đa 3 dòng**
- Dòng thứ 3 phải có ellipsis (...) nếu text còn dài

**🔧 Plan to Fix:**

```typescript
// Tìm component render CGSI Insights articles
// Thêm line-clamp-3 vào description

<p className="text-sm text-typo-secondary line-clamp-3">
  {article.description}
</p>

// Đảm bảo globals.css có utility này (Tailwind 4 đã có sẵn):
// .line-clamp-3 {
//   display: -webkit-box;
//   -webkit-line-clamp: 3;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }
```

**⏱️ Estimated Time:** 15 minutes
**🎚️ Complexity:** Easy
**📁 Files to Change:**
- `app/(with-layout)/(home)/_component/Investment.tsx` (hoặc tương tự)
- Verify `app/globals.css` có line-clamp utilities

---

### 3. TC-143: Date Format Incorrect

**📍 Location:** `app/(with-layout)/(home)/_component/*` - CGSI Insights section

**❌ Current Behavior:**
- Hiển thị ngày dạng: `2026-01-20` (YYYY-MM-DD)

**✅ Expected Behavior:**
- Hiển thị ngày dạng: `20-Jan-2026` (DD-MMM-YYYY)

**🔧 Plan to Fix:**

```typescript
// 1. Tạo utility function trong lib/utils.ts

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// Ví dụ: formatDate("2026-01-20") => "20-Jan-2026"

// 2. Áp dụng vào component render articles:

import { formatDate } from "@/lib/utils";

<span className="text-xs text-typo-tertiary">
  {formatDate(article.createdOn)}
</span>
```

**⏱️ Estimated Time:** 30 minutes
**🎚️ Complexity:** Easy
**📁 Files to Change:**
- `lib/utils.ts` - Add formatDate function
- `app/(with-layout)/(home)/_component/*` - Apply to Insights section
- Có thể áp dụng cho các nơi khác cũng hiển thị date

---

### 4. TC-189: Notification Title Formatting (Preview List)

**📍 Location:** `app/(minimal)/sidebar/Notification.tsx` (List view - preview)

**❌ Current Behavior:**
- Title không xuống dòng (no line break)
- Không có truncation
- Text overflow hoặc bị cắt không đẹp

**✅ Expected Behavior:**
- Title hiển thị **tối đa 2 dòng**
- Dòng thứ 2 có ellipsis (...) nếu text còn dài
- Text wrap naturally, không bị overflow

**🔧 Plan to Fix:**

```typescript
// File: app/(minimal)/sidebar/Notification.tsx
// Tìm phần render notification title trong list view (preview)

// Notification list item:
<div className="flex flex-col gap-1">
  <h3 className="text-sm font-medium line-clamp-2">
    {notification.title}
  </h3>
  <p className="text-xs text-typo-secondary line-clamp-1">
    {notification.message}
  </p>
  <span className="text-xs text-typo-tertiary">
    {formatDate(notification.createdOn)}
  </span>
</div>
```

**⏱️ Estimated Time:** 20 minutes
**🎚️ Complexity:** Easy
**📁 Files to Change:**
- `app/(minimal)/sidebar/Notification.tsx` - List view section

---

### 5. TC-195: Notification Detail Formatting

**📍 Location:** `app/(minimal)/sidebar/Notification.tsx` (Detail view)

**❌ Current Behavior:**
- Title không xuống dòng, không truncate (max 2 lines)
- Placeholder image vẫn hiển thị khi không có image

**✅ Expected Behavior:**
- Title hiển thị **tối đa 2 dòng** với ellipsis
- **Không hiển thị image** nếu notification không có image
- Layout collapse properly khi không có image

**🔧 Plan to Fix:**

```typescript
// File: app/(minimal)/sidebar/Notification.tsx
// Detail view section

// Notification detail:
<div className="flex flex-col gap-4">
  {/* Title - max 2 lines */}
  <h2 className="text-lg font-semibold line-clamp-2">
    {selectedNotification.title}
  </h2>

  {/* Conditional image rendering */}
  {selectedNotification.imageUrl && (
    <div className="w-full aspect-video relative">
      <Image
        src={selectedNotification.imageUrl}
        alt={selectedNotification.title}
        fill
        className="object-cover rounded-lg"
      />
    </div>
  )}

  {/* Message body */}
  <div className="text-sm text-typo-secondary whitespace-pre-wrap">
    {selectedNotification.message}
  </div>

  {/* Date */}
  <span className="text-xs text-typo-tertiary">
    {formatDate(selectedNotification.createdOn)}
  </span>
</div>
```

**⏱️ Estimated Time:** 30 minutes
**🎚️ Complexity:** Easy
**📁 Files to Change:**
- `app/(minimal)/sidebar/Notification.tsx` - Detail view section

---

### 6. TC-124: Button Text Incorrect (Mobile)

**📍 Location:** `app/(with-layout)/(detail)/my-applications/page.tsx` - Mobile view

**❌ Current Behavior:**
- Button hiển thị text: `[View]`

**✅ Expected Behavior:**
- Button hiển thị text: `[View Application Note]`

**🔧 Plan to Fix:**

```typescript
// File: app/(with-layout)/(detail)/my-applications/page.tsx
// Tìm button trong mobile view

// Có thể dùng responsive text:
<Button variant="outline" size="sm">
  <span className="md:hidden">View Application Note</span>
  <span className="hidden md:inline">View</span>
</Button>

// Hoặc nếu muốn "View" ở desktop, "View Application Note" ở mobile:
<Button variant="outline" size="sm">
  <span className="md:hidden">View Application Note</span>
  <span className="hidden md:inline">View</span>
</Button>

// Check lại spec - có thể là ngược lại:
// Mobile: "View"
// Desktop: "View Application Note"
```

**⚠️ Note:** Cần confirm lại requirement chính xác:
- Mobile nên hiển thị text nào?
- Desktop nên hiển thị text nào?

**⏱️ Estimated Time:** 10 minutes
**🎚️ Complexity:** Easy
**📁 Files to Change:**
- `app/(with-layout)/(detail)/my-applications/page.tsx`

---

### 7. TC-105: Modal Height Not Scaled

**📍 Location:** Product Application Form modal/dialog

**❌ Current Behavior:**
- Pop-up window height không scale theo screen height
- Footer với CTA buttons bị che khuất (blocked)
- User không scroll được để thấy footer

**✅ Expected Behavior:**
- Modal height phải scale theo screen height
- Footer luôn visible hoặc scrollable
- Modal body có thể scroll nếu content quá dài
- Footer CTA buttons luôn accessible

**🔧 Plan to Fix:**

```typescript
// Option 1: Fixed height với scrollable content
// File: components/ui/dialog.tsx hoặc sheet.tsx (tùy component được dùng)

<DialogContent className="max-h-[90vh] flex flex-col">
  {/* Header - fixed */}
  <DialogHeader className="flex-shrink-0">
    <DialogTitle>Product Application</DialogTitle>
  </DialogHeader>

  {/* Body - scrollable */}
  <div className="flex-1 overflow-y-auto">
    {/* Form content */}
  </div>

  {/* Footer - fixed */}
  <DialogFooter className="flex-shrink-0 border-t pt-4">
    <Button>Submit</Button>
    <Button variant="outline">Cancel</Button>
  </DialogFooter>
</DialogContent>

// Option 2: Nếu dùng Sheet component:
// File: app/(with-layout)/(form)/_components/* (Product Application Form)

<Sheet>
  <SheetContent className="flex flex-col h-full">
    <SheetHeader className="flex-shrink-0">
      <SheetTitle>Product Application</SheetTitle>
    </SheetHeader>

    <div className="flex-1 overflow-y-auto py-4">
      {/* Form content */}
    </div>

    <div className="flex-shrink-0 border-t pt-4 bg-white">
      <Button className="w-full">Submit Application</Button>
    </div>
  </SheetContent>
</Sheet>

// CSS additions if needed:
// globals.css
.modal-content {
  max-height: calc(100vh - 64px); /* Account for header */
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 10;
}
```

**⏱️ Estimated Time:** 1-2 hours
**🎚️ Complexity:** Medium
**📁 Files to Change:**
- `components/ui/dialog.tsx` hoặc `components/ui/sheet.tsx`
- `app/(with-layout)/(form)/_components/*` - Product Application Form components
- Có thể cần update `app/globals.css`

**🧪 Testing Required:**
- Test trên nhiều screen sizes (mobile, tablet, desktop)
- Test với content ngắn và content dài
- Test scroll behavior
- Verify footer always visible/accessible

---

## 📋 Kế Hoạch Thực Hiện

### Phase 1: Quick Wins (2 hours)
✅ **Mức độ ưu tiên cao - Fix ngay**

1. ⏱️ 30 min - **TC-143**: Date format
2. ⏱️ 15 min - **TC-46**: Announcement truncation
3. ⏱️ 15 min - **TC-142**: Article description line clamp
4. ⏱️ 10 min - **TC-124**: Button text
5. ⏱️ 20 min - **TC-189**: Notification title format
6. ⏱️ 30 min - **TC-195**: Notification detail format

**Total Phase 1: ~2 hours**

### Phase 2: Medium Task (1-2 hours)
⚠️ **Cần test kỹ hơn**

7. ⏱️ 1-2 hours - **TC-105**: Modal height scaling

**Total Phase 2: 1-2 hours**

---

## 📁 Files Cần Modify

### 1. Core Utilities
```
lib/utils.ts
  ✅ Add formatDate() function
```

### 2. Components
```
components/Header.tsx
  ✅ TC-46: Announcement truncation

components/ui/dialog.tsx hoặc sheet.tsx
  ✅ TC-105: Modal height fix
```

### 3. Pages/Features
```
app/(with-layout)/(home)/_component/
  ✅ TC-142: Article description
  ✅ TC-143: Apply date format

app/(minimal)/sidebar/Notification.tsx
  ✅ TC-189: List view title
  ✅ TC-195: Detail view formatting

app/(with-layout)/(detail)/my-applications/page.tsx
  ✅ TC-124: Button text
```

### 4. Styles (if needed)
```
app/globals.css
  ✅ Verify line-clamp utilities exist
  ✅ Add modal/dialog utilities if needed
```

---

## ✅ Testing Checklist

### After Each Fix:

#### TC-46: Announcement Truncation
- [ ] Desktop wide screen (1920px): Text truncates với ellipsis
- [ ] Desktop standard (1440px): Text truncates với ellipsis
- [ ] Tablet (768px): Text truncates với ellipsis
- [ ] Mobile (375px): Text truncates với ellipsis
- [ ] Text ngắn: Không bị cắt, không có ellipsis
- [ ] Text dài: Bị cắt với ellipsis sau 1 dòng

#### TC-142: Article Description
- [ ] Description hiển thị tối đa 3 dòng
- [ ] Dòng 3 có ellipsis nếu text còn dài
- [ ] Description ngắn (1-2 dòng): Không có ellipsis
- [ ] Layout không bị break

#### TC-143: Date Format
- [ ] Tất cả dates trong Insights hiển thị DD-MMM-YYYY
- [ ] Ví dụ: "20-Jan-2026", "05-Feb-2026"
- [ ] Không có dates dạng YYYY-MM-DD
- [ ] Function hoạt động với invalid dates (return fallback)

#### TC-189: Notification Title (List)
- [ ] Title hiển thị max 2 dòng
- [ ] Line 2 có ellipsis nếu còn dài
- [ ] Text wrap tự nhiên
- [ ] Không bị overflow

#### TC-195: Notification Detail
- [ ] Title max 2 dòng với ellipsis
- [ ] Notification có image: Image hiển thị đúng
- [ ] Notification không có image: Không hiển thị placeholder, layout collapse
- [ ] Date format đúng (DD-MMM-YYYY)

#### TC-124: Button Text
- [ ] Mobile: Hiển thị đúng text (confirm spec)
- [ ] Desktop: Hiển thị đúng text (confirm spec)
- [ ] Responsive breakpoint hoạt động đúng

#### TC-105: Modal Height
- [ ] Modal không vượt quá screen height
- [ ] Modal body scrollable khi content dài
- [ ] Footer luôn visible hoặc scroll được
- [ ] CTA buttons luôn accessible
- [ ] Test với content ngắn: Modal không quá cao
- [ ] Test với content dài: Scroll smooth
- [ ] Mobile (375px): Footer không bị che
- [ ] Desktop (1920px): Layout reasonable

---

## 🚫 Bugs KHÔNG THỂ Fix (Backend Required)

### Authentication & Session (4 bugs)
- **TC-7**: Session timeout handling
- **TC-9**: Logout không hoạt động
- **TC-16, TC-22**: OTP validation (✅ Đã improve frontend validation)
- **TC-17, TC-23**: OTP expiry message (✅ Đã improve error message, cần backend check expiry)

### Data & API Issues (13 bugs)
- **TC-38**: Announcement wrong data source
- **TC-81**: Product count API mismatch
- **TC-89**: Product greyed-out state (backend logic)
- **TC-113**: Terms & Conditions link (no URL)
- **TC-114, TC-115**: Product submission errors (backend validation)
- **TC-125**: Alternatives count mismatch
- **TC-126**: AI account permission
- **TC-129, TC-131**: Access restriction popup
- **TC-158**: PayNow popup (payment gateway)
- **TC-163, TC-164**: Trust Account donation API
- **TC-211**: Trading Representative API missing

### Features & Navigation (7 bugs)
- **TC-174**: Notification bell red dot (backend flag)
- **TC-188**: Notification toast (push system)
- **TC-196**: Change Password redirect
- **TC-219, TC-220**: Navigation links (✅ Đã fix email links)

---

## 📊 Progress Summary

### Completed ✅
- **Logic Bugs**: 6/6 (100%)
  - TC-44, TC-186, TC-121/122, TC-100, TC-102, TC-118
- **Additional Improvements**: 3/3 (100%)
  - Sheet positioning, OTP validation, Email subject

### Remaining ⚠️
- **UI Bugs**: 0/7 (0%)
  - TC-46, TC-142, TC-143, TC-189, TC-195, TC-124, TC-105

### Cannot Fix 🚫
- **Backend Required**: 24 bugs
- **Blocked**: 29 bugs (unable to test)
- **Closed**: 11 bugs (not relevant)

---

## 🎯 Next Steps

1. **Immediate Action** (2-4 hours):
   - Fix all 7 remaining UI bugs
   - Priority: TC-143, TC-46, TC-142, TC-189, TC-195, TC-124
   - Test thoroughly on multiple screen sizes

2. **Medium Priority** (1-2 hours):
   - Fix TC-105 (modal height)
   - Requires more testing

3. **Backend Coordination**:
   - Document 24 backend-required bugs
   - Create JIRA tickets
   - Provide API requirements

4. **Code Review & QA**:
   - Self-test all fixes
   - Create checklist document
   - Request QA re-test

---

## 💡 Implementation Tips

### General Best Practices:
1. **Use Tailwind utilities first** - `truncate`, `line-clamp-N`
2. **Test responsive** - Verify trên mobile, tablet, desktop
3. **Handle edge cases** - Empty data, very long text, no image
4. **Keep consistent** - Use same date format, truncation style across app
5. **Performance** - Don't add unnecessary re-renders

### Code Quality:
- Add utility functions to `lib/utils.ts`
- Reuse formatDate across application
- Extract common line-clamp classes if needed
- Comment complex CSS if not obvious
- Test with real data + edge cases

---

**📄 Related Documents:**
- `bug-analysis.md` - Full bug analysis
- `fixable-bugs-summary.md` - Implementation details
- `RECENT-FIXES.md` - Changelog of completed fixes
- `COMMIT-MESSAGE.md` - Commit message templates
