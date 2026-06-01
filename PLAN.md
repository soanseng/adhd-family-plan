# plan.md — ADHD 家庭本位計劃 GitBook + Landing Page + 個人化計畫產生器

## 0A. Chosen Implementation Answer

經過 CEO / Design / Engineering plan review，MVP 採用 **靜態優先完整垂直切片**，而不是先接 GitBook CLI、PDF 服務、帳號系統或後端。

### 選擇

1. **Landing page + generator + downloads + repo-native GitBook-style docs 一次完成**
   - `index.html` 作為第一入口。
   - `generator.html` 提供完整 4 週與 8 週 client-side plan generator。
   - `downloads.html` 與 `forms/*.html` 提供可列印表格。
   - `docs/` 保持 Markdown source of truth，另提供 `docs/index.html` 作為 GitHub Pages 上的 GitBook-style 入口。

2. **不導入 HonKit / GitBook Legacy CLI**
   - 原因：專案要求 static-first、無複雜 build chain；GitHub Pages 可直接部署 HTML、CSS、JS、Markdown。
   - 後續若需要 GitBook.com 或 HonKit，可用既有 `docs/SUMMARY.md` 與 markdown 內容升級。

3. **產生器以 deterministic data-driven ES modules 實作**
   - jQuery 4 只負責 DOM selection、event handling、progressive enhancement。
   - plan-building logic 放在 `assets/js/generator/plan-builder.js`，輸入相同時輸出必須相同。
   - 規則、年齡分層、家庭限制、輸出轉換分檔，便於單元測試。

4. **測試採零 build-chain 的 Node test runner**
   - 使用 Node 內建 `node:test` 測純 JS modules。
   - 不新增 Jest/Vitest/Playwright 作為 MVP 依賴。
   - 瀏覽器 QA 用 local static server + manual/smoke script 驗證主要頁面、console、鍵盤路徑、列印樣式。

5. **GitHub Pages 部署採 GitHub Actions**
   - 加入 `.github/workflows/pages.yml`，將整個 repository root 作為 static artifact 部署。
   - 不依賴 npm build。

### 明確不在本次範圍

- 登入、帳號、雲端同步、資料庫、後端 API。
- 伺服器端 PDF 產生。
- 真實姓名、學校名稱、身分證字號、地址或診斷證明欄位。
- 醫療診斷、藥物劑量建議、替代專業評估的宣稱。
- 以 HonKit/GitBook CLI 作為必要部署條件。

### Design Direction

前端採 **print-first Taiwan clinic workbook** 方向：像可帶去親師會或門診討論的工作手冊，而不是 SaaS 行銷頁。

- 首屏用清楚的品牌字級與家庭流程視覺，不使用 generic 3-card hero。
- 主色保持醫療可信的藍綠，搭配紙張暖底與琥珀色標記；避免單一藍紫漸層。
- 版面以寬版工作紙、流程軸、檢核表、可列印表格為核心。
- landing page 是 marketing + utility hybrid；generator 是 calm app UI。
- 所有主要頁面保留專業免責聲明與隱私說明。

### Engineering Shape

```text
index.html / generator.html / downloads.html / forms/*.html
  │
  ├── assets/css/*.css
  │     ├── base tokens
  │     ├── layout bands
  │     ├── components
  │     └── print overrides
  │
  └── assets/js/
        ├── jquery-init.js
        ├── app.js
        ├── generator/
        │     ├── index.js          # DOM adapter
        │     ├── form-state.js
        │     ├── plan-builder.js   # deterministic core
        │     ├── plan-rules.js
        │     ├── export-json.js
        │     ├── export-csv.js
        │     └── output-renderer.js
        └── shared/
              ├── storage.js
              └── validators.js
```

### Acceptance Evidence To Collect Before Completion

- `npm test` or equivalent Node test command passes for plan generation and exporters.
- Static pages open from a local server without console errors.
- Generator produces both 4-week and 8-week plans.
- Output varies by age band, main difficulty, family time constraint, and school support.
- JSON and CSV downloads work.
- `window.print()` workflows exist on generator and forms.
- GitHub Pages workflow is present and points at the static site artifact.
- A final review confirms no backend, login, or identifying-data collection slipped in.

