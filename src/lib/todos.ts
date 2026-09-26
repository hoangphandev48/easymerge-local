import { RippleObject } from 'ripple';
import type { Todo } from '../types.ts';

/** Reactive todo: assigning `todo.done` or `todo.text` updates the UI on its own. */
export function createTodo(id: number, text: string, done = false): Todo {
	return new RippleObject({ id, text, done });
}

export function reactiveTodo(todo: Todo): Todo {
	return createTodo(todo.id, todo.text, todo.done);
}

/** Plain, non-reactive copy — used when writing to localStorage. */
export function plainTodo(todo: Todo): Todo {
	return { id: todo.id, text: todo.text, done: todo.done };
}

export function isTodo(value: unknown): value is Todo {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const todo = value as Record<string, unknown>;

	return (
		typeof todo.id === 'number' &&
		typeof todo.text === 'string' &&
		typeof todo.done === 'boolean'
	);
}
