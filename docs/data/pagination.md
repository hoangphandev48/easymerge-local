# Phân trang

Kiểu theo trang (`page` + `limit`), không dùng cursor.

## Công thức

```text
start = (page - 1) * limit
items = sorted.slice(start, start + limit)
```

## Kết quả

| Trường  | Ý nghĩa                                  |
| ------- | ---------------------------------------- |
| `items` | Các todo của trang                       |
| `total` | Tổng số todo khớp bộ lọc (trước khi cắt) |
| `page`  | Số trang đã yêu cầu                      |
| `limit` | Số phần tử tối đa mỗi trang              |

## Giới hạn

- `limit` mặc định 10, tối đa 50.
- `page` vượt quá tổng số trang trả mảng rỗng.
- Số trang tổng không được trả về; client tự tính `ceil(total / limit)`.
