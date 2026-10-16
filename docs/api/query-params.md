# Tham số query của GET /todos

| Tham số     | Kiểu    | Mặc định    | Ràng buộc                                              |
| ----------- | ------- | ----------- | ------------------------------------------------------ |
| `q`         | string  | không có    | Trim; rỗng thì bỏ qua; tìm trong `title`, không phân biệt hoa thường |
| `completed` | string  | không có    | Chỉ `true` hoặc `false`                                |
| `sort`      | string  | `createdAt` | `createdAt`, `updatedAt`, `priority`, `dueDate`        |
| `order`     | string  | `desc`      | `asc` hoặc `desc`                                      |
| `page`      | number  | `1`         | Số nguyên dương                                        |
| `limit`     | number  | `10`        | Số nguyên từ 1 đến 50                                  |

## Quy tắc parse

- Số chỉ nhận chuỗi toàn chữ số; `1.5`, `-1`, `abc` đều bị từ chối.
- `q` lặp lại nhiều lần (mảng) bị từ chối.
- Giá trị sai trả `400` kèm tên tham số trong thông điệp.

Ví dụ: `/todos?sort=dueDate&order=asc&limit=5`.
