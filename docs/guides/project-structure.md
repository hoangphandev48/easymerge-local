# Cấu trúc dự án

```text
src/
├── index.ts
├── app.ts
├── app.test.ts
├── middleware/
│   └── errorHandler.ts
└── todos/
    ├── todo.types.ts
    ├── todo.validation.ts
    ├── todo.repository.ts
    ├── todo.controller.ts
    ├── todo.routes.ts
    └── *.test.ts
docs/
public/
```

## Quy ước

- Tổ chức theo feature, không theo loại file.
- Test nằm cạnh file được test.
- File dưới 400 dòng, hàm dưới 50 dòng.
- `public/todo-client.min.js` là client tĩnh, không thuộc luồng build.
