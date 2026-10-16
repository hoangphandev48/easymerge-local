# Dependency injection

Repository được truyền từ ngoài vào để thay thế khi test.

```ts
export function createTodoRouter(repository = new TodoRepository()): Router
```

`TodoController` nhận repository qua constructor:

```ts
constructor(private readonly repository: TodoRepository) {}
```

## Lợi ích

- Mỗi test có thể dùng repository riêng, không chia sẻ trạng thái.
- Không cần thư viện DI; hàm factory là đủ.

## Hạn chế hiện tại

`createApp()` không nhận tham số và luôn tạo repository mới trong router mặc định.
Test tích hợp tạo `createApp()` riêng khi cần dữ liệu sạch.
