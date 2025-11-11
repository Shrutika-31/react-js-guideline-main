export interface RequestOptions {
	signal?: AbortSignal;
}

export async function getJson<T>(path: string, opts: RequestOptions = {}): Promise<T> {
	// For now load from /src/mocks; later swap to real endpoints
	const res = await fetch(path, { signal: opts.signal });
	if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
	return (await res.json()) as T;
}