### Review Summary

| Review | Decision | Result |
| --- | --- | --- |
| CEO review | Hold MVP scope, but complete the full static vertical slice | Avoid backend/toolchain expansion; ship usable parent-facing site |
| Design review | Use print-first clinic workbook direction | Avoid generic SaaS cards; emphasize forms, flow, trust, and readability |
| Engineering review | Keep deterministic ES modules and Node tests | Testable core logic without build-chain complexity |

## 0. 專案定位

建立一個面向家長、老師與臨床工作者的 ADHD 家庭本位計劃網站，包含：

1. 一頁式 Landing Page：清楚說明 ADHD 家庭本位計劃的核心概念、適用對象、使用流程與下載資源。
2. GitBook-style 知識庫：以參考文獻為基礎，整理家長訓練、生活結構、正向增強、親子互動、學校協作、睡眠與情緒調節等主題。
3. 個人化計畫產生器：家長可依孩子年齡、主要困難、家庭型態、雙親工作時間、學校支持程度，自動產生一份 4–8 週家庭執行計畫。
4. 可下載表格：包含 PDF/HTML print-friendly/CSV/JSON 格式的家庭計畫、日常流程表、獎勵星星表、作業計畫表、情緒冷靜卡、家校溝通紀錄表。
5. Ref-based GitBook：每一章需附上 references，包含 AAP、CDC、NICE 與主要 parent training / behavioral intervention 資料來源。

> MVP 原則：先做 static-first、client-side-only。所有計畫產生邏輯先在瀏覽器完成，不收集個資、不需要登入、不需要後端。之後再考慮 FastAPI / SQLite / LIFF / 帳號系統。

---

## 1. 技術限制與開發原則

### 1.1 前端技術

使用者指定：

- HTML5
- CSS：37signals-inspired modular CSS
- JavaScript：ES6 modules
- jQuery 4.0
- 不使用 React / Vue / Svelte
- 不使用 Tailwind
- 不使用複雜 build chain
- 優先可被 Codex 直接生成、維護與重構

### 1.2 CSS 風格

不要把「37signals modular CSS」當成 npm 套件。此專案採用 37signals / Basecamp 近年偏好的精神：

- Vanilla CSS
- CSS custom properties
- CSS nesting（若瀏覽器支援；否則避免）
- 清楚的 component class
- 少量 utility class
- 不依賴大型 CSS framework
- 不需要 Figma-first，直接以 HTML/CSS 建構可用畫面
- 組件化但不過度抽象

參考精神：

- `/assets/css/base.css`
- `/assets/css/layout.css`
- `/assets/css/components/*.css`
- `/assets/css/pages/*.css`
- `/assets/css/print.css`

### 1.3 JavaScript 原則

使用 ES6 module：

- 不把所有邏輯塞進單一 `app.js`
- 使用資料驅動的 plan rules
- jQuery 用於 DOM selection、event handling、progressive enhancement
- 計畫產生邏輯必須可單元測試
- 產生器結果可輸出為 HTML、JSON、CSV，並可用 `window.print()` 下載 PDF

---

## 2. 產品架構

### 2.1 網站分區

```text
/
├── index.html                       # Landing Page
├── generator.html                   # 個人化計畫產生器
├── downloads.html                   # 表格下載中心
├── docs/
│   ├── README.md                    # GitBook 首頁
│   ├── SUMMARY.md                   # 章節目錄
│   ├── 01-adhd-family-plan.md
│   ├── 02-parent-training.md
│   ├── 03-home-structure.md
│   ├── 04-reward-system.md
│   ├── 05-homework-executive-function.md
│   ├── 06-emotion-regulation.md
│   ├── 07-school-collaboration.md
│   ├── 08-sleep-screen-time.md
│   ├── 09-medication-and-referral.md
│   ├── 10-templates.md
│   └── references.md
├── forms/
│   ├── daily-routine.html
│   ├── reward-chart.html
│   ├── homework-sprint.html
│   ├── emotion-break-card.html
│   ├── school-home-note.html
│   ├── weekly-review.html
│   └── parent-observation-log.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   └── data/
└── tests/
```

