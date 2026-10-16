# Sắp xếp

Thực hiện trong `compareTodos` của repository.

| Trường      | So sánh                                         |
| ----------- | ----------------------------------------------- |
| `createdAt` | So sánh chuỗi ISO bằng `localeCompare`          |
| `updatedAt` | Như trên                                        |
| `priority`  | Theo thứ hạng số, xem [priority.md](priority.md) |
| `dueDate`   | Theo thời gian; null luôn cuối                  |

## Hướng

`order=asc` nhân với 1, `order=desc` nhân với -1. Riêng nhánh `dueDate` với giá trị null không bị đảo.

## Ổn định

Hàm so sánh trả `0` khi bằng nhau, nên các phần tử bằng nhau giữ thứ tự chèn ban đầu, kể cả khi `order=desc`.
Điều này đáng chú ý với `createdAt` khi nhiều todo tạo trong cùng một mili giây.
