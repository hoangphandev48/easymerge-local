export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Bộ lọc khi truy vấn danh sách todo. */
export interface TodoFilter {
  completed?: boolean;
}

/** Dữ liệu client gửi lên khi tạo mới một todo. */
export interface CreateTodoInput {
  title: string;
}

/** Dữ liệu client gửi lên khi cập nhật một todo (tất cả đều tùy chọn). */
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}
