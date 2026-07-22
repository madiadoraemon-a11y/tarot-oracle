const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "IELTS Teacher";
pres.title = "雅思写作话题词汇与范文拆解";

// Color palette
const C = {
  navy: "1A5276", navyDark: "0D354F", teal: "148F77", tealLight: "D1F2EB",
  white: "FFFFFF", bg: "F8F9FA", text: "2C3E50", muted: "7F8C8D",
  red: "C0392B", redLight: "FDEDEC", green: "27AE60", greenLight: "EAFAF1",
  gold: "D4A017", goldLight: "FEF9E7", accent: "2980B9", accentLight: "EBF5FB",
  edu: "2E86C1", env: "27AE60", tech: "8E44AD", soc: "E67E22",
  crime: "C0392B", gov: "1A5276", health: "148F77"
};

const makeShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 });

function sectionHdr(s, title, subtitle) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.05, fill: { color: C.teal } });
  s.addText(title, { x: 0.4, y: 0.15, w: 9.2, h: 0.45, fontSize: 24, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  if (subtitle) s.addText(subtitle, { x: 0.4, y: 0.55, w: 9.2, h: 0.28, fontSize: 11, fontFace: "Calibri", color: C.muted, margin: 0 });
}

function topicBadge(s, x, y, label, color) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.0, h: 0.32, fill: { color }, rectRadius: 0.05 });
  s.addText(label, { x, y, w: 1.0, h: 0.32, fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
}

function vocabCard(s, x, y, w, h, title, items, color) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.white }, shadow: makeShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.05, fill: { color } });
  s.addText(title, { x: x + 0.12, y: y + 0.12, w: w - 0.24, h: 0.32, fontSize: 13, fontFace: "Calibri", color, bold: true, margin: 0 });
  s.addText(items, { x: x + 0.12, y: y + 0.48, w: w - 0.24, h: h - 0.6, fontSize: 9.5, fontFace: "Calibri", color: C.text, valign: "top", margin: 0 });
}

// ============================================================
// Slide 1: Title
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.navyDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.05, fill: { color: C.teal } });
  s.addText("雅思写作话题词汇\n与 6-7 分范文拆解", {
    x: 0.8, y: 0.9, w: 8.4, h: 1.6,
    fontSize: 40, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 2.65, w: 3, h: 0.02, fill: { color: C.teal } });
  s.addText([
    { text: "7大话题  ·  核心词汇+搭配  ·  PEEL逐句拆解  ·  Band 6 vs 7 对比", options: { color: C.gold } }
  ], { x: 0.8, y: 2.9, w: 8.4, h: 0.45, fontSize: 13, fontFace: "Calibri", align: "center", margin: 0 });
  s.addText("适用于：基础薄弱 → 稳拿6.5分  |  教师备课参考  |  学生自学提升", {
    x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });
}

// ============================================================
// Slide 2: 7 Topics Overview
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHdr(s, "七大话题概览", "2025年IELTS Writing Task 2 高频话题分布");

  const topics = [
    { label: "教育\nEducation", pct: "~29%", color: C.edu, desc: "最常考！在线学习、考试制度、家校责任" },
    { label: "科技\nTechnology", pct: "~26%", color: C.tech, desc: "AI影响、屏幕时间、数字化沟通" },
    { label: "环境\nEnvironment", pct: "~15%", color: C.env, desc: "气候变化、污染治理、可持续发展" },
    { label: "社会\nSociety", pct: "~12%", color: C.soc, desc: "城市化、贫富差距、人口老龄化" },
    { label: "健康\nHealth", pct: "~7%", color: C.health, desc: "肥胖、心理健康、医疗资源" },
    { label: "政府\nGovernment", pct: "~6%", color: C.gov, desc: "公共支出、政策制定、基础设施" },
    { label: "犯罪\nCrime", pct: "~5%", color: C.crime, desc: "再犯率、改造教育、社区警务" },
  ];

  topics.forEach((t, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.2 + col * 2.42;
    const y = 1.05 + row * 2.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.27, h: 1.85, fill: { color: C.white }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.27, h: 0.05, fill: { color: t.color } });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.65, y: y + 0.2, w: 0.95, h: 0.32, fill: { color: t.color }, rectRadius: 0.05 });
    s.addText(t.pct, { x: x + 0.65, y: y + 0.2, w: 0.95, h: 0.32, fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(t.label, { x: x + 0.1, y: y + 0.65, w: 2.07, h: 0.6, fontSize: 15, fontFace: "Calibri", color: C.navy, bold: true, align: "center", margin: 0 });
    s.addText(t.desc, { x: x + 0.1, y: y + 1.25, w: 2.07, h: 0.5, fontSize: 9, fontFace: "Calibri", color: C.muted, align: "center", valign: "top", margin: 0 });
  });

  s.addText("每页包含：核心名词 + 动词搭配 + 形容词搭配 + 模板句型 → 直接用于写作", {
    x: 0.4, y: 5.2, w: 9.2, h: 0.3, fontSize: 9, fontFace: "Calibri", color: C.teal, align: "center", margin: 0
  });
}

