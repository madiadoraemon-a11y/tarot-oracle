const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "IELTS Teacher";
pres.title = "雅思写作全攻略 — 从基础到6分";

// Color palette — academic clean
const C = {
  navy: "1A5276",
  navyDark: "0D354F",
  teal: "148F77",
  tealLight: "D1F2EB",
  white: "FFFFFF",
  bg: "F8F9FA",
  card: "FFFFFF",
  text: "2C3E50",
  muted: "7F8C8D",
  red: "C0392B",
  redLight: "FDEDEC",
  green: "27AE60",
  greenLight: "EAFAF1",
  gold: "D4A017",
  goldLight: "FEF9E7",
  accent: "2980B9",
  accentLight: "EBF5FB",
};

const makeShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 });

function footer(slide, text) {
  slide.addText(text || "雅思写作教学课件", {
    x: 0.5, y: 5.2, w: 9, h: 0.3,
    fontSize: 8, fontFace: "Calibri", color: C.muted, align: "left"
  });
}

function sectionHeader(slide, title, subtitle) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9, h: 0.5,
    fontSize: 26, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 0.65, w: 9, h: 0.3,
      fontSize: 12, fontFace: "Calibri", color: C.muted, margin: 0
    });
  }
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: opts.fill || C.card }, shadow: opts.shadow !== false ? makeShadow() : undefined
  });
  if (opts.accentColor) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.05, fill: { color: opts.accentColor } });
  }
}

// ============================================================
// Slide 1: Title
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.navyDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  s.addText("雅思写作全攻略", {
    x: 0.8, y: 1.0, w: 8.4, h: 1.0,
    fontSize: 48, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
  });
  s.addText("从基础入门到稳拿6分 — 实战教学版", {
    x: 0.8, y: 2.0, w: 8.4, h: 0.55,
    fontSize: 20, fontFace: "Calibri", color: "A0C4D0", align: "center", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.2, y: 2.75, w: 3.6, h: 0.02, fill: { color: C.teal } });
  s.addText([
    { text: "适用于：", options: { color: C.muted } },
    { text: "基础薄弱考生  ·  课堂教学  ·  自学提分", options: { color: C.gold } }
  ], {
    x: 0.8, y: 3.0, w: 8.4, h: 0.45,
    fontSize: 13, fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("IELTS Writing | Task 1 & Task 2 | Band 5 → 6+", {
    x: 0.8, y: 4.8, w: 8.4, h: 0.3,
    fontSize: 10, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });
}

// ============================================================
// Slide 2: Exam Overview
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHeader(s, "考试概览", "IELTS Writing — 60分钟两篇作文");

  const info = [
    { label: "Task 1 小作文", time: "20分钟", words: "≥ 150词", weight: "占 1/3", content: "学术类：描述图表/地图/流程\n培训类：写书信", color: C.accent },
    { label: "Task 2 大作文", time: "40分钟", words: "≥ 250词", weight: "占 2/3", content: "议论文 — 教育/环境/科技/社会等话题\n五种题型选一", color: C.teal },
  ];

  info.forEach((item, i) => {
    const y = 1.2 + i * 1.85;
    card(s, 0.4, y, 9.2, 1.65, { accentColor: item.color });

    s.addText(item.label, {
      x: 0.7, y: y + 0.15, w: 2.2, h: 0.4,
      fontSize: 18, fontFace: "Calibri", color: item.color, bold: true, margin: 0
    });
    // Badges
    const badges = [
      { text: item.time, x: 3.1 },
      { text: item.words, x: 4.5 },
      { text: item.weight, x: 5.9 },
    ];
    badges.forEach(b => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: b.x, y: y + 0.15, w: 1.15, h: 0.35,
        fill: { color: C.accentLight }, rectRadius: 0.05
      });
      s.addText(b.text, {
        x: b.x, y: y + 0.15, w: 1.15, h: 0.35,
        fontSize: 10, fontFace: "Calibri", color: C.navy, align: "center", valign: "middle", bold: true, margin: 0
      });
    });

    s.addText(item.content, {
      x: 0.7, y: y + 0.65, w: 8.5, h: 0.8,
      fontSize: 13, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
  });

  // Formula highlight
  s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.95, w: 9.2, h: 0.5, fill: { color: C.goldLight } });
  s.addText([
    { text: "写作总分 = (Task 1得分 × 1 + Task 2得分 × 2) ÷ 3      ", options: { bold: true, color: C.navy } },
    { text: "→ Task 2 定生死！", options: { bold: true, color: C.red } }
  ], {
    x: 0.7, y: 4.95, w: 8.8, h: 0.5,
    fontSize: 13, fontFace: "Calibri", align: "center", valign: "middle", margin: 0
  });

  footer(s);
}

