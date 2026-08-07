/**
 * LocalReadingGenerator — Offline fallback for AI reading.
 * Generates structured tarot readings from card meanings when the API is unreachable.
 * Uses template-based generation with controlled randomness for variety.
 */

import { ReadingRequest } from './types';

// ── Template fragments ──

const OPENINGS = [
  '让我来为你解读这次的牌面。',
  '看着这些牌面，我能感受到它们传递的信息。',
  '牌面已经铺开，让我为你一一解读。',
  '这次的牌阵很有意思，让我来为你慢慢解读。',
  '每张牌都在与你的问题对话，让我为你解读它们的语言。',
];

const CLOSINGS = [
  '这些牌面所揭示的，是你内在已经知道但可能尚未正视的真相。无论牌面如何，最终的决定权始终在你手中。愿你在这段旅程中找到属于自己的答案。',
  '牌面是镜子，映照的是你内心的风景。每一张牌的智慧都指向同一个方向——你内心深处早已知晓的方向。带着这些启示前行吧，但请记得，你才是自己人生的作者。',
  '塔罗的意义不在于预测，而在于启发。这些牌面为你打开了一扇窗，但路需要你自己去走。祝你在接下来的旅程中，心怀勇气，步履坚定。',
  '这些解读是一个邀请，邀请你重新审视自己的处境。牌面所揭示的可能性，会在你的选择中逐渐成形。相信你的直觉，它比任何外部的答案都更了解你。',
];

const ELEMENT_THEMES: Record<string, string> = {
  wands: '权杖牌的出现暗示着行动、热情与创造力的能量在场。',
  cups: '圣杯牌带来了情感、直觉与人际关系的讯息。',
  swords: '宝剑牌揭示了思想、沟通与挑战的面向。',
  pentacles: '钱币牌带来了物质、稳定与务实层面的启示。',
};

// ── Card-to-card relationship analysis ──

interface CardInfo {
  cardId: string;
  name: string;
  nameZh: string;
  orientation: 'upright' | 'reversed';
  positionId: string;
  baseMeaning: string;
  drawOrder: number;
}

function analyzeRelations(cards: CardInfo[], spread: ReadingRequest['spread']): string {
  const parts: string[] = [];

  // Count majors vs minors
  const majors = cards.filter(c => c.cardId.startsWith('major'));
  if (majors.length >= 2) {
    parts.push(`牌阵中出现${majors.length}张大阿尔卡纳牌，说明当前的议题触及人生的深层主题，值得你认真对待。`);
  }

  // Check for repeated suits
  const suitCounts: Record<string, string[]> = {};
  for (const c of cards) {
    if (c.cardId.startsWith('minor')) {
      const suit = c.cardId.split('-')[1];
      if (suit) {
        if (!suitCounts[suit]) suitCounts[suit] = [];
        suitCounts[suit].push(c.nameZh);
      }
    }
  }
  for (const [suit, suitCards] of Object.entries(suitCounts)) {
    if (suitCards.length >= 2) {
      parts.push(`${suitCards.join('和')}同属${getSuitNameZh(suit)}，意味着${getSuitTheme(suit)}是你当前需要重点关注的领域。`);
    }
  }

  // Check reversal patterns
  const reversedCount = cards.filter(c => c.orientation === 'reversed').length;
  if (reversedCount >= cards.length / 2) {
    parts.push('多张牌以逆位出现，或许暗示着一些内在的阻碍或尚未意识到的面向，需要你更多的自我反思。');
  } else if (reversedCount === 0) {
    parts.push('所有牌都为正位，能量流动顺畅，这是一个行动和表达的有利时机。');
  }

  return parts.length > 0 ? parts.join('\n\n') : '各张牌之间的能量相互呼应，构成了一幅完整的内在图景。';
}

function getSuitNameZh(suit: string): string {
  const map: Record<string, string> = {
    wands: '权杖牌组',
    cups: '圣杯牌组',
    swords: '宝剑牌组',
    pentacles: '钱币牌组',
  };
  return map[suit] || suit;
}

function getSuitTheme(suit: string): string {
  const map: Record<string, string> = {
    wands: '行动力、热情与事业发展',
    cups: '情感关系、创造力与内在感受',
    swords: '思维模式、沟通方式与面临的挑战',
    pentacles: '物质基础、财务规划与务实行动',
  };
  return map[suit] || '个人成长';
}

