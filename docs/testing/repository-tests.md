# Test repository

File: `src/todos/todo.repository.test.ts`.

## Nhóm test

- CRUD cơ bản và tính bất biến.
- `search`: tìm không phân biệt hoa thường, sắp xếp theo priority, null `dueDate` xuống cuối, phân trang, kết hợp bộ lọc.
- `stats`: tổng, hoàn thành, đang làm, quá hạn.

## Lưu ý khi viết test mới

- Dùng ngày cố định xa quá khứ (`2000-...`) hoặc tương lai (`2999-...`) để không phụ thuộc đồng hồ.
- Lấy tiêu đề (`map(t => t.title)`) khi so sánh thứ tự cho dễ đọc.