// ============================================================
// Slide 3: 教育类 — Vocab
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "教育 Education", C.edu);
  sectionHdr(s, "教育类 — 核心词汇与搭配", "");

  vocabCard(s, 0.25, 0.85, 3.1, 4.25,
    "核心名词 Nouns",
    "curriculum 课程大纲\nsyllabus 教学大纲\nacademic performance 学业表现\nscholarship 奖学金\ntertiary / higher education 高等教育\nvocational training 职业培训\nliteracy rate 识字率\nwell-rounded development 全面发展\ncritical thinking 批判性思维\ndistance learning 远程教育\nself-directed learning 自主学习\neducational equity 教育公平",
    C.edu);

  vocabCard(s, 3.45, 0.85, 3.1, 4.25,
    "动词搭配 Verb + Noun",
    "pursue a degree 攻读学位\nacquire knowledge/skills 获取知识\nbroaden one's horizons 开阔视野\nfall behind (in studies) 掉队\nmeet a deadline 按时完成\ntake/sit an exam 参加考试\nattend a course 参加课程\nenroll in a program 报读\nfoster creativity 培养创造力\npromote independent thinking\nencourage self-discipline",
    C.edu);

  vocabCard(s, 6.65, 0.85, 3.1, 4.25,
    "形容词搭配 + 模板句",
    "compulsory education 义务教育\nelective subjects 选修课\ngifted and talented 有天赋的\nacademic discipline 学术纪律\nequal opportunities 平等机会\n\n模板句：\n\"The unequal distribution of educational\nresources emphasizes that governments\nshould ensure educational equity.\"\n\n\"Online education brings convenience\nbut raises concerns about self-discipline.\"",
    C.edu);
}

// ============================================================
// Slide 4: 教育类 — Essay Breakdown
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "教育 Education", C.edu);
  sectionHdr(s, "教育类 — Band 7 范文拆解", "题目: Technology in education — positive or negative? Discuss both views.");

  // Essay left side with annotations
  const essayText = "Introduction:\n" +
    "Technology has become an integral part of education. While some believe it greatly enhances learning effectiveness, others argue it can be detrimental. This essay will examine both perspectives before reaching a conclusion.\n\n" +
    "Body 1 — Positive View:\n" +
    "On the one hand, technology provides students with unparalleled access to information. For instance, platforms like Khan Academy and Coursera offer free, high-quality lessons to anyone with an internet connection. Furthermore, adaptive learning apps can personalise exercises based on individual student performance, helping learners progress at their own pace.\n\n" +
    "Body 2 — Negative View:\n" +
    "On the other hand, over-reliance on technology can undermine critical thinking. When students use online calculators instead of mental math, they may lose essential problem-solving skills. Additionally, digital devices are a constant source of distraction — social media notifications frequently interrupt study sessions.\n\n" +
    "Conclusion:\n" +
    "In my opinion, while technology has undeniable drawbacks, its benefits outweigh the negatives when implemented under proper teacher supervision. The key is balance, not replacement.";

  s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 0.82, w: 5.5, h: 4.35, fill: { color: C.bg } });
  s.addText(essayText, {
    x: 0.35, y: 0.88, w: 5.2, h: 4.22,
    fontSize: 8.5, fontFace: "Consolas", color: C.text, valign: "top", margin: 0
  });

  // Right side annotations
  const annotations = [
    { y: 0.82, color: C.teal, title: "Intro分析", text: "改写题目(paraphrase) — integral part / enhances / detrimental\n明确结构 — This essay will examine...\n立场放在Conclusion才亮明 — 讨论类做法\nBand 7 词汇: integral, detrimental, examine perspectives" },
    { y: 1.92, color: C.green, title: "Body 1 亮点", text: "具体例子! Khan Academy / Coursera — 比说'many websites'强\nPEEL完整: Point→Explain(anyone with internet)→Example→Link\n搭配: unparalleled access, adaptive learning, at one's own pace" },
    { y: 2.82, color: C.red, title: "Body 2 亮点", text: "让步+反驳结构 — 承认技术好但有问题\n具体对比: online calculators vs mental math — 简单而有效\n搭配: undermine critical thinking, constant source of, disrupt study" },
    { y: 3.92, color: C.gold, title: "提升到 Band 7+ 的关键", text: "1. 替换'The key is balance' → 'Striking a careful balance is crucial'\n2. 加一个条件句: 'Were technology to replace teachers entirely...'\n3. 结尾段不要完全重复Intro, 要有新意" },
  ];

  annotations.forEach(a => {
    s.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: a.y, w: 3.85, h: 1.05, fill: { color: C.white }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: a.y, w: 0.05, h: 1.05, fill: { color: a.color } });
    s.addText(a.title, {
      x: 6.1, y: a.y + 0.05, w: 3.5, h: 0.22, fontSize: 10, fontFace: "Calibri", color: a.color, bold: true, margin: 0
    });
    s.addText(a.text, {
      x: 6.1, y: a.y + 0.28, w: 3.5, h: 0.72, fontSize: 8, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
  });
}

