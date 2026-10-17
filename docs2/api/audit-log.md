# API — Audit log sản phẩm

Mở rộng của [products.md](products.md). Ghi lại ai đã sửa gì, lúc nào. Schema bảng xem cuối tài liệu.

## Ghi log

- Mọi thao tác **tạo**, **cập nhật** và **xóa** sản phẩm (kể cả xóa hàng loạt) ghi một dòng vào `product_audit_logs`.
- Dòng log được ghi **trong cùng transaction** với thay đổi dữ liệu: thay đổi thất bại thì không có log, và không bao giờ có thay đổi mà thiếu log.
- `actor` là định danh người thực hiện lấy từ phiên đăng nhập, không nhận từ body hoặc query.
- `action` là một trong `create` / `update` / `delete`.
- `before` là bản ghi trước khi sửa (`null` khi `create`); `after` là bản ghi sau khi sửa (`null` khi `delete`).
- `before` và `after` **không bao giờ chứa** `description`: trường này có thể rất dài và chứa dữ liệu nhạy cảm của khách hàng.
- Log chỉ ghi thêm, không có endpoint sửa hoặc xóa log.

## GET /api/products/:id/audit

Xem lịch sử thay đổi của một sản phẩm, kể cả sản phẩm đã xóa mềm.

- Yêu cầu role `admin`.
- Query: `page` (mặc định 1), `limit` (mặc định 20, tối đa 100). Sắp xếp cố định theo thời gian giảm dần.
- Response `200`: `data` là mảng log, `meta` là `{ total, page, limit }`. Mỗi log:

```json
{
  "id": "…",
  "productId": "0b7c2f6e-6f0a-4c3e-9a55-3d6d0a1c1e11",
  "actor": "admin",
  "action": "update",
  "before": { "price": "199000.00" },
  "after": { "price": "159000.00" },
  "createdAt": "2026-10-17T05:00:00Z"
}
```

- `400` nếu `id` không phải UUID; sản phẩm chưa từng có log trả mảng rỗng với `200`, không phải `404`.

## Bảng `product_audit_logs`

| Cột | Kiểu | Ràng buộc |
|-----|------|-----------|
| `id` | UUID | PK |
| `product_id` | UUID | NOT NULL, index cùng `created_at DESC` |
| `actor` | VARCHAR(100) | NOT NULL |
| `action` | VARCHAR(10) | NOT NULL, thuộc `create/update/delete` |
| `before` | JSONB | NULL |
| `after` | JSONB | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` |
