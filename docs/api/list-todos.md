# GET /todos

Trả danh sách todo có lọc, tìm kiếm, sắp xếp và phân trang.

## Query

Chi tiết từng tham số xem [query-params.md](query-params.md).

```text
GET /todos?q=mua&completed=false&sort=priority&order=desc&page=1&limit=10
```

## Response 200

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "0b9c...",
        "title": "Mua sữa",
        "completed": false,
        "priority": "high",
        "dueDate": null,
        "createdAt": "2026-10-16T10:00:00.000Z",
        "updatedAt": "2026-10-16T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10
  },
  "error": null
}
```

## Ghi chú

- `total` là tổng số bản ghi khớp bộ lọc, không phải số bản ghi của trang.
- `page` vượt quá số trang trả `items: []`, không phải lỗi.
- Query sai trả `400`, xem [errors.md](errors.md).
