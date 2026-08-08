import type { TodoFilter } from '@/types/todo';

interface TodoFiltersProps {
  filter: TodoFilter;
  activeCount: number;
  hasCompleted: boolean;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
}

const FILTERS: ReadonlyArray<{ value: TodoFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang làm' },
  { value: 'completed', label: 'Đã xong' },
];

/** Thanh chân trang: đếm việc còn lại, chọn bộ lọc, xoá việc đã xong. */
export function TodoFilters({
  filter,
  activeCount,
  hasCompleted,
  onFilterChange,
  onClearCompleted,
}: TodoFiltersProps) {
  return (
    <footer className="todo-filters">
      <span className="todo-filters__count">
        <strong>{activeCount}</strong> việc còn lại
      </span>

      <div className="todo-filters__group" role="tablist" aria-label="Lọc công việc">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={`todo-filters__btn${
              filter === value ? ' todo-filters__btn--active' : ''
            }`}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="todo-filters__clear"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Xoá việc đã xong
      </button>
    </footer>
  );
}
