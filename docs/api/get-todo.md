# GET /todos/:id

Lấy một todo theo `id` (UUID sinh bởi `randomUUID`).

## Response

- `200` kèm todo trong `data`.
- `404` với `error: "Không tìm thấy todo"` khi id không tồn tại.

## Lưu ý

- `/todos/stats` được đăng ký trước `/:id` nên không bao giờ bị coi là id.
- Không validate định dạng UUID; id lạ đơn giản trả 404.
