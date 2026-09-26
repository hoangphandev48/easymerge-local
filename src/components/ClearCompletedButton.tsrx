export function ClearCompletedButton(&{ count, onClear }: { count: number; onClear: () => void }) @{
	<>
		@if (count > 0) {
			<button
				class="clear-done"
				type="button"
				onClick={() => onClear()}
			>{`Xoá ${count} việc đã xong`}</button>
		}

		<style>
			.clear-done {
				margin-top: 1rem;
				padding: 0.45rem 0.9rem;
				border-radius: 0.6rem;
				border: 1px solid rgba(255, 255, 255, 0.12);
				background: transparent;
				color: #9fa3b9;
				font-size: 0.85rem;
				cursor: pointer;
			}
		</style>
	</>
}