// ============================================================
// Slide 5: 科技类 — Vocab
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "科技 Technology", C.tech);
  sectionHdr(s, "科技类 — 核心词汇与搭配", "");

  vocabCard(s, 0.25, 0.85, 4.6, 4.25,
    "核心名词与词组",
    "artificial intelligence (AI) 人工智能\nautomation 自动化\ndigital divide 数字鸿沟\ncybersecurity 网络安全\ndata privacy 数据隐私\ntechnological advancement 科技进步\ndigital innovation 数字创新\ne-commerce 电子商务\nsocial media influence 社交媒体影响\nalgorithmic bias 算法偏见\nscreen time 屏幕时间\ninformation dissemination 信息传播",
    C.tech);

  vocabCard(s, 5.15, 0.85, 4.6, 4.25,
    "动词搭配 + 模板句型",
    "access information 获取信息\nbridge the digital divide 弥合数字鸿沟\nenhance efficiency 提高效率\nreshape the sector 重塑行业\nraise concerns about... 引发对...的担忧\nimprove productivity 提高生产力\nautomate routine tasks 自动化常规任务\n\n模板句：\n\"AI is transforming industries such as\nhealthcare and manufacturing, but it also\nraises concerns about data privacy.\"\n\n\"Over-reliance on the internet may lead\nto the loss of face-to-face communication.\"",
    C.tech);
}

