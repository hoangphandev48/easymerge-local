import type { Todo, TodoFilter } from './types.ts';

/** localStorage key; bump the suffix when the stored shape changes. */
export const STORAGE_KEY = 'ripple-todo/v1';

export const FILTERS: readonly TodoFilter[] = ['all', 'active', 'done'];

export const FILTER_LABELS: Record<TodoFilter, string> = {
	all: 'Tất cả',
	active: 'Đang làm',
	done: 'Đã xong',
};

/** Seed data for the first visit, when localStorage is still empty. */
export const SEED_TODOS: readonly Todo[] = [
	{ id: 1, text: 'Học cú pháp Ripple', done: true },
	{ id: 2, text: 'Viết ứng dụng đầu tiên', done: false },
];
