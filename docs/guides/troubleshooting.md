# Xử lý sự cố

| Triệu chứng                              | Nguyên nhân thường gặp               | Cách xử lý                              |
| ---------------------------------------- | ------------------------------------ | --------------------------------------- |
| `ERR_MODULE_NOT_FOUND` khi chạy test     | Chưa cài dependency                  | `npm install`                           |
| `EADDRINUSE`                             | Cổng đang bận                        | Đổi `PORT` hoặc tắt tiến trình cũ       |
| `GET /todos/stats` trả 404               | Route bị đặt sau `/:id`              | Xem [../architecture/routing.md](../architecture/routing.md) |
| 400 "Body không phải JSON hợp lệ"        | Thiếu header hoặc JSON sai           | Gửi `Content-Type: application/json`    |
| `limit` bị từ chối                       | Ngoài khoảng 1 đến 50                | Giảm `limit`                            |
| Danh sách trống sau khi chạy lại         | Dữ liệu in-memory                    | Tạo lại dữ liệu                         |
