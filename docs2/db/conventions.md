# DB — Quy ước

## Khóa và thời gian

- Khóa chính dùng UUID để không lộ số lượng bản ghi.
- Mọi bảng có `created_at`, `updated_at`; `updated_at` được cập nhật ở tầng repository (hoặc trigger nếu muốn đảm bảo ở DB).
- Dùng `TIMESTAMPTZ`, lưu UTC.

## Xóa mềm

- Xóa bằng `UPDATE ... SET deleted_at = now()`.
- Mọi truy vấn đọc và ghi phải có `WHERE deleted_at IS NULL`.
- Khôi phục: đặt `deleted_at = NULL` (nếu SKU đã bị dùng lại thì khôi phục sẽ vi phạm unique index và trả `409`).
- Dọn dữ liệu cũ bằng job định kỳ nếu cần (ví dụ xóa cứng bản ghi quá 90 ngày).

## Ràng buộc

- `NOT NULL`, `CHECK`, `UNIQUE` đặt ở DB, không chỉ dựa vào validate ở app.
- Lỗi vi phạm unique của Postgres (mã `23505`) được backend chuyển thành `409 SKU_EXISTS`.

## Migration

- Mọi thay đổi schema qua file migration đánh số, ví dụ `migrations/001_create_products.sql`.
- Không sửa tay trên môi trường chạy; không sửa migration đã áp dụng, hãy thêm migration mới.
- Migration phải chạy được trên DB trống và trên DB đang có dữ liệu.

## Truy cập dữ liệu

- Chỉ truy vấn tham số hóa (`$1`, `$2`), không nối chuỗi.
- Tên cột sắp xếp lấy từ whitelist.
- Phân trang bằng `LIMIT/OFFSET`; `limit` tối đa 100.

## Cấu hình kết nối

- Chuỗi kết nối lấy từ biến môi trường (ví dụ `DATABASE_URL`), kiểm tra khi khởi động.
- Dùng connection pool; user DB của app chỉ cần quyền `SELECT/INSERT/UPDATE` trên bảng.
