# Chiến lược kiểm thử

Công cụ: Vitest, Supertest. Tất cả test chạy bằng `npm test`.

## Ba lớp

| Lớp         | File                          | Mục tiêu                              |
| ----------- | ----------------------------- | ------------------------------------- |
| Validation  | `todo.validation.test.ts`     | Parse đúng/sai, các giá trị biên      |
| Repository  | `todo.repository.test.ts`     | Lọc, sắp xếp, phân trang, thống kê    |
| Tích hợp    | `app.test.ts`                 | HTTP end-to-end qua supertest         |

## Nguyên tắc

- Viết test trước (RED), code tối thiểu (GREEN), rồi refactor.
- Mục tiêu độ phủ từ 80% trở lên, xem [coverage.md](coverage.md).
- Sửa code thay vì sửa test, trừ khi test sai.
