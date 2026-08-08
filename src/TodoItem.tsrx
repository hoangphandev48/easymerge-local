import type { Todo } from './types.ts';

export function TodoItem({
	todo,
	onToggle,
	onRemove,
}: {
	todo: Todo;
	onToggle: () => void;
	onRemove: () => void;
}) {
	return <>
		<li class="item">
			<label class="label">
				<input type="checkbox" checked={todo.done} onInput={onToggle} />
				<span class={todo.done ? 'text done' : 'text'}>{todo.text}</span>
			</label>
			<button class="remove" type="button" title="Xoá" onClick={onRemove}>×</button>
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

			.label {
				flex: 1;
				display: flex;
				align-items: center;
				gap: 0.6rem;
				cursor: pointer;
			}

			.text {
				font-size: 0.95rem;
			}

			.done {
				text-decoration: line-through;
				color: #6f738a;
			}

			.remove {
				border: none;
				background: transparent;
				color: #9fa3b9;
				font-size: 1rem;
				cursor: pointer;
				padding: 0 0.25rem;
			}
		</style>
	</>;
}
