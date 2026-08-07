/**
 * Cloudflare Worker — AI Reading Proxy
 * Proxies structured tarot reading requests to DeepSeek API.
 * API key stays server-side; never exposed to the frontend.
 *
 * Deploy: npx wrangler deploy
 * Env vars (set via `npx wrangler secret put DEEPSEEK_API_KEY`):
 *   DEEPSEEK_API_KEY — DeepSeek API key
 *   DEEPSEEK_BASE_URL — (optional) defaults to https://api.deepseek.com/v1
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

// ── System prompt ──

function buildSystemPrompt(): string {
  return `你是一位温和、智慧且富有同理心的塔罗牌解读师。你的解读风格融合了传统塔罗象征与现代心理学视角。

## 核心规则
1. 你不会做确定性的未来预言，不诊断疾病，不提供法律/投资建议，不使用恐吓语言。
2. 你鼓励用户保有自主决定权，塔罗是自我反思的工具。
3. 你的语言温暖、包容、不评判。
4. 你始终基于牌面含义、牌位和牌之间的关联进行解读。

## 解读结构
当给定牌阵信息时，请按以下结构回应：
1. **开篇回应**：根据用户的问题和整体牌面，给出2-3句直接而温和的总体回应。
2. **逐牌解读**：对每一张牌，结合其牌位含义、正逆位和基础牌义进行解读。解释该牌在此位置的意义。
3. **牌际关联**：指出牌与牌之间的呼应、冲突、推动或阻碍关系。这是个性化解读的核心。
4. **核心主题**：总结2-3个贯穿整个牌阵的核心主题或启示。
5. **行动建议**：提供可选的小步骤或思考方向，以温和建议的语气。
6. **温馨提醒**：提醒用户，这些解读仅供自我反思，最终的决定权始终在用户手中。

## 风格要求
- 使用流畅、优美的中文
- 避免机械地复述牌义，而是将牌义与用户的具体问题和牌位结合
- 不要用"你将会..."的绝对预言句式，改用"这可能提示..."、"值得留意的是..."等开放表达
- 保持积极和有建设性的基调，即使面对挑战牌（逆位/宝剑等），也要指出可能的成长方向`;
}

// ── Build user message from structured request ──

function buildUserMessage(req: ReadingRequest): string {
  const cardDescriptions = req.cards
    .sort((a, b) => a.drawOrder - b.drawOrder)
    .map((c, i) => {
      const pos = req.spread.positions.find(p => p.id === c.positionId);
      const posName = pos ? `${pos.name}（${pos.meaning || ''}）` : c.positionId;
      return `### 第${i + 1}张：${c.nameZh}（${c.name}）— ${c.orientation === 'upright' ? '正位' : '逆位'}
- 牌位：${posName}
- 基础牌义：${c.baseMeaning}`;
    })
    .join('\n\n');

  const questionLine = req.question
    ? `用户的问题：「${req.question}」`
    : '用户未提出具体问题，请根据牌面给出整体指引。';

  return `${questionLine}

## 牌阵：${req.spread.name}（${req.spread.id}）

## 抽牌结果：
${cardDescriptions}

请根据以上信息，为该用户提供完整的塔罗牌解读。`;
}

// ── Main handler ──

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(new Response(null, { status: 204 }));
    }

    // Health check
    if (url.pathname === '/api/health') {
      return corsResponse(Response.json({ status: 'ok' }));
    }

    // POST /api/readings
    if (url.pathname === '/api/readings' && request.method === 'POST') {
      return handleReading(request, env);
    }

    // POST /api/readings/:id/follow-ups
    const followUpMatch = url.pathname.match(/^\/api\/readings\/(.+)\/follow-ups$/);
    if (followUpMatch && request.method === 'POST') {
      return handleFollowUp(request, env);
    }

    return corsResponse(new Response('Not Found', { status: 404 }));
  },
};

// ── Reading handler ──

async function handleReading(request: Request, env: Env): Promise<Response> {
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
        max_tokens: 2048,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('DeepSeek API error:', aiResp.status, errText);
      return corsResponse(Response.json(
        { error: 'AI service error', status: aiResp.status },
        { status: 502 },
      ));
    }

    // Stream the response
    const stream = aiResp.body;
    if (!stream) {
      return corsResponse(Response.json({ error: 'No response stream' }, { status: 502 }));
    }

    return corsResponse(
      new Response(stream, {
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
