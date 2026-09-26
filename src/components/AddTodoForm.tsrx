import { track } from 'ripple';

export function AddTodoForm({ onAdd }: { onAdd: (text: string) => void }) @{
	let &[draft] = track('');

	function submit(event: SubmitEvent) {
		event.preventDefault();

		const text = draft.trim();
		if (text === '') {
			return;
		}

		onAdd(text);
		draft = '';
	}

	<>
		<form class="form" onSubmit={submit}>
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

		<style>
			.form {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
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
		</style>
	</>
}