// ============================================================
// Slide 6: 科技类 — Band 6 vs Band 7 comparison
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "科技 Technology", C.tech);
  sectionHdr(s, "科技类 — Band 6 vs Band 7 同题对比", "同一话题，差0.5分到底差在哪？逐项解剖");

  const rows = [
    [
      { text: "维度", options: hdr() },
      { text: "Band 6 写法", options: hdr() },
      { text: "Band 7 写法", options: hdr() },
      { text: "差距在哪", options: hdr() },
    ],
    [
      { text: "词汇\nLexical", options: lCol() },
      { text: "Digital technology has\nhelped many people\nget education.", options: cell(C.redLight) },
      { text: "Digital technology has\ngreatly improved access\nto education globally.", options: cell(C.greenLight) },
      { text: "\"helped...get\" → \"improved\naccess\"|\"many people\" →\n\"globally\"|多用一个副词\ngreatly 就拉开差距", options: explain() },
    ],
    [
      { text: "举例\nExamples", options: lCol() },
      { text: "many free websites\nhelp students learn.", options: cell(C.redLight) },
      { text: "platforms like Khan\nAcademy and Coursera\noffer free courses.", options: cell(C.greenLight) },
      { text: "Named examples!\n具体名字 > 抽象描述\n考官会直接在这一项\n多给0.5分", options: explain() },
    ],
    [
      { text: "衔接\nCohesion", options: lCol() },
      { text: "Also, ... But, ...\nSo, ... Also, ...", options: cell(C.redLight) },
      { text: "Furthermore, ...\nHowever, ...\nConsequently, ...", options: cell(C.greenLight) },
      { text: "Also/But/So 过于重复\n用 Furthermore, However,\nConsequently 替换\n每段至少2种不同连接词", options: explain() },
    ],
    [
      { text: "句型\nGrammar", options: lCol() },
      { text: "Technology is good.\nIt helps students.\nThey can learn fast.", options: cell(C.redLight) },
      { text: "While technology offers\nclear benefits, it should\nbe used with caution.", options: cell(C.greenLight) },
      { text: "简单句→复合句\n从句(While/Although)\n条件句(If...then...)\n被动语态(can be used)", options: explain() },
    ],
  ];

  function hdr() { return { fill: { color: C.tech }, color: C.white, bold: true, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" }; }
  function lCol() { return { fill: { color: C.bg }, color: C.navy, bold: true, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" }; }
  function cell(fill) { return { fill: { color: fill }, color: C.text, fontSize: 10, fontFace: "Calibri", align: "center", valign: "middle" }; }
  function explain() { return { fill: { color: C.white }, color: C.teal, fontSize: 9, fontFace: "Calibri", valign: "middle" }; }

  s.addTable(rows, {
    x: 0.2, y: 0.82, w: 9.6,
    colW: [1.0, 2.5, 2.8, 3.3],
    rowH: [0.38, 0.85, 0.85, 0.85, 0.85],
    border: { pt: 0.5, color: "D0D0D0" }
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 4.55, w: 9.6, h: 0.55, fill: { color: C.goldLight } });
  s.addText([
    { text: "核心结论：", options: { bold: true, color: C.red } },
    { text: "Band 6→7 不需要写出花来。做好三件事：①具体例子(命名!) ②换掉Also/But ③每段用1个复合句。这就够了。", options: { color: C.text } }
  ], {
    x: 0.4, y: 4.58, w: 9.2, h: 0.5, fontSize: 11, fontFace: "Calibri", valign: "middle", margin: 0
  });
}

// ============================================================
// Slide 7: 环境类 — Vocab
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "环境 Environment", C.env);
  sectionHdr(s, "环境类 — 核心词汇与搭配", "");

  vocabCard(s, 0.25, 0.85, 4.6, 1.95,
    "名词与短语",
    "climate change / global warming 气候变化\ncarbon emissions / carbon footprint 碳排放/碳足迹\nrenewable energy sources 可再生能源\nenvironmental degradation 环境退化\nbiodiversity loss 生物多样性丧失\nsustainable development 可持续发展\neco-friendly / sustainability / conservation",
    C.env);

  vocabCard(s, 5.15, 0.85, 4.6, 1.95,
    "动词搭配",
    "combat / tackle climate change 应对气候变化\nreduce carbon emissions 减少碳排放\ninvest in renewable energy 投资可再生能源\nraise awareness 提高意识\npose a threat 构成威胁\nimplement stringent regulations 实施严格法规\nadopt sustainable practices 采取可持续做法",
    C.env);

  vocabCard(s, 0.25, 2.95, 9.5, 2.2,
    "Band 6 → Band 7 表达升级 + 模板句型",
    "pollution → environmental contamination · dirty air → toxic emissions · cutting trees → deforestation\nanimals dying → species extinction · green energy → sustainable/renewable energy sources\n\n模板句：\n\"Governments should invest in renewable energy to combat climate change and reduce carbon emissions.\"\n\"Deforestation not only reduces carbon absorption but also leads to soil erosion and potential extinction of species.\"",
    C.env);
}

// ============================================================
// Slide 8: 环境类 — Essay Breakdown
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "环境 Environment", C.env);
  sectionHdr(s, "环境类 — Band 7 范文拆解", "题目: Environmental damage — causes and solutions. (2025高频)");

  // Essay text
  const envEssay = `"Environmental damage has become a pressing issue worldwide. The main causes relate to human expansion and industry and must therefore be tackled by relevant authorities."

Causes Paragraph:
"The factors contributing to environmental damage stem from human activity. Firstly, industrial activities and the burning of fossil fuels release harmful emissions into the atmosphere, leading to climate change. For instance, the excessive use of coal in power generation contributes significantly to rising temperatures. Secondly, deforestation, driven by logging and agricultural expansion, destroys crucial ecosystems. The loss of forests not only reduces carbon absorption but also leads to soil erosion and the endangerment of species."

Solutions Paragraph:
"To address this requires a multifaceted approach. Governments should implement stringent environmental regulations and promote sustainable practices across industries. For example, imposing strict emission standards on factories and incentivising renewable energy can significantly reduce air pollution. Relatedly, funding reforestation programmes can help restore vital ecosystems. These solutions should be applied together with companies involved in environmental degradation."`;

  s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 0.82, w: 5.6, h: 4.35, fill: { color: C.bg } });
  s.addText(envEssay, {
    x: 0.35, y: 0.88, w: 5.3, h: 4.22,
    fontSize: 9, fontFace: "Consolas", color: C.text, valign: "top", margin: 0
  });

  // Right annotations
  const envAnn = [
    { y: 0.82, h: 1.0, color: C.teal, title: "Intro + 高光句型", text: "✧ 'pressing issue' — 替换 important problem\n✧ 'stem from' — 源自，替换 come from\n✧ 'must therefore be tackled by' — 被动语态加分\n✧ 因果关系清晰: cause → must be tackled" },
    { y: 1.92, h: 1.35, color: C.red, title: "Causes段 逐句拆解", text: "P: factors contributing to... stem from human activity\nE1: fossil fuels → emissions → climate change (因果链!)\nE1例: excessive use of coal in power generation (具体!)\nE2: deforestation → destroys ecosystems → soil erosion\nL: not only...but also... → 并列复杂句加分\nBand 7特征: harmful emissions, crucial ecosystems,\ncarbon absorption, endangerment — 精准话题词" },
    { y: 3.37, h: 1.05, color: C.green, title: "Solutions段 亮点", text: "P: multifaceted approach (−1词替换 many solutions)\nE1: stringent regulations + incentivising (精准动词!)\n例: emission standards + renewable energy\nL: applied together with companies — 多方协作意识\nBand 7特征: 方案具体、可操作、不空洞" },
    { y: 4.52, h: 0.65, color: C.gold, title: "值得记住的句式", text: "★ not only...but also... ★ stem from ★ requires a multifaceted approach ★ should be applied together with" },
  ];

  envAnn.forEach(a => {
    s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: a.y, w: 3.75, h: a.h, fill: { color: C.white }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: a.y, w: 0.05, h: a.h, fill: { color: a.color } });
    s.addText(a.title, {
      x: 6.2, y: a.y + 0.05, w: 3.4, h: 0.22, fontSize: 10, fontFace: "Calibri", color: a.color, bold: true, margin: 0
    });
    s.addText(a.text, {
      x: 6.2, y: a.y + 0.28, w: 3.4, h: a.h - 0.33, fontSize: 8, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
    });
  });
}

