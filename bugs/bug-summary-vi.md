# Tóm tắt Phân tích Bug List - QA Round 1

**Ngày phân tích:** 2026-01-20

## 📊 Tổng quan

**Tổng số test case lỗi:** 82

| Loại | Số lượng | Tỷ lệ |
|------|----------|-------|
| ❌ Error (Lỗi) | 42 | 51.2% |
| ⚪ Closed (Đã đóng) | 11 | 13.4% |
| 🔒 Unable to Test (Không test được) | 29 | 35.4% |

---

## ✅ CÓ THỂ FIX (13 bugs)

### 🎨 Lỗi UI (7 bugs - EASY)

| Bug ID | Vấn đề | Độ phức tạp | Thời gian ước tính |
|--------|--------|-------------|-------------------|
| **TC-46** | Text thông báo không cắt với "..." khi màn hình rộng | Dễ | 15 phút |
| **TC-142** | Mô tả bài viết hiện 4 dòng thay vì tối đa 3 dòng | Dễ | 15 phút |
| **TC-143** | Định dạng ngày sai: YYYY-MM-DD thay vì DD-MMM-YYYY | Dễ | 30 phút |
| **TC-189** | Tiêu đề notification không xuống dòng, không cắt (max 2 dòng) | Dễ | 20 phút |
| **TC-195** | Định dạng notification detail sai, hiện ảnh placeholder khi không có ảnh | Dễ | 30 phút |
| **TC-124** | Text button hiện "[View]" thay vì "[View Application Note]" | Dễ | 10 phút |
| **TC-105** | Chiều cao popup không scale theo màn hình, footer bị che | Trung bình | 1-2 giờ |

### ⚙️ Lỗi Logic (6 bugs)

| Bug ID | Vấn đề | Độ phức tạp | Thời gian ước tính |
|--------|--------|-------------|-------------------|
| **TC-44** | Thanh thông báo hiện lại sau khi refresh (không lưu trạng thái đã đóng) | Dễ | 30 phút |
| **TC-186** | Thông báo sắp xếp sai thứ tự (phải mới nhất lên đầu) | Dễ | 20 phút |
| **TC-121/122** | Tên sản phẩm không click được trên Web (phải redirect đến Product Details) | Dễ | 45 phút |
| **TC-100** | Card đầu tiên trong Analysis tab mở sẵn (phải đóng hết mặc định) | Dễ | 15 phút |
| **TC-102** | Trạng thái reason card reset khi chuyển tab (phải giữ trạng thái) | Trung bình | 1-2 giờ |
| **TC-118** | Filter sai: Securities hiện trong Alternatives tab | Trung bình | 1-2 giờ |

**⏱️ Tổng thời gian ước tính: 8-12 giờ**

---

## 🚫 KHÔNG THỂ FIX (24 bugs - Cần Backend)

Những lỗi này cần Backend/API sửa, Frontend không thể fix:

### Authentication & Session (4 bugs)
- **TC-7**: Session timeout xử lý sai
<!-- - **TC-9**: Logout không hoạt động -->
<!-- - **TC-16, TC-22**: OTP validation gây refresh page -->
<!-- - **TC-17, TC-23**: Message OTP hết hạn sai -->

### Data & API Issues (13 bugs)
- **TC-38**: Announcement lấy data từ Corporate Website thay vì iTrade
- **TC-81**: Số lượng Securities products không khớp (home: 1, IOP page: 2)
- **TC-89**: Product card không hiện greyed-out khi đóng
- **TC-113**: Link Terms & Conditions không hoạt động
- **TC-114, TC-115**: Submit product application lỗi (invalid JSON)
- **TC-125**: Số lượng Alternatives không khớp
- **TC-126**: Tài khoản AI vẫn bị block khỏi CP Listing
- **TC-129, TC-131**: Popup access restriction không hoạt động
- **TC-158**: PayNow popup không hiện
- **TC-163, TC-164**: Trust Account donation lỗi API
- **TC-211**: Thiếu Trading Representative API

### Features & Navigation (7 bugs)
- **TC-174**: Notification bell không hiện red dot
- **TC-188**: Notification toast không hoạt động
- **TC-196**: Change Password redirect về prod site
<!-- - **TC-219, TC-220**: Central Dealing Desk navigation sai (đi vào Client Service)
- **TC-223, TC-225**: Email không tự động điền subject "iTrade Client Enquiry"
- **TC-224**: Click số điện thoại không hoạt động -->

---

## ⚪ ĐÃ ĐÓNG - KHÔNG CẦN FIX (11 bugs)

Những bugs này không còn liên quan do redesign hoặc không cần thiết:

