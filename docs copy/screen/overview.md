# Screen — Tổng quan frontend

React + TypeScript. API xem [../api/products.md](../api/products.md).

## Màn hình và route

| Đường dẫn | Màn hình | Tài liệu |
|-----------|----------|----------|
| `/admin/products` | Danh sách | [product-list.md](product-list.md) |
| `/admin/products/new` | Form tạo mới | [product-form.md](product-form.md) |
| `/admin/products/:id/edit` | Form chỉnh sửa | [product-form.md](product-form.md) |
| (dialog trong danh sách) | Xác nhận xóa | [delete-dialog.md](delete-dialog.md) |

## Cấu trúc thư mục

```
src/features/products/
├── api.ts                  # hàm gọi API
├── hooks.ts                # useProducts, useProduct, useCreate/Update/DeleteProduct
├── schema.ts               # Zod schema dùng cho form
├── ProductListPage.tsx
├── ProductFormPage.tsx     # dùng chung cho tạo mới và chỉnh sửa
├── ProductTable.tsx
├── ConfirmDeleteDialog.tsx
└── products.css
```

## Quản lý state

| Loại | Công cụ |
|------|---------|
| Server state | TanStack Query |
| Form state | React Hook Form + `zodResolver` |
| URL state | search params (`page`, `q`, `status`, `sort`) |

- Query key: `['products', { page, q, status, sort }]` và `['product', id]`.
- Sau create/update/delete thành công: `invalidateQueries(['products'])`.
- Không sao chép dữ liệu server vào store client.

## Xử lý lỗi từ API

| Lỗi | Hiển thị |
|-----|----------|
| `VALIDATION_ERROR` có `fields` | Gán vào đúng ô nhập |
| `SKU_EXISTS` (409) | Lỗi ở ô SKU |
| `NOT_FOUND` (404) | Thông báo "Sản phẩm không tồn tại" và quay về danh sách |
| `UNAUTHORIZED` (401) | Chuyển về trang đăng nhập |
| `FORBIDDEN` (403) | Trang "Không có quyền" |
| Lỗi mạng / 5xx | Thông báo chung kèm nút thử lại |

## Khả năng truy cập

- Dùng `<table>`, `<label>`, `<button>` đúng ngữ nghĩa; mỗi ô nhập có label.
- Dialog giữ focus trong hộp thoại và đóng bằng `Esc`.
- Lỗi form gắn bằng `aria-describedby`; toast dùng `role="status"`.
- Thao tác được toàn bộ bằng bàn phím.
- Tôn trọng `prefers-reduced-motion`.

## Kiểm thử

- Unit: hook, utility, schema form.
- E2E (Playwright): tạo → tìm → sửa → xóa.
- Kiểm tra responsive ở 320, 768, 1024, 1440 và không bị tràn ngang.
