# Mô hình Todo

Định nghĩa trong `src/todos/todo.types.ts`.

| Trường      | Kiểu                          | Ghi chú                                   |
| ----------- | ----------------------------- | ----------------------------------------- |
| `id`        | string                        | UUID do `randomUUID` sinh                 |
| `title`     | string                        | Đã trim, không rỗng                       |
| `completed` | boolean                       | Mặc định `false`                          |
| `priority`  | `"low" \| "medium" \| "high"` | Mặc định `medium`, xem [priority.md](priority.md) |
| `dueDate`   | string \| null                | Xem [due-date.md](due-date.md)            |
| `createdAt` | string                        | ISO 8601, không đổi sau khi tạo           |
| `updatedAt` | string                        | ISO 8601, đổi mỗi lần `update`            |

## Kiểu liên quan

- `TodoQuery`, `Paginated<T>`, `TodoStats`
- `CreateTodoInput`, `UpdateTodoInput`
- `TodoFilter`: bộ lọc đơn giản chỉ có `completed`
