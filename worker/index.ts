/**
 * Cloudflare Worker — AI Reading Proxy
 * Proxies structured tarot reading requests to DeepSeek API.
 * Stores reading history in KV for admin review.
 *
 * Deploy: npx wrangler deploy
 * Secrets:
 *   DEEPSEEK_API_KEY  — DeepSeek API key
 *   DEEPSEEK_BASE_URL — (optional) defaults to https://api.deepseek.com/v1
 *   ADMIN_TOKEN       — (optional) password for /admin page
 */

interface ReadingRequest {
  sessionId: string;
  question?: string;
  locale: string;
  spread: {
    id: string;
    name: string;
    positions: Array<{ id: string; name: string; meaning: string }>;
  };
  cards: Array<{
    cardId: string;
    name: string;
    nameZh: string;
    orientation: 'upright' | 'reversed';
    positionId: string;
    baseMeaning: string;
    drawOrder: number;
  }>;
}

interface FollowUpRequest {
  question: string;
  previousReading: string;
  sessionContext: ReadingRequest;
}

interface ReadingRecord {
  timestamp: number;
  timeStr: string;
  question: string;
  spreadName: string;
  readingContent: string;
  cards: Array<{
    nameZh: string;
    nameEn: string;
    orientation: string;
    positionLabel: string;
  }>;
}

// ── System prompt ──

function buildSystemPrompt(): string {
  return `你是一名资深的塔罗师。你融合传统塔罗象征与现代心理学视角进行解读。

核心规则：
1. 不做确定性的未来预言，不诊断疾病，不提供法律/投资建议，不使用恐吓语言。
2. 鼓励用户保有自主决定权，塔罗是自我反思的工具。
3. 语言温暖、包容、不评判。
4. 始终基于牌面含义、牌位和牌之间的关联进行解读。

按以下结构回应：
1. 开篇回应：根据用户问题和牌面，给出2-3句直接的总体回应。不要提及牌阵名称或牌的数量。
2. 逐牌解读：对每张牌，结合牌位含义、正逆位和基础牌义进行解读。
3. 牌际关联：指出牌与牌之间的呼应、冲突、推动或阻碍关系。
4. 核心主题：总结2-3个贯穿牌阵的核心主题（不要使用任何加粗或星号标记）。
5. 行动建议：提供可选的小步骤或思考方向。
6. 温馨提醒：提醒用户解读仅供自我反思，决定权在用户手中。

风格：流畅优美的中文，避免绝对预言句式，保持积极有建设性的基调。`;
}

// ── Build user message from structured request ──

function buildUserMessage(req: ReadingRequest): string {
  const cardDescriptions = req.cards
    .sort((a, b) => a.drawOrder - b.drawOrder)
    .map((c, i) => {
      const pos = req.spread.positions.find(p => p.id === c.positionId);
      const posName = pos ? pos.name : c.positionId;
      const orient = c.orientation === 'upright' ? '正位' : '逆位';
      return `第${i + 1}张：${c.nameZh}（${c.name}）${orient}，牌位：${posName}，含义：${c.baseMeaning}`;
    })
    .join('\n');

  const questionIntro = req.question
    ? `对于问题「${req.question}」，`
    : '';

  return `${questionIntro}抽出了以下塔罗牌：

${cardDescriptions}

牌阵为${req.spread.name}。

请你帮我解读。`;
}

// ── Main handler ──

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(new Response(null, { status: 204 }));
    }

    // Health check
    if (url.pathname === '/api/health') {
      return corsResponse(Response.json({ status: 'ok' }));
    }

    // Admin dashboard
    if (url.pathname === '/admin') {
      return handleAdmin(url, env);
    }

    // POST /api/readings
    if (url.pathname === '/api/readings' && request.method === 'POST') {
      return handleReading(request, env, ctx);
    }

    // POST /api/readings/:id/follow-ups
    const followUpMatch = url.pathname.match(/^\/api\/readings\/(.+)\/follow-ups$/);
    if (followUpMatch && request.method === 'POST') {
      return handleFollowUp(request, env);
    }

    return corsResponse(new Response('Not Found', { status: 404 }));
  },
};

// ── Admin dashboard ──

