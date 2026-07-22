const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "梅花易数 — 观物取象，以心通易";

// Color palette — traditional Chinese aesthetic
const C = {
  primary: "1A3A5C",
  primaryLight: "2C5F8A",
  secondary: "F5EFE6",
  accent: "B84040",
  accentLight: "D46969",
  dark: "0D2137",
  white: "FFFFFF",
  offWhite: "F5EFE6",
  charcoal: "2D2D2D",
  muted: "8B8B8B",
  gold: "C9A96E",
  goldLight: "F0E6D2",
  cream: "FAF7F2",
};

// Utility functions
const makeShadow = () => ({
  type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.10
});

function slideNum(slide) {
  slide.addText("梅花易数", {
    x: 0.5, y: 5.2, w: 9, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.muted, align: "left"
  });
}

function sectionTitle(slide, title, subtitle) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: C.accent }
  });
  slide.addText(title, {
    x: 0.6, y: 0.25, w: 8.8, h: 0.55,
    fontSize: 30, fontFace: "Cambria", color: C.primary, bold: true, margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 0.75, w: 8.8, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.muted, margin: 0
    });
  }
}

// ============================================================
// Slide 1: Title Slide (dark background)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  // Decorative top line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent }
  });

  // Chinese title
  slide.addText("梅花易数", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.2,
    fontSize: 54, fontFace: "Cambria", color: C.gold, bold: true, align: "center", margin: 0
  });

  // Subtitle
  slide.addText("观物取象  以心通易", {
    x: 0.8, y: 2.3, w: 8.4, h: 0.6,
    fontSize: 22, fontFace: "Calibri", color: C.offWhite, align: "center", charSpacing: 4, margin: 0
  });

  // Decorated line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 3.1, w: 3, h: 0.02, fill: { color: C.gold }
  });

  // Subtitle info
  slide.addText("中国古代三大易学占卜体系之一  |  北宋邵雍开创", {
    x: 0.8, y: 3.4, w: 8.4, h: 0.45,
    fontSize: 13, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });
}

// ============================================================
// Slide 2: 什么是梅花易数 (icon + text rows layout)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.cream };
  sectionTitle(slide, "什么是梅花易数", "名称由来 · 核心理念 · 三大体系");

  // Three key points with icon circles
  const items = [
    { label: "名称", text: "源于邵雍「观梅占」典故\n两只麻雀坠地，起卦预言邻女折梅跌伤" },
    { label: "别称", text: "梅花心易 · 观梅数 · 观梅占\n强调「心」的直觉与物象的直接关联" },
    { label: "地位", text: "与古筮法、纳甲法并称易占三大体系\n以灵活快捷、无需工具著称" },
  ];

  items.forEach((item, i) => {
    const y = 1.4 + i * 1.3;
    // Circle with label
    slide.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y + 0.05, w: 0.65, h: 0.65,
      fill: { color: C.primary }
    });
    slide.addText(item.label, {
      x: 0.6, y: y + 0.05, w: 0.65, h: 0.65,
      fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    // Content text
    slide.addText([
      { text: item.text.split("\n")[0], options: { bold: true, fontSize: 15, color: C.primary, breakLine: true } },
      { text: item.text.split("\n")[1], options: { fontSize: 12, color: C.charcoal } }
    ], {
      x: 1.55, y: y, w: 7.8, h: 0.85,
      fontFace: "Calibri", align: "left", valign: "top", margin: 0
    });
  });

  slideNum(slide);
}

