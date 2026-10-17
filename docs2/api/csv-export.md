# API — Xuất CSV

Mở rộng của [products.md](products.md). Định dạng lỗi xem [overview.md](overview.md).

| Method | Path | Mô tả | Thành công |
|--------|------|-------|------------|
| GET | `/api/products/export.csv` | Xuất danh sách sản phẩm ra CSV | 200 |

## Quyền và giới hạn

- Yêu cầu role `admin`; route nằm **sau** middleware `rate-limit` và `auth` như các endpoint khác.
- Tối đa **10.000** dòng mỗi lần xuất. Nếu kết quả lọc vượt 10.000 dòng thì trả `400 VALIDATION_ERROR` kèm thông điệp yêu cầu thu hẹp bộ lọc; không cắt bớt âm thầm.
- Endpoint này bị giới hạn **5 request mỗi phút** trên mỗi client, chặt hơn mức mặc định của `/api`.

## Query

Dùng cùng bộ lọc với `GET /api/products`: `q`, `status`, `sort`. **Không** có `page` và `limit`. `sort` chỉ nhận giá trị trong whitelist (`createdAt`, `name`, `price`, `stock`, có thể kèm tiền tố `-`).

## Nội dung file

- Header `Content-Type: text/csv; charset=utf-8` và `Content-Disposition: attachment; filename="products.csv"`.
- Bắt đầu bằng BOM UTF-8 để Excel đọc đúng tiếng Việt.
- Dòng đầu là tiêu đề: `id,name,sku,description,price,stock,status,createdAt`.
- Xuống dòng bằng `\r\n`. Trường chứa dấu phẩy, dấu nháy kép hoặc xuống dòng được bao trong dấu nháy kép; dấu nháy kép bên trong được nhân đôi (`""`).
- `price` giữ dạng chuỗi hai chữ số thập phân (`199000.00`).
- **Chống CSV injection**: trường văn bản (`name`, `sku`, `description`) bắt đầu bằng `=`, `+`, `-` hoặc `@` phải được thêm dấu nháy đơn `'` ở đầu.
- Chỉ xuất sản phẩm chưa bị xóa mềm (`deleted_at IS NULL`).
