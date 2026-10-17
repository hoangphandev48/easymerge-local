# API — Xóa hàng loạt

Mở rộng của [products.md](products.md). Định dạng response và mã lỗi xem [overview.md](overview.md).

| Method | Path | Mô tả | Thành công |
|--------|------|-------|------------|
| POST | `/api/products/bulk-delete` | Xóa mềm nhiều sản phẩm | 200 |

## Quyền và giới hạn

- Yêu cầu role `admin`, đi qua cùng chuỗi middleware với các endpoint khác (`rate-limit → auth → validate`).
- Mỗi lần gọi tối đa **50** id. Danh sách rỗng hoặc quá 50 phần tử trả `400 VALIDATION_ERROR`.
- Mỗi id phải là UUID hợp lệ; một id sai định dạng làm cả request bị từ chối (`400`), không xử lý một phần.
- Id trùng nhau trong danh sách chỉ được tính một lần.

## Body

```json
{ "ids": ["0b7c2f6e-6f0a-4c3e-9a55-3d6d0a1c1e11", "5f1d2a9c-1b2e-4d63-8c0f-77a1b6d1c9aa"] }
```

## Hành vi

- **Chỉ xóa mềm**: đặt `deleted_at = now()`; không bao giờ xóa cứng bản ghi.
- Chỉ tác động tới bản ghi chưa bị xóa (`deleted_at IS NULL`).
- Id không tồn tại hoặc đã xóa **không** làm request thất bại; chúng được liệt kê ở `notFound`.
- Toàn bộ các bản ghi hợp lệ được xóa trong **một câu lệnh** (một transaction), không lặp từng bản ghi.

## Response `200`

```json
{
  "success": true,
  "data": { "deleted": 1, "notFound": ["5f1d2a9c-1b2e-4d63-8c0f-77a1b6d1c9aa"] },
  "error": null,
  "meta": null
}
```

`deleted` là số bản ghi vừa bị xóa mềm; `notFound` là các id không tìm thấy hoặc đã xóa trước đó, theo thứ tự trong request.
