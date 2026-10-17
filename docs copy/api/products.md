# API — Products

Định dạng response và mã lỗi xem [overview.md](overview.md). Tất cả endpoint yêu cầu role `admin`.

| Method | Path | Mô tả | Thành công |
|--------|------|-------|------------|
| GET | `/api/products` | Danh sách | 200 |
| GET | `/api/products/:id` | Chi tiết | 200 |
| POST | `/api/products` | Tạo mới | 201 |
| PATCH | `/api/products/:id` | Cập nhật một phần | 200 |
| DELETE | `/api/products/:id` | Xóa mềm | 204 |

## Đối tượng Product

```json
{
  "id": "0b7c2f6e-6f0a-4c3e-9a55-3d6d0a1c1e11",
  "name": "Áo thun",
  "sku": "AT-001",
  "description": "Áo thun cotton",
  "price": "199000.00",
  "stock": 10,
  "status": "active",
  "createdAt": "2026-10-17T05:00:00Z",
  "updatedAt": "2026-10-17T05:00:00Z"
}
```

## GET /api/products

Query:

| Tham số | Mặc định | Ghi chú |
|---------|----------|---------|
| `page` | 1 | ≥ 1 |
| `limit` | 20 | 1–100 |
| `q` | — | tìm theo `name` hoặc `sku` (ILIKE) |
| `status` | — | `draft` / `active` / `archived` |
| `sort` | `-createdAt` | tiền tố `-` là giảm dần; cho phép `createdAt`, `name`, `price`, `stock` |

Response `200`: `data` là mảng Product, `meta` là `{ total, page, limit }`.

## GET /api/products/:id

- `200`: `data` là Product.
- `404 NOT_FOUND` nếu không có hoặc đã xóa mềm.
- `400` nếu `id` không phải UUID.

## POST /api/products

Body:

| Trường | Kiểu | Bắt buộc | Quy tắc |
|--------|------|----------|---------|
| `name` | string | có | 1–200 ký tự, cắt khoảng trắng hai đầu |
| `sku` | string | có | 1–50 ký tự, duy nhất |
| `description` | string | không | ≤ 5000 ký tự, mặc định `""` |
| `price` | number | có | ≥ 0 |
| `stock` | integer | không | ≥ 0, mặc định 0 |
| `status` | enum | không | `draft` / `active` / `archived`, mặc định `draft` |

Response:
- `201`: `data` là Product vừa tạo.
- `400 VALIDATION_ERROR`, `409 SKU_EXISTS`.

## PATCH /api/products/:id

Body: các trường như POST, tất cả tùy chọn, nhưng phải có ít nhất một trường.

Response:
- `200`: `data` là Product sau khi cập nhật.
- `400 VALIDATION_ERROR`, `404 NOT_FOUND`, `409 SKU_EXISTS`.

## DELETE /api/products/:id

- `204` không có body.
- `404 NOT_FOUND` nếu không có hoặc đã xóa.
- Xóa mềm: chỉ đặt `deleted_at`.

## Ví dụ

```bash
curl -X POST /api/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Áo thun","sku":"AT-001","price":199000,"stock":10,"status":"active"}'
```
