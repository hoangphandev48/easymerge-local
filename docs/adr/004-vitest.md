# ADR 004: Vitest cho kiểm thử

- Trạng thái: chấp nhận
- Ngày: 2026-10-16

## Quyết định

Dùng Vitest 2 cùng Supertest.

## Lý do

- Hỗ trợ TypeScript và ESM sẵn, không cần cấu hình phức tạp.
- Chạy nhanh, có chế độ watch.

## Hệ quả

- Phiên bản được giữ ở 2.x theo lịch sử commit gần đây.
- Đo độ phủ cần thêm gói `@vitest/coverage-v8`.
