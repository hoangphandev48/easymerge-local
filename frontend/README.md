# Todo Frontend (React + Vite + TypeScript)

Sample ứng dụng Todo cơ bản, tách biệt với backend Express ở thư mục gốc.

## Tính năng

- Thêm / sửa (nhấn đúp) / xoá công việc
- Đánh dấu hoàn thành
- Lọc: Tất cả · Đang làm · Đã xong
- Xoá tất cả việc đã xong
- Tự lưu vào `localStorage` (không mất khi tải lại trang)

## Chạy dự án

```bash
cd frontend
npm install
npm run dev      # chạy dev server tại http://localhost:5173
```

Các lệnh khác:

```bash
npm run build      # type-check + build production vào dist/
npm run preview    # xem thử bản build
npm run typecheck  # chỉ kiểm tra type
```

## Cấu trúc thư mục

Tổ chức theo **feature**, không theo loại file:

```
src/
├── main.tsx                  # entry point, mount React + import styles
├── App.tsx                   # root component
├── components/
│   └── todo/                 # feature "todo"
│       ├── TodoApp.tsx       # container: nối hook với UI
│       ├── TodoForm.tsx      # ô nhập thêm việc
│       ├── TodoList.tsx      # danh sách + empty state
│       ├── TodoItem.tsx      # 1 dòng việc (toggle/sửa/xoá)
│       ├── TodoFilters.tsx   # footer: đếm, lọc, xoá đã xong
│       └── todo.css          # style riêng của feature
├── hooks/
│   ├── useTodos.ts           # toàn bộ state logic + action bất biến
│   └── useLocalStorage.ts    # đồng bộ state ↔ localStorage
├── lib/
│   └── todo.ts               # hàm thuần (pure): create/toggle/filter...
├── types/
│   └── todo.ts               # kiểu dữ liệu Todo, TodoFilter
└── styles/
    ├── tokens.css            # design tokens (màu, spacing, motion...)
    └── global.css            # reset + nền toàn cục
```

## Nguyên tắc thiết kế

- **Bất biến (immutable):** mọi thao tác trả về mảng/đối tượng mới, không mutate.
- **Tách logic khỏi UI:** `useTodos` giữ state, component chỉ render.
- **Design tokens:** màu/spacing/motion khai báo một chỗ trong `tokens.css`.
- **Accessible:** semantic HTML, `aria-*`, hỗ trợ bàn phím và `prefers-reduced-motion`.
- **Motion mượt:** chỉ animate `transform` / `opacity` (thân thiện compositor).
