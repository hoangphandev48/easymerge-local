/** Highest id in use, so new ids never collide with stored data. */
export function highestId(todos: readonly { id: number }[]): number {
	return todos.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
}

/** Incrementing id generator, starting at `startAfter + 1`. */
export function createIdFactory(startAfter = 0): () => number {
	let last = startAfter;

	return () => ++last;
}
