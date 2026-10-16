# Đặt tên

| Đối tượng        | Quy ước                  | Ví dụ                       |
| ---------------- | ------------------------ | --------------------------- |
| File theo feature| `<feature>.<vai trò>.ts` | `todo.repository.ts`        |
| File test        | thêm `.test`             | `todo.validation.test.ts`   |
| Class            | PascalCase               | `TodoRepository`            |
| Hàm, biến        | camelCase                | `parseQuery`                |
| Hằng             | UPPER_SNAKE_CASE         | `DEFAULT_LIMIT`             |
| Kiểu             | PascalCase               | `TodoQuery`                 |
| Lỗi              | hậu tố `Error`           | `ValidationError`           |

Tên hàm parse bắt đầu bằng `parse`, hàm tạo response bắt đầu bằng `ok`/`errorBody`.
