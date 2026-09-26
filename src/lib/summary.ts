import { FILTER_LABELS } from '../constants.ts';
import type { TodoCounts, TodoFilter } from '../types.ts';

function isNarrowed(filter: TodoFilter, query: string): boolean {
	return filter !== 'all' || query.trim() !== '';
}

/** Summary line shown under the heading. */
export function summaryText(
	counts: TodoCounts,
	visible: number,
	filter: TodoFilter,
	query: string
): string {
	if (counts.all === 0) {
		return 'Chưa có việc nào.';
	}

	const total = `Còn lại ${counts.active} / ${counts.all} việc`;

	return isNarrowed(filter, query) ? `${total} — đang hiển thị ${visible}` : total;
}

/** Stand-in sentence for an empty list, worded by the reason it is empty. */
export function emptyMessage(hasTodos: boolean, filter: TodoFilter, query: string): string {
	if (!hasTodos) {
		return 'Chưa có việc nào.';
	}

	const keyword = query.trim();

	if (keyword !== '') {
		return `Không có việc nào khớp “${keyword}”.`;
	}

	return `Không có việc nào ở mục “${FILTER_LABELS[filter]}”.`;
}
