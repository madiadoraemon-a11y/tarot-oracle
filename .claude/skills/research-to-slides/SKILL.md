---
name: research-to-slides
description: "Use this skill when the user wants to research a topic and turn findings into a presentation. Triggers when the user gives a topic/subject with intent to create slides, or says things like \"research X and make a deck\", \"create a presentation about Y\", \"look up Z and turn it into slides\", \"I need a briefing on W\", or any request that combines research + presentation output. Also triggers when user provides a topic and says \"research-to-slides\" or \"/research-to-slides\"."
---

# Research-to-Slides Skill

Turn any topic into a polished, well-researched presentation through a systematic research → organize → create pipeline.

---

## Workflow Overview

```
User gives topic
    │
    ▼
Phase 1: Research — Web search from multiple angles, capture findings
    │
    ▼
Phase 2: Synthesize — Organize into structured outline, verify completeness
    │
    ▼
Phase 3: Generate — Use PPTX skill to create the presentation
    │
    ▼
Phase 4: QA — Content + visual quality check per PPTX skill QA workflow
```

---

## Phase 1: Research

**Goal**: Gather comprehensive, accurate, and current information from the web about the user's topic.

### 1.1 Deconstruct the Topic

Before searching, identify 4-6 specific angles to investigate:

- **Definition & fundamentals**: What is it? Core concepts, terminology
- **Current state**: Latest developments, statistics, trends (current year)
- **Key players / landscape**: Major companies, products, frameworks, competitors
- **Pros & cons / debates**: Trade-offs, controversies, differing viewpoints
- **How-to / practical**: Steps, best practices, common pitfalls
- **Future outlook**: Predictions, upcoming changes, what's next

### 1.2 Execute Searches

Run **at least 4-6 distinct WebSearch queries** covering the angles above. Do NOT settle for one broad search — depth matters.

Examples of good search queries:
- "what is [topic] overview fundamentals 2026"
- "[topic] latest trends statistics 2026"
- "[topic] best practices common mistakes"
- "[topic] pros cons comparison"
- "[topic] major tools frameworks companies"
- "[topic] future predictions outlook 2026"

### 1.3 Capture Findings

After each search, extract and save key information. While research is ongoing, write raw notes to `research_notes.md` in the working directory. Structure notes by angle.

---

## Phase 2: Synthesize

**Goal**: Transform raw research into a structured slide outline that tells a coherent story.

### 2.1 Determine Slide Count

Default: **8-12 slides**. Adjust based on topic complexity:
- Simple/quick topic: 6-8 slides
- Standard briefing: 10-12 slides
- Deep dive: 12-15 slides

### 2.2 Choose a Narrative Structure

Pick the structure that fits the topic:

| Structure | Best for | Slide flow |
|-----------|----------|------------|
| **Overview** | General topic intro | What → Why → How → Examples → Takeaways |
| **Analysis** | Comparison, evaluation | Context → Options → Criteria → Comparison → Recommendation |
| **How-to** | Tutorials, guides | Problem → Solution → Steps → Tips → Results |
| **Trend report** | Market/tech trends | Landscape → Key trends → Data → Implications → Outlook |
| **Argument/Pitch** | Persuasive | Hook → Problem → Solution → Evidence → Call to action |

### 2.3 Create the Outline

Write `slides_outline.md` with this format for each slide:

```markdown
## Slide N: [Title]
- **Type**: [title-slide / content / two-column / quote / data / divider / conclusion]
- **Key message**: [One sentence — the main takeaway]
- **Content**: [Bullet points, data points, or narrative text]
- **Visual idea**: [Suggested chart, icon, or image concept]
```

Rules:
- **One key message per slide** — if a slide has two, split it
- **Vary slide types** — no more than 2 consecutive slides of the same type
- **Numbers get callouts** — if you have a stat, give it its own big-number slide
- **Hook first, action last** — first slide hooks, last slide tells them what to do with the info

### 2.4 Verify Completeness

Before moving to Phase 3, check:
- [ ] Every angle from Phase 1.1 is covered somewhere
- [ ] Outline has a clear narrative arc (beginning → middle → end)
- [ ] At least one data/stat slide (if research yielded numbers)
- [ ] At least one visual-concept slide (not just text)
- [ ] No slide is overloaded (6+ bullet points = split it)

---

## Phase 3: Generate Presentation

### 3.1 Call the PPTX Skill

Now hand off to the PPTX skill. The PPTX skill's SKILL.md will guide presentation creation.

**Explicitly state**: "Now I'll create this presentation using the pptx skill."

Then follow these principles from the PPTX skill:

- **Pick a color palette** that fits the topic. Consult the PPTX skill's color palette table and choose deliberately — don't default to blue.
- **Use PptxGenJS for creation** (not XML template editing, unless the user provided a template).
- **Every slide needs a visual element** — icons, charts, shapes, or images.
- **Vary layouts** across slides per the PPTX skill's layout options.

### 3.2 Content Guidelines

- **Slide titles**: Concise, under 8 words, use action words or intriguing phrasing
- **Body text**: 14-16pt, max 4-6 bullet points per slide, each point under 12 words
- **Data slides**: Use the PPTX skill's chart guidance for clean, modern charts
- **Sources slide**: Last content slide should list key sources (2-4 URLs) used in research

---

## Phase 4: QA

Follow the PPTX skill's QA workflow exactly:

1. **Content QA**: `python -m markitdown output.pptx` — verify all content, no placeholders
2. **Visual QA**: Convert to images, inspect with subagent per PPTX skill instructions
3. **Fix-and-verify loop**: At least one cycle before declaring success

---

## Quick Reference: Search-to-Slide Mapping

| Research finding type | Best slide type |
|----------------------|-----------------|
| Definition or concept | Title + icon rows |
| Statistical data | Big-number callout OR bar/line chart |
| Process or steps | Numbered flow (1 → 2 → 3) |
| Comparison (pros/cons) | Two-column side-by-side |
| Quote or testimonial | Quote slide |
| Timeline / history | Timeline graphic |
| Multiple categories | 2x2 grid or card layout |

---

## Common Pitfalls

- **Don't skip the multi-angle research** — one broad search produces shallow slides
- **Don't start generating before outlining** — the outline is the cheapest place to fix structure problems
- **Don't copy-paste search results into slides** — synthesize, condense, rewrite in slide language
- **Don't make every slide a bullet list** — use the PPTX skill's layout variety
- **Don't forget the source attribution slide** — credibility matters
- **Don't skip QA** — the first render always has issues
