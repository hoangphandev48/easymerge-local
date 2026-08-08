/**
 * Kiểu dữ liệu cho miền Todo.
 * Tách riêng khỏi logic để tái sử dụng ở component, hook và util.
 */

export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly createdAt: number;
}

/** Bộ lọc hiển thị danh sách todo. */
export type TodoFilter = 'all' | 'active' | 'completed';
