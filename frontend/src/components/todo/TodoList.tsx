import type { Todo } from '@/types/todo';
import { TodoItem } from '@/components/todo/TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}

/** Danh sách todo. Rỗng thì hiển thị empty state thân thiện. */
export function TodoList({ todos, onToggle, onRename, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="todo-list__empty" role="status">
        Chưa có công việc nào ở đây — thêm một việc để bắt đầu ✨
      </p>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