function getPositionContextWord(posName: string): string {
  const map: Record<string, string> = {
    '过去': '回顾过去，',
    '现在': '在当下，',
    '未来': '展望未来，',
    '困境': '面对当前的挑战，',
    '环境': '环顾四周的环境，',
    '希望': '你内心真正渴望的，',
    '结果': '可能走向的结果是，',
    '自我': '关于你自己，',
    '障碍': '需要跨越的障碍在于，',
    '建议': '宇宙给出的建议是，',
    '综合': '综合来看，',
  };
  // Partial match for position labels
  for (const [key, val] of Object.entries(map)) {
    if (posName.includes(key)) return val;
  }
  return '在此位置上，';
}

// ── Main generator ──

export function generateLocalReading(req: ReadingRequest): string {
  const lines: string[] = [];
  const cards = [...req.cards].sort((a, b) => a.drawOrder - b.drawOrder);
  const opening = pick(OPENINGS);

  // ── 1. 开篇回应 ──
  lines.push('## 开篇回应');
  lines.push('');
  const questionLine = req.question
    ? `你提出了关于「${req.question}」的问题，`
    : '';
  lines.push(`${opening}${questionLine}让我逐一为你分析每张牌的含义。`);
  lines.push('');

  // ── 2. 逐牌解读 ──
  lines.push('## 逐牌解读');
  lines.push('');

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const pos = req.spread.positions.find(p => p.id === c.positionId);
    const posName = pos?.name || c.positionId;
    const posCtx = getPositionContextWord(posName);
    const orientation = c.orientation === 'upright' ? '正位' : '逆位';

    lines.push(`### 第${i + 1}张：${c.nameZh}（${c.name}）—— ${posName} ${orientation}`);
    lines.push('');
    lines.push(`${posCtx}${c.baseMeaning}`);
    lines.push('');
  }

  // ── 3. 牌际关联 ──
  lines.push('## 牌际关联');
  lines.push('');
  lines.push(analyzeRelations(cards, req.spread));
  lines.push('');

  // ── 4. 核心主题 ──
  lines.push('## 核心主题');
  lines.push('');
  lines.push(generateThemes(cards));
  lines.push('');

  // ── 5. 行动建议 ──
  lines.push('## 行动建议');
  lines.push('');
  lines.push(generateSuggestions(cards));
  lines.push('');

  // ── 6. 温馨提醒 ──
  lines.push('## 温馨提醒');
  lines.push('');
  lines.push(pick(CLOSINGS));
  lines.push('');

  return lines.join('\n');
}

// ── Theme generation ──

function generateThemes(cards: CardInfo[]): string {
  const keywords: string[] = [];
  for (const c of cards) {
    // Extract keywords-likes from baseMeaning
    const phrases = c.baseMeaning.split(/[，。！？；、]/).filter(s => s.trim().length > 3);
    for (const p of phrases.slice(0, 2)) {
      if (!keywords.includes(p.trim())) {
        keywords.push(p.trim());
      }
    }
  }

  const selected = shuffle(keywords).slice(0, 3);
  if (selected.length === 0) {
    return '本次解读的核心主题围绕自我认知与内在成长展开，牌面邀请你更深入地了解自己的内心世界。';
  }

  return `综合所有牌面讯息，本次解读的核心主题可以归纳为以下几点：\n\n1. ${selected[0] || '自我觉察'}：这是贯穿整个牌阵的主线，值得你深入反思。\n2. ${selected[1] || '内在平衡'}：牌面提示你关注生活中各个面向的协调与平衡。\n3. ${selected[2] || '积极行动'}：牌面鼓励你在合适的时机迈出行动的一步。`;
}

// ── Suggestion generation ──

function generateSuggestions(cards: CardInfo[]): string {
  const uprightCards = cards.filter(c => c.orientation === 'upright');
  const reversedCards = cards.filter(c => c.orientation === 'reversed');

  const suggestions: string[] = [];

  if (uprightCards.length > reversedCards.length) {
    suggestions.push('当前整体能量较为顺畅，这是一个适合主动出击的时期。你可以利用正位牌带来的有利能量，在关键领域推动进展。');
  } else {
    suggestions.push('多张逆位牌的出现提示你，当下可能需要更多的内省而非外求。暂停脚步，审视内心的阻碍，比急于行动更为重要。');
  }

  const hasMajor = cards.some(c => c.cardId.startsWith('major'));
  if (hasMajor) {
    suggestions.push('大阿尔卡纳牌的出现，邀请你从更高的视角看待当前的处境。这件事的意义可能超越了眼前的得失，蕴含着更深层的成长课题。');
  }

  suggestions.push('建议你在这段时间保持写日记或冥想的习惯，让牌面的智慧在日常的觉察中逐渐发酵和深化。');

  return suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n');
}

// ── Helpers ──

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