// ============================================================
// Slide 3: 起源与历史 (two-column: timeline + portrait)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  sectionTitle(slide, "起源与历史", "从北宋到当代，跨越千年的易学传承");

  // Left column — timeline
  const timeline = [
    { year: "1011-1077", text: "邵雍（邵康节）\n北宋五子之一，创先天易学" },
    { year: "南宋", text: "「观梅卜瓦」之说已在文人诗中流传\n马永卿《嬾真子》有载" },
    { year: "明代", text: "《梅花易数》广泛流传\n传入日本、韩国" },
    { year: "当代", text: "黄鉴、邓海一等发展新流派\n全息直读、俏梅花外应体系" },
  ];

  timeline.forEach((item, i) => {
    const y = 1.3 + i * 1.05;
    // Year badge
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: y, w: 1.3, h: 0.35,
      fill: { color: C.primary }, rectRadius: 0.05
    });
    slide.addText(item.year, {
      x: 0.5, y: y, w: 1.3, h: 0.35,
      fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    // Connecting line
    if (i < timeline.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 1.12, y: y + 0.35, w: 0.03, h: 0.7,
        fill: { color: C.gold }
      });
    }
    // Text
    slide.addText(item.text, {
      x: 2.1, y: y - 0.05, w: 3.5, h: 0.8,
      fontSize: 12, fontFace: "Calibri", color: C.charcoal, align: "left", valign: "top", margin: 0
    });
  });

  // Right column — a quote card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.9, y: 1.3, w: 3.7, h: 3.8,
    fill: { color: C.goldLight },
    shadow: makeShadow()
  });
  slide.addText("“观梅占雀，坠地而知人事。\n此非卜也，心通于物也。”", {
    x: 6.2, y: 1.8, w: 3.1, h: 1.8,
    fontSize: 16, fontFace: "Cambria", color: C.primary, align: "center", valign: "middle", italic: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.4, y: 3.6, w: 0.7, h: 0.03, fill: { color: C.accent }
  });
  slide.addText("— 观梅占典故", {
    x: 6.2, y: 3.8, w: 3.1, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });

  slideNum(slide);
}

// ============================================================
// Slide 4: 哲学根基 (three cards layout)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.cream };
  sectionTitle(slide, "哲学根基", "天人合一  ·  万物类象  ·  阴阳五行");

  const cards = [
    { title: "天人合一", desc: "人与天地同构，心念波动\n与时空信息精密共振。\n“心动之处，即是卦起之时。”" },
    { title: "一物一太极", desc: "任一物象、数字、动作都\n构成独立的信息全息单元。\n局部承载整体的全部信息。" },
    { title: "阴阳五行", desc: "以体用生克解读事物关系：\n相生则顺，相克则阻，\n比和则稳。" },
  ];

  cards.forEach((card, i) => {
    const x = 0.5 + i * 3.15;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.3, w: 2.85, h: 3.2,
      fill: { color: C.white },
      shadow: makeShadow()
    });
    // Accent top line
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.3, w: 2.85, h: 0.06,
      fill: { color: C.accent }
    });
    // Card number
    slide.addText(String(i + 1), {
      x: x + 0.2, y: 1.5, w: 0.5, h: 0.5,
      fontSize: 28, fontFace: "Cambria", color: C.accent, bold: true, margin: 0
    });
    // Title
    slide.addText(card.title, {
      x: x + 0.2, y: 2.05, w: 2.4, h: 0.4,
      fontSize: 17, fontFace: "Cambria", color: C.primary, bold: true, margin: 0
    });
    // Divider
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.2, y: 2.5, w: 1, h: 0.02, fill: { color: C.gold }
    });
    // Description
    slide.addText(card.desc, {
      x: x + 0.2, y: 2.7, w: 2.4, h: 1.6,
      fontSize: 12, fontFace: "Calibri", color: C.charcoal, align: "left", valign: "top", margin: 0
    });
  });

  slideNum(slide);
}

// ============================================================
// Slide 5: 先天八卦 (grid layout with numbers and symbols)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  sectionTitle(slide, "核心工具 — 先天八卦", "万物皆数，数中有象");

  const guas = [
    { name: "乾 ☰", num: "一", elem: "金", nature: "天", color: C.primary },
    { name: "兑 ☱", num: "二", elem: "金", nature: "泽", color: C.primaryLight },
    { name: "离 ☲", num: "三", elem: "火", nature: "火", color: C.accent },
    { name: "震 ☳", num: "四", elem: "木", nature: "雷", color: "2C5F2D" },
    { name: "巽 ☴", num: "五", elem: "木", nature: "风", color: "5B8C5A" },
    { name: "坎 ☵", num: "六", elem: "水", nature: "水", color: "2874A6" },
    { name: "艮 ☶", num: "七", elem: "土", nature: "山", color: C.gold },
    { name: "坤 ☷", num: "八", elem: "土", nature: "地", color: "A0805A" },
  ];

  guas.forEach((gua, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.5 + col * 2.35;
    const y = 1.3 + row * 2.0;

    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 2.15, h: 1.75,
      fill: { color: C.offWhite },
      shadow: makeShadow()
    });
    // Left color bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 0.07, h: 1.75,
      fill: { color: gua.color }
    });
    // Gua name + symbol
    slide.addText(gua.name, {
      x: x + 0.25, y: y + 0.15, w: 1.7, h: 0.55,
      fontSize: 22, fontFace: "Cambria", color: C.primary, bold: true, margin: 0
    });
    // Details
    slide.addText([
      { text: "卦数: " + gua.num + "  |  五行: " + gua.elem, options: { breakLine: true } },
      { text: "象: " + gua.nature, options: {} }
    ], {
      x: x + 0.25, y: y + 0.75, w: 1.7, h: 0.8,
      fontSize: 11, fontFace: "Calibri", color: C.charcoal, margin: 0
    });
  });

  slideNum(slide);
}

