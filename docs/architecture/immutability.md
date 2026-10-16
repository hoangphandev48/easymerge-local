# Bất biến dữ liệu

Nguyên tắc: không sửa object đã có, luôn tạo bản sao mới.

## Áp dụng trong repository

- `create`: `this.todos = [...this.todos, todo]`.
- `update`: tạo object mới bằng spread rồi `map` thay thế đúng phần tử.
- `delete`: `filter` ra mảng mới.
- `search`: sắp xếp trên bản sao `[...matched]`, không đụng mảng gốc.

## Vì sao

- Todo trả về cho caller không bị đổi ngầm khi có cập nhật sau đó.
- Dễ suy luận và dễ test.

## Kiểm chứng

Test `cập nhật todo mà không làm thay đổi object gốc (bất biến)` trong `todo.repository.test.ts` bảo vệ quy tắc này.
