# POST /todos

Tạo một todo mới. Todo mới luôn có `completed = false`.

## Body

| Trường     | Kiểu             | Bắt buộc | Ghi chú                                  |
| ---------- | ---------------- | -------- | ---------------------------------------- |
| `title`    | string           | Có       | Bị trim, không được rỗng                 |
| `priority` | string           | Không    | `low`, `medium`, `high`; mặc định `medium` |
| `dueDate`  | string \| null   | Không    | ISO 8601; mặc định `null`                |

## Ví dụ

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Nộp báo cáo","priority":"high","dueDate":"2030-01-01T00:00:00.000Z"}'
```

## Response

- `201` kèm todo vừa tạo trong `data`.
- `400` khi thiếu `title`, `priority` sai, `dueDate` không parse được, hoặc body không phải JSON.
