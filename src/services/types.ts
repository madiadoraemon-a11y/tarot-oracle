/** Shared types for ReadingService */

export interface ReadingRequest {
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

export interface ReadingResponse {
  content: string;
  modelVersion?: string;
  status: 'completed' | 'failed';
}