// ============================================================
// Slide 6: 起卦方法 (two methods side by side)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.cream };
  sectionTitle(slide, "起卦方法", "卦以八除  ·  爻以六除");

  // Method 1: 时间起卦
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.3, w: 4.55, h: 3.8,
    fill: { color: C.white }, shadow: makeShadow()
  });
  slide.addText("时间起卦法", {
    x: 0.55, y: 1.45, w: 4.05, h: 0.4,
    fontSize: 18, fontFace: "Cambria", color: C.primary, bold: true, margin: 0
  });
  slide.addText([
    { text: "取农历年、月、日、时辰之数", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "上卦 = (年 + 月 + 日) ÷ 8 取余", options: { breakLine: true, fontSize: 11 } },
    { text: "下卦 = (年 + 月 + 日 + 时) ÷ 8 取余", options: { breakLine: true, fontSize: 11 } },
    { text: "动爻 = (年 + 月 + 日 + 时) ÷ 6 取余", options: { breakLine: true, fontSize: 11 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "例: 乙巳年六月初一亥时", options: { breakLine: true, fontSize: 11, color: C.accent, bold: true } },
    { text: "上卦: (6+6+1)÷8=1余5 → 巽 ☴", options: { breakLine: true, fontSize: 10, color: C.charcoal } },
    { text: "下卦: (6+6+1+12)÷8=3余1 → 乾 ☰", options: { breakLine: true, fontSize: 10, color: C.charcoal } },
    { text: "得: 风天小畜 → 风地观", options: { breakLine: true, fontSize: 10, color: C.primary, bold: true } },
  ], {
    x: 0.55, y: 1.95, w: 4.05, h: 2.9,
    fontFace: "Calibri", valign: "top", margin: 0
  });

  // Method 2: 数字起卦
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.15, y: 1.3, w: 4.55, h: 3.8,
    fill: { color: C.white }, shadow: makeShadow()
  });
  slide.addText("数字起卦法", {
    x: 5.4, y: 1.45, w: 4.05, h: 0.4,
    fontSize: 18, fontFace: "Cambria", color: C.primary, bold: true, margin: 0
  });
  slide.addText([
    { text: "心念专注，随口报出两个自然数", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "上卦 = 第一个数 ÷ 8 取余", options: { breakLine: true, fontSize: 11 } },
    { text: "下卦 = 第二个数 ÷ 8 取余", options: { breakLine: true, fontSize: 11 } },
    { text: "动爻 = (两数之和) ÷ 6 取余", options: { breakLine: true, fontSize: 11 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "例: 报数 3 和 6", options: { breakLine: true, fontSize: 11, color: C.accent, bold: true } },
    { text: "上卦: 3 → 离 ☲", options: { breakLine: true, fontSize: 10, color: C.charcoal } },
    { text: "下卦: 6 → 坎 ☵", options: { breakLine: true, fontSize: 10, color: C.charcoal } },
    { text: "得: 火水未济 → 火风鼎", options: { breakLine: true, fontSize: 10, color: C.primary, bold: true } },
  ], {
    x: 5.4, y: 1.95, w: 4.05, h: 2.9,
    fontFace: "Calibri", valign: "top", margin: 0
  });

  slideNum(slide);
}

