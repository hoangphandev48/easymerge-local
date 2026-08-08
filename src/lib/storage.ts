import { STORAGE_KEY } from '../constants.ts';
import { isTodo } from './todos.ts';
import type { Todo } from '../types.ts';

/** localStorage can throw (private mode, blocked cookies). */
function getStorage(): Storage | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

/** `null` means nothing was stored — distinct from an empty array (all todos deleted). */
export function loadTodos(): Todo[] | null {
	const storage = getStorage();

	if (storage === null) {
		return null;
	}

	try {
		const raw = storage.getItem(STORAGE_KEY);

		if (raw === null) {
			return null;
		}

		const parsed: unknown = JSON.parse(raw);

		return Array.isArray(parsed) ? parsed.filter(isTodo) : null;
	} catch {
		return null;
	}
}

export function saveTodos(todos: readonly Todo[]): void {
	const storage = getStorage();

	if (storage === null) {
		return;
	}

	try {
		storage.setItem(STORAGE_KEY, JSON.stringify(todos));
	} catch {
		// Out of quota or writes blocked: the app keeps working, it just does not persist.
	}
}
