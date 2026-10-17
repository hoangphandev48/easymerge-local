# CRUD trang quản trị — Tổng quan

Tài liệu cho tính năng CRUD đơn giản của trang quản trị. Thực thể mẫu: **Product** (sản phẩm). Muốn áp dụng cho thực thể khác thì đổi tên và các trường.

## Mục lục

| Thư mục | File | Nội dung |
|---------|------|----------|
| [db/](db/) | [schema.md](db/schema.md) | Bảng, cột, ràng buộc, index |
| | [conventions.md](db/conventions.md) | Quy ước DB, xóa mềm, migration |
| [api/](api/) | [overview.md](api/overview.md) | Xác thực, envelope response, mã lỗi |
| | [products.md](api/products.md) | Chi tiết 5 endpoint |
| | [implementation.md](api/implementation.md) | Cấu trúc code, validate, repository |
| [screen/](screen/) | [overview.md](screen/overview.md) | Route, cấu trúc thư mục, state, accessibility |
| | [product-list.md](screen/product-list.md) | Màn hình danh sách |
| | [product-form.md](screen/product-form.md) | Màn hình tạo/sửa |
| | [delete-dialog.md](screen/delete-dialog.md) | Hộp thoại xác nhận xóa |

## Công nghệ (mặc định)

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | React + TypeScript, TanStack Query, React Hook Form + Zod |
| Backend | Node.js + Express + TypeScript, Zod |
| Database | PostgreSQL |

## Luồng dữ liệu

```
[Admin UI] -- HTTP/JSON --> [REST API] -- SQL --> [PostgreSQL]
 screen/        api/         controller → service → repository     db/
```

## Chức năng

- **Create**: thêm sản phẩm mới.
- **Read**: danh sách (phân trang, tìm kiếm, sắp xếp) và chi tiết.
- **Update**: sửa thông tin sản phẩm.
- **Delete**: xóa mềm để có thể khôi phục.

## Bảo mật

- Xác thực và kiểm tra role `admin` ở **middleware backend**; ẩn nút trên UI chỉ là phụ.
- Validate mọi input ở backend; không tin dữ liệu từ client.
- Chống SQL injection: truy vấn tham số hóa, `sort` theo whitelist.
- Chống XSS: không dùng `dangerouslySetInnerHTML` cho `description`.
- CSRF: dùng cookie thì bật `SameSite` và CSRF token cho request thay đổi dữ liệu.
- Rate limit các endpoint ghi.
- Không trả stack trace hoặc lỗi SQL ra client; ghi log chi tiết ở server.
- Không hardcode secret (chuỗi kết nối DB, khóa JWT); dùng biến môi trường.

## Kiểm thử

Mục tiêu coverage tối thiểu 80%.

| Loại | Phạm vi |
|------|---------|
| Unit | Zod schema, service, hook/utility ở frontend |
| Integration | Từng endpoint với DB test: tạo, trùng SKU (409), không tìm thấy (404), không đủ quyền (403), phân trang/lọc/sắp xếp, xóa mềm không còn trong danh sách |
| E2E (Playwright) | Đăng nhập admin → tạo → tìm → sửa → xóa sản phẩm |

Viết test trước (RED), cài đặt tối thiểu (GREEN), rồi refactor.

## Thứ tự triển khai gợi ý

1. Migration tạo bảng `products` ([db/schema.md](db/schema.md)).
2. Test + repository + service.
3. Zod schema, controller, route, middleware ([api/implementation.md](api/implementation.md)).
4. Test integration cho API.
5. `api.ts` và hooks ở frontend ([screen/overview.md](screen/overview.md)).
6. Trang danh sách → form → hộp thoại xóa.
7. E2E, rà soát bảo mật, cập nhật docs nếu API thay đổi.

## Mở rộng sau này

- Xóa hàng loạt, import/export CSV.
- Upload ảnh sản phẩm (lưu object storage, DB chỉ giữ URL).
- Audit log (ai sửa gì, lúc nào).
- Phân quyền chi tiết hơn (`viewer`, `editor`, `admin`).