### 2.2 使用者流程

```text
Landing Page
  ↓
了解 ADHD 家庭本位計劃
  ↓
選擇：「直接下載表格」或「產生我的家庭計劃」
  ↓
填寫孩子與家庭條件
  ↓
產生 4–8 週計畫
  ↓
下載：
  - 家庭計畫 PDF
  - 日常流程表
  - 星星獎勵表
  - 家校溝通表
  - 每週回顧表
  - JSON 備份檔
  ↓
閱讀 GitBook refs 與完整說明
```

---

## 3. Landing Page 規格

### 3.1 首頁目標

首頁要讓家長在 10 秒內知道：

- 這不是責怪孩子，也不是責怪父母
- ADHD 家庭本位計劃的重點是「把家庭系統改得更好執行」
- 可以馬上產生一份適合自己家的計畫
- 表格可下載、可列印、可帶去跟老師或醫師討論

### 3.2 首頁區塊

1. Hero
   - 標題：ADHD 家庭本位計劃
   - 副標：把「每天吼叫」改成「看得見、做得到、追蹤得了」的家庭支持系統
   - CTA 1：產生我的家庭計劃
   - CTA 2：下載空白表格
   - CTA 3：閱讀完整指南

2. 痛點區
   - 寫作業拖很久
   - 早上出門像打仗
   - 一提醒就吵架
   - 父母下班後已經沒力
   - 老師說孩子很聰明但常漏東漏西

3. 方法區
   - 生活結構
   - 正向鼓勵
   - 作業短衝刺
   - 情緒休息區
   - 親子合作
   - 學校協作

4. 產生器介紹
   - 根據孩子年齡、主要困難、家庭時間、學校合作程度產生
   - 可下載 PDF / HTML / JSON
   - 不需登入，不上傳資料

5. 表格下載中心
   - 日常流程表
   - 獎勵星星表
   - 作業衝刺表
   - 情緒冷靜卡
   - 家校溝通紀錄
   - 每週回顧表

6. Evidence 區
   - AAP：ADHD 治療應納入家庭、學校與共病評估
   - CDC：6 歲以上建議藥物與行為治療結合，12 歲以下包含家長行為管理訓練
   - NICE：家長訓練與教育方案可改善親子關係與兒童行為

7. 安全聲明
   - 本網站是教育工具，不取代醫師、心理師或職能治療師評估
   - 若孩子有明顯自傷風險、暴力風險、嚴重失眠、憂鬱、焦慮、學習障礙或自閉症特質，請尋求專業協助
   - 若已使用藥物，請勿自行停藥或調藥

---

## 4. GitBook 規格

### 4.1 GitBook 技術建議

MVP 有兩種做法，Codex 先實作 A：

#### A. Repo 內 Markdown Docs，部署成 GitBook-style docs

- 使用 `docs/` 裡的 markdown 作為主內容
- 可先用靜態 HTML 呈現或後續接 GitBook.com
- 每章 markdown 都需能獨立閱讀
- `docs/references.md` 統一整理文獻

#### B. HonKit / GitBook Legacy CLI

- 若需要本地 build，可使用 HonKit
- `SUMMARY.md` 建立側邊章節
- 不要讓 MVP 卡在 GitBook 工具鏈

### 4.2 章節規劃

#### docs/README.md

內容：

- 專案介紹
- 誰適合使用
- 誰不適合只靠此工具
- 如何使用產生器與表格
- 免責聲明

#### docs/01-adhd-family-plan.md

內容：

- ADHD 家庭本位計劃是什麼
- 為什麼不是只要求孩子自律
- 家庭系統與執行功能
- 家庭、學校、臨床三方合作

#### docs/02-parent-training.md

內容：

- Parent Training in Behavior Management
- 指令給法
- 正向注意力
- Immediate reinforcement
- Consistent consequences
- 避免過度責罵

