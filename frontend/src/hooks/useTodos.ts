import { useCallback, useMemo, useState } from 'react';
import type { Todo, TodoFilter } from '@/types/todo';
import {
  clearCompleted,
  countActive,
  createTodo,
  filterTodos,
  removeTodo,
  renameTodo,
  toggleTodo,
} from '@/lib/todo';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'react-todo:items';

export interface UseTodosResult {
  todos: Todo[];
  visibleTodos: Todo[];
  filter: TodoFilter;
  activeCount: number;
  completedCount: number;
  hasCompleted: boolean;
  setFilter: (filter: TodoFilter) => void;
  addTodo: (title: string) => void;
  toggle: (id: string) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  clearDone: () => void;
}

/**
 * Container logic cho todo: sở hữu state, persist qua localStorage,
 * và phơi ra các action bất biến. Component chỉ việc render.
 */
export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [filter, setFilter] = useState<TodoFilter>('all');

  const addTodo = useCallback(
    (title: string) => {
      const trimmed = title.trim();
      if (!trimmed) {
        return;
      }
      setTodos((prev) => [createTodo(trimmed), ...prev]);
    },
    [setTodos],
  );

  const toggle = useCallback(
    (id: string) => setTodos((prev) => toggleTodo(prev, id)),
    [setTodos],
  );

  const rename = useCallback(
    (id: string, title: string) => {
      const trimmed = title.trim();
      // Tiêu đề rỗng đồng nghĩa với xoá todo.
      setTodos((prev) =>
        trimmed ? renameTodo(prev, id, trimmed) : removeTodo(prev, id),
      );
    },
    [setTodos],
  );

  const remove = useCallback(
    (id: string) => setTodos((prev) => removeTodo(prev, id)),
    [setTodos],
  );

  const clearDone = useCallback(
    () => setTodos((prev) => clearCompleted(prev)),
    [setTodos],
  );

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );
  const activeCount = useMemo(() => countActive(todos), [todos]);
  const completedCount = todos.length - activeCount;

  return {
    todos,
    visibleTodos,
    filter,
    activeCount,
    completedCount,
    hasCompleted: completedCount > 0,
    setFilter,
    addTodo,
    toggle,
    rename,
    remove,
    clearDone,
  };
}
