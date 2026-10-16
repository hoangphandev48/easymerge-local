# DELETE /todos/:id

Xóa một todo.

## Response

- `204` không có body khi xóa thành công.
- `404` với envelope lỗi khi id không tồn tại.

## Ghi chú

- Thao tác không idempotent theo mã trạng thái: gọi lần hai trả `404`.
- Không có xóa mềm; dữ liệu mất hẳn khỏi bộ nhớ.