#### docs/03-home-structure.md

內容：

- 視覺化流程表
- 早晨流程
- 放學後流程
- 睡前流程
- 父母工作型態與流程簡化

#### docs/04-reward-system.md

內容：

- Star chart
- Token economy
- 如何選目標行為
- 如何設定獎勵
- 如何避免獎勵制度變成威脅制度

#### docs/05-homework-executive-function.md

內容：

- 作業短衝刺
- 番茄鐘變形
- 任務拆解
- 書包與作業檢查
- 工作記憶外部化

#### docs/06-emotion-regulation.md

內容：

- 情緒休息區
- 5-4-3-2-1 grounding
- 深呼吸
- 親子衝突降溫
- 父母自身調節

#### docs/07-school-collaboration.md

內容：

- 家校溝通表
- 老師可協助事項
- 座位、提醒卡、作業拆段
- 每週追蹤 1–2 個目標即可
- 避免公開羞辱或過度懲罰

#### docs/08-sleep-screen-time.md

內容：

- 睡眠與 ADHD
- 睡前螢幕
- 晚間流程
- 週末規則
- 過度刺激管理

#### docs/09-medication-and-referral.md

內容：

- 藥物治療不是此網站核心，但需正確說明
- 何時需要醫師評估
- 何時需要心理師、職能治療、語言治療或學習評估
- 不提供自行調藥建議

#### docs/10-templates.md

內容：

- 每個表格用途
- 如何填
- 範例
- 下載連結

#### docs/references.md

整理所有 references，分成：

- Guidelines
- Parent training / behavior therapy
- School intervention
- Executive function / homework
- Sleep and ADHD
- Measurement tools

---

## 5. 個人化計畫產生器

### 5.1 表單欄位

#### A. 孩子基本資料

```js
child = {
  age: 8,
  grade: "小二",
  adhdProfile: ["inattention", "hyperactivity", "impulsivity"],
  mainDifficulties: [
    "morning_routine",
    "homework_delay",
    "emotional_outburst",
    "forgetfulness",
  ],
  strengths: ["curious", "creative", "likes_movement"],
  sleepIssue: true,
  screenIssue: true,
  schoolSupport: "moderate",
};
```

#### B. 家庭條件

```js
family = {
  caregivers: ["father", "mother", "grandparent"],
  parentWorkPattern: {
    father: "full_time_late",
    mother: "full_time_regular",
    grandparent: "after_school_support",
  },
  availableTime: {
    morning: 20,
    afterSchool: 45,
    evening: 60,
    weekend: 120,
  },
  siblingCount: 1,
  householdStress: "moderate",
};
```

#### C. 家長偏好

```js
preferences = {
  planLengthWeeks: 8,
  rewardType: ["activity", "screen_time", "parent_child_time"],
  printStyle: "color",
  languageTone: "warm_practical",
  intensity: "starter",
};
```

### 5.2 年齡分層

```js
ageBands = {
  preschool: { min: 4, max: 5 },
  lowerElementary: { min: 6, max: 8 },
  upperElementary: { min: 9, max: 12 },
  adolescent: { min: 13, max: 17 },
};
```

不同年齡給不同建議：

| 年齡     | 主要策略                                          |
| -------- | ------------------------------------------------- |
| 4–5 歲   | 家長訓練、生活流程、短指令、立即增強、少量目標    |
| 6–8 歲   | 視覺化流程、星星表、作業短衝刺、情緒休息區        |
| 9–12 歲  | 任務拆解、自我監測、家校合作、逐步增加責任        |
| 13–17 歲 | 協商式目標、手機/螢幕契約、讀書計畫、睡眠與自主性 |

### 5.3 計畫產生邏輯

Codex 建立 `assets/js/plan-rules.js`：

```js
export const ruleModules = {
  morningRoutine: {
    id: "morning_routine",
    label: "早晨出門流程",
    triggers: ["morning_routine", "forgetfulness"],
    ageBands: ["preschool", "lowerElementary", "upperElementary"],
    output: {
      goal: "降低早上出門衝突，讓孩子用視覺流程完成 4–6 個步驟。",
      strategies: [
        "建立早晨流程圖",
        "每次只給一個指令",
        "完成 3 個步驟即可得到 1 顆星",
        "書包前一晚先整理",
      ],
      forms: ["daily-routine", "reward-chart"],
    },
  },
};
```

