# ADR 005: Validation viết tay

- Trạng thái: chấp nhận, có thể xem lại
- Ngày: 2026-10-16

## Bối cảnh

Số trường ít, muốn tránh thêm dependency.

## Quyết định

Viết các hàm `parse*` thuần trong `todo.validation.ts` thay vì dùng Zod.

## Hệ quả

- Ưu: không thêm dependency, thông điệp lỗi tiếng Việt tùy ý.
- Nhược: phải tự duy trì khi số trường tăng.
- Nếu schema phình to, chuyển sang Zod và suy ra kiểu từ schema.
