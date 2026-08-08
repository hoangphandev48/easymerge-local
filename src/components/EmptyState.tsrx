export function EmptyState(&{ message }: { message: string }) @{
	<>
		<li class="empty">{message}</li>

		<style>
			.empty {
				color: #6f738a;
				font-size: 0.9rem;
				text-align: center;
				padding: 1rem 0;
			}
		</style>
	</>
}
