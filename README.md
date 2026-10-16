# easy-merge-test-repo-2

From Leo with ❤️

Một **Todo REST API** đơn giản viết bằng **Node.js + TypeScript + Express**, dùng để minh hoạ cấu trúc dự án gọn gàng, bất biến và có test.

## Yêu cầu

- Node.js >= 20

## Cài đặt

```bash
npm install
```

## Chạy dự án

```bash
npm run dev      # chế độ phát triển (tự reload với tsx)
npm run build    # biên dịch TypeScript sang dist/
npm start        # chạy bản đã build
npm test         # chạy toàn bộ test (vitest)
npm run typecheck # kiểm tra kiểu, không xuất file
```

Mặc định server chạy tại `http://localhost:3000` (đổi qua biến môi trường `PORT`).

## API

| Method | Endpoint       | Mô tả                                                         |
| ------ | -------------- | ------------------------------------------------------------- |
| GET    | `/health`      | Kiểm tra sức khoẻ server                                      |
| GET    | `/todos`       | Danh sách todo: lọc, tìm kiếm, sắp xếp, phân trang           |
| GET    | `/todos/stats` | Thống kê `total`, `completed`, `pending`, `overdue`           |
| POST   | `/todos`       | Tạo todo mới (`title`, tuỳ chọn `priority`, `dueDate`)        |
| GET    | `/todos/:id`   | Lấy todo theo id                                              |
| PATCH  | `/todos/:id`   | Cập nhật (`title`/`completed`/`priority`/`dueDate`)           |
| DELETE | `/todos/:id`   | Xoá todo                                                      |

Query của `GET /todos`:

| Query       | Mặc định    | Ràng buộc                                            |
| ----------- | ----------- | ---------------------------------------------------- |
| `q`         | —           | Tìm theo `title`, không phân biệt hoa thường         |
| `completed` | —           | `true` hoặc `false`                                  |
| `sort`      | `createdAt` | `createdAt`, `updatedAt`, `priority`, `dueDate`      |
| `order`     | `desc`      | `asc` hoặc `desc`                                    |
| `page`      | `1`         | Số nguyên >= 1                                       |
| `limit`     | `20`        | Số nguyên từ 1 đến 100                               |

`priority` nhận `low`, `medium` (mặc định), `high`; `dueDate` là chuỗi ISO 8601 hoặc `null`.

Mọi response đều có dạng `{ "success": boolean, "data": ..., "error": string | null }`
(riêng `DELETE` thành công trả `204` không có body). Danh sách trả về
`data: { items, total, page, limit }`. Lỗi: `400` dữ liệu không hợp lệ, `404` không tìm thấy, `500` lỗi máy chủ.

Ví dụ tạo todo:

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Học TypeScript"}'
```

## Cấu trúc

```text
src/
├── index.ts               # điểm khởi động (listen)
├── app.ts                 # cấu hình Express
├── middleware/
│   └── errorHandler.ts    # 404 + xử lý lỗi tập trung
└── todos/                 # feature todo
    ├── todo.types.ts      # kiểu dữ liệu
    ├── todo.repository.ts # lưu trữ (in-memory, bất biến)
    ├── todo.validation.ts # parse và validate query/body
    ├── todo.controller.ts # xử lý request/response
    ├── todo.routes.ts     # khai báo route
    ├── todo.repository.test.ts
    └── ../app.test.ts     # test tích hợp API
```

Dữ liệu lưu trong bộ nhớ (in-memory) nên sẽ mất khi khởi động lại — phù hợp cho mục đích demo.
