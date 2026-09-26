import { RippleArray, effect, track } from 'ripple';
import { AddTodoForm } from './components/AddTodoForm.tsrx';
import { ClearCompletedButton } from './components/ClearCompletedButton.tsrx';
import { FilterBar } from './components/FilterBar.tsrx';
import { SearchBox } from './components/SearchBox.tsrx';
import { TodoList } from './components/TodoList.tsrx';
import { TodoStats } from './components/TodoStats.tsrx';
import { SEED_TODOS } from './constants.ts';
import { countTodos, matchesFilter } from './lib/filters.ts';
import { createIdFactory, highestId } from './lib/id.ts';
import { matchesQuery } from './lib/search.ts';
import { loadTodos, saveTodos } from './lib/storage.ts';
import { emptyMessage } from './lib/summary.ts';
import { createTodo, plainTodo, reactiveTodo } from './lib/todos.ts';
import type { Todo, TodoFilter } from './types.ts';

export function App() @{
	const initial = loadTodos() ?? SEED_TODOS;
	const nextId = createIdFactory(highestId(initial));

	const todos = RippleArray.from(initial, reactiveTodo);

	let &[filter] = track<TodoFilter>('all');
	let &[query] = track('');

	let &[counts] = track(() => countTodos(todos));
	let &[visible] = track(
		() => todos.filter((todo) => matchesFilter(todo, filter) && matchesQuery(todo.text, query)),
	);

	// Reading every property makes the effect re-run on any change to the list.
	effect(() => {
		saveTodos(todos.map(plainTodo));
	});

	function addTodo(text: string) {
		todos.push(createTodo(nextId(), text));
	}

	function toggleTodo(todo: Todo) {
		todo.done = !todo.done;
	}

	function renameTodo(todo: Todo, text: string) {
		todo.text = text;
	}

	function removeTodo(todo: Todo) {
		const index = todos.indexOf(todo);
		if (index !== -1) {
			todos.splice(index, 1);
		}
	}

	function clearCompleted() {
		for (let index = todos.length - 1; index >= 0; index--) {
			if (todos[index].done) {
				todos.splice(index, 1);
			}
		}
	}

	<>
		<main class="app">
			<h1>Ripple Todo</h1>
			<TodoStats {counts} visible={visible.length} {filter} {query} />

			<AddTodoForm onAdd={addTodo} />
			<SearchBox
				{query}
				onQueryChange={(value: string) => {
					query = value;
				}}
			/>
			<FilterBar
				{filter}
				{counts}
				onSelect={(value: TodoFilter) => {
					filter = value;
				}}
			/>

			<TodoList
				todos={visible}
				emptyMessage={emptyMessage(counts.all > 0, filter, query)}
				onToggle={toggleTodo}
				onRemove={removeTodo}
				onRename={renameTodo}
			/>

			<ClearCompletedButton count={counts.done} onClear={clearCompleted} />
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
		</style>
	</>
}
