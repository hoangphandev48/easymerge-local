# HTTP headers bảo mật

Hiện chưa cấu hình. Khuyến nghị dùng `helmet`:

| Header                      | Giá trị gợi ý                         |
| --------------------------- | ------------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                             |
| `X-Frame-Options`           | `DENY`                                |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`     |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |

Express nên tắt `X-Powered-By` bằng `app.disable("x-powered-by")`.
CORS chưa bật; nếu client chạy khác origin cần cấu hình allow-list rõ ràng.
