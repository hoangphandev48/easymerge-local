import { useState, type KeyboardEvent } from 'react';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}

/** Một dòng todo: toggle, sửa tại chỗ (double click) và xoá. */
export function TodoItem({ todo, onToggle, onRename, onRemove }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function commit() {
    onRename(todo.id, draft);
    setIsEditing(false);
  }

  function cancel() {
    setDraft(todo.title);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      commit();
    } else if (event.key === 'Escape') {
      cancel();
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--done' : ''}`}>
      <label className="todo-item__check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Đánh dấu "${todo.title}" là ${
            todo.completed ? 'chưa xong' : 'đã xong'
          }`}
        />
        <span className="todo-item__box" aria-hidden="true" />
      </label>

      {isEditing ? (
        <input
          className="todo-item__edit"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label="Sửa tiêu đề công việc"
          autoFocus
        />
      ) : (
        <span
          className="todo-item__title"
          onDoubleClick={() => setIsEditing(true)}
          title="Nhấn đúp để sửa"
        >
          {todo.title}
        </span>
      )}

      <button
        className="todo-item__remove"
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label={`Xoá "${todo.title}"`}
      >
        ×
      </button>
    </li>
  );
}
