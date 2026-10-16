# ADR 002: Dùng Express 4

- Trạng thái: chấp nhận
- Ngày: 2026-10-16

## Bối cảnh

Cần framework HTTP quen thuộc, tài liệu nhiều, tích hợp tốt với supertest.

## Quyết định

Dùng Express `^4.19`.

## Hệ quả

- Handler đồng bộ ném lỗi được chuyển sang `errorHandler` tự động.
- Handler bất đồng bộ trong Express 4 không tự bắt lỗi; cần bọc khi thêm.
- Nâng lên Express 5 là hướng cần cân nhắc sau.
