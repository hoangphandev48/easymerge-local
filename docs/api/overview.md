# Tổng quan API

Todo REST API chạy trên Express, mọi endpoint trả JSON (trừ `DELETE` thành công trả `204` không body).

## Base URL

- Mặc định `http://localhost:3000`, đổi qua biến môi trường `PORT`.
- `GET /health` trả `{ "status": "ok" }`, không dùng envelope.

## Danh sách endpoint

| Method | Đường dẫn      | Tài liệu                          |
| ------ | -------------- | --------------------------------- |
| GET    | `/todos`       | [list-todos.md](list-todos.md)    |
| GET    | `/todos/stats` | [stats.md](stats.md)              |
| POST   | `/todos`       | [create-todo.md](create-todo.md)  |
| GET    | `/todos/:id`   | [get-todo.md](get-todo.md)        |
| PATCH  | `/todos/:id`   | [update-todo.md](update-todo.md)  |
| DELETE | `/todos/:id`   | [delete-todo.md](delete-todo.md)  |

## Quy ước chung

- Body gửi lên là JSON, header `Content-Type: application/json`.
- Định dạng response xem [response-envelope.md](response-envelope.md).
- Định dạng lỗi xem [errors.md](errors.md).
- Không có xác thực; dữ liệu nằm trong bộ nhớ nên mất khi khởi động lại.
