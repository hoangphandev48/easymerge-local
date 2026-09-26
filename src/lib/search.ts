/**
 * Strips diacritics and lowercases so "hoc" matches "Học".
 * `đ` is not a combining sequence, so it needs its own replacement.
 */
export function normalize(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd');
}

export function matchesQuery(text: string, query: string): boolean {
	const needle = normalize(query.trim());

	if (needle === '') {
		return true;
	}

	return normalize(text).includes(needle);
}