// ============================================================
// Slide 9: 社会类 — Vocab
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "社会 Society", C.soc);
  sectionHdr(s, "社会类 — 核心词汇与搭配", "人口 · 城市 · 贫富 · 文化");

  vocabCard(s, 0.25, 0.85, 4.6, 2.0,
    "核心名词",
    "social cohesion 社会凝聚力\nsocial inequality / wealth gap 社会不平等/贫富差距\naging population 人口老龄化\nurbanization 城市化\ndemographic changes 人口结构变化\nsocial mobility 社会流动性\npublic services 公共服务\ncommunity bonding 社区纽带",
    C.soc);

  vocabCard(s, 5.15, 0.85, 4.6, 2.0,
    "动词搭配 + 模板句",
    "bridge the wealth gap 缩小贫富差距\npromote social cohesion 促进社会凝聚\naddress social inequality 解决社会不平等\nimprove living standards 提高生活水平\n\n模板句：\n\"The widening wealth gap threatens social\nstability and may lead to the spread of\nsocial dissatisfaction.\"",
    C.soc);

  vocabCard(s, 0.25, 3.0, 9.5, 2.1,
    "2025年社会类高频子话题 + 搭配",
    "人口老龄化 aging population — put pressure on healthcare systems · elderly care services · raise the retirement age · pension burden\n城市化 urbanization — rural-to-urban migration · strain on infrastructure · affordable housing shortage · urban planning\n贫富差距 wealth gap — income disparity · equal opportunities · redistributive policies · social safety nets\n文化 globalization — cultural homogenization · preserve cultural identity · cross-cultural communication · cultural heritage",
    C.soc);
}

// ============================================================
// Slide 10: 健康 + 政府 — Vocab combo
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "健康 Health", C.health);
  topicBadge(s, 3.5, 0.18, "政府 Government", C.gov);
  sectionHdr(s, "健康类 + 政府类 — 核心词汇与搭配", "");

  vocabCard(s, 0.25, 0.85, 4.6, 4.25,
    "健康 Health",
    "public health system 公共卫生体系\nsedentary lifestyle 久坐生活方式\nbalanced diet 均衡饮食\nmental well-being 心理健康\npreventive measures 预防措施\nlife expectancy 预期寿命\nhealthcare accessibility 医疗可及性\nlifestyle diseases 生活方式疾病\nnutrition and diet 营养与饮食\nphysical activity / fitness 体育锻炼\nvaccination programs 疫苗接种\n\n模板句：\n\"Promoting healthy diets and physical\nactivity is essential to reduce diseases\nlinked to a sedentary lifestyle.\"",
    C.health);

  vocabCard(s, 5.15, 0.85, 4.6, 4.25,
    "政府 Government",
    "government intervention 政府干预\nallocate resources 分配资源\npublic expenditure 公共支出\ntaxpayers' money 纳税人的钱\ninfrastructure investment 基础设施投资\nregulatory framework 监管框架\nfiscal policy 财政政策\nsocial welfare 社会福利\npolicy implementation 政策实施\nnational priorities 国家优先事项\npublic services 公共服务\n\n模板句：\n\"Governments should allocate resources\nwisely to maximize social benefits.\"\n\n\"Public money should be used to address\nfundamental needs such as healthcare\nand education.\"",
    C.gov);
}

