export type Todo = {
	id: number;
	text: string;
	done: boolean;
};

/** Status filter currently applied to the list. */
export type TodoFilter = 'all' | 'active' | 'done';

/** Todo count per status, used by the filter bar and the summary line. */
export type TodoCounts = Record<TodoFilter, number>;
