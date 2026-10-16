# Phát triển cục bộ

## Vòng lặp làm việc

1. `npm run dev` chạy `tsx watch`, tự khởi động lại khi sửa file.
2. Viết test trước trong `*.test.ts` cạnh file nguồn.
3. `npm run test:watch` để chạy test liên tục.
4. Trước khi commit: `npm run typecheck && npm test`.

## Mẹo

- Dữ liệu in-memory nên khởi động lại là mất; dùng script curl để tạo lại dữ liệu mẫu.
- Dùng `PORT=4000 npm run dev` nếu cổng 3000 đang bận.
- Import trong mã nguồn dùng đuôi `.js` (ESM + `moduleResolution: Bundler`).
