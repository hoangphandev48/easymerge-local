# Kiểm tra đầu vào

Mọi dữ liệu từ client được kiểm tra tại `todo.validation.ts` trước khi vào repository.

## Biện pháp

- Kiểu `unknown` cho body, thu hẹp từng trường.
- Danh sách giá trị cho phép (allow-list) cho `priority`, `sort`, `order`.
- Số nguyên chỉ nhận chuỗi toàn chữ số, chặn `NaN`, số âm, số thập phân.
- `limit` bị chặn trên (50) để tránh trả quá nhiều dữ liệu.
- `title` được trim và không cho rỗng.

## Chưa có

- Giới hạn độ dài `title`.
- Giới hạn kích thước body ngoài mặc định của `express.json()`.