### 5.4 計畫輸出格式

產生後顯示：

1. 家庭摘要
2. 本週優先目標
3. 每日流程
4. 獎勵制度
5. 作業策略
6. 情緒策略
7. 學校合作建議
8. 每週追蹤指標
9. 需要專業協助的提醒
10. 可下載表格

### 5.5 計畫長度

MVP 先支援：

- 4 週 Starter Plan
- 8 週 Standard Plan

#### 4 週 Starter Plan

| 週次   | 主題                          |
| ------ | ----------------------------- |
| Week 1 | 選 1–2 個目標行為，建立流程表 |
| Week 2 | 加入即時正向增強與星星表      |
| Week 3 | 作業短衝刺與情緒休息區        |
| Week 4 | 家校溝通與維持計畫            |

#### 8 週 Standard Plan

| 週次   | 主題                            |
| ------ | ------------------------------- |
| Week 1 | 家庭壓力盤點與目標設定          |
| Week 2 | 視覺化生活流程                  |
| Week 3 | 正向增強與獎勵制度              |
| Week 4 | 作業與執行功能                  |
| Week 5 | 情緒調節與親子衝突降溫          |
| Week 6 | 每天 10 分鐘親子連結            |
| Week 7 | 學校協作                        |
| Week 8 | 回顧、維持與 relapse prevention |

---

## 6. 可下載表格規格

所有表格都要做成：

- HTML print-friendly
- 可用瀏覽器列印成 PDF
- 可下載 CSV
- 可下載 JSON
- A4-friendly
- 手機可填、桌機可列印

### 6.1 表格清單

#### Form 1：日常流程表

檔案：

- `forms/daily-routine.html`
- `assets/js/forms/daily-routine.js`

欄位：

- 時段
- 步驟
- 圖示
- 完成打勾
- 備註
- 家長提醒方式

預設流程：

- 起床
- 刷牙洗臉
- 換衣服
- 吃早餐
- 檢查書包
- 出門

#### Form 2：獎勵星星表

欄位：

- 目標行為
- 星期一到星期日
- 星星數
- 可兌換獎勵
- 本週總結

規則：

- 一次最多追蹤 3 個行為
- 不要追蹤「乖一點」這種模糊行為
- 每個目標行為要可觀察、可計數

#### Form 3：作業短衝刺表

欄位：

- 作業科目
- 任務拆解
- 預估時間
- 實際時間
- 休息方式
- 完成狀態

支援：

- 10 分鐘衝刺
- 15 分鐘衝刺
- 20 分鐘衝刺
- 25 分鐘衝刺

#### Form 4：情緒休息卡

內容：

- 我現在的情緒
- 我的身體感覺
- 我可以做的 3 件事
- 深呼吸
- 喝水
- 到休息區
- 找大人幫忙
- 5-4-3-2-1 grounding

#### Form 5：家校溝通紀錄

欄位：

- 日期
- 本週目標
- 老師觀察
- 家長觀察
- 有效策略
- 下週調整
- 是否需要醫療/心理/特教協助

#### Form 6：每週回顧表

欄位：

- 本週最有效的策略
- 最困難的時段
- 孩子做得好的地方
- 父母做得好的地方
- 下週只改一件事
- 是否調整獎勵

---

## 7. JavaScript 架構

```text
assets/js/
├── app.js
├── jquery-init.js
├── generator/
│   ├── index.js
│   ├── form-state.js
│   ├── plan-builder.js
│   ├── plan-rules.js
│   ├── age-bands.js
│   ├── family-constraints.js
│   ├── output-renderer.js
│   ├── export-json.js
│   ├── export-csv.js
│   └── print-pdf.js
├── forms/
│   ├── daily-routine.js
│   ├── reward-chart.js
│   ├── homework-sprint.js
│   ├── emotion-break-card.js
│   ├── school-home-note.js
│   └── weekly-review.js
└── shared/
    ├── validators.js
    ├── storage.js
    ├── i18n.js
    └── ui.js
```

