import { RippleArray, RippleObject, track } from 'ripple';
import { TodoItem } from './TodoItem.tsrx';
import type { Todo } from './types.ts';

export function App() @{
	let next_id = 1;

	function createTodo(text: string, done = false): Todo {
		return new RippleObject({ id: next_id++, text, done });
	}

	const todos = new RippleArray<Todo>();
	todos.push(createTodo('Học cú pháp Ripple', true), createTodo('Viết ứng dụng đầu tiên'));

	let &[draft] = track('');
	let &[remaining] = track(() => todos.filter((todo) => !todo.done).length);

	function addTodo(event: SubmitEvent) {
		event.preventDefault();

		const text = draft.trim();
		if (text === '') {
			return;
		}

		todos.push(createTodo(text));
		draft = '';
	}

	function removeTodo(todo: Todo) {
const index = todos.indexOf(todo);
if (index !== -1) {
	todos.splice(index, 1);
}
	}

	<>
		<main class="app">
			<h1>Ripple Todo</h1>
			<p class="summary">Còn lại {remaining} / {todos.length} việc</p>

			<form class="form" onSubmit={addTodo}>
				<input
					class="input"
					placeholder="Thêm việc cần làm..."
					value={draft}
					onInput={(event: Event) => {
						draft = (event.currentTarget as HTMLInputElement).value;
					}}
				/>
				<button class="add" type="submit">Thêm</button>
			</form>

			<ul class="list">
				@for (const todo of todos; key todo.id) {
					<TodoItem
						{todo}
						onToggle={() => (todo.done = !todo.done)}
						onRemove={() => removeTodo(todo)}
					/>
				} @empty {
					<li class="empty">Chưa có việc nào.</li>
				}
			</ul>
		</main>

		<style>
			:global(body) {
				margin: 0;
				background: #0d0e17;
				color: #f2f4f8;
				font-family: 'Inter', 'Segoe UI', sans-serif;
			}

			.app {
				max-width: 30rem;
				margin: 0 auto;
				padding: 3rem 1.25rem;
			}

			h1 {
				margin: 0 0 0.25rem;
				font-size: 1.75rem;
			}

			.summary {
				margin: 0 0 1.5rem;
				color: #9fa3b9;
				font-size: 0.9rem;
			}

			.form {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 1.5rem;
			}

			.input {
				flex: 1;
				padding: 0.6rem 0.8rem;
				border-radius: 0.6rem;
				border: 1px solid rgba(255, 255, 255, 0.12);
				background: rgba(18, 19, 29, 0.9);
				color: inherit;
				font-size: 1rem;
			}

			.add {
				padding: 0.6rem 1.1rem;
				border-radius: 0.6rem;
				border: 1px solid rgba(255, 255, 255, 0.12);
				background: #4f5bd5;
				color: #fff;
				font-size: 1rem;
				cursor: pointer;
			}

			.list {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.empty {
				color: #6f738a;
				font-size: 0.9rem;
				text-align: center;
				padding: 1rem 0;
			}
		</style>
	</>
}
