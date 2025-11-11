export interface EnhanceOptions {
	roleContext?: string;
	language?: string;
}

export async function enhanceTextWithAI(input: string, options: EnhanceOptions = {}): Promise<string> {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

	// If a client key is present, call OpenAI directly (use ONLY in non-production scenarios)
	if (apiKey) {
		const systemPrompt = `You are an assistant that rewrites and improves hiring content.
		- Keep bullet points concise and actionable.
		- Prefer neutral, inclusive language.
		- Avoid sensitive attributes (age, gender, etc.).
		- Preserve factual details.
		${options.roleContext ? `Context: ${options.roleContext}` : ''}`;

		const body = {
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: input }
			],
			temperature: 0.3
		};

		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body)
		});
		if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
		const data = await res.json();
		const content = data?.choices?.[0]?.message?.content as string | undefined;
		if (!content) throw new Error('No content from OpenAI');
		return content.trim();
	}

	// Otherwise, call the local Vite dev server proxy (server-side API key)
	const proxyRes = await fetch('/api/ai/enhance', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ input, roleContext: options.roleContext })
	});
	if (!proxyRes.ok) {
		// Fallback: local heuristic improvement if no key/proxy available
		if (proxyRes.status === 404 || proxyRes.status === 500) {
			return localHeuristicEnhance(input, options);
		}
		throw new Error(`AI proxy error: ${proxyRes.status} ${await proxyRes.text()}`);
	}
	const { text } = (await proxyRes.json()) as { text: string };
	return text?.trim() ?? '';
}

function localHeuristicEnhance(text: string, options: EnhanceOptions = {}): string {
	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	const bullets = lines.map(l => {
		let s = l.replace(/\s+/g, ' ').replace(/\.*$/, (m) => (m.length > 1 ? m : ''));
		s = s.replace(/\b(he|she)\b/gi, 'they');
		s = s.replace(/^\w/, c => c.toUpperCase());
		if (!/[.!?]$/.test(s)) s += '.';
		return `• ${s}`;
	});
	const header = options.roleContext ? `${options.roleContext}\n\n` : '';
	return `${header}${bullets.join('\n')}`.trim();
}