### 7.1 Local Storage

MVP 可暫存資料在 localStorage，但要清楚告知：

- 資料只存在使用者裝置
- 不會上傳
- 可一鍵清除
- 匯出 JSON 可備份

```js
const STORAGE_KEY = "adhd-family-plan-v1";
```

### 7.2 隱私設計

不要要求真名、身分證、學校名稱、地址、診斷證明。

欄位只用：

- 年齡
- 年級
- 主要困難
- 家庭時間限制
- 學校合作程度
- 偏好策略

---

## 8. 資料檔案

```text
assets/data/
├── plan-rules.json
├── form-templates.json
├── reward-ideas.json
├── school-accommodations.json
├── age-band-defaults.json
├── warning-signs.json
└── references.json
```

### 8.1 reward-ideas.json

```json
[
  {
    "id": "parent_child_time",
    "label": "親子時間",
    "examples": ["一起玩桌遊 10 分鐘", "一起散步", "一起選晚餐"]
  },
  {
    "id": "activity",
    "label": "活動獎勵",
    "examples": ["公園時間", "球類活動", "畫畫材料"]
  },
  {
    "id": "screen_time",
    "label": "螢幕時間",
    "examples": ["額外 10 分鐘遊戲", "週末看一集節目"]
  }
]
```

### 8.2 school-accommodations.json

```json
[
  {
    "id": "seat_near_teacher",
    "label": "座位靠近老師",
    "for": ["inattention", "forgetfulness"]
  },
  {
    "id": "assignment_chunking",
    "label": "作業拆段",
    "for": ["homework_delay", "executive_function"]
  },
  {
    "id": "private_reminder",
    "label": "私下提醒卡",
    "for": ["impulsivity", "emotional_outburst"]
  }
]
```

---

## 9. 計畫產生規則

### 9.1 優先順序

產生器不要一次塞太多策略。依下列順序：

1. 安全與專業轉介提醒
2. 父母最痛苦的時段
3. 孩子最容易成功的目標
4. 家庭時間限制
5. 學校可配合程度
6. 年齡適配
7. 表格輸出

### 9.2 目標行為規則

錯誤目標：

- 乖一點
- 不要再惹我生氣
- 功課全部自己寫完
- 每天都不能分心

正確目標：

- 7:30 前完成刷牙洗臉
- 寫作業前先把鉛筆盒和聯絡簿拿出來
- 一次完成 10 分鐘作業衝刺
- 生氣時先到情緒休息區 3 分鐘
- 睡前 30 分鐘把平板放到客廳充電

### 9.3 父母工作型態調整

#### 雙親全職、晚上才有空

輸出建議：

- 早晨流程表要前一晚準備
- 放學後由祖父母/安親班執行簡化版
- 晚上只追蹤 1–2 個目標
- 不做太複雜的獎勵制度
- 每週固定 15 分鐘家庭回顧即可

#### 一位主要照顧者在家

輸出建議：

- 可執行較完整的日常流程
- 但需避免照顧者過度耗竭
- 每天安排 10 分鐘不糾正時間
- 每週保留照顧者休息安排

#### 隔代教養

輸出建議：

- 表格文字要更簡單
- 避免複雜心理術語
- 使用圖像、打勾、固定口令
- 父母與祖父母需使用一致規則

#### 單親或主要照顧者高壓

輸出建議：

- 只選一個最痛點
- 不追求完美
- 優先降低每日衝突
- 獎勵制度要簡單
- 加入外部支持：老師、親友、醫療團隊

---

## 10. UI Components

### 10.1 Component 清單

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

### 10.2 CSS 命名

範例：

```css
.plan-card {
}
.plan-card__title {
}
.plan-card__body {
}
.plan-card--highlight {
}

.generator-step {
}
.generator-step__header {
}
.generator-step__options {
}

.u-stack-sm {
}
.u-stack-md {
}
.u-center {
}
```

