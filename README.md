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

| Method | Endpoint      | Mô tả                       |
| ------ | ------------- | --------------------------- |
| GET    | `/health`     | Kiểm tra sức khoẻ server    |
| GET    | `/todos`      | Lấy danh sách todo (lọc: `?completed=true\|false`) |
| POST   | `/todos`      | Tạo todo mới (`{ title }`)  |
| GET    | `/todos/:id`  | Lấy todo theo id            |
| PATCH  | `/todos/:id`  | Cập nhật (`title`/`completed`) |
| DELETE | `/todos/:id`  | Xoá todo                    |

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
    ├── todo.controller.ts # xử lý request/response
    ├── todo.routes.ts     # khai báo route
    ├── todo.repository.test.ts
    └── ../app.test.ts     # test tích hợp API
```

Dữ liệu lưu trong bộ nhớ (in-memory) nên sẽ mất khi khởi động lại — phù hợp cho mục đích demo.
