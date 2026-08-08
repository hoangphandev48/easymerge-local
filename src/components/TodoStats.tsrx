import { summaryText } from '../lib/summary.ts';
import type { TodoCounts, TodoFilter } from '../types.ts';

export function TodoStats(&{
	counts,
	visible,
	filter,
	query,
}: {
	counts: TodoCounts;
	visible: number;
	filter: TodoFilter;
	query: string;
}) @{
	<>
		<p class="summary">{summaryText(counts, visible, filter, query)}</p>

		<style>
			.summary {
				margin: 0 0 1.5rem;
				color: #9fa3b9;
				font-size: 0.9rem;
			}
		</style>
	</>
}
