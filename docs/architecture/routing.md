# Routing

## Bảng route

| Method | Đường dẫn      | Handler               |
| ------ | -------------- | --------------------- |
| GET    | `/todos`       | `controller.list`     |
| POST   | `/todos`       | `controller.create`   |
| GET    | `/todos/stats` | `controller.stats`    |
| GET    | `/todos/:id`   | `controller.getById`  |
| PATCH  | `/todos/:id`   | `controller.update`   |
| DELETE | `/todos/:id`   | `controller.remove`   |

## Thứ tự

`/stats` bắt buộc đứng trước `/:id`; nếu đảo, `stats` sẽ bị hiểu là một id và trả 404.

## Gắn router

`app.use("/todos", createTodoRouter())` trong `app.ts`, sau `/health` và trước `notFoundHandler`.