// ============================================================
// Slide 3: Four Scoring Criteria
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "四大评分标准", "考官从这四个维度分别打分，各占 25%");

  const criteria = [
    { abbr: "TR", title: "Task Response\n任务回应", desc: "是否完整回答了题目？\n立场是否清晰？\n有没有跑题？", tips: "精准审题  ·  立场一致  ·  不跑题", color: C.red },
    { abbr: "CC", title: "Coherence & Cohesion\n连贯与衔接", desc: "段落逻辑是否清晰？\n句子间连接是否自然？\n是否有机械堆砌连接词？", tips: "一段一主题  ·  自然过渡  ·  先用简单连接词", color: C.gold },
    { abbr: "LR", title: "Lexical Resource\n词汇资源", desc: "用词是否准确多样？\n搭配（collocation）是否自然？\n是否能换词而不抄题？", tips: "场景词群记忆  ·  背搭配不背单词  ·  准确>复杂", color: C.teal },
    { abbr: "GRA", title: "Grammatical Range\n语法多样与准确", desc: "简单句是否正确？\n是否尝试了复杂句？\n时态、冠词、主谓一致？", tips: "先保证简单句全对  ·  再学3个核心复杂句", color: C.accent },
  ];

  criteria.forEach((c, i) => {
    const x = 0.2 + i * 2.45;
    card(s, x, 1.15, 2.3, 3.85, { accentColor: c.color });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.15, y: 1.35, w: 0.65, h: 0.5,
      fill: { color: c.color }, rectRadius: 0.05
    });
    s.addText(c.abbr, {
      x: x + 0.15, y: 1.35, w: 0.65, h: 0.5,
      fontSize: 16, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    s.addText(c.title, {
      x: x + 0.15, y: 2.0, w: 1.95, h: 0.65,
      fontSize: 13, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
    });
    s.addText(c.desc, {
      x: x + 0.15, y: 2.7, w: 1.95, h: 1.3,
      fontSize: 10, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: 4.1, w: 1.95, h: 0.02, fill: { color: "E0E0E0" } });
    s.addText(c.tips, {
      x: x + 0.15, y: 4.2, w: 1.95, h: 0.65,
      fontSize: 9, fontFace: "Calibri", color: C.teal, bold: true, valign: "top", margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 4: Task 2 — 5 Question Types
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHeader(s, "大作文 — 五大题型", "Task 2 先判断题型 → 再选对应结构 → 绝不跑题");

  const types = [
    { num: "01", type: "观点类 Opinion", key: "Do you agree or disagree?\nTo what extent...?", struct: "明确立场 + 2个论据支撑\n不骑墙，选一边站", color: C.red },
    { num: "02", type: "讨论类 Discussion", key: "Discuss both views\nand give your opinion", struct: "Body1讲对方观点\nBody2讲自己观点\n结论亮明立场", color: C.teal },
    { num: "03", type: "问题解决类\nProblem/Solution", key: "What are the causes?\nHow can it be solved?", struct: "Body1 = 原因/问题\nBody2 = 解决方案\n两边篇幅要均衡", color: C.gold },
    { num: "04", type: "利弊类\nAdvantages/Disadvantages", key: "What are the advantages\nand disadvantages?", struct: "Body1 = 优点\nBody2 = 缺点\n结论给出评价", color: C.accent },
    { num: "05", type: "双问题类\nTwo-Part Question", key: "Why is this happening?\nIs it positive or negative?", struct: "Body1 回答第一问\nBody2 回答第二问\n两问答在同一篇里", color: C.navy },
  ];

  types.forEach((t, i) => {
    const x = 0.15 + i * 1.96;
    card(s, x, 1.15, 1.82, 3.85, {});

    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.4, y: 1.3, w: 1.0, h: 0.45,
      fill: { color: t.color }, rectRadius: 0.06
    });
    s.addText(t.num, {
      x: x + 0.4, y: 1.3, w: 1.0, h: 0.45,
      fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    s.addText(t.type, {
      x: x + 0.1, y: 1.9, w: 1.6, h: 0.55,
      fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, align: "center", margin: 0
    });
    s.addText(t.key, {
      x: x + 0.1, y: 2.55, w: 1.6, h: 0.65,
      fontSize: 9.5, fontFace: "Calibri", color: C.red, align: "center", margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: 3.25, w: 1.5, h: 0.015, fill: { color: "E8E8E8" } });
    s.addText(t.struct, {
      x: x + 0.1, y: 3.35, w: 1.6, h: 1.2,
      fontSize: 10, fontFace: "Calibri", color: C.text, align: "center", valign: "top", margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 5: Task 2 Universal Structure
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "大作文万能结构", "无论什么题型，底层框架都是「引言 + 主体×2 + 结论」");

  // PEEL card
  card(s, 0.3, 1.1, 5.8, 4.1, { accentColor: C.teal });
  s.addText("PEEL 段落法 — 每个主体段都用它", {
    x: 0.6, y: 1.25, w: 5.2, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.teal, bold: true, margin: 0
  });

  const peel = [
    { letter: "P", title: "Point 观点", desc: "一句话表明本段论点", example: "Firstly, technology has made education more accessible to students worldwide." },
    { letter: "E", title: "Explain 解释", desc: "解释为什么，展开你的逻辑", example: "This means that anyone with an internet connection can now access free courses from top universities..." },
    { letter: "E", title: "Example 举例", desc: "具体案例或假设情境", example: "For example, platforms like Coursera and Khan Academy offer thousands of online courses..." },
    { letter: "L", title: "Link 回扣", desc: "联系回主题/立场", example: "Therefore, it is clear that technology plays a crucial role in modern education." },
  ];

  peel.forEach((p, i) => {
    const y = 1.8 + i * 0.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 0.45, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText(p.letter, {
      x: 0.6, y, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    s.addText(p.title, {
      x: 1.2, y: y - 0.02, w: 1.2, h: 0.3,
      fontSize: 12, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
    });
    s.addText(p.desc, {
      x: 2.3, y: y - 0.02, w: 1.6, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.muted, margin: 0
    });
    s.addText(p.example, {
      x: 0.6, y: y + 0.32, w: 5.2, h: 0.45,
      fontSize: 9, fontFace: "Calibri", color: C.text, italic: true, margin: 0
    });
  });

  // Right side: 4-paragraph template
  card(s, 6.35, 1.1, 3.35, 4.1, { accentColor: C.accent });
  s.addText("四段式模板", {
    x: 6.55, y: 1.25, w: 2.95, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
  });

  const paras = [
    { title: "Introduction", words: "~50词", desc: "改写题目 + 亮出立场", color: C.navy },
    { title: "Body 1", words: "~100词", desc: "主论点一\nPoint → Explain → Example → Link", color: C.teal },
    { title: "Body 2", words: "~100词", desc: "主论点二\n（或讨论对立观点+反驳）", color: C.gold },
    { title: "Conclusion", words: "~50词", desc: "总结立场 + 不引入新观点", color: C.red },
  ];

  paras.forEach((p, i) => {
    const y = 1.8 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.55, y, w: 0.06, h: 0.65, fill: { color: p.color }
    });
    s.addText(p.title, {
      x: 6.75, y: y, w: 1.3, h: 0.3,
      fontSize: 11, fontFace: "Calibri", color: p.color, bold: true, margin: 0
    });
    s.addText(p.words, {
      x: 8.3, y: y, w: 1.1, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: C.muted, align: "right", margin: 0
    });
    s.addText(p.desc, {
      x: 6.75, y: y + 0.28, w: 2.7, h: 0.4,
      fontSize: 9.5, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 6: Task 2 — Introductions
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHeader(s, "大作文开头段 — 万能公式", "3句话搞定 Introduction：转述题目 + 引出讨论 + 亮出立场");

  // Formula
  card(s, 0.3, 1.1, 9.4, 0.9, { accentColor: C.teal });
  s.addText([
    { text: "第1句：", options: { bold: true, color: C.teal } }, { text: "改写题目 — 用同义词换掉题目里的关键词，绝不照抄", options: { breakLine: true } },
    { text: "第2句：", options: { bold: true, color: C.gold } }, { text: "背景/争议 — 一句话说明这件事为什么值得讨论（基础弱的学生这句可以省）", options: { breakLine: true } },
    { text: "第3句：", options: { bold: true, color: C.red } }, { text: "亮立场 — This essay will argue that... / I strongly believe that...", options: {} },
  ], {
    x: 0.55, y: 1.15, w: 8.9, h: 0.8,
    fontSize: 11.5, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
  });

  // Examples: Opinion vs Discussion
  // Opinion
  card(s, 0.3, 2.2, 4.55, 2.75, { accentColor: C.accent });
  s.addText("观点类开头 — 例", {
    x: 0.55, y: 2.35, w: 4.05, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
  });
  s.addText([
    { text: "题目：", options: { bold: true, color: C.muted, fontSize: 9 } },
    { text: "Some believe children should not be given homework. Do you agree?", options: { color: C.muted, fontSize: 9, breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "① ", options: { bold: true, color: C.teal, fontSize: 10 } },
    { text: "The question of whether students should be assigned homework has been widely debated.", options: { fontSize: 10, breakLine: true } },
    { text: "② ", options: { bold: true, color: C.gold, fontSize: 10 } },
    { text: "While some argue it causes unnecessary stress, others believe it reinforces learning.", options: { fontSize: 10, breakLine: true } },
    { text: "③ ", options: { bold: true, color: C.red, fontSize: 10 } },
    { text: "This essay will argue that homework, in moderation, remains an essential educational tool.", options: { fontSize: 10 } },
  ], {
    x: 0.55, y: 2.7, w: 4.05, h: 2.1,
    fontFace: "Calibri", color: C.text, valign: "top", margin: 0
  });

  // Discussion
  card(s, 5.15, 2.2, 4.55, 2.75, { accentColor: C.teal });
  s.addText("讨论类开头 — 例", {
    x: 5.4, y: 2.35, w: 4.05, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: C.teal, bold: true, margin: 0
  });
  s.addText([
    { text: "题目：", options: { bold: true, color: C.muted, fontSize: 9 } },
    { text: "Some think govts should fund public transport. Others prefer roads. Discuss both.", options: { color: C.muted, fontSize: 9, breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "① ", options: { bold: true, color: C.teal, fontSize: 10 } },
    { text: "People hold different views on how governments should allocate transportation budgets.", options: { fontSize: 10, breakLine: true } },
    { text: "② ", options: { bold: true, color: C.gold, fontSize: 10 } },
    { text: "Some favour investing in public transport systems, while others prioritise road infrastructure.", options: { fontSize: 10, breakLine: true } },
    { text: "③ ", options: { bold: true, color: C.red, fontSize: 10 } },
    { text: "This essay will examine both perspectives before reaching a conclusion.", options: { fontSize: 10 } },
  ], {
    x: 5.4, y: 2.7, w: 4.05, h: 2.1,
    fontFace: "Calibri", color: C.text, valign: "top", margin: 0
  });

  footer(s);
}

// ============================================================
// Slide 7: Task 2 Body Paragraph Example
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "主体段实战拆解", "Topic: Why is learning English important? (Band 6 水准示例)");

  card(s, 0.3, 1.05, 9.4, 1.65, { accentColor: C.teal });
  // Annotations
  const annotations = [
    { x: 0.55, y: 1.15, w: 0.35, h: 0.3, label: "P", color: C.navy },
    { x: 0.55, y: 1.65, w: 0.35, h: 0.3, label: "E", color: C.teal },
    { x: 0.55, y: 2.05, w: 0.35, h: 0.3, label: "E", color: C.gold },
    { x: 0.55, y: 2.35, w: 0.35, h: 0.3, label: "L", color: C.red },
  ];
  annotations.forEach(a => {
    s.addShape(pres.shapes.RECTANGLE, { x: a.x, y: a.y, w: a.w, h: a.h, fill: { color: a.color }, rectRadius: 0.04 });
    s.addText(a.label, {
      x: a.x, y: a.y, w: a.w, h: a.h,
      fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
  });
  s.addText("Firstly, learning English can greatly improve one's career prospects.",
    { x: 1.05, y: 1.18, w: 8.4, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  s.addText("In today's globalised world, many multinational companies use English as their working language. Employees who are proficient in English can communicate with colleagues and clients from different countries, which makes them more valuable to the organisation.",
    { x: 1.05, y: 1.55, w: 8.4, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0 });
  s.addText("For instance, a 2024 survey found that English-speaking employees in China earn on average 30% more than those who do not speak English. This is particularly true in industries like finance, IT, and international trade.",
    { x: 1.05, y: 2.0, w: 8.4, h: 0.4, fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0 });
  s.addText("Thus, English proficiency can serve as a powerful tool for career advancement in an increasingly interconnected job market.",
    { x: 1.05, y: 2.33, w: 8.4, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });

  // Tips box
  card(s, 0.3, 2.95, 9.4, 2.25, { accentColor: C.gold });
  s.addText("写作要点详解", {
    x: 0.55, y: 3.1, w: 3, h: 0.3,
    fontSize: 14, fontFace: "Calibri", color: C.gold, bold: true, margin: 0
  });

  const tips = [
    { title: "P — Point", desc: "主题句直接回答题目，一段只讲一个观点。基础弱的学生可以先用 Firstly/Secondly/Finally 串联。" },
    { title: "E — Explain", desc: "解释为什么这个观点成立，用 This means that... / In other words... / The reason is that... 引出。" },
    { title: "E — Example", desc: "举例不求真实，但求具体、相关。用 For example/For instance...。编例子可以，但要合理。" },
    { title: "L — Link", desc: "回扣主题，用 Therefore/Thus/As a result... 总结本段论点，自然过渡到下一段。" },
  ];

  tips.forEach((tip, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 4.5;
    const y = 3.5 + row * 0.8;
    s.addText([
      { text: tip.title + "：", options: { bold: true, color: C.navy, fontSize: 10.5 } },
      { text: tip.desc, options: { color: C.text, fontSize: 10 } }
    ], {
      x, y, w: 4.3, h: 0.7,
      fontFace: "Calibri", valign: "top", margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 8: Topic Vocabulary Rescue Kit
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHeader(s, "词汇急救包", "按话题记词群，背搭配不背单词 — Band 6 → 7 的关键");

  const topics = [
    {
      title: "教育 Education", color: C.navy,
      items: "acquire knowledge · broaden horizons\npursue a degree · fall behind\ncompulsory education · lifelong learning\ntertiary education = 高等教育"
    },
    {
      title: "环境 Environment", color: C.teal,
      items: "combat climate change · carbon footprint\nrenewable energy · environmental degradation\nraise awareness · sustainable development\npose a threat · tackle pollution"
    },
    {
      title: "科技 Technology", color: C.accent,
      items: "access information · bridge the digital divide\nartificial intelligence · data privacy\nenhance efficiency · reshape the sector\ncutting-edge innovation = 尖端创新"
    },
    {
      title: "替换基础词 必背", color: C.red,
      items: "good → beneficial / advantageous\nbad → detrimental / harmful\nimportant → crucial / essential / vital\nmany → numerous / a great deal of\npeople → individuals / citizens"
    },
  ];

  topics.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.25 + col * 4.85;
    const y = 1.15 + row * 2.1;

    card(s, x, y, 4.65, 1.95, { accentColor: t.color });
    s.addText(t.title, {
      x: x + 0.2, y: y + 0.1, w: 4.25, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: t.color, bold: true, margin: 0
    });
    s.addText(t.items, {
      x: x + 0.2, y: y + 0.5, w: 4.25, h: 1.3,
      fontSize: 10.5, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
  });

  footer(s, "雅思写作教学课件  |  建议学生建立自己的话题词库，每个话题记10-15个核心搭配");
}

// ============================================================
// Slide 9: Common Collocations + Chinglish Fix
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "Chinglish 矫正 + 高频搭配", "考官最不能忍的中式英语 — 改掉这些，直接提 0.5 分");

  // Left: Common errors table
  const rows = [
    [
      { text: "中式英语 (Chinglish)", options: { fill: { color: C.red }, color: C.white, bold: true, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" } },
      { text: "正确表达 (Correct)", options: { fill: { color: C.teal }, color: C.white, bold: true, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" } },
      { text: "说明", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" } },
    ],
    [{ text: "make a crime", options: cellOpts() }, { text: "commit a crime", options: cellOpts(true) }, { text: "commit = 犯（罪）", options: explainOpts() }],
    [{ text: "do a decision", options: cellOpts() }, { text: "make a decision", options: cellOpts(true) }, { text: "固定搭配，不可直译", options: explainOpts() }],
    [{ text: "strong rain", options: cellOpts() }, { text: "heavy rain", options: cellOpts(true) }, { text: "strong ≠ 大（雨）", options: explainOpts() }],
    [{ text: "learn knowledge", options: cellOpts() }, { text: "acquire/gain knowledge", options: cellOpts(true) }, { text: "learn 不接 knowledge", options: explainOpts() }],
    [{ text: "big problem", options: cellOpts() }, { text: "serious / significant problem", options: cellOpts(true) }, { text: "big 太口语化", options: explainOpts() }],
    [{ text: "very excellent", options: cellOpts() }, { text: "excellent", options: cellOpts(true) }, { text: "excellent 已含\"非常\"", options: explainOpts() }],
    [{ text: "discuss about", options: cellOpts() }, { text: "discuss (no about)", options: cellOpts(true) }, { text: "discuss 及物动词", options: explainOpts() }],
    [{ text: "according to me", options: cellOpts() }, { text: "in my opinion / I believe", options: cellOpts(true) }, { text: "according to ≠ 据我说", options: explainOpts() }],
  ];

  function cellOpts(good) {
    return { fill: { color: good ? C.greenLight : C.redLight }, color: C.text, fontSize: 10, fontFace: "Calibri", valign: "middle" };
  }
  function explainOpts() {
    return { fill: { color: C.bg }, color: C.muted, fontSize: 9, fontFace: "Calibri", valign: "middle" };
  }

  s.addTable(rows, {
    x: 0.3, y: 1.15, w: 6.2,
    colW: [2.2, 2.3, 1.7],
    rowH: [0.38, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42],
    border: { pt: 0.5, color: "E0E0E0" },
  });

  // Right: Key collocations
  card(s, 6.75, 1.15, 3.0, 4.2, { accentColor: C.teal });
  s.addText("高频搭配", {
    x: 6.95, y: 1.3, w: 2.6, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.teal, bold: true, margin: 0
  });

  const colls = [
    "make a contribution\n做出贡献",
    "conduct research\n进行研究",
    "implement policies\n实施政策",
    "bridge the gap\n缩小差距",
    "address an issue\n解决问题",
    "draw a conclusion\n得出结论",
    "mitigate risks\n降低风险",
    "foster development\n促进发展",
  ];

  colls.forEach((c, i) => {
    s.addText(c, {
      x: 6.95, y: 1.75 + i * 0.42, w: 2.6, h: 0.38,
      fontSize: 10, fontFace: "Calibri", color: C.text, margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 10: Task 1 Framework
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHeader(s, "小作文通关框架", "Task 1 — 四段式就够用，Overview 是最重要的段落");

  // Four box flow
  const boxes = [
    { num: "1", title: "Introduction\n引言段", desc: "改写题目\n用同义词换掉\nwhat/where/when", words: "25-30词\n2分钟", color: C.navy },
    { num: "2", title: "Overview\n概述段 ★", desc: "2-3句总结全局趋势\n不写具体数字！\n最重要的一段", words: "30-40词\n3分钟", color: C.teal },
    { num: "3", title: "Body 1\n主体段1", desc: "第一组关键数据\n选最大值/最小值/\n拐点/突变", words: "50-60词\n5分钟", color: C.accent },
    { num: "4", title: "Body 2\n主体段2", desc: "第二组数据作对比\n使用 while/whereas\nin contrast", words: "50-60词\n5分钟", color: C.gold },
  ];

  boxes.forEach((b, i) => {
    const x = 0.25 + i * 2.42;
    card(s, x, 1.15, 2.27, 2.8, { accentColor: b.color });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.8, y: 1.3, w: 0.65, h: 0.5,
      fill: { color: b.color }, rectRadius: 0.06
    });
    s.addText(b.num, {
      x: x + 0.8, y: 1.3, w: 0.65, h: 0.5,
      fontSize: 18, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    s.addText(b.title, {
      x: x + 0.12, y: 1.95, w: 2.0, h: 0.6,
      fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, align: "center", margin: 0
    });
    s.addText(b.desc, {
      x: x + 0.12, y: 2.55, w: 2.0, h: 0.85,
      fontSize: 10.5, fontFace: "Calibri", color: C.text, align: "center", valign: "top", margin: 0
    });
    s.addText(b.words, {
      x: x + 0.12, y: 3.55, w: 2.0, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
    });
  });

  // Warning
  card(s, 0.3, 4.15, 9.4, 0.9, { accentColor: C.red });
  s.addText([
    { text: "⚠️ 小作文三大禁忌：", options: { bold: true, color: C.red } },
    { text: "  ① 不要写个人观点或解释原因，只描述数据    ② 不要罗列所有数字，只挑关键的    ③ 必须写 Overview！没有 Overview，TA 不可能上 5 分", options: {} }
  ], {
    x: 0.55, y: 4.25, w: 8.9, h: 0.7,
    fontSize: 12, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0
  });

  footer(s);
}

// ============================================================
// Slide 11: Task 1 Sentence Patterns
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "小作文趋势描述句型", "六种核心描述方向，每种记住2个句型就够用");

  const patterns = [
    { dir: "📈 上升", color: C.teal, ex: "The number increased steadily from 10% to 45%.\nThere was a sharp rise in smartphone users." },
    { dir: "📉 下降", color: C.red, ex: "The figure declined sharply, falling to just 5%.\nA noticeable drop occurred in the year 2010." },
    { dir: "➡️ 平稳", color: C.muted, ex: "The percentage remained stable at around 30%.\nThe figure stayed relatively constant." },
    { dir: "🔄 波动", color: C.gold, ex: "The data fluctuated slightly from 1990 to 2000.\nThere was a slight fluctuation throughout the period." },
    { dir: "🔺 峰值", color: C.accent, ex: "The number peaked at 85% in 2020.\nIt reached a peak of 85% before declining." },
    { dir: "🔻 谷值", color: C.navy, ex: "The figure hit a low of 10% in 2015.\nIt bottomed out at only 10% in the final year." },
  ];

  patterns.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.25 + col * 4.85;
    const y = 1.15 + row * 1.35;

    card(s, x, y, 4.65, 1.22, { accentColor: p.color });
    s.addText(p.dir, {
      x: x + 0.15, y: y + 0.08, w: 2.0, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: p.color, bold: true, margin: 0
    });
    s.addText(p.ex, {
      x: x + 0.15, y: y + 0.42, w: 4.35, h: 0.7,
      fontSize: 10, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 12: Grammar Self-Check
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHeader(s, "语法自救清单", "写完每段自查这 6 项 — 能避免 80% 的扣分");

  const checks = [
    { num: "01", title: "主谓一致", desc: "The number 后动词用单数！\nHe go → He goes", example: "The chart shows... ✓\nThe chart show... ✗" },
    { num: "02", title: "时态检查", desc: "图表写哪年就用哪个时态\n过去时间 → 过去时", example: "In 2010, the number was... ✓\nIn 2010, the number is... ✗" },
    { num: "03", title: "第三人称单数", desc: "主语是 he/she/it/单数名词\n动词后面加 -s 或 -es", example: "It increases sharply ✓\nIt increase sharply ✗" },
    { num: "04", title: "冠词不丢", desc: "单数可数名词要有 a/an/the\n可数/不可数要分清", example: "an information ✗\ninformation ✓ (不可数)" },
    { num: "05", title: "句子完整性", desc: "每句话必须有主语+谓语\n不能逗号连接两个句子", example: "I think, it is important ✗\nI think it is important ✓" },
    { num: "06", title: "三个核心复杂句", desc: "每段用1个：定语从句(which)\n状语从句(because/if)\n被动语态", example: "...which means that...\nIf...then...\n...can be seen in..." },
  ];

  checks.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.2 + col * 3.23;
    const y = 1.15 + row * 2.0;

    card(s, x, y, 3.08, 1.85, { accentColor: C.navy });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.15, y: y + 0.12, w: 0.5, h: 0.5,
      fill: { color: C.navy }
    });
    s.addText(c.num, {
      x: x + 0.15, y: y + 0.12, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0
    });
    s.addText(c.title, {
      x: x + 0.75, y: y + 0.12, w: 2.2, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, valign: "middle", margin: 0
    });
    s.addText(c.desc, {
      x: x + 0.15, y: y + 0.72, w: 2.78, h: 0.65,
      fontSize: 9.5, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: y + 1.4, w: 2.78, h: 0.01, fill: { color: "E8E8E8" } });
    s.addText(c.example, {
      x: x + 0.15, y: y + 1.45, w: 2.78, h: 0.35,
      fontSize: 8.5, fontFace: "Calibri", color: C.muted, valign: "top", margin: 0
    });
  });

  footer(s);
}

// ============================================================
// Slide 13: Study Plan
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "备考黄金计划", "从今天到考试 — 基础薄弱学生的 8 周提分方案");

  const phases = [
    { week: "第1-2周", phase: "打基础", color: C.navy, items: [
      { text: "语法", detail: "主谓一致、时态、三大核心句" },
      { text: "词汇", detail: "每天背20个话题词 + 10个搭配" },
      { text: "范文", detail: "每周精析2篇范文结构" },
    ]},
    { week: "第3-4周", phase: "学方法", color: C.teal, items: [
      { text: "小作文", detail: "四段式模板 + 趋势句型练熟" },
      { text: "大作文", detail: "PEEL段落法 + 五题型结构" },
      { text: "审题", detail: "每天分析2道真题题干" },
    ]},
    { week: "第5-6周", phase: "练实战", color: C.gold, items: [
      { text: "限时写", detail: "小作文18分钟 + 大作文40分钟" },
      { text: "自批改", detail: "用语法自查清单逐项修改" },
      { text: "找老师", detail: "每周请老师精批1-2篇" },
    ]},
    { week: "第7-8周", phase: "冲冲刺", color: C.red, items: [
      { text: "模考", detail: "严格限时模拟，每周2套" },
      { text: "复习", detail: "翻看自己写过的修改稿" },
      { text: "心态", detail: "考场时间分配要果断" },
    ]},
  ];

  phases.forEach((p, i) => {
    const x = 0.2 + i * 2.42;
    card(s, x, 1.15, 2.27, 3.9, { accentColor: p.color });
    s.addText(p.week, {
      x: x + 0.12, y: 1.25, w: 2.0, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.muted, margin: 0
    });
    s.addText(p.phase, {
      x: x + 0.12, y: 1.55, w: 2.0, h: 0.4,
      fontSize: 20, fontFace: "Calibri", color: p.color, bold: true, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.12, y: 2.0, w: 1.2, h: 0.02, fill: { color: p.color } });

    p.items.forEach((item, j) => {
      const iy = 2.2 + j * 0.85;
      s.addText([
        { text: item.text, options: { bold: true, fontSize: 12, color: C.navy, breakLine: true } },
        { text: item.detail, options: { fontSize: 10, color: C.text } }
      ], {
        x: x + 0.12, y: iy, w: 2.0, h: 0.7,
        fontFace: "Calibri", valign: "top", margin: 0
      });
    });
  });

  footer(s, "雅思写作教学课件  |  关键原则：一篇文章改3遍 > 写3篇新文章");
}

// ============================================================
// Slide 14: Conclusion
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.navyDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });

  s.addText("雅思写作的本质不是炫技", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
  });
  s.addText("而是让考官挑不出扣分的理由", {
    x: 0.8, y: 1.65, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: "A0C4D0", align: "center", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: 2.35, w: 4, h: 0.02, fill: { color: C.teal } });

  const takeaways = [
    { label: "审题", desc: "先看清题型\n绝不跑题" },
    { label: "结构", desc: "四段式/PEEL\n先搭好骨架" },
    { label: "准确", desc: "简单句全对\n胜过复杂句全错" },
    { label: "修改", desc: "一篇文章改3遍\n改>写" },
  ];

  takeaways.forEach((t, i) => {
    const x = 0.5 + i * 2.35;
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.6, y: 2.65, w: 0.8, h: 0.8,
      fill: { color: C.navy }
    });
    s.addText(t.label, {
      x: x + 0.6, y: 2.65, w: 0.8, h: 0.8,
      fontSize: 14, fontFace: "Calibri", color: C.gold, align: "center", valign: "middle", bold: true, margin: 0
    });
    s.addText(t.desc, {
      x: x, y: 3.6, w: 2.35, h: 0.65,
      fontSize: 11, fontFace: "Calibri", color: "B0C8D0", align: "center", margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.45, w: 8.4, h: 0.01, fill: { color: C.muted } });

  s.addText("Task Response  +  Coherence  +  Lexical Resource  +  Grammar  =  Your Band Score", {
    x: 0.8, y: 4.6, w: 8.4, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: C.gold, align: "center", margin: 0
  });
  s.addText("数据来源: British Council · IDP IELTS · 新东方 · 新航道 · Magoosh · IELTS.org", {
    x: 0.8, y: 5.15, w: 8.4, h: 0.25,
    fontSize: 8, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });
}

// Write
pres.writeFile({ fileName: "d:/ideas/雅思写作全攻略.pptx" }).then(() => {
  console.log("Done: 雅思写作全攻略.pptx");
}).catch(err => {
  console.error("Error:", err);
});