// ============================================================
// Slide 7: 体用生克 (five relationship cards)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  sectionTitle(slide, "解卦核心 — 体用生克", "体为己身，用为应事；五行生克，万占之基");

  const relations = [
    { label: "用生体", score: "大吉", desc: "贵人相助\n机遇主动上门", color: "2E7D32" },
    { label: "体用比和", score: "大吉", desc: "内外和谐\n百事顺遂", color: "1565C0" },
    { label: "体克用", score: "小吉", desc: "事能成\n需努力争取", color: "5D8A2E" },
    { label: "体生用", score: "小凶", desc: "付出多\n回报少，泄气", color: "E67E22" },
    { label: "用克体", score: "大凶", desc: "处处受制\n压力重重", color: C.accent },
  ];

  relations.forEach((rel, i) => {
    const x = 0.3 + i * 1.92;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.3, w: 1.72, h: 2.9,
      fill: { color: C.offWhite },
      shadow: makeShadow()
    });
    // Score badge
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.46, y: 1.5, w: 0.8, h: 0.5,
      fill: { color: rel.color }, rectRadius: 0.08
    });
    slide.addText(rel.score, {
      x: x + 0.46, y: 1.5, w: 0.8, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    // Label
    slide.addText(rel.label, {
      x: x, y: 2.15, w: 1.72, h: 0.4,
      fontSize: 15, fontFace: "Cambria", color: C.primary, align: "center", bold: true, margin: 0
    });
    // Description
    slide.addText(rel.desc, {
      x: x + 0.1, y: 2.6, w: 1.52, h: 1.0,
      fontSize: 10.5, fontFace: "Calibri", color: C.charcoal, align: "center", valign: "top", margin: 0
    });
  });

  slideNum(slide);
}

// ============================================================
// Slide 8: 断卦三步法 (numbered flow)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.cream };
  sectionTitle(slide, "断卦三步法", "从起卦到结论的系统化方法");

  const steps = [
    { num: "01", title: "定体用", desc: "找出动爻所在——有动爻者为用卦\n无动爻者为体卦，代表问卦者自身" },
    { num: "02", title: "辨生克", desc: "按八卦五行属性判断体用关系\n金→水→木→火→土→金（相生）\n金→木→土→水→火→金（相克）" },
    { num: "03", title: "察变化", desc: "结合互卦看中间过程\n结合变卦看最终结局\n综合四时旺衰定应期" },
  ];

  steps.forEach((step, i) => {
    const y = 1.3 + i * 1.35;
    // Large number
    slide.addText(step.num, {
      x: 0.4, y: y, w: 0.8, h: 0.65,
      fontSize: 32, fontFace: "Cambria", color: C.accent, bold: true, margin: 0
    });
    // Connecting line
    if (i < steps.length - 1) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.77, y: y + 0.7, w: 0.03, h: 0.65, fill: { color: C.gold }
      });
    }
    // Title
    slide.addText(step.title, {
      x: 1.5, y: y, w: 3, h: 0.45,
      fontSize: 18, fontFace: "Cambria", color: C.primary, bold: true, margin: 0
    });
    // Description
    slide.addText(step.desc, {
      x: 1.5, y: y + 0.45, w: 7.8, h: 0.75,
      fontSize: 12, fontFace: "Calibri", color: C.charcoal, align: "left", valign: "top", margin: 0
    });
  });

  // Right side: key tip box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 3.8, w: 4.1, h: 1.2,
    fill: { color: C.goldLight }
  });
  slide.addText([
    { text: "核心口诀", options: { bold: true, breakLine: true, fontSize: 13, color: C.accent } },
    { text: "用生体 → 乘风破浪\n体生用 → 量力而行\n体克用 → 坚持到底\n用克体 → 及时转向", options: { fontSize: 11, color: C.charcoal } }
  ], {
    x: 5.7, y: 3.9, w: 3.7, h: 1.0,
    fontFace: "Calibri", align: "left", valign: "top", margin: 0
  });

  slideNum(slide);
}

