import { EmptyState } from './EmptyState.tsrx';
import { TodoItem } from './TodoItem.tsrx';
import type { Todo } from '../types.ts';

export function TodoList(&{
	todos,
	emptyMessage,
	onToggle,
	onRemove,
	onRename,
}: {
	todos: readonly Todo[];
	emptyMessage: string;
	onToggle: (todo: Todo) => void;
	onRemove: (todo: Todo) => void;
	onRename: (todo: Todo, text: string) => void;
}) @{
	<>
		<ul class="list">
			@for (const todo of todos; key todo.id) {
				<TodoItem
					{todo}
					onToggle={() => onToggle(todo)}
					onRemove={() => onRemove(todo)}
					onRename={(text: string) => onRename(todo, text)}
				/>
			} @empty {
				<EmptyState message={emptyMessage} />
			}
		</ul>

		<style>
			.list {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}
		</style>
	</>
}