### 10.3 色彩

使用 CSS variables：

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

---

## 11. Accessibility

必做：

- 表單 label 必須明確
- 所有 button 可用 keyboard 操作
- 色彩不可作為唯一提示
- 產生結果要可列印
- 字體最小 16px
- 手機版優先
- 表格列印時不截斷
- 圖示需有文字 label

---

## 12. SEO

### 12.1 主要關鍵字

- ADHD 家庭本位計劃
- ADHD 家長訓練
- ADHD 親子教養
- ADHD 作業拖延
- ADHD 獎勵表
- ADHD 生活流程表
- ADHD 學校協作
- ADHD 情緒調節
- ADHD 執行功能

### 12.2 Metadata

每頁需包含：

- title
- description
- og:title
- og:description
- og:image
- canonical
- structured data FAQPage（只用於 FAQ 區）

---

## 13. Content Tone

使用台灣繁體中文。

語氣：

- 溫暖但不雞湯
- 實務、可執行
- 不責備孩子
- 不責備父母
- 不把 ADHD 描述成缺陷
- 強調環境調整與技能建立

避免：

- 「孩子就是不努力」
- 「父母要更有耐心」但不給方法
- 「只要愛就會好」
- 「不用藥也可以完全改善」
- 「吃藥就解決」
- 過度承諾療效

推薦文案風格：

> ADHD 家庭本位計劃不是要孩子突然變成另一個人，而是幫家庭建立一套比較容易成功的系統。先從一個痛點開始，讓每天少一點衝突，多一點看得見的進步。

---

## 14. Safety / Clinical Disclaimer

每個主要頁面 footer 加上：

> 本網站提供 ADHD 家庭支持與教育資訊，不能取代醫師、心理師、職能治療師、特教老師或其他專業人員的評估與治療。若孩子出現明顯情緒低落、強烈焦慮、攻擊行為、嚴重睡眠問題、學習退化、疑似自閉症或其他發展困難，請尋求專業協助。若孩子正在使用藥物，請勿自行停藥或調整劑量，請與醫師討論。

---

## 15. References 建議放入 GitBook

### 15.1 Core Guidelines

1. Wolraich, M. L., Hagan, J. F., Allan, C., et al. (2019). Clinical Practice Guideline for the Diagnosis, Evaluation, and Treatment of Attention-Deficit/Hyperactivity Disorder in Children and Adolescents. _Pediatrics_, 144(4), e20192528.  
   URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC7067282/

2. CDC. Treatment of ADHD.  
   URL: https://www.cdc.gov/adhd/treatment/index.html

3. CDC. Parent Training in Behavior Management for ADHD.  
   URL: https://www.cdc.gov/adhd/treatment/behavior-therapy.html

4. NICE. Quality statement 4: Parent training programmes.  
   URL: https://www.nice.org.uk/guidance/qs39/chapter/quality-statement-4-parent-training-programmes

### 15.2 需要再補的文獻

Codex 不需自行改寫醫療內容，但可以建立 references TODO：

- Behavioral parent training meta-analysis
- Parent-child interaction therapy and ADHD-related behavior
- School-based intervention for ADHD
- Homework intervention and executive function support
- Sleep hygiene and ADHD
- Token economy and reinforcement schedule
- ADHD and screen time / evening routine
- Measurement-based care: SNAP-IV, Vanderbilt, Conners, SDQ

---

## 16. 開發階段

### Phase 1 — Static MVP

目標：

- 完成 landing page
- 完成 generator UI
- 完成 client-side plan generation
- 完成 6 份 print-friendly forms
- 完成 docs markdown skeleton
- 完成 references page

驗收：

- 使用者可填表產生 4 週或 8 週計畫
- 可列印成 PDF
- 可下載 JSON
- 可下載 CSV
- 手機可用
- 不需要後端

### Phase 2 — Content 完整化

目標：

- 每章 GitBook 補完整內容
- 每章加 references
- 增加案例：低年級、高年級、青少年、雙薪家庭、隔代教養、單親家庭
- 增加 FAQ

