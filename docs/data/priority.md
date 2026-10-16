# Độ ưu tiên

Ba mức, khai báo bằng union literal thay vì enum.

| Giá trị  | Thứ hạng khi sắp xếp |
| -------- | -------------------- |
| `low`    | 0                    |
| `medium` | 1 (mặc định)         |
| `high`   | 2                    |

## Sắp xếp

- `sort=priority&order=desc` đưa `high` lên đầu.
- `order=asc` đưa `low` lên đầu.
- Hai todo cùng mức giữ nguyên thứ tự tương đối (sort ổn định).

## Validation

Giá trị khác ba mức trên bị từ chối với `400`.
