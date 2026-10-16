# Tích hợp liên tục

Repo chưa có cấu hình CI. Đề xuất pipeline tối thiểu:

```text
install → typecheck → test → build
```

## Lệnh

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## Điều kiện merge

- Cả bốn bước thành công.
- Docs khớp với hành vi code, hoặc ghi chú rõ chỗ lệch trong PR.
- Không có `console.log` ngoài `index.ts` và `errorHandler`.
