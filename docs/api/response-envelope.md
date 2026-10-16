# Response envelope

Mọi response JSON của `/todos` đều có ba trường:

| Trường    | Kiểu            | Ghi chú                          |
| --------- | --------------- | -------------------------------- |
| `success` | boolean         | `true` khi thành công            |
| `data`    | object \| null  | `null` khi có lỗi                |
| `error`   | string \| null  | `null` khi thành công            |

## Thành công

```json
{ "success": true, "data": { "total": 1, "completed": 0, "pending": 1, "overdue": 0 }, "error": null }
```

## Lỗi

```json
{ "success": false, "data": null, "error": "Không tìm thấy todo" }
```

## Ngoại lệ

- `DELETE /todos/:id` thành công trả `204` không body.
- `GET /health` trả `{ "status": "ok" }`.

Helper nằm ở `ok()` trong controller và `errorBody()` trong `errorHandler.ts`.
Quyết định thiết kế xem [../adr/003-response-envelope.md](../adr/003-response-envelope.md).