// ============================================================
// Slide 9: 实战案例 (two case columns)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  sectionTitle(slide, "实战案例", "古人今用，以卦明事");

  // Case 1
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.3, w: 4.55, h: 3.8,
    fill: { color: C.cream }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.3, w: 4.55, h: 0.06, fill: { color: "2E7D32" }
  });
  slide.addText("吉  ·  办事成功", {
    x: 0.55, y: 1.5, w: 4.05, h: 0.35,
    fontSize: 15, fontFace: "Cambria", color: "2E7D32", bold: true, margin: 0
  });
  slide.addText([
    { text: "问：", options: { bold: true } },
    { text: "2002年，朋友问交警队办事能成否", options: {}, breakLine: true },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "卦：", options: { bold: true } },
    { text: "巽为风 → 风天小畜", options: {}, breakLine: true },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "析：", options: { bold: true } },
    { text: "变卦乾金为体，巽木为用，体克用小吉\n体卦得月建申金所生，旺相有力", options: {}, breakLine: true },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "果：", options: { bold: true } },
    { text: "✅ 酉月9月19-20日左右成功办成", options: { color: "2E7D32" } },
  ], {
    x: 0.55, y: 1.95, w: 4.05, h: 2.8,
    fontSize: 11, fontFace: "Calibri", color: C.charcoal, valign: "top", margin: 0
  });

  // Case 2
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.15, y: 1.3, w: 4.55, h: 3.8,
    fill: { color: C.cream }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.15, y: 1.3, w: 4.55, h: 0.06, fill: { color: C.accent }
  });
  slide.addText("凶  ·  测病应期", {
    x: 5.4, y: 1.5, w: 4.05, h: 0.35,
    fontSize: 15, fontFace: "Cambria", color: C.accent, bold: true, margin: 0
  });
  slide.addText([
    { text: "问：", options: { bold: true } },
    { text: "2004年，79岁母亲脑出血住院二十多日\n问还能坚持几天", options: {}, breakLine: true },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "卦：", options: { bold: true } },
    { text: "地风升 → 地水师", options: {}, breakLine: true },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "析：", options: { bold: true } },
    { text: "坎水为体（母），坤土为用（病）\n用克体大凶，坤土得巳月生极旺", options: {}, breakLine: true },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "果：", options: { bold: true } },
    { text: "❌ 未日亥时（坤土值日）去世", options: { color: C.accent } },
  ], {
    x: 5.4, y: 1.95, w: 4.05, h: 2.8,
    fontSize: 11, fontFace: "Calibri", color: C.charcoal, valign: "top", margin: 0
  });

  slideNum(slide);
}