### Phase 3 — LIFF / Clinic Integration

目標：

- LINE LIFF 版本
- 家長可每週回報
- 醫師端或心理師端可讀摘要
- FastAPI + SQLite
- 匿名 code / QR code share
- 匯出給臨床紀錄

暫不做：

- 診斷功能
- 藥物建議
- 自動判斷是否需要開藥
- 收集未成年人敏感個資

---

## 17. Codex 開發任務拆解

### Task 1：建立 repo skeleton

建立所有資料夾與基本檔案。

### Task 2：建立 landing page

完成：

- `index.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/components/buttons.css`
- `assets/css/components/cards.css`
- `assets/css/pages/home.css`

### Task 3：建立 generator UI

完成：

- `generator.html`
- multi-step form
- option chips
- localStorage draft
- reset button
- privacy notice

### Task 4：建立 plan rules

完成：

- `assets/data/plan-rules.json`
- `assets/js/generator/plan-builder.js`
- age band logic
- family constraint logic

### Task 5：建立 result renderer

完成：

- plan preview
- weekly table
- recommended forms
- safety alert
- download buttons

### Task 6：建立 downloadable forms

完成 6 個 forms HTML：

- daily routine
- reward chart
- homework sprint
- emotion break card
- school home note
- weekly review

### Task 7：建立 export functions

完成：

- export JSON
- export CSV
- print PDF
- print stylesheet

### Task 8：建立 docs

完成：

- docs markdown skeleton
- summary
- references

### Task 9：品質檢查

完成：

- mobile responsive
- keyboard accessible
- print preview usable
- no console errors
- no external personal data upload

---

## 18. 驗收標準

### Functional

- [ ] 家長可完成表單
- [ ] 系統可產生 4 週計畫
- [ ] 系統可產生 8 週計畫
- [ ] 計畫內容依年齡不同而調整
- [ ] 計畫內容依父母工作型態不同而調整
- [ ] 計畫內容依主要困難不同而調整
- [ ] 可列印 PDF
- [ ] 可下載 JSON
- [ ] 可下載 CSV
- [ ] 可下載空白表格

### Content

- [ ] 每個策略都有簡短說明
- [ ] 每個策略都有可執行範例
- [ ] 不使用責備語氣
- [ ] 不誇大療效
- [ ] 有專業轉介提醒
- [ ] 有 references

### Technical

- [ ] HTML valid
- [ ] CSS modular
- [ ] JS modules separated
- [ ] jQuery 4 works
- [ ] No build needed for MVP
- [ ] Works in latest Chrome / Firefox / Safari / Edge
- [ ] Mobile first
- [ ] Print stylesheet OK

---

## 19. 第一版 Prompt 給 Codex

請 Codex 依照以下順序實作：

```text
You are building a static-first ADHD Family-Based Plan website in Traditional Chinese for Taiwan users.

Follow plan.md exactly.

Tech constraints:
- HTML5
- jQuery 4.0
- ES6 modules
- Vanilla modular CSS inspired by 37signals / Basecamp style
- No React, Vue, Tailwind, Bootstrap, or complex build chain
- Static-first, client-side-only MVP
- No backend
- No user login
- No personal data upload

Build:
1. Repo skeleton
2. Landing page
3. Plan generator
4. Six downloadable / printable forms
5. GitBook-style markdown docs
6. References page
7. JSON / CSV / print export

The product should be warm, practical, mobile-friendly, print-friendly, and clinically responsible. Use Traditional Chinese. Avoid blaming parents or children. Include clear disclaimer that this is educational and not a medical diagnosis or treatment replacement.
```

---

## 20. 後續可加功能

- 家長每週回顧進度圖
- ADHD subtype-based tips
- 家校溝通 email / LINE 訊息產生器
- 孩子版可愛視覺流程卡
- 老師版 1 頁摘要
- 診所版：初診前家庭問卷
- LIFF integration
- FastAPI + SQLite
- PDFKit / Playwright server-side PDF rendering
- 多語：日文、英文
- 臨床版 references with DOI
