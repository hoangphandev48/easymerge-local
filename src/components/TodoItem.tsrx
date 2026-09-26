import { track } from 'ripple';
import type { Todo } from '../types.ts';

export function TodoItem({
	todo,
	onToggle,
	onRemove,
	onRename,
}: {
	todo: Todo;
	onToggle: () => void;
	onRemove: () => void;
	onRename: (text: string) => void;
}) @{
	let &[editing] = track(false);
	let &[draft] = track('');

	function startEdit() {
		draft = todo.text;
		editing = true;
	}

	// Called on both Enter and blur; `editing` guards against the second run.
	function commit() {
		if (!editing) {
			return;
		}

		const text = draft.trim();
		editing = false;

		if (text !== '' && text !== todo.text) {
			onRename(text);
		}
	}

	function cancel() {
		editing = false;
	}

	<>
		<li class="item">
			@if (editing) {
				<input
					class="edit"
					value={draft}
					onInput={(event: Event) => {
						draft = (event.currentTarget as HTMLInputElement).value;
					}}
					onKeyDown={(event: KeyboardEvent) => {
						if (event.key === 'Enter') {
							commit();
						} else if (event.key === 'Escape') {
							cancel();
						}
					}}
					onBlur={commit}
				/>
			} @else {
				<>
					<input
						type="checkbox"
						title="Đánh dấu hoàn thành"
						checked={todo.done}
						onInput={onToggle}
					/>
					<span
						class={todo.done ? 'text done' : 'text'}
						onDblClick={startEdit}
					>{todo.text}</span>
					<button class="icon" type="button" title="Sửa" onClick={startEdit}>✎</button>
					<button class="icon" type="button" title="Xoá" onClick={onRemove}>×</button>
				</>
			}
		</li>

		<style>
			.item {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				padding: 0.6rem 0.8rem;
				border-radius: 0.6rem;
				border: 1px solid rgba(255, 255, 255, 0.1);
				background: rgba(18, 19, 29, 0.75);
			}

			.text {
				flex: 1;
				font-size: 0.95rem;
				cursor: text;
			}

			.done {
				text-decoration: line-through;
				color: #6f738a;
			}

			.edit {
				flex: 1;
				padding: 0.2rem 0.4rem;
				border-radius: 0.4rem;
				border: 1px solid #4f5bd5;
				background: rgba(13, 14, 23, 0.9);
				color: inherit;
				font-size: 0.95rem;
			}

			.icon {
				border: none;
				background: transparent;
				color: #9fa3b9;
				font-size: 1rem;
				cursor: pointer;
				padding: 0 0.25rem;
			}
		</style>
	</>
}
