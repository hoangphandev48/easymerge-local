# Kế hoạch mở rộng Todo API

Tài liệu mô tả các tính năng sẽ bổ sung cho Todo REST API (Node.js + TypeScript + Express).
Sau khi duyệt, code sẽ được thực hiện theo đúng thứ tự trong mục [Lộ trình](#6-lộ-trình-thực-hiện).

## 1. Mục tiêu

- Bổ sung tìm kiếm, sắp xếp và phân trang cho danh sách todo.
- Thêm trường `priority` và `dueDate` cho todo.
- Validate dữ liệu đầu vào chặt chẽ, trả lỗi thống nhất.
- Giữ độ phủ test từ 80% trở lên.

## 2. Phạm vi

### Trong phạm vi

- Mở rộng `GET /todos` với query `q`, `sort`, `order`, `page`, `limit`.
- Thêm `priority` (`low` | `medium` | `high`) và `dueDate` (ISO 8601).
- Thêm endpoint thống kê `GET /todos/stats`.
- Chuẩn hóa định dạng response lỗi.

### Ngoài phạm vi

- Xác thực người dùng (authentication).
- Lưu trữ vào database (vẫn dùng repository in-memory).
- Giao diện client (`public/todo-client.min.js` giữ nguyên).

## 3. Thay đổi mô hình dữ liệu

File: `src/todos/todo.types.ts`

| Trường     | Kiểu                          | Bắt buộc | Mặc định   | Ghi chú                   |
| ---------- | ----------------------------- | -------- | ---------- | ------------------------- |
| `priority` | `"low" \| "medium" \| "high"` | Không    | `"medium"` | Dùng union, không dùng enum |
| `dueDate`  | `string \| null`              | Không    | `null`     | Chuẩn ISO 8601            |

Các kiểu cần thêm hoặc sửa:

- `TodoPriority`: union literal cho độ ưu tiên.
- `CreateTodoInput` và `UpdateTodoInput`: thêm `priority`, `dueDate`.
- `TodoQuery`: gồm `completed`, `q`, `sort`, `order`, `page`, `limit`.
- `Paginated<T>`: gồm `items`, `total`, `page`, `limit`.

## 4. Thiết kế API

### 4.1 Danh sách todo

`GET /todos?q=mua&completed=false&sort=createdAt&order=desc&page=1&limit=10`

| Query       | Kiểu    | Mặc định    | Ràng buộc                                      |
| ----------- | ------- | ----------- | ---------------------------------------------- |
| `q`         | string  | —           | Tìm theo `title`, không phân biệt hoa thường   |
| `completed` | boolean | —           | Giữ hành vi lọc hiện có                        |
| `sort`      | string  | `createdAt` | Một trong `createdAt`, `updatedAt`, `priority`, `dueDate` |
| `order`     | string  | `desc`      | `asc` hoặc `desc`                              |
| `page`      | number  | `1`         | Số nguyên >= 1                                 |
| `limit`     | number  | `20`        | Số nguyên từ 1 đến 100                         |

Response `200`:

```json
{
  "success": true,
  "data": { "items": [], "total": 0, "page": 1, "limit": 20 },
  "error": null
}
```

### 4.2 Thống kê

`GET /todos/stats` trả về `total`, `completed`, `pending`, `overdue`.
Route này phải đăng ký trước `/:id` để không bị nhầm thành id.

### 4.3 Định dạng lỗi thống nhất

```json
{ "success": false, "data": null, "error": "Mô tả lỗi thân thiện" }
```

| Mã  | Tình huống                              |
| --- | --------------------------------------- |
| 400 | Dữ liệu hoặc query không hợp lệ         |
| 404 | Không tìm thấy todo                     |
| 500 | Lỗi không xác định (không lộ chi tiết)  |

## 5. Kiến trúc và quy ước

- Thêm `src/todos/todo.validation.ts` chứa hàm parse query/body, trả về dữ liệu đã chuẩn hóa hoặc ném lỗi 400.
- Controller chỉ điều phối: parse, gọi repository, trả response.
- Repository nhận `TodoQuery`, trả `Paginated<Todo>`, không mutate đối tượng cũ (luôn tạo bản sao mới).
- Mỗi file dưới 400 dòng, mỗi hàm dưới 50 dòng.
- Không dùng `console.log`; lỗi đi qua `errorHandler`.

## 6. Lộ trình thực hiện

Thực hiện theo TDD: viết test trước, chạy thấy fail, rồi mới code.

1. **Kiểu dữ liệu**: cập nhật `todo.types.ts`.
2. **Validation**: viết `todo.validation.ts` kèm test đơn vị.
3. **Repository**: thêm tìm kiếm, sắp xếp, phân trang; bổ sung test trong `todo.repository.test.ts`.
4. **Controller và routes**: nối validation, thêm `GET /todos/stats`.
5. **Error handler**: chuẩn hóa format lỗi trong `middleware/errorHandler.ts`.
6. **Test tích hợp**: mở rộng `src/app.test.ts` bằng supertest.
7. **README**: cập nhật mô tả endpoint.

## 7. Kế hoạch kiểm thử

- Đơn vị: validation (giá trị hợp lệ, biên, sai kiểu), repository (lọc, sort, phân trang).
- Tích hợp: mỗi endpoint với trường hợp thành công và lỗi 400/404.
- Biên cần phủ: `page` vượt tổng số trang, `limit=0`, `limit=101`, `q` rỗng, `dueDate` sai định dạng.
- Lệnh kiểm tra: `npm run typecheck`, `npm test`.

## 8. Rủi ro

| Rủi ro                                    | Giảm thiểu                                   |
| ----------------------------------------- | -------------------------------------------- |
| Đổi cấu trúc response làm hỏng client cũ  | Kiểm tra `todo-client.min.js` trước khi đổi  |
| `/stats` bị khớp với `/:id`               | Đăng ký route `/stats` trước `/:id`          |
| Sắp xếp theo `dueDate` khi có giá trị null | Đặt todo không có hạn xuống cuối             |

## 9. Tiêu chí hoàn thành

- [ ] Toàn bộ endpoint hoạt động đúng như mục 4.
- [ ] `npm run typecheck` và `npm test` đều pass.
- [ ] Độ phủ test >= 80%.
- [ ] README đã cập nhật.
