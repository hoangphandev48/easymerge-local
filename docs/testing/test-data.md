# Dữ liệu test

Không dùng fixture file; dữ liệu tạo ngay trong test qua repository hoặc API.

## Mẫu hay dùng

| Mục đích           | Dữ liệu                                      |
| ------------------ | -------------------------------------------- |
| Quá hạn            | `dueDate: "2000-01-01T00:00:00.000Z"`        |
| Chưa tới hạn       | `dueDate: "2999-01-01T00:00:00.000Z"`        |
| Hạn gần / xa       | `2030-01-01...` và `2031-01-01...`           |
| Tìm kiếm           | Tiêu đề có dấu như `Mua sữa`, `Học bài`      |

## Nguyên tắc

- Mỗi test tự tạo dữ liệu, không phụ thuộc test khác.
- Test dùng repository chung phải chấp nhận dữ liệu từ test trước hoặc dùng `createApp()` mới.
