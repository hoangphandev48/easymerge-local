# Ripple Todo

Ứng dụng todo đơn giản viết bằng [Ripple](https://www.ripple-ts.com/) — framework UI
TypeScript dùng file `.tsrx`.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
```

Các lệnh khác: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format`.

## Cấu trúc

| File                                   | Nội dung                                    |
| -------------------------------------- | ------------------------------------------- |
| [index.html](index.html)               | Trang gốc, nạp `src/index.ts`               |
| [src/index.ts](src/index.ts)           | `mount(App, { target })`                    |
| [src/App.tsrx](src/App.tsrx)           | State + form thêm việc + danh sách          |
| [src/TodoItem.tsrx](src/TodoItem.tsrx) | Một dòng todo (checkbox, nội dung, nút xoá) |
| [src/types.ts](src/types.ts)           | Kiểu `Todo`                                 |
| [vite.config.js](vite.config.js)       | Vite + `@ripple-ts/vite-plugin`             |

## Cú pháp Ripple dùng trong app

- `function App() @{ ... }` — statement container: code setup đứng trước, kết thúc
  bằng đúng một node JSX.
- `let &[draft] = track('')` — state; đọc là subscribe, gán là cập nhật.
- `let &[remaining] = track(() => ...)` — giá trị dẫn xuất.
- `new RippleArray(...)` / `new RippleObject(...)` — collection phản ứng, nên
  `todos.push(...)` hay `todo.done = !todo.done` là UI tự cập nhật.
- `@for (const todo of todos; key todo.id) { ... } @empty { ... }` — control flow
  trong template (không dùng `for`/`if` thường để render).
- `<style>` trong component được scope tự động; `:global(...)` để thoát scope.
