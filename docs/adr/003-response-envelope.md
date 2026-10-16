# ADR 003: Envelope thống nhất

- Trạng thái: chấp nhận
- Ngày: 2026-10-16

## Quyết định

Mọi response JSON của `/todos` có dạng `{ success, data, error }`.

## Lý do

- Client xử lý lỗi một cách đồng nhất.
- Dễ mở rộng thêm metadata sau này.

## Hệ quả

- `GET /todos` đổi từ mảng sang `{ items, total, page, limit }`, có thể làm hỏng client cũ.
- `/health` và `204` là ngoại lệ có chủ đích.
