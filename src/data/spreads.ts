import { SpreadConfig } from '../types';

export const spreads: SpreadConfig[] = [
  {
    id: 'single-card',
    name: '单张牌',
    description: '最简单的占卜方式，适合每日指引或快速解答。抽取一张牌，聆听宇宙今日给你的讯息。',
    cardCount: 1,
    layoutShape: 'single',
    positions: [
      { id: 'center', label: '今日指引', x: 50, y: 50 },
    ],
  },
  {
    id: 'time-flow',
    name: '时间之流',
    description: '揭示过去、现在、未来的因果流动。适合需要了解事情发展脉络和趋势的问题。',
    cardCount: 3,
    layoutShape: 'line',
    positions: [
      { id: 'past', label: '过去', x: 15, y: 50 },
      { id: 'present', label: '现在', x: 50, y: 50 },
      { id: 'future', label: '未来', x: 85, y: 50 },
    ],
  },
  {
    id: 'two-choices',
    name: '二选一',
    description: '在两条路径之间做出选择。清晰展示每条道路的前景和可能的结果。',
    cardCount: 5,
    layoutShape: 'line',
    positions: [
      { id: 'situation', label: '现状', x: 50, y: 15 },
      { id: 'path-a', label: '选择A', x: 20, y: 50 },
      { id: 'path-b', label: '选择B', x: 80, y: 50 },
      { id: 'outcome-a', label: 'A的结果', x: 20, y: 85 },
      { id: 'outcome-b', label: 'B的结果', x: 80, y: 85 },
    ],
  },
  {
    id: 'love-cross',
    name: '爱情十字',
    description: '深度探索爱情关系的核心动力。理解彼此、面对挑战、预见结局。',
    cardCount: 5,
    layoutShape: 'cross',
    positions: [
      { id: 'you', label: '你', x: 15, y: 50 },
      { id: 'relationship', label: '关系', x: 50, y: 50 },
      { id: 'partner', label: '对方', x: 85, y: 50 },
      { id: 'challenge', label: '挑战', x: 50, y: 18 },
      { id: 'outcome', label: '结局', x: 50, y: 82 },
    ],
  },
  {
    id: 'tree-of-life',
    name: '生命之树',
    description: '基于卡巴拉生命之树的深度占卜。十个源质位置全面揭示灵性与物质的各个层面。',
    cardCount: 10,
    layoutShape: 'tree',
    positions: [
      { id: 'kether', label: '王冠·本源', x: 50, y: 8 },
      { id: 'chokmah', label: '智慧·阳', x: 72, y: 20 },
      { id: 'binah', label: '理解·阴', x: 28, y: 20 },
      { id: 'chesed', label: '慈悲·扩展', x: 72, y: 37 },
      { id: 'geburah', label: '严厉·收缩', x: 28, y: 37 },
      { id: 'tiphereth', label: '美·和谐', x: 50, y: 50 },
      { id: 'netzach', label: '胜利·情感', x: 72, y: 63 },
      { id: 'hod', label: '荣耀·理智', x: 28, y: 63 },
      { id: 'yesod', label: '基础·潜意识', x: 50, y: 78 },
      { id: 'malkuth', label: '王国·现实', x: 50, y: 92 },
    ],
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    description: '最经典的塔罗牌阵之一。全面深入地分析问题的各个维度，包含内在、外在和结果。',
    cardCount: 10,
    layoutShape: 'cross',
    positions: [
      { id: 'present', label: '现状', x: 50, y: 50 },
      { id: 'challenge', label: '阻碍', x: 50, y: 45 },
      { id: 'past', label: '过去', x: 22, y: 35 },
      { id: 'future', label: '未来', x: 78, y: 35 },
      { id: 'above', label: '目标', x: 50, y: 12 },
      { id: 'below', label: '根基', x: 50, y: 88 },
      { id: 'advice', label: '建议', x: 85, y: 60 },
      { id: 'external', label: '环境', x: 85, y: 75 },
      { id: 'hopes', label: '希望', x: 15, y: 60 },
      { id: 'outcome', label: '结局', x: 15, y: 75 },
    ],
  },
  {
    id: 'pentagram',
    name: '五芒星',
    description: '以五芒星的神圣几何排列，连接五行元素之力。探索问题的五个基本面向。',
    cardCount: 5,
    layoutShape: 'pentagram',
    positions: [
      { id: 'spirit', label: '灵·本质', x: 50, y: 10 },
      { id: 'fire', label: '火·行动', x: 85, y: 45 },
      { id: 'water', label: '水·情感', x: 15, y: 45 },
      { id: 'air', label: '风·思维', x: 72, y: 87 },
      { id: 'earth', label: '土·现实', x: 28, y: 87 },
    ],
  },
  {
    id: 'four-seasons',
    name: '四季',
    description: '以四季流转映照事物发展的四个阶段。适合规划、项目发展或年度运势占卜。',
    cardCount: 4,
    layoutShape: 'grid',
    positions: [
      { id: 'spring', label: '春·开始', x: 30, y: 30 },
      { id: 'summer', label: '夏·成长', x: 70, y: 30 },
      { id: 'autumn', label: '秋·收获', x: 30, y: 70 },
      { id: 'winter', label: '冬·沉淀', x: 70, y: 70 },
    ],
  },
];

export function getSpreadById(id: string): SpreadConfig | undefined {
  return spreads.find(s => s.id === id);
}
