# Phát hành

Dự án chưa có quy trình tự động; các bước thủ công:

1. Hợp nhất vào `main` sau khi typecheck và test đều pass.
2. `npm run build` và kiểm tra `dist/`.
3. Tăng `version` trong `package.json`.
4. Gắn tag `vX.Y.Z`.
5. Triển khai bằng `npm start` với `PORT` phù hợp.

## Lưu ý

Vì dữ liệu in-memory, mỗi lần triển khai sẽ xóa sạch todo. Cần thông báo trước nếu có người dùng thật.
