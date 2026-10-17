# Screen — Form tạo/sửa sản phẩm

Routes: `/admin/products/new` (tạo) và `/admin/products/:id/edit` (sửa). Component `ProductFormPage` dùng chung cho cả hai.

## Trường nhập

| Trường | Control | Quy tắc (khớp backend) |
|--------|---------|------------------------|
| Tên | text | Bắt buộc, 1–200 ký tự |
| SKU | text | Bắt buộc, 1–50 ký tự, duy nhất |
| Mô tả | textarea | Tối đa 5000 ký tự |
| Giá | number | Bắt buộc, ≥ 0 |
| Tồn kho | number (nguyên) | ≥ 0, mặc định 0 |
| Trạng thái | select | draft / active / archived, mặc định draft |

Schema Zod ở `schema.ts` dùng cùng quy tắc với [backend](../api/implementation.md) để hai phía luôn khớp.

## Hành vi

**Tạo mới**
- Form rỗng với giá trị mặc định.
- Gửi `POST /api/products`.

**Chỉnh sửa**
- Tải chi tiết bằng `useProduct(id)`, hiển thị skeleton khi đang tải, điền sẵn vào form.
- Chỉ gửi các trường đã thay đổi bằng `PATCH /api/products/:id`.
- Nếu API trả `404`, báo "Sản phẩm không tồn tại" và quay về danh sách.

**Chung**
- Validate khi blur và khi submit; lỗi hiện dưới ô nhập, gắn bằng `aria-describedby`.
- Khi submit, focus nhảy tới ô lỗi đầu tiên.
- Nút **Lưu** bị vô hiệu hóa và hiện trạng thái đang gửi để tránh gửi trùng.
- Thành công: toast "Đã lưu" và quay về danh sách (danh sách được invalidate).
- Lỗi `409 SKU_EXISTS`: hiện "SKU đã tồn tại" ở ô SKU.
- Lỗi `VALIDATION_ERROR` có `fields`: gán vào đúng ô.
- Lỗi mạng/5xx: giữ nguyên dữ liệu đã nhập, hiện thông báo lỗi.
- Có thay đổi chưa lưu mà rời trang: hỏi xác nhận.
- Nút **Hủy** quay về danh sách.

## Bố cục

```
┌──────────────────────────────┐
│ ‹ Sản phẩm / Thêm sản phẩm   │
├──────────────────────────────┤
│ Tên *        [____________]  │
│ SKU *        [____________]  │
│ Giá *   [______]  Tồn [____] │
│ Trạng thái   [ draft ▾ ]     │
│ Mô tả        [____________]  │
│              [____________]  │
├──────────────────────────────┤
│              [Hủy] [ Lưu ]   │
└──────────────────────────────┘
```

Dưới 768px: các trường xếp một cột, nút Lưu/Hủy chiếm toàn chiều rộng.