// ============================================================
// Slide 11: 犯罪类 — Vocab + Essay sample
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  topicBadge(s, 0.4, 0.18, "犯罪 Crime", C.crime);
  sectionHdr(s, "犯罪类 — 核心词汇与 Band 7 范文拆解", "");

  vocabCard(s, 0.25, 0.82, 4.5, 2.15,
    "核心词汇",
    "recidivism rate 再犯率\njuvenile delinquency 青少年犯罪\nrehabilitation programmes 改造项目\nlaw enforcement 执法\nroot causes of crime 犯罪根源\npunitive measures 惩罚措施\ndeterrent effect 威慑作用\nreintegration into society 重新融入社会\nrestorative justice 恢复性司法\ncustodial sentence 监禁判决\ncommunity service 社区服务",
    C.crime);

  // Essay sample
  const crimeEssay = `Topic: Prison is not the best solution to crime. Education and job training are better. To what extent do you agree?

Sample (Band 7):
"While imprisonment remains the predominant approach to crime, I strongly agree that education and vocational training offer more effective long-term solutions.

Prison alone often fails because it does not address the root causes of criminal behaviour. Many offenders come from disadvantaged backgrounds with limited access to education and employment. Without acquiring marketable skills, they are likely to reoffend upon release — which explains the high recidivism rates worldwide.

By contrast, educational programmes equip inmates with literacy, numeracy, and vocational skills. For example, in Norway, prisoners who complete job training have a recidivism rate of only 20%, compared to over 50% in systems relying solely on incarceration. This demonstrates that addressing the underlying causes is far more effective.

In conclusion, while prisons are necessary for serious crimes, a greater emphasis on rehabilitation through education can break the cycle of reoffending and create safer communities."`;

  s.addShape(pres.shapes.RECTANGLE, { x: 4.95, y: 0.82, w: 4.8, h: 4.35, fill: { color: C.bg } });
  s.addText(crimeEssay, {
    x: 5.08, y: 0.88, w: 4.55, h: 4.22,
    fontSize: 7.8, fontFace: "Consolas", color: C.text, valign: "top", margin: 0
  });

  // Annotations below vocab
  s.addShape(pres.shapes.RECTANGLE, { x: 0.25, y: 3.1, w: 4.5, h: 2.05, fill: { color: C.goldLight } });
  s.addText("范文亮点拆解", {
    x: 0.4, y: 3.18, w: 4.2, h: 0.25, fontSize: 12, fontFace: "Calibri", color: C.crime, bold: true, margin: 0
  });
  s.addText([
    { text: "• predominant approach — ", options: { bold: true, color: C.teal } }, { text: "替换 main way\n", options: {} },
    { text: "• root causes / disadvantaged backgrounds — ", options: { bold: true, color: C.teal } }, { text: "论证深度来源\n", options: {} },
    { text: "• marketable skills / reoffend / recidivism — ", options: { bold: true, color: C.teal } }, { text: "话题精准词\n", options: {} },
    { text: "• 挪威复犯率对比 — ", options: { bold: true, color: C.red } }, { text: "具体数据! Band 7必备的论证\n", options: {} },
    { text: "• underlying causes / break the cycle — ", options: { bold: true, color: C.teal } }, { text: "简洁而有力", options: {} },
  ], {
    x: 0.4, y: 3.5, w: 4.2, h: 1.5,
    fontSize: 9.5, fontFace: "Calibri", color: C.text, valign: "top", margin: 0
  });
}

// ============================================================
// Slide 12: PEEL逐句拆解 — 一张图看懂
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHdr(s, "PEEL 逐句拆解 — 一张图看懂一个 Body 段", "Topic: Why should governments invest in public transport? (Band 7)");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.95, w: 9.4, h: 4.2, fill: { color: C.white }, shadow: makeShadow() });

  const peelParts = [
    { label: "P", full: "Point", x: 0.5, color: C.navy, sentence: "Firstly, investing in public transport is one of the most effective ways to reduce urban air pollution.", comment: "→ 主题句直接回答问题，一句话亮明论点\n→ 'one of the most effective ways' — 语气适中不绝对" },
    { label: "E", full: "Explain", x: 0.5, color: C.teal, sentence: "This is because private vehicles, particularly older diesel cars, emit large quantities of harmful gases such as carbon monoxide and nitrogen oxides. When a well-designed public transit system provides a convenient alternative, fewer people need to drive, leading to a significant reduction in overall emissions.", comment: "→ This is because... 引出原因解释\n→ 因果链: public transit → fewer cars → fewer emissions\n→ 精准词: emit, harmful gases, convenient alternative" },
    { label: "E", full: "Example", x: 0.5, color: C.gold, sentence: "For instance, after London introduced its Ultra Low Emission Zone and expanded its underground network, nitrogen dioxide levels dropped by 44% in the city centre within three years.", comment: "→ 具体命名: London + ULEZ + 44% — 真实可查的数据\n→ Band 7 关键: 有地点、有名称、有数字" },
    { label: "L", full: "Link", x: 0.5, color: C.red, sentence: "Therefore, government funding for public transport is not merely a transport policy — it is fundamentally an environmental and public health investment.", comment: "→ Therefore 回扣主题\n→ 'not merely...it is fundamentally...' — 修辞升级\n→ 升华: transport policy → environmental + health investment" },
  ];

  peelParts.forEach((p, i) => {
    const y = 1.08 + i * 1.02;
    // Label badge
    s.addShape(pres.shapes.RECTANGLE, { x: p.x, y, w: 0.55, h: 0.45, fill: { color: p.color }, rectRadius: 0.05 });
    s.addText(p.label, { x: p.x, y, w: 0.55, h: 0.45, fontSize: 18, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(p.full, { x: p.x + 0.62, y: y + 0.02, w: 0.7, h: 0.4, fontSize: 9, fontFace: "Calibri", color: p.color, bold: true, margin: 0 });
    // Sentence
    s.addText(p.sentence, { x: p.x + 1.5, y: y + 0.02, w: 7.8, h: 0.45, fontSize: 10.5, fontFace: "Consolas", color: C.text, valign: "middle", margin: 0 });
    // Comment
    s.addText(p.comment, { x: p.x + 1.5, y: y + 0.5, w: 7.8, h: 0.45, fontSize: 8.5, fontFace: "Calibri", color: C.muted, italic: true, valign: "top", margin: 0 });
  });
}

// ============================================================
// Slide 13: PEEL继续 — Quality checking
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHdr(s, "学生常见PEEL问题 & 修复方案", "看完范文之后，学生自己写最容易犯的四个错");

  const problems = [
    { title: "P写得太宽泛", bad: "Technology is very important in our lives.", good: "Technology has become an indispensable tool in modern education.", fix: "把话题关键词(education)放进去，用具体形容词(indispensable)替换very important" },
    { title: "E跳过直接举例", bad: "This is because many students use phones. For example, my friend uses his phone every day.", good: "This means that with easy access to unlimited information, students can supplement classroom learning with online resources at any time.", fix: "E必须解释「为什么」再用「例如」引出。用This means that.../The reason is that...强制自己写解释" },
    { title: "Example太模糊", bad: "Many countries have done this successfully.", good: "Singapore's Land Transport Authority, for instance, reported a 15% increase in public transport usage after introducing dynamic pricing in 2020.", fix: "必须有:哪个国家/城市 + 什么组织/机构 + 什么数据 + 哪一年。编也可以但要合理具体。" },
    { title: "L只是重复P", bad: "So technology is indeed very important.", good: "Thus, when implemented strategically, technology does not replace teachers — it amplifies their impact.", fix: "L要升华，不要重复。用Thus/Therefore + 换个角度重新表达 + 可以加一个更大的意义" },
  ];

  problems.forEach((p, i) => {
    const y = 0.95 + i * 1.08;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.98, fill: { color: C.bg } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.05, h: 0.98, fill: { color: C.red } });
    s.addText(p.title, {
      x: 0.5, y: y + 0.05, w: 2.6, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.red, bold: true, margin: 0
    });
    s.addText("✗ " + p.bad, {
      x: 0.5, y: y + 0.32, w: 4.2, h: 0.32, fontSize: 8.5, fontFace: "Consolas", color: C.red, margin: 0
    });
    s.addText("✓ " + p.good, {
      x: 4.8, y: y + 0.32, w: 4.6, h: 0.32, fontSize: 8.5, fontFace: "Consolas", color: C.green, margin: 0
    });
    s.addText("Fix: " + p.fix, {
      x: 0.5, y: y + 0.68, w: 8.9, h: 0.28, fontSize: 9, fontFace: "Calibri", color: C.teal, margin: 0
    });
  });
}

