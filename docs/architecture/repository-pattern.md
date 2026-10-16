# Repository

`TodoRepository` ẩn chi tiết lưu trữ sau một giao diện nhỏ.

## Giao diện công khai

| Phương thức          | Trả về                 | Mô tả                                  |
| -------------------- | ---------------------- | -------------------------------------- |
| `findAll(filter)`    | `Todo[]`               | Lọc theo `completed`                   |
| `search(query)`      | `Paginated<Todo>`      | Tìm, sắp xếp, phân trang               |
| `stats(now?)`        | `TodoStats`            | Thống kê; `now` để test được           |
| `findById(id)`       | `Todo \| undefined`    |                                        |
| `create(input)`      | `Todo`                 | Gán id, mặc định priority/dueDate      |
| `update(id, input)`  | `Todo \| undefined`    | `undefined` khi không tìm thấy         |
| `delete(id)`         | `boolean`              | `false` khi không tồn tại              |

## Lưu trữ

Mảng `todos` private. Mọi thao tác ghi gán mảng mới, xem [immutability.md](immutability.md).
Muốn đổi sang database chỉ cần giữ nguyên giao diện này, xem [../adr/001-in-memory-storage.md](../adr/001-in-memory-storage.md).
