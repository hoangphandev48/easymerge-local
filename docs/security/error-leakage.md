# Không lộ thông tin qua lỗi

- Lỗi 500 chỉ trả `Đã có lỗi xảy ra trên máy chủ`.
- Chi tiết lỗi được log phía server tại `errorHandler`.
- Lỗi 400 chỉ chứa tên tham số và quy tắc, không chứa dữ liệu nhạy cảm.
- Express 4 mặc định có thể trả stack trace trong môi trường không phải production; `errorHandler` tùy chỉnh đã chặn điều này cho mọi lỗi đi qua nó.

## Việc cần làm khi thêm tính năng

Không đưa `err.message` của lỗi lạ vào response.
