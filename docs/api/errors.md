# Lỗi API

Mọi lỗi dùng cùng một dạng, xem [response-envelope.md](response-envelope.md).

```json
{ "success": false, "data": null, "error": "Mô tả lỗi" }
```

## Mã trạng thái

| Mã  | Khi nào                                                       |
| --- | ------------------------------------------------------------- |
| 400 | Query/body sai (`ValidationError`) hoặc body không phải JSON  |
| 404 | Không tìm thấy todo, hoặc route không tồn tại                 |
| 500 | Lỗi không lường trước; chi tiết chỉ nằm trong log server      |

## Thông điệp thường gặp

- `Trường 'title' là bắt buộc và không được rỗng`
- `Tham số 'completed' phải là 'true' hoặc 'false'`
- `Body không phải JSON hợp lệ`
- `Không tìm thấy todo`
- `Không tìm thấy tài nguyên` (route lạ)
- `Đã có lỗi xảy ra trên máy chủ`

Cơ chế xử lý nằm ở [../architecture/error-handling.md](../architecture/error-handling.md).
