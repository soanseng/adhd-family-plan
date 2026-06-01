# ADHD Family Plan Project Instructions

`CLAUDE.md` is the only source of truth for project instructions in this
repository. `AGENTS.md` must only point here. If another project note or plan
conflicts with this file, follow this file.

## Project Goal

Build a static-first ADHD family-based plan website for Taiwan users. The site
serves parents, teachers, and clinical workers with:

- A one-page landing page.
- GitBook-style Markdown documentation.
- A client-side personalized 4- or 8-week family plan generator.
- Downloadable, printable forms.
- Reference-based clinical education content.

The MVP is client-side only. Do not add login, accounts, backend services,
databases, personal-data upload, or server-side PDF generation unless explicitly
requested for a later phase.

## Product Principles

- Use Taiwan Traditional Chinese for user-facing content.
- Be warm, practical, and clinically responsible.
- Do not blame children or parents.
- Do not describe ADHD as a character flaw.
- Emphasize environmental adjustment, skill building, routines, positive
  reinforcement, parent-child cooperation, school collaboration, sleep, and
  emotion regulation.
- Avoid overpromising outcomes.
- Do not imply that medication is unnecessary or that medication alone solves
  everything.
- Include clear professional referral guidance where safety, comorbidity,
  development, learning, sleep, anxiety, depression, aggression, or self-harm
  risks are relevant.

Required disclaimer for major pages:

> 本網站提供 ADHD 家庭支持與教育資訊，不能取代醫師、心理師、職能治療師、特教老師或其他專業人員的評估與治療。若孩子出現明顯情緒低落、強烈焦慮、攻擊行為、嚴重睡眠問題、學習退化、疑似自閉症或其他發展困難，請尋求專業協助。若孩子正在使用藥物，請勿自行停藥或調整劑量，請與醫師討論。

## Technical Constraints

- HTML5.
- Vanilla CSS inspired by 37signals/Basecamp modular CSS.
- ES6 modules.
- jQuery 4.0 for DOM selection, event handling, and progressive enhancement.
- No React, Vue, Svelte, Tailwind, Bootstrap, or complex build chain.
- Static-first, browser-only MVP.
- Plan-generation logic must be deterministic, data-driven, and testable.
- Use `window.print()` for print/PDF workflows in the MVP.
- Export generated plans and forms as HTML, JSON, and CSV where relevant.
- Use `localStorage` only for optional client-side drafts, with clear privacy
  copy and a one-click clear option.

Privacy rules:

- Do not ask for real names, ID numbers, school names, addresses, diagnosis
  proof, or other identifying details.
- Keep inputs to age, grade, main difficulties, family constraints, school
  support level, and strategy preferences.
- State that data stays on the user's device and is not uploaded.

## Recommended Structure

```text
/
├── index.html
├── generator.html
├── downloads.html
├── docs/
├── forms/
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components/
│   │   ├── pages/
│   │   └── print.css
│   ├── js/
│   │   ├── app.js
│   │   ├── jquery-init.js
│   │   ├── generator/
│   │   ├── forms/
│   │   └── shared/
│   ├── img/
│   └── data/
└── tests/
```

Planned documentation files:

- `docs/README.md`
- `docs/SUMMARY.md`
- `docs/01-adhd-family-plan.md`
- `docs/02-parent-training.md`
- `docs/03-home-structure.md`
- `docs/04-reward-system.md`
- `docs/05-homework-executive-function.md`
- `docs/06-emotion-regulation.md`
- `docs/07-school-collaboration.md`
- `docs/08-sleep-screen-time.md`
- `docs/09-medication-and-referral.md`
- `docs/10-templates.md`
- `docs/references.md`

Planned forms:

- `forms/daily-routine.html`
- `forms/reward-chart.html`
- `forms/homework-sprint.html`
- `forms/emotion-break-card.html`
- `forms/school-home-note.html`
- `forms/weekly-review.html`

## Generator Rules

Support these MVP plan lengths:

- 4-week Starter Plan.
- 8-week Standard Plan.

Age bands:

- 4-5: parent training, daily routines, short instructions, immediate
  reinforcement, few targets.
- 6-8: visual routines, star charts, homework sprints, emotion break area.
- 9-12: task breakdown, self-monitoring, school collaboration, gradual
  responsibility.
- 13-17: negotiated goals, phone/screen contract, study plan, sleep and
  autonomy.

Generation priority:

1. Safety and professional referral reminders.
2. The most painful daily time window for parents.
3. The child's most achievable first target.
4. Family time constraints.
5. School support level.
6. Age fit.
7. Relevant form output.

Do not overload families with too many strategies. Prefer one or two clear
targets at first.

