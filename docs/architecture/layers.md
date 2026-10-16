# Các tầng và ranh giới

## Quy tắc phụ thuộc

- Controller phụ thuộc repository và validation.
- Repository chỉ phụ thuộc kiểu dữ liệu, không biết Express.
- Validation không phụ thuộc Express; nhận `unknown`/`Record<string, unknown>`.
- `errorHandler` biết `ValidationError` nhưng không biết controller.

## Việc của từng tầng

| Tầng       | Làm                                             | Không làm                      |
| ---------- | ----------------------------------------------- | ------------------------------ |
| Controller | Gọi parse, gọi repository, chọn mã trạng thái   | Tự kiểm tra kiểu dữ liệu       |
| Validation | Chuẩn hóa và ném `ValidationError`              | Đọc/ghi dữ liệu                |
| Repository | Lọc, sắp xếp, phân trang, tạo bản ghi mới       | Biết về HTTP                   |

Nhờ vậy repository và validation test được mà không cần khởi động Express.
