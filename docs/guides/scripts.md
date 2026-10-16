# Các script npm

| Lệnh                | Tác dụng                                  |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Chạy `tsx watch src/index.ts`             |
| `npm run build`     | Biên dịch bằng `tsc` ra `dist/`           |
| `npm start`         | Chạy `node dist/index.js`                 |
| `npm run typecheck` | `tsc --noEmit`                            |
| `npm test`          | `vitest run` một lần                      |
| `npm run test:watch`| `vitest` chế độ theo dõi                  |

## Thứ tự gợi ý trước khi tạo PR

1. `npm run typecheck`
2. `npm test`
3. `npm run build`