// ============================================================
// Slide 14: Band 6→7 自查清单
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionHdr(s, "学生自查清单 — 写完文章逐项对照", "每项做到了就✓，没做到就改 — 这是从6分到7分最快的路");

  const checklist = [
    { cat: "TR", q: "立场是否从开头到结尾保持一致？", detail: "开头说agree but...结尾说I strongly agree → 自相矛盾！选一边站到底" },
    { cat: "TR", q: "每个主体段有没有具体例子？", detail: "没有具体例子的论点 = 没写完。地名/机构名/数据/年份，至少有一个" },
    { cat: "CC", q: "连接词是否多样化？", detail: "检查: 用了几个Also? 超过1个就要换。用Furthermore/Moreover/In addition替换" },
    { cat: "CC", q: "每段是否只讲一个主题？", detail: "一段里出现first...second...third...说明该拆成两段" },
    { cat: "LR", q: "题目关键词是否全换了？", detail: "题目里的词不能在文章里原样出现超过1次(除了专有名词)。用paraphrase" },
    { cat: "LR", q: "有没有用至少3个话题搭配？", detail: "找一下: make a decision / pose a threat / bridge the gap — 有3个以上吗？" },
    { cat: "GRA", q: "简单句有没有语法错误？", detail: "逐句检查: 主谓一致? 三单+s? 过去时-ed? 冠词a/an/the?" },
    { cat: "GRA", q: "每段是否有一个复杂句？", detail: "至少: 1个定语从句(which/that) + 1个状语从句(While/Although/Because) + 1个被动语态" },
  ];

  checklist.forEach((c, i) => {
    const x = 0.2 + (i % 2) * 4.85;
    const y = 0.95 + Math.floor(i / 2) * 1.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.65, h: 0.95, fill: { color: C.white }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 0.95, fill: { color: C.navy } });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.18, y: y + 0.08, w: 0.42, h: 0.28, fill: { color: C.navy }, rectRadius: 0.04 });
    s.addText(c.cat, { x: x + 0.18, y: y + 0.08, w: 0.42, h: 0.28, fontSize: 8, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(c.q, { x: x + 0.7, y: y + 0.06, w: 3.7, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
    s.addText(c.detail, { x: x + 0.7, y: y + 0.38, w: 3.7, h: 0.5, fontSize: 9, fontFace: "Calibri", color: C.muted, valign: "top", margin: 0 });
  });
}

// ============================================================
// Slide 15: Quick Reference Table — All Topics
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHdr(s, "话题词汇快速索引", "七个话题，每个话题 10 个最核心的搭配 — 打印出来贴墙上");

  const refData = [
    { topic: "教育 Edu", color: C.edu, words: "acquire knowledge · broaden horizons · pursue a degree · lifelong learning · critical thinking · tertiary education · vocational training · academic achievement · compulsory education · well-rounded development" },
    { topic: "科技 Tech", color: C.tech, words: "artificial intelligence · digital divide · data privacy · enhance efficiency · bridge the gap · technological advancement · over-reliance on · access information · social media influence · screen time" },
    { topic: "环境 Env", color: C.env, words: "climate change · carbon emissions · renewable energy · environmental degradation · sustainable development · combat/tackle pollution · biodiversity loss · carbon footprint · raise awareness · eco-friendly" },
    { topic: "社会 Soc", color: C.soc, words: "social cohesion · wealth gap · aging population · urbanization · social mobility · demographic changes · social inequality · living standards · community bonding · public services" },
    { topic: "健康 Hlth", color: C.health, words: "public health · sedentary lifestyle · balanced diet · mental well-being · preventive measures · life expectancy · healthcare accessibility · lifestyle diseases · physical activity · vaccination" },
    { topic: "政府 Gov", color: C.gov, words: "allocate resources · public expenditure · government intervention · regulatory framework · infrastructure investment · social welfare · taxpayers' money · policy implementation · national priorities · fiscal policy" },
    { topic: "犯罪 Crime", color: C.crime, words: "recidivism rate · juvenile delinquency · rehabilitation programmes · law enforcement · root causes · punitive measures · deterrent effect · reintegration · restorative justice · community service" },
  ];

  refData.forEach((r, i) => {
    const y = 0.85 + i * 0.65;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y, w: 1.15, h: 0.55, fill: { color: r.color }, rectRadius: 0.05 });
    s.addText(r.topic, { x: 0.2, y, w: 1.15, h: 0.55, fontSize: 10, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(r.words, { x: 1.45, y: y + 0.02, w: 8.2, h: 0.52, fontSize: 9, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0 });
    if (i < 6) s.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: y + 0.58, w: 9.4, h: 0.01, fill: { color: "E8E8E8" } });
  });
}

