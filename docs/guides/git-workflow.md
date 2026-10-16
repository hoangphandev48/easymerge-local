# Quy trình Git

## Nhánh

- `main`: ổn định.
- `develop`: tích hợp.
- `feature/<mô-tả>`: một tính năng, ví dụ `feature/todo-api-enhancements`.

## Commit

Định dạng `<type>: <mô tả>`, type gồm `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

## Pull request

1. Chạy typecheck và test.
2. Mô tả đầy đủ thay đổi so với nhánh gốc.
3. Ghi kế hoạch kiểm thử.
4. Đảm bảo docs khớp với code; nếu lệch phải ghi rõ lý do.
