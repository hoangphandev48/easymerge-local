import type { Todo, TodoFilter } from '@/types/todo';

/**
 * Các hàm thuần (pure) thao tác trên Todo.
 * Luôn trả về bản sao mới — không bao giờ mutate dữ liệu đầu vào.
 */

/** Sinh id duy nhất, ưu tiên crypto.randomUUID khi trình duyệt hỗ trợ. */
function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Tạo một todo mới từ tiêu đề đã được chuẩn hoá. */
export function createTodo(title: string): Todo {
  return {
    id: generateId(),
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}

/** Đảo trạng thái hoàn thành, trả về mảng mới. */
export function toggleTodo(todos: readonly Todo[], id: string): Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
}

/** Cập nhật tiêu đề của một todo, trả về mảng mới. */
export function renameTodo(
  todos: readonly Todo[],
  id: string,
  title: string,
): Todo[] {
  const next = title.trim();
  return todos.map((todo) =>
    todo.id === id ? { ...todo, title: next } : todo,
  );
}

/** Xoá một todo theo id, trả về mảng mới. */
export function removeTodo(todos: readonly Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

/** Xoá toàn bộ todo đã hoàn thành, trả về mảng mới. */
export function clearCompleted(todos: readonly Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

/** Lọc danh sách theo bộ lọc hiện tại. */
export function filterTodos(
  todos: readonly Todo[],
  filter: TodoFilter,
): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    case 'all':
    default:
      return [...todos];
  }
}

/** Đếm số todo chưa hoàn thành. */
export function countActive(todos: readonly Todo[]): number {
  return todos.reduce((total, todo) => (todo.completed ? total : total + 1), 0);
}
