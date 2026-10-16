# Độ phủ

Mục tiêu tối thiểu: 80% dòng, nhánh và hàm.

## Cách đo

Cần cài thêm `@vitest/coverage-v8`, hiện chưa có trong `devDependencies`:

```bash
npm install -D @vitest/coverage-v8
npx vitest run --coverage
```

Thư mục `coverage/` đã nằm trong `.gitignore`.

## Vùng cần chú ý

- Nhánh 500 trong `errorHandler` chưa có test riêng.
- `src/index.ts` không được test vì chỉ gọi `listen`.
