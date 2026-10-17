# API — Tổng quan

Base path: `/api`. Dữ liệu JSON, UTF-8. Chi tiết endpoint: [products.md](products.md).

## Xác thực và phân quyền

- Mọi endpoint yêu cầu đăng nhập với role `admin`.
- Chưa đăng nhập → `401`; không phải admin → `403`.
- Dùng session cookie `HttpOnly` hoặc JWT. Với cookie, request thay đổi dữ liệu cần CSRF token.

## Envelope response

Mọi response dùng cùng một định dạng:

```json
{ "success": true, "data": { }, "error": null, "meta": null }
```

| Trường | Ý nghĩa |
|--------|---------|
| `success` | `true` / `false` |
| `data` | Dữ liệu; `null` khi lỗi |
| `error` | Đối tượng lỗi; `null` khi thành công |
| `meta` | Thông tin phân trang cho danh sách; còn lại `null` |

Danh sách:

```json
{ "success": true, "data": [ ], "error": null, "meta": { "total": 134, "page": 1, "limit": 20 } }
```

Lỗi:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "fields": { "price": "Phải ≥ 0" }
  },
  "meta": null
}
```

`fields` chỉ có với lỗi validate; frontend dùng để hiển thị lỗi ở từng ô nhập.

## Mã lỗi

| HTTP | `code` | Khi nào |
|------|--------|---------|
| 400 | `VALIDATION_ERROR` | body/query sai định dạng |
| 401 | `UNAUTHORIZED` | chưa đăng nhập |
| 403 | `FORBIDDEN` | không phải admin |
| 404 | `NOT_FOUND` | không có bản ghi hoặc đã bị xóa |
| 409 | `SKU_EXISTS` | trùng SKU |
| 429 | `RATE_LIMITED` | vượt giới hạn request |
| 500 | `INTERNAL_ERROR` | lỗi không lường trước (không lộ chi tiết) |

## Quy ước

- Số tiền (`price`) trả về dạng chuỗi (`"199000.00"`) để tránh sai số số thực.
- Thời gian dùng ISO 8601 UTC.
- `PATCH` cập nhật một phần; không gửi trường nào thì không đổi trường đó.
