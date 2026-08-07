/**
 * ReadingService — Frontend client for AI reading API.
 * Communicates with Cloudflare Worker (or equivalent backend).
 * Never contains API keys; they live server-side only.
 */

import { ReadingRequest, ReadingResponse } from './types';

const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE || '/api';

export interface ReadingStreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

export class ReadingService {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || DEFAULT_API_BASE;
  }

  /** Build a structured ReadingRequest from session state */
  buildRequest(params: {
    sessionId: string;
    question?: string;
    locale: string;
    spreadId: string;
    spreadName: string;
    positions: Array<{ id: string; name: string; meaning: string }>;
    cards: Array<{
      cardId: string;
      name: string;
      nameZh: string;
      orientation: 'upright' | 'reversed';
      positionId: string;
      baseMeaning: string;
      drawOrder: number;
    }>;
  }): ReadingRequest {
    return {
      sessionId: params.sessionId,
      question: params.question,
      locale: params.locale,
      spread: {
        id: params.spreadId,
        name: params.spreadName,
        positions: params.positions,
      },
      cards: params.cards,
    };
  }

  /** Stream a reading from the API */
  async streamReading(
    request: ReadingRequest,
    callbacks: ReadingStreamCallbacks,
  ): Promise<void> {
    this.cancel(); // Cancel any in-flight request

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    let fullText = '';

    try {
      const resp = await fetch(`${this.baseUrl}/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
        callbacks.onError(err.error || '请求失败');
        return;
      }

      const contentType = resp.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // SSE stream
        const reader = resp.body?.getReader();
        if (!reader) {
          callbacks.onError('无法读取响应流');
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) {
                  fullText += token;
                  callbacks.onToken(fullText);
                }
              } catch {
                // Skip unparseable lines
              }
            }
          }
        }

        // Process remaining buffer
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6).trim();
          if (data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content || '';
              if (token) fullText += token;
            } catch { /* skip */ }
          }
        }
      } else {
        // JSON response (non-streaming or error fallback)
        const data = await resp.json();
        fullText = data.content || data.reading || '';
        callbacks.onToken(fullText);
      }

      callbacks.onDone(fullText);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        callbacks.onDone(fullText); // Graceful cancel
        return;
      }
      callbacks.onError(err instanceof Error ? err.message : '网络错误');
    }
  }

  /** Stream a follow-up question */
  async streamFollowUp(
    readingId: string,
    question: string,
    previousReading: string,
    sessionContext: ReadingRequest,
    callbacks: ReadingStreamCallbacks,
  ): Promise<void> {
    this.cancel();
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    let fullText = '';

    try {
      const resp = await fetch(`${this.baseUrl}/readings/${readingId}/follow-ups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, previousReading, sessionContext }),
        signal,
      });

      if (!resp.ok) {
        callbacks.onError(`请求失败 (${resp.status})`);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) {
        callbacks.onError('无法读取响应流');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content || '';
              if (token) {
                fullText += token;
                callbacks.onToken(fullText);
              }
            } catch { /* skip */ }
          }
        }
      }

      callbacks.onDone(fullText);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        callbacks.onDone(fullText);
        return;
      }
      callbacks.onError(err instanceof Error ? err.message : '网络错误');
    }
  }

  /** Cancel current request */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

// Singleton
export const readingService = new ReadingService();
