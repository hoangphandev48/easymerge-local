# Tổng quan kiến trúc

Ứng dụng chia theo feature, mỗi feature gồm types, repository, controller, routes.

```text
Request → express.json → router → controller → validation → repository
                                       ↓ lỗi
                                  errorHandler → JSON lỗi
```

## Thành phần

| Thành phần        | File                                  | Trách nhiệm                         |
| ----------------- | ------------------------------------- | ----------------------------------- |
| Khởi động         | `src/index.ts`                        | Đọc `PORT`, gọi `listen`            |
| Cấu hình app      | `src/app.ts`                          | Gắn middleware và router            |
| Router            | `src/todos/todo.routes.ts`            | Khai báo route, lắp controller      |
| Controller        | `src/todos/todo.controller.ts`        | Điều phối request/response          |
| Validation        | `src/todos/todo.validation.ts`        | Parse và kiểm tra đầu vào           |
| Repository        | `src/todos/todo.repository.ts`        | Lưu trữ in-memory, truy vấn         |
| Xử lý lỗi         | `src/middleware/errorHandler.ts`      | 404 và lỗi tập trung                |

Các tài liệu liên quan: [layers.md](layers.md), [app-bootstrap.md](app-bootstrap.md).