Bad target examples:

- 乖一點
- 不要再惹我生氣
- 功課全部自己寫完
- 每天都不能分心

Good target examples:

- 7:30 前完成刷牙洗臉
- 寫作業前先把鉛筆盒和聯絡簿拿出來
- 一次完成 10 分鐘作業衝刺
- 生氣時先到情緒休息區 3 分鐘
- 睡前 30 分鐘把平板放到客廳充電

## CSS And UI Conventions

- Use vanilla modular CSS with clear component classes and a small number of
  utilities.
- Prefer component naming like `plan-card`, `plan-card__title`, and
  `plan-card--highlight`.
- Keep the interface mobile-first, readable, and print-friendly.
- Do not introduce a design framework.
- Do not create broad abstractions before repeated need exists.

Core components:

- `site-header`
- `hero-panel`
- `cta-button`
- `feature-card`
- `evidence-card`
- `generator-stepper`
- `option-chip`
- `form-section`
- `plan-preview`
- `download-card`
- `print-sheet`
- `reference-note`
- `safety-alert`

Baseline CSS variables:

```css
:root {
  --color-ink: #1f2937;
  --color-muted: #6b7280;
  --color-bg: #fffaf0;
  --color-panel: #ffffff;
  --color-primary: #2563eb;
  --color-primary-soft: #dbeafe;
  --color-accent: #f59e0b;
  --color-success: #16a34a;
  --color-danger: #dc2626;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --shadow-soft: 0 10px 30px rgba(31, 41, 55, 0.08);
}
```

## Accessibility And SEO

Accessibility requirements:

- Explicit labels for form controls.
- Keyboard-operable buttons and controls.
- Do not use color as the only signal.
- Minimum 16px body text.
- Mobile-first layout.
- Print output must not truncate tables or cards.
- Icons need text labels.

SEO requirements for public pages:

- `title`
- `description`
- `og:title`
- `og:description`
- `og:image`
- `canonical`
- FAQ structured data only when the page has a real FAQ section.

Primary keywords:

- ADHD 家庭本位計劃
- ADHD 家長訓練
- ADHD 親子教養
- ADHD 作業拖延
- ADHD 獎勵表
- ADHD 生活流程表
- ADHD 學校協作
- ADHD 情緒調節
- ADHD 執行功能

## References

Include source-backed references in GitBook-style docs. Start with:

- Wolraich, M. L., Hagan, J. F., Allan, C., et al. (2019). Clinical Practice
  Guideline for the Diagnosis, Evaluation, and Treatment of
  Attention-Deficit/Hyperactivity Disorder in Children and Adolescents.
  `Pediatrics`, 144(4), e20192528.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC7067282/
- CDC. Treatment of ADHD.
  https://www.cdc.gov/adhd/treatment/index.html
- CDC. Parent Training in Behavior Management for ADHD.
  https://www.cdc.gov/adhd/treatment/behavior-therapy.html
- NICE. Quality statement 4: Parent training programmes.
  https://www.nice.org.uk/guidance/qs39/chapter/quality-statement-4-parent-training-programmes

Add TODO references for behavioral parent training meta-analyses, school-based
interventions, homework and executive-function support, sleep and ADHD, token
economy, screen-time routines, and measurement tools such as SNAP-IV,
Vanderbilt, Conners, and SDQ.

## Development Workflow

- Read the relevant existing file, immediate callers, and shared utilities
  before editing.
- Make small, surgical changes.
- Match existing style and structure.
- Keep the MVP static and simple.
- Prefer deterministic code for routing, state transitions, export transforms,
  retries, and status handling.
- Use AI judgment only for drafting, summarization, classification, or
  extraction from unstructured content.
- Verify before claiming success. For static UI work, use the simplest relevant
  checks available: browser smoke test, console check, keyboard path, responsive
  check, print preview, unit tests, or lint/build if such tooling exists.
- Surface skipped verification and uncertainty clearly.

## MVP Acceptance Criteria

Functional:

- Parents can complete the generator form.
- The system can generate 4-week and 8-week plans.
- Plan content changes by age, family work pattern, main difficulty, and school
  support.
- Plans can be printed as PDF from the browser.
- Plans can be downloaded as JSON and CSV.
- Blank forms can be downloaded or printed.

Content:

- Each strategy has a short explanation and executable example.
- Tone is non-blaming.
- No exaggerated treatment claims.
- Professional referral reminders are present.
- References are included.

Technical:

- Valid HTML.
- Modular CSS.
- Separated ES modules.
- jQuery 4 works.
- No build chain required for the MVP.
- Works in latest Chrome, Firefox, Safari, and Edge.
- Mobile-first and print-friendly.