- **TC-30, TC-36**: Rate limiting không cần
- **TC-52, TC-66, TC-138**: Số lượng item tối đa đã thay đổi trong redesign
- **TC-59, TC-79, TC-149**: Auto-rotate đã bỏ trong redesign
- **TC-63**: Expired events (giữ lại tạm thời)
- **TC-104**: Vấn đề document hosting (cần file host mới)
- **TC-146**: Carousel blur đã bỏ trong redesign

---

## 🔒 KHÔNG THỂ TEST (29 bugs)

### Bị chặn bởi bugs khác (8 bugs)
- **TC-90, TC-91, TC-92**: Cần fix TC-89 trước
- **TC-159-162**: Cần fix TC-158 (PayNow popup) trước
- **TC-106**: Cần tài khoản test có đúng 1 cash account

### Thiếu features (21 bugs)
- **TC-47, TC-53**: Cần quyền CMS/data
- **TC-177-182, TC-185**: Hệ thống notification unread chưa có
- **TC-197-208**: Flow Change Password chưa implement

---

## 📋 Kế hoạch thực hiện

### ✨ Phase 1: Quick Wins (3-4 giờ)

Những bugs dễ, fix nhanh:

1. ✅ **TC-143** - Fix date format (30 phút)
2. ✅ **TC-46** - Announcement truncation (15 phút)
3. ✅ **TC-142** - Article truncation (15 phút)
4. ✅ **TC-124** - Button text (10 phút)
5. ✅ **TC-189** - Notification title format (20 phút)
6. ✅ **TC-195** - Notification detail format (30 phút)
7. ✅ **TC-44** - Announcement bar persistence (30 phút)
8. ✅ **TC-186** - Notification sorting (20 phút)
9. ✅ **TC-100** - Analysis tab default state (15 phút)
10. ✅ **TC-121/122** - Product name clickable (45 phút)

### 🔧 Phase 2: Medium Tasks (4-6 giờ)

Những bugs phức tạp hơn:

11. 🔶 **TC-105** - Modal height scaling (1-2 giờ)
12. 🔶 **TC-102** - Card state persistence (1-2 giờ)
13. 🔶 **TC-118** - Filter logic fix (1-2 giờ)

---

## 📁 Files cần sửa

### Components chính:
```
app/(with-layout)/(home)/_component/
  → Announcement bar, Investment section, CGSI Insights

app/(minimal)/sidebar/
  → Notification.tsx ✓

app/(with-layout)/(detail)/my-applications/
  → Applications list, Filters

app/(with-layout)/(detail)/product-details/
  → Analysis tab, Product Application Modal
```

### Utilities:
```
lib/utils.ts
  → Thêm date formatting helper
```

### Styles:
```
app/globals.css
  → Line clamp utilities

components/ui/sheet.tsx
  → Modal height fixes
```

---

## 🎯 Ưu tiên khuyến nghị

### 🔥 CAO - Fix ngay (13 bugs)
Tất cả 13 bugs có thể fix được → Frontend có thể xử lý độc lập

### 🟡 TRUNG BÌNH - Cần phối hợp Backend (24 bugs)
Tạo tickets cho Backend team để fix các API/authentication issues

### 🔵 THẤP - Blocked/Closed (40 bugs)
Không thể action ngay, chờ unblock hoặc không cần nữa

---

## 📝 Tóm tắt cho Dev

**Bạn CÓ THỂ fix được 13 bugs**, bao gồm:
- **7 bugs UI**: Truncation, formatting, layout
- **6 bugs logic**: Sorting, persistence, filters, navigation

**Bạn KHÔNG THỂ fix được 24 bugs** vì:
- Cần Backend API changes
- Cần authentication/session fixes
- Cần payment gateway integration

**11 bugs đã closed** - không cần fix

**29 bugs unable to test** - bị block hoặc thiếu features

---

## ✅ Checklist sau khi fix

- [ ] TC-46: Announcement cắt đúng trên mọi màn hình
- [ ] TC-142: Article description đúng 3 dòng tối đa
- [ ] TC-143: Ngày hiện định dạng "20-Jan-2026"
- [ ] TC-189: Notification title 2 dòng max với ellipsis
- [ ] TC-195: Không hiện placeholder khi không có ảnh
- [ ] TC-124: Mobile hiện "View Application Note"
- [ ] TC-105: Modal scroll được, footer luôn nhìn thấy
- [ ] TC-44: Đóng announcement, refresh, vẫn đóng
- [ ] TC-186: Notification mới nhất ở trên cùng
- [ ] TC-121: Web - product name click được
- [ ] TC-122: Mobile - product name không click được
- [ ] TC-100: Tất cả cards đóng ban đầu
- [ ] TC-102: Mở card, đổi tab, quay lại - vẫn mở
- [ ] TC-118: Filter đúng category

---

**📄 Chi tiết đầy đủ xem file:**
- `bug-analysis.md` - Phân tích chi tiết
- `fixable-bugs-summary.md` - Danh sách bugs có thể fix với hướng dẫn
