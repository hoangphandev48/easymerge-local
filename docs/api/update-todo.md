# PATCH /todos/:id

Cập nhật một phần todo. Chỉ các trường có trong body mới bị thay đổi.

## Body

| Trường      | Kiểu             | Ghi chú                              |
| ----------- | ---------------- | ------------------------------------ |
| `title`     | string           | Bị trim, không được rỗng             |
| `completed` | boolean          | Chuỗi như `"yes"` bị từ chối         |
| `priority`  | string           | `low`, `medium`, `high`              |
| `dueDate`   | string \| null   | Gửi `null` để xóa hạn                |

## Hành vi

- Body rỗng vẫn hợp lệ; chỉ `updatedAt` được làm mới.
- Repository tạo object mới thay vì sửa object cũ, xem [../architecture/immutability.md](../architecture/immutability.md).
- Validate chạy trước khi tìm todo, nên body sai trả `400` ngay cả khi id không tồn tại.

## Response

- `200` kèm todo sau cập nhật.
- `400` dữ liệu không hợp lệ.
- `404` khi id không tồn tại.
