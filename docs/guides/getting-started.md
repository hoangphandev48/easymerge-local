# Bắt đầu nhanh

## Yêu cầu

- Node.js 20 trở lên
- npm

## Các bước

```bash
npm install
npm run dev
```

Server chạy tại `http://localhost:3000`. Kiểm tra:

```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" -d '{"title":"Thử nghiệm"}'
curl "http://localhost:3000/todos?q=thử"
```

## Tiếp theo

- Cấu trúc thư mục: [project-structure.md](project-structure.md)
- Các lệnh npm: [scripts.md](scripts.md)
- Gặp lỗi: [troubleshooting.md](troubleshooting.md)