async function handleAdmin(url: URL, env: Env): Promise<Response> {
  // Simple token check
  const adminToken = env.ADMIN_TOKEN;
  if (adminToken && url.searchParams.get('token') !== adminToken) {
    return new Response('Unauthorized — add ?token= to the URL', { status: 401 });
  }

  const kv = env.READING_HISTORY;

  // List recent readings (up to 50)
  const listResult = await kv.list({ prefix: 'reading:', limit: 50 });
  const records: ReadingRecord[] = [];

  // Sort keys by timestamp (newest first) — keys are "reading:<ts>:<suffix>"
  const sortedKeys = [...listResult.keys].sort((a, b) => b.name.localeCompare(a.name));

  for (const key of sortedKeys) {
    const value = await kv.get(key.name);
    if (value) {
      try {
        records.push(JSON.parse(value));
      } catch { /* skip malformed */ }
    }
  }

  return new Response(renderAdminPage(records), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function renderAdminPage(records: ReadingRecord[]): string {
  const rows = records.map((r, i) => `
    <tr>
      <td>${esc(r.timeStr)}</td>
      <td>${esc(r.spreadName)}</td>
      <td>${esc(r.question || '(无问题)')}</td>
      <td>${r.cards.map(c => esc(`${c.nameZh}${c.orientation === 'reversed' ? '(逆)' : ''} [${c.positionLabel}]`)).join('<br>')}</td>
      <td>
        ${r.readingContent ? `<button class="toggleBtn" onclick="this.nextElementSibling.classList.toggle('open');this.textContent=this.textContent.includes('+')?this.textContent.replace('+','-').replace('展开','收起'):'- 收起 '+this.textContent.split(' ').pop()">+ 展开</button><div class="readingText">${esc(r.readingContent)}</div>` : '(无)'}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>塔罗解读记录</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0a0a1a; color: #e0d8c0; padding: 20px; }
  h1 { color: #c9a96e; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { padding: 10px 12px; border-bottom: 1px solid rgba(201,169,110,0.2); text-align: left; vertical-align: top; }
  th { color: #c9a96e; position: sticky; top: 0; background: #0a0a1a; }
  tr:hover { background: rgba(201,169,110,0.05); }
  .count { color: #888; margin-bottom: 16px; }
  .toggleBtn { cursor: pointer; color: #c9a96e; background: none; border: 1px solid rgba(201,169,110,0.3); border-radius: 4px; padding: 2px 8px; font-size: 12px; }
  .readingText { display: none; margin-top: 6px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; max-width: 400px; white-space: pre-wrap; font-size: 12px; line-height: 1.6; max-height: 300px; overflow-y: auto; }
  .readingText.open { display: block; }
</style>
</head>
<body>
<h1>🔮 塔罗解读记录</h1>
<p class="count">共 ${records.length} 条记录（最近 50 条）</p>
<table>
<thead><tr><th>时间</th><th>牌阵</th><th>问题</th><th>卡牌</th><th>AI解读</th></tr></thead>
<tbody>${rows || '<tr><td colspan="5">暂无记录</td></tr>'}</tbody>
</table>
</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Reading handler ──

async function handleReading(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  let body: ReadingRequest;
  try {
    body = await request.json();
  } catch {
    return corsResponse(Response.json({ error: 'Invalid JSON' }, { status: 400 }));
  }

  // Validate
  if (!body.sessionId || !body.spread || !body.cards?.length) {
    return corsResponse(Response.json({ error: 'Missing required fields' }, { status: 400 }));
  }
  if ((body.question?.length ?? 0) > 500) {
    return corsResponse(Response.json({ error: 'Question too long' }, { status: 400 }));
  }

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return corsResponse(Response.json({ error: 'Service not configured' }, { status: 500 }));
  }

  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(body);

  try {
    const aiResp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!aiResp.ok || !aiResp.body) {
      const errText = aiResp.ok ? '' : await aiResp.text();
      console.error('DeepSeek API error:', aiResp.status, errText);
      return corsResponse(Response.json(
        { error: 'AI service error', status: aiResp.status },
        { status: 502 },
      ));
    }

    // Tee the stream: one copy to client (instant), one for background KV save
    const [clientStream, captureStream] = aiResp.body.tee();

    ctx.waitUntil(
      (async () => {
        try {
          const rawSSE = await new Response(captureStream).text();
          const rawContent = extractContentFromSSE(rawSSE);
          const cleaned = cleanContent(rawContent);
          await saveRecord(env, body, cleaned);
        } catch (err) {
          console.error('KV save error:', err);
        }
      })(),
    );

    return corsResponse(
      new Response(clientStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }),
    );
  } catch (err) {
    console.error('Reading error:', err);
    return corsResponse(Response.json({ error: 'Internal error' }, { status: 500 }));
  }
}

// ── Save reading record to KV ──

async function saveRecord(env: Env, body: ReadingRequest, content: string): Promise<void> {
  try {
    const now = new Date();
    const ts = Date.now();
    const key = `reading:${ts}:${body.sessionId.slice(0, 8)}`;

    const record: ReadingRecord = {
      timestamp: ts,
      timeStr: now.toISOString().replace('T', ' ').slice(0, 19),
      question: body.question || '',
      spreadName: body.spread.name,
      readingContent: content.slice(0, 5000),
      cards: body.cards
        .sort((a, b) => a.drawOrder - b.drawOrder)
        .map(c => ({
          nameZh: c.nameZh,
          nameEn: c.name,
          orientation: c.orientation === 'upright' ? '正位' : '逆位',
          positionLabel: body.spread.positions.find(p => p.id === c.positionId)?.name || c.positionId,
        })),
    };

    await env.READING_HISTORY.put(key, JSON.stringify(record));
  } catch (err) {
    console.error('KV save error:', err);
  }
}

// ── Extract plain text from SSE stream ──

function extractContentFromSSE(sse: string): string {
  const lines = sse.split('\n');
  let content = '';
  for (const line of lines) {
    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
      try {
        const parsed = JSON.parse(line.slice(6));
        const token = parsed.choices?.[0]?.delta?.content || '';
        content += token;
      } catch { /* skip */ }
    }
  }
  return content;
}

// ── Clean AI response content ──

function cleanContent(text: string): string {
  let cleaned = text;

  // Remove "本次使用……牌阵……含义" patterns in opening response
  // Matches sentences like "本次使用「XXX」牌阵，共抽出N张牌……"
  cleaned = cleaned.replace(/本次使用[^。！？\n]*牌阵[^。！？\n]*[。]/g, '');

  // Strip ** markers
  cleaned = cleaned.replace(/\*\*/g, '');

  // Remove local offline warning (safety net, shouldn't come from DeepSeek)
  cleaned = cleaned.replace(/[⚠>]\s*以上解读由本地生成[^\n。！？]*[。]?/g, '');

  // Collapse blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned;
}

// ── Follow-up handler ──

async function handleFollowUp(request: Request, env: Env): Promise<Response> {
  let body: FollowUpRequest;
  try {
    body = await request.json();
  } catch {
    return corsResponse(Response.json({ error: 'Invalid JSON' }, { status: 400 }));
  }

  if (!body.question || body.question.length > 300) {
    return corsResponse(Response.json({ error: 'Invalid follow-up question' }, { status: 400 }));
  }

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return corsResponse(Response.json({ error: 'Service not configured' }, { status: 500 }));
  }

  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: buildUserMessage(body.sessionContext) },
    { role: 'assistant', content: body.previousReading },
    {
      role: 'user',
      content: `关于以上塔罗解读，我想进一步了解：${body.question}\n请结合原始牌阵和解读内容，给出针对性的回应。`,
    },
  ];

  try {
    const aiResp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!aiResp.ok || !aiResp.body) {
      return corsResponse(Response.json(
        { error: 'AI service error', status: aiResp.status },
        { status: 502 },
      ));
    }

    return corsResponse(
      new Response(aiResp.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }),
    );
  } catch (err) {
    console.error('Follow-up error:', err);
    return corsResponse(Response.json({ error: 'Internal error' }, { status: 500 }));
  }
}

// ── Helpers ──

interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL?: string;
  ADMIN_TOKEN?: string;
  READING_HISTORY: KVNamespace;
}

function corsResponse(resp: Response): Response {
  const headers = new Headers(resp.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers,
  });
}
