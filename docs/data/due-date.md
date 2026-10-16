# Hạn hoàn thành

`dueDate` là chuỗi ISO 8601 hoặc `null`.

## Quy tắc

- Kiểm tra bằng `Date.parse`; chuỗi không parse được bị từ chối.
- Giá trị được lưu nguyên chuỗi client gửi, không chuẩn hóa múi giờ.
- `PATCH` với `dueDate: null` xóa hạn.

## Quá hạn

Một todo quá hạn khi chưa hoàn thành, có `dueDate` và `Date.parse(dueDate)` nhỏ hơn thời điểm hiện tại.
Số lượng quá hạn xuất hiện trong [../api/stats.md](../api/stats.md).

## Sắp xếp

Khi `sort=dueDate`, todo không có hạn luôn xếp cuối, bất kể `order`.