// ============================================================
// Slide 16: Conclusion
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.navyDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.05, fill: { color: C.teal } });

  s.addText("从 6 到 7", {
    x: 0.8, y: 0.7, w: 8.4, h: 0.7, fontSize: 44, fontFace: "Calibri", color: C.white, bold: true, align: "center", margin: 0
  });
  s.addText("不靠背更多词，靠用对每一个词", {
    x: 0.8, y: 1.4, w: 8.4, h: 0.5, fontSize: 18, fontFace: "Calibri", color: "A0C4D0", align: "center", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 2.1, w: 5, h: 0.02, fill: { color: C.teal } });

  const finalTips = [
    { label: "词汇", desc: "背搭配，不背单词\n每话题10个核心搭配\n用对 > 用难" },
    { label: "句型", desc: "先保证简单句全对\n每段只加1个复杂句\n定语/状语/被动 轮着用" },
    { label: "例子", desc: "具体! 命名! 给数据!\n真实最好，编也要合理\n没有例子的论点=没写完" },
    { label: "自查", desc: "写完逐项检查清单\n一个语法错都不放过\n改3遍 > 写3篇" },
  ];

  finalTips.forEach((t, i) => {
    const x = 0.4 + i * 2.4;
    s.addShape(pres.shapes.OVAL, { x: x + 0.65, y: 2.4, w: 0.75, h: 0.75, fill: { color: C.navy } });
    s.addText(t.label, { x: x + 0.65, y: 2.4, w: 0.75, h: 0.75, fontSize: 14, fontFace: "Calibri", color: C.gold, align: "center", valign: "middle", bold: true, margin: 0 });
    s.addText(t.desc, { x: x, y: 3.3, w: 2.4, h: 1.0, fontSize: 10.5, fontFace: "Calibri", color: "B0C8D0", align: "center", margin: 0 });
  });

  s.addText([
    { text: "Task Response  ·  Coherence  ·  Lexical Resource  ·  Grammar  =  Band 7", options: { color: C.gold } }
  ], { x: 0.8, y: 4.5, w: 8.4, h: 0.35, fontSize: 11, fontFace: "Calibri", align: "center", margin: 0 });

  s.addText("数据来源: IELTS.org · British Council · IDP · ieltszone.org · edubenchmark.com · howtodoielts.com · engnovate.com", {
    x: 0.8, y: 5.15, w: 8.4, h: 0.25, fontSize: 8, fontFace: "Calibri", color: C.muted, align: "center", margin: 0
  });
}

// Write
pres.writeFile({ fileName: "d:/ideas/雅思写作话题词汇与范文拆解.pptx" }).then(() => {
  console.log("Done: 雅思写作话题词汇与范文拆解.pptx");
}).catch(err => {
  console.error("Error:", err);
});
