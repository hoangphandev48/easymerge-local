# Xử lý lỗi

## Luồng

1. Validation ném `ValidationError` (có `status = 400`).
2. Controller là hàm đồng bộ nên Express tự chuyển lỗi sang `errorHandler`.
3. `errorHandler` phân loại và trả envelope lỗi.

## Phân loại trong errorHandler

| Loại lỗi                          | Trả về | Log server |
| --------------------------------- | ------ | ---------- |
| `ValidationError`                 | 400    | Không      |
| Lỗi parse JSON (`entity.parse.failed`) | 400 | Không      |
| Còn lại                           | 500    | Có         |

Lỗi 500 chỉ trả thông điệp chung, không lộ stack trace hay nội dung lỗi.

## 404

- Todo không tồn tại: controller tự trả 404.
- Route không khớp: `notFoundHandler` gắn trước `errorHandler` trong `app.ts`.

Nếu sau này có handler bất đồng bộ, cần bọc để chuyển lỗi vào `next`.