// ============================================================
// Slide 10: 四大占卜术对比 (table)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.cream };
  sectionTitle(slide, "四大占卜术对比", "梅花易数  ·  六爻  ·  大六壬  ·  奇门遁甲");

  const headerOpts = { fill: { color: C.primary }, color: C.white, bold: true, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" };
  const cellOpts = { fill: { color: C.white }, color: C.charcoal, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" };

  const rows = [
    [
      { text: "", options: headerOpts },
      { text: "梅花易数", options: headerOpts },
      { text: "六爻", options: headerOpts },
      { text: "大六壬", options: headerOpts },
      { text: "奇门遁甲", options: headerOpts },
    ],
    [
      { text: "起源", options: { ...cellOpts, bold: true, fill: { color: C.goldLight } } },
      { text: "宋·邵雍", options: cellOpts },
      { text: "西汉·京房", options: cellOpts },
      { text: "先秦上古", options: cellOpts },
      { text: "传说黄帝时", options: cellOpts },
    ],
    [
      { text: "入门难度", options: { ...cellOpts, bold: true, fill: { color: C.goldLight } } },
      { text: "★★ 最简单", options: cellOpts },
      { text: "★★★ 中等", options: cellOpts },
      { text: "★★★★★ 极难", options: cellOpts },
      { text: "★★★★ 很难", options: cellOpts },
    ],
    [
      { text: "起卦方式", options: { ...cellOpts, bold: true, fill: { color: C.goldLight } } },
      { text: "时间/数字/外应", options: cellOpts },
      { text: "摇铜钱六次", options: cellOpts },
      { text: "月将+时辰排盘", options: cellOpts },
      { text: "时间方位排盘", options: cellOpts },
    ],
    [
      { text: "核心逻辑", options: { ...cellOpts, bold: true, fill: { color: C.goldLight } } },
      { text: "体用生克", options: cellOpts },
      { text: "世应用神\n生克制化", options: cellOpts },
      { text: "课体格局\n地支关系", options: cellOpts },
      { text: "宫位生克\n格局组合", options: cellOpts },
    ],
    [
      { text: "核心优势", options: { ...cellOpts, bold: true, fill: { color: C.goldLight } } },
      { text: "灵活快捷\n随时随地可用", options: cellOpts },
      { text: "一事一测\n准验度高", options: cellOpts },
      { text: "人事之王\n信息最丰富", options: cellOpts },
      { text: "空间感最强\n风水择吉", options: cellOpts },
    ],
  ];

  slide.addTable(rows, {
    x: 0.4, y: 1.3, w: 9.2,
    colW: [1.5, 1.9, 1.9, 1.9, 2.0],
    rowH: [0.45, 0.45, 0.45, 0.5, 0.55, 0.55],
    border: { pt: 0.5, color: "D0D0D0" },
  });

  slideNum(slide);
}

// ============================================================
// Slide 11: 现代意义 (icon rows)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  sectionTitle(slide, "现代意义与学习价值", "超越预测本身 — 思维、心性、智慧");

  const items = [
    { title: "入门门槛最低", desc: "无需工具，随时随地起卦，一两个月掌握基础。是所有术数中最易上手的体系。" },
    { title: "全息思维训练", desc: "建立「局部包含整体」的系统思维，弥补纯理性逻辑分析的盲区。以类象思维看待世界。" },
    { title: "心性觉察修行", desc: "「至诚之道，感而遂通」。核心不在于技术而在于心性的清明与觉察力的提升。" },
    { title: "生活决策辅助", desc: "用于性格解析、职业指导、环境勘测、决策参考，在不确定中找到方向感。" },
  ];

  items.forEach((item, i) => {
    const y = 1.3 + i * 1.02;
    // Circle with number
    slide.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y + 0.08, w: 0.55, h: 0.55,
      fill: { color: C.accent }
    });
    slide.addText(String(i + 1), {
      x: 0.6, y: y + 0.08, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    // Title + desc
    slide.addText([
      { text: item.title, options: { bold: true, fontSize: 15, color: C.primary, breakLine: true } },
      { text: item.desc, options: { fontSize: 11.5, color: C.charcoal } }
    ], {
      x: 1.45, y: y, w: 8.1, h: 0.8,
      fontFace: "Calibri", align: "left", valign: "top", margin: 0
    });
  });

  // Right side highlight box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 4.0, w: 4.2, h: 1.2,
    fill: { color: C.goldLight }
  });
  slide.addText([
    { text: "建议学习路径", options: { bold: true, breakLine: true, fontSize: 13, color: C.primary } },
    { text: "梅花易数入门 → 六爻精进\n→ 六壬或奇门专攻", options: { fontSize: 11, color: C.charcoal } }
  ], {
    x: 5.7, y: 4.1, w: 3.8, h: 1.0,
    fontFace: "Calibri", align: "left", valign: "top", margin: 0
  });

  slideNum(slide);
}

// ============================================================
// Slide 12: 总结 (dark background conclusion)
// ============================================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  // Decorative top line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent }
  });

  slide.addText("善易者不卜", {
    x: 0.8, y: 1.3, w: 8.4, h: 0.9,
    fontSize: 44, fontFace: "Cambria", color: C.gold, bold: true, align: "center", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 2.3, w: 3, h: 0.02, fill: { color: C.accent }
  });

  slide.addText("当内心足够清明，能与天地规律同频，\n当行为足够智慧，能顺应趋势变化，\n当心态足够豁达，能接纳万物流转——\n就不再需要刻意的预测。", {
    x: 1.0, y: 2.6, w: 8, h: 1.6,
    fontSize: 15, fontFace: "Calibri", color: C.offWhite, align: "center", valign: "middle", margin: 0
  });

  slide.addText([
    { text: "天人合一  ·  以心通易  ·  观物取象", options: { fontSize: 12, color: C.gold, charSpacing: 3 } }
  ], {
    x: 0.8, y: 4.3, w: 8.4, h: 0.5,
    fontFace: "Calibri", align: "center", margin: 0
  });

  slide.addText("数据来源: 百度百科 · 维基文库 · 360doc · 搜狐 · 微信公众平台 · 上海社科院", {
    x: 0.8, y: 5.1, w: 8.4, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });
}

// ============================================================
// Write output
// ============================================================
pres.writeFile({ fileName: "d:/ideas/梅花易数.pptx" }).then(() => {
  console.log("Presentation saved to d:/ideas/梅花易数.pptx");
}).catch(err => {
  console.error("Error:", err);
});
