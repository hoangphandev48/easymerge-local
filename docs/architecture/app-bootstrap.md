# Khởi động ứng dụng

## Tách `createApp` và `listen`

- `src/app.ts` xuất `createApp()` chỉ cấu hình Express.
- `src/index.ts` đọc `PORT` rồi gọi `listen`.
- Test dùng `createApp()` với supertest, không mở cổng thật.

## Thứ tự middleware

1. `express.json()`
2. `GET /health`
3. Router `/todos`
4. `notFoundHandler`
5. `errorHandler`

Hai handler cuối phải ở cuối để bắt các request không khớp và mọi lỗi phát sinh phía trước.

## Cổng

`PORT` lấy từ biến môi trường, mặc định `3000` khi không có hoặc không phải số.
