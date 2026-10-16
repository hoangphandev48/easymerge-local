# Test tích hợp

File `src/app.test.ts` dùng supertest gọi thẳng `createApp()`.

## Quy ước

- Không mở cổng thật.
- Test cần dữ liệu sạch tạo `createApp()` riêng thay vì dùng `app` chung.
- Luôn kiểm tra cả mã trạng thái và hình dạng envelope.

## Các tình huống phủ

- Health check, danh sách rỗng, tạo, lấy, cập nhật, xóa.
- 400: thiếu title, priority sai, completed sai kiểu, JSON hỏng, query sai.
- 404: id lạ khi PATCH/DELETE/GET, route lạ.
- Thống kê và việc `/stats` không bị nhầm với `/:id`.
- Tìm kiếm kết hợp sắp xếp và phân trang.
