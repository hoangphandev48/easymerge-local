export function SearchBox(&{
	query,
	onQueryChange,
}: {
	query: string;
	onQueryChange: (value: string) => void;
}) @{
	<>
		<div class="search">
			<input
				class="input"
				type="search"
				placeholder="Tìm việc..."
				value={query}
				onInput={(event: Event) => {
					onQueryChange((event.currentTarget as HTMLInputElement).value);
				}}
			/>

			@if (query !== '') {
				<button
					class="clear"
					type="button"
					title="Xoá từ khoá"
					onClick={() => onQueryChange('')}
				>×</button>
			}
		</div>

		<style>
			.search {
				position: relative;
				display: flex;
				margin-bottom: 0.75rem;
			}

			.input {
				flex: 1;
				padding: 0.5rem 2rem 0.5rem 0.8rem;
				border-radius: 0.6rem;
				border: 1px solid rgba(255, 255, 255, 0.12);
				background: rgba(18, 19, 29, 0.9);
				color: inherit;
				font-size: 0.95rem;
			}

			.input::-webkit-search-cancel-button {
				display: none;
			}

			.clear {
				position: absolute;
				right: 0.5rem;
				top: 50%;
				transform: translateY(-50%);
				border: none;
				background: transparent;
				color: #9fa3b9;
				font-size: 1rem;
				cursor: pointer;
			}
		</style>
	</>
}
