import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

function aiProxyPlugin(): PluginOption {
  return {
    name: 'ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai/enhance', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
        try {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) { res.statusCode = 500; res.end('OPENAI_API_KEY missing on server'); return; }
          let body = '';
          await new Promise<void>((resolve) => { req.on('data', (c) => (body += c)); req.on('end', () => resolve()); });
          const { input, roleContext } = JSON.parse(body || '{}');
          const system = `You are an assistant that rewrites and improves hiring content.\n- Keep bullets concise and inclusive.\n- Avoid sensitive attributes.\n- Preserve factual details.\n${roleContext ? `Context: ${roleContext}` : ''}`;
          const payload = { model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: String(input || '') }], temperature: 0.3 };
          const r = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload) });
          if (!r.ok) { res.statusCode = r.status; res.end(await r.text()); return; }
          const data = await r.json();
          const content: string = data?.choices?.[0]?.message?.content ?? '';
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text: content }));
        } catch (e: any) { res.statusCode = 500; res.end(e?.message || 'Unknown server error'); }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ai/enhance', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
        try {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) { res.statusCode = 500; res.end('OPENAI_API_KEY missing on server'); return; }
          let body = '';
          await new Promise<void>((resolve) => { req.on('data', (c) => (body += c)); req.on('end', () => resolve()); });
          const { input, roleContext } = JSON.parse(body || '{}');
          const system = `You are an assistant that rewrites and improves hiring content.\n- Keep bullets concise and inclusive.\n- Avoid sensitive attributes.\n- Preserve factual details.\n${roleContext ? `Context: ${roleContext}` : ''}`;
          const payload = { model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: String(input || '') }], temperature: 0.3 };
          const r = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload) });
          if (!r.ok) { res.statusCode = r.status; res.end(await r.text()); return; }
          const data = await r.json();
          const content: string = data?.choices?.[0]?.message?.content ?? '';
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text: content }));
        } catch (e: any) { res.statusCode = 500; res.end(e?.message || 'Unknown server error'); }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), aiProxyPlugin()],
});






