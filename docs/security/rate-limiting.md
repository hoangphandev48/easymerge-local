# Giới hạn tốc độ

Hiện chưa triển khai.

## Rủi ro

Các endpoint ghi (`POST`, `PATCH`, `DELETE`) có thể bị gọi dồn dập làm đầy bộ nhớ vì dữ liệu lưu in-memory.

## Đề xuất

- Dùng `express-rate-limit` cho nhóm `/todos`, ví dụ 100 request mỗi phút mỗi IP.
- Siết chặt hơn cho `POST /todos`.
- Đặt giới hạn tổng số todo trong repository.

Đây là việc ngoài phạm vi hiện tại.
