import { useState, type FormEvent } from 'react';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

/** Ô nhập để thêm todo mới. Presentational — chỉ báo lên qua onAdd. */
export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setTitle('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__input"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Cần làm gì hôm nay?"
        aria-label="Tiêu đề công việc mới"
        autoFocus
      />
      <button
        className="todo-form__submit"
        type="submit"
        disabled={!title.trim()}
      >
        Thêm
      </button>
    </form>
  );
}
