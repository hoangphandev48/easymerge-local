# ADR 001: Lưu trữ in-memory

- Trạng thái: chấp nhận
- Ngày: 2026-10-16

## Bối cảnh

Dự án là bản demo, cần đơn giản và không phụ thuộc hạ tầng.

## Quyết định

Lưu todo trong mảng của `TodoRepository`.

## Hệ quả

- Ưu: không cần database, test nhanh.
- Nhược: mất dữ liệu khi khởi động lại, không scale ngang.
- Đường lui: giữ giao diện repository, thay phần cài đặt bằng database.
