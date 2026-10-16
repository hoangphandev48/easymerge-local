# Cấu hình

## Biến môi trường

| Biến   | Mặc định | Mô tả                                      |
| ------ | -------- | ------------------------------------------ |
| `PORT` | `3000`   | Cổng lắng nghe; giá trị không phải số bị bỏ qua |

## TypeScript

Các tùy chọn đáng chú ý trong `tsconfig.json`:

- `strict: true`
- `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- `module: ESNext`, `target: ES2022`
- Xuất ra `dist/`, nguồn ở `src/`

## Vitest

`vitest.config.ts` chạy môi trường `node`, chỉ lấy file `src/**/*.test.ts`.

## Ghi chú

Chưa có file cấu hình runtime nào khác; `.env` đã nằm trong `.gitignore` phòng khi cần sau này.
