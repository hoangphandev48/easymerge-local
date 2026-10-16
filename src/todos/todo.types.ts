export type TodoPriority = "low" | "medium" | "high";
export type TodoSortField = "createdAt" | "updatedAt" | "priority" | "dueDate";
export type SortOrder = "asc" | "desc";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  /** Hạn hoàn thành theo ISO 8601, null nếu không có hạn. */
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Bộ lọc khi truy vấn danh sách todo. */
export interface TodoFilter {
  completed?: boolean;
}

/** Truy vấn danh sách todo: lọc, tìm kiếm, sắp xếp, phân trang. */
export interface TodoQuery {
  completed?: boolean;
  q?: string;
  sort: TodoSortField;
  order: SortOrder;
  page: number;
  limit: number;
}

/** Kết quả phân trang. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/** Thống kê tổng quan các todo. */
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

/** Dữ liệu client gửi lên khi tạo mới một todo. */
export interface CreateTodoInput {
  title: string;
  priority?: TodoPriority;
  dueDate?: string | null;
}

/** Dữ liệu client gửi lên khi cập nhật một todo (tất cả đều tùy chọn). */
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  priority?: TodoPriority;
  dueDate?: string | null;
}
