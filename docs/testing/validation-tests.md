# Test validation

File: `src/todos/todo.validation.test.ts`.

## Phạm vi

| Hàm                 | Ca hợp lệ                             | Ca bị từ chối                                  |
| ------------------- | ------------------------------------- | ---------------------------------------------- |
| `parseQuery`        | Mặc định, đầy đủ, `q` rỗng            | `completed`, `sort`, `order`, `page`, `limit`, `q` mảng |
| `parseCreateInput`  | title trim, kèm priority/dueDate      | Thiếu title, priority lạ, dueDate sai          |
| `parseUpdateInput`  | Body rỗng, `dueDate: null`            | title rỗng, completed không phải boolean       |

## Giá trị biên của limit

- `0` và `51` bị từ chối; `1` và `50` hợp lệ.
- Chuỗi như `abc` hoặc `1.5` bị từ chối.
