import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/todo/TodoForm';
import { TodoList } from '@/components/todo/TodoList';
import { TodoFilters } from '@/components/todo/TodoFilters';
import '@/components/todo/todo.css';

/**
 * Container của tính năng Todo.
 * Kéo state từ hook useTodos rồi phân phối xuống các component con thuần.
 */
export function TodoApp() {
  const {
    visibleTodos,
    filter,
    activeCount,
    completedCount,
    hasCompleted,
    setFilter,
    addTodo,
    toggle,
    rename,
    remove,
    clearDone,
  } = useTodos();

  return (
    <main className="todo-app" aria-labelledby="todo-heading">
      <header className="todo-app__header">
        <p className="todo-app__eyebrow">React · Vite · TypeScript</p>
        <h1 id="todo-heading" className="todo-app__title">
          Việc cần làm
        </h1>
        <p className="todo-app__subtitle">
          {completedCount > 0
            ? `Đã hoàn thành ${completedCount} · còn ${activeCount} việc`
            : 'Ghi lại, sắp xếp và hoàn thành mọi việc.'}
        </p>
      </header>

      <section className="todo-app__panel" aria-labelledby="todo-heading">
        <TodoForm onAdd={addTodo} />
        <TodoList
          todos={visibleTodos}
          onToggle={toggle}
          onRename={rename}
          onRemove={remove}
        />
        <TodoFilters
          filter={filter}
          activeCount={activeCount}
          hasCompleted={hasCompleted}
          onFilterChange={setFilter}
          onClearCompleted={clearDone}
        />
      </section>
    </main>
  );
}
