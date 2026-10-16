# GET /todos/stats

Trả số liệu tổng quan, tính trực tiếp từ dữ liệu hiện có.

## Response 200

```json
{
  "success": true,
  "data": { "total": 4, "completed": 1, "pending": 3, "overdue": 1 },
  "error": null
}
```

## Định nghĩa

| Trường      | Ý nghĩa                                                  |
| ----------- | -------------------------------------------------------- |
| `total`     | Tổng số todo                                             |
| `completed` | Số todo có `completed = true`                            |
| `pending`   | `total - completed`                                      |
| `overdue`   | Todo chưa hoàn thành có `dueDate` nhỏ hơn thời điểm hiện tại |

Todo đã hoàn thành không bao giờ tính là quá hạn; todo không có `dueDate` cũng vậy.
