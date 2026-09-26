import { FILTER_LABELS, FILTERS } from '../constants.ts';
import type { TodoCounts, TodoFilter } from '../types.ts';

export function FilterBar(&{
	filter,
	counts,
	onSelect,
}: {
	filter: TodoFilter;
	counts: TodoCounts;
	onSelect: (value: TodoFilter) => void;
}) @{
	<>
		<nav class="filters">
			@for (const value of FILTERS; key value) {
				<button
					class={value === filter ? 'chip selected' : 'chip'}
					type="button"
					onClick={() => onSelect(value)}
				>{`${FILTER_LABELS[value]} (${counts[value]})`}</button>
			}
		</nav>

		<style>
			.filters {
				display: flex;
				gap: 0.4rem;
				margin-bottom: 1rem;
			}

			.chip {
				padding: 0.35rem 0.7rem;
				border-radius: 999px;
				border: 1px solid rgba(255, 255, 255, 0.12);
				background: transparent;
				color: #9fa3b9;
				font-size: 0.85rem;
				cursor: pointer;
			}

			.selected {
				border-color: #4f5bd5;
				background: rgba(79, 91, 213, 0.2);
				color: #f2f4f8;
			}
		</style>
	</>
}
