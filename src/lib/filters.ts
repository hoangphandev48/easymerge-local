import type { Todo, TodoCounts, TodoFilter } from '../types.ts';

export function matchesFilter(todo: Todo, filter: TodoFilter): boolean {
	if (filter === 'active') {
		return !todo.done;
	}

	if (filter === 'done') {
		return todo.done;
	}

	return true;
}

export function countTodos(todos: readonly Todo[]): TodoCounts {
	let done = 0;

	for (const todo of todos) {
		if (todo.done) {
			done++;
		}
	}

	return { all: todos.length, active: todos.length - done, done };
}
