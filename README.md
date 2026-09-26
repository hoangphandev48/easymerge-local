# Ripple Todo

Ứng dụng todo viết bằng [Ripple](https://www.ripple-ts.com/) — framework UI
TypeScript dùng file `.tsrx`.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
```

Các lệnh khác: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format`.

## Tính năng

- Thêm / xoá việc, đánh dấu hoàn thành.
- Sửa nhanh nội dung: nháy đúp vào việc (hoặc bấm ✎), `Enter` để lưu, `Esc` để huỷ.
- Lọc theo trạng thái: Tất cả / Đang làm / Đã xong, kèm số lượng từng mục.
- Tìm kiếm không phân biệt hoa thường và **không phân biệt dấu** (`hoc` khớp `Học`).
- Nút xoá toàn bộ việc đã xong.
- Tự lưu vào `localStorage`, mở lại trình duyệt vẫn còn dữ liệu.

## Cấu trúc

| File                                                                                 | Nội dung                                    |
| ------------------------------------------------------------------------------------ | ------------------------------------------- |
| [index.html](index.html)                                                             | Trang gốc, nạp `src/index.ts`               |
| [src/index.ts](src/index.ts)                                                         | `mount(App, { target })`                    |
| [src/App.tsrx](src/App.tsrx)                                                         | State, giá trị dẫn xuất và các hành động    |
| [src/types.ts](src/types.ts)                                                         | `Todo`, `TodoFilter`, `TodoCounts`          |
| [src/constants.ts](src/constants.ts)                                                 | Khoá localStorage, nhãn bộ lọc, dữ liệu mẫu |
| [src/components/AddTodoForm.tsrx](src/components/AddTodoForm.tsrx)                   | Form thêm việc (giữ draft riêng)            |
| [src/components/SearchBox.tsrx](src/components/SearchBox.tsrx)                       | Ô tìm kiếm + nút xoá từ khoá                |
| [src/components/FilterBar.tsrx](src/components/FilterBar.tsrx)                       | Ba nút lọc kèm số lượng                     |
| [src/components/TodoStats.tsrx](src/components/TodoStats.tsrx)                       | Dòng tóm tắt                                |
| [src/components/TodoList.tsrx](src/components/TodoList.tsrx)                         | Danh sách đã lọc                            |
| [src/components/TodoItem.tsrx](src/components/TodoItem.tsrx)                         | Một dòng todo, gồm chế độ sửa               |
| [src/components/EmptyState.tsrx](src/components/EmptyState.tsrx)                     | Dòng thay thế khi danh sách rỗng            |
| [src/components/ClearCompletedButton.tsrx](src/components/ClearCompletedButton.tsrx) | Nút xoá việc đã xong                        |
| [src/lib/filters.ts](src/lib/filters.ts)                                             | `matchesFilter`, `countTodos`               |
| [src/lib/search.ts](src/lib/search.ts)                                               | Bỏ dấu + so khớp từ khoá                    |
| [src/lib/storage.ts](src/lib/storage.ts)                                             | Đọc/ghi localStorage an toàn                |
| [src/lib/summary.ts](src/lib/summary.ts)                                             | Câu tóm tắt và câu cho danh sách rỗng       |
| [src/lib/todos.ts](src/lib/todos.ts)                                                 | Tạo todo phản ứng, chuyển về object thường  |
| [src/lib/id.ts](src/lib/id.ts)                                                       | Bộ phát id tăng dần                         |
| [vite.config.js](vite.config.js)                                                     | Vite + `@ripple-ts/vite-plugin`             |

## Cú pháp Ripple dùng trong app

- `function App() @{ ... }` — statement container: code setup đứng trước, kết thúc
  bằng đúng một node JSX.
- `let &[draft] = track('')` — state; đọc là subscribe, gán là cập nhật.
- `let &[visible] = track(() => ...)` — giá trị dẫn xuất (danh sách sau khi lọc).
- `function SearchBox(&{ query, onChange })` — lazy destructuring, prop vẫn phản ứng
  sau khi tách khỏi object.
- `effect(() => saveTodos(...))` — chạy lại mỗi khi dữ liệu đọc bên trong đổi.
- `new RippleArray(...)` / `new RippleObject(...)` — collection phản ứng, nên
  `todos.push(...)` hay `todo.done = !todo.done` là UI tự cập nhật.
- `@for (const todo of todos; key todo.id) { ... } @empty { ... }`, `@if`/`@else` —
  control flow trong template (không dùng `for`/`if` thường để render).
- `<style>` trong component được scope tự động; `:global(...)` để thoát scope.
