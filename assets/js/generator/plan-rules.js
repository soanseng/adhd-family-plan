export const ruleModules = [
  {
    id: "morning_routine",
    label: "早晨出門流程",
    triggers: ["morning_routine", "forgetfulness"],
    ageBands: ["preschool", "lowerElementary", "upperElementary"],
    goal: "降低早上出門衝突，讓孩子用視覺流程完成 4-6 個步驟。",
    examples: ["7:30 前完成刷牙洗臉", "前一晚把書包放在門口固定位置"],
    strategies: ["建立早晨流程圖", "每次只給一個指令", "完成 3 個步驟即可得到 1 顆星"],
    forms: ["daily-routine", "reward-chart"],
  },
  {
    id: "homework_delay",
    label: "作業拖延與執行功能",
    triggers: ["homework_delay", "forgetfulness"],
    ageBands: ["lowerElementary", "upperElementary", "adolescent"],
    goal: "把作業改成可開始、可休息、可追蹤的短任務。",
    examples: ["寫作業前先把鉛筆盒和聯絡簿拿出來", "一次完成 10 分鐘作業衝刺"],
    strategies: ["先拆成 1-3 個小任務", "使用 10-20 分鐘短衝刺", "完成後立刻打勾或貼星星"],
    forms: ["homework-sprint", "weekly-review"],
  },
  {
    id: "emotional_outburst",
    label: "情緒爆發與親子衝突",
    triggers: ["emotional_outburst", "impulsivity"],
    ageBands: ["preschool", "lowerElementary", "upperElementary", "adolescent"],
    goal: "先降低衝突強度，再練習可重複的情緒休息步驟。",
    examples: ["生氣時先到情緒休息區 3 分鐘", "用一句固定口令提醒：先停、喝水、再說"],
    strategies: ["設置情緒休息區", "練習 5-4-3-2-1 grounding", "父母先降低音量並縮短說明"],
    forms: ["emotion-break-card", "weekly-review"],
  },
  {
    id: "sleep_screen",
    label: "睡眠與螢幕時間",
    triggers: ["sleep_issue", "screen_issue"],
    ageBands: ["lowerElementary", "upperElementary", "adolescent"],
    goal: "把睡前 30 分鐘改成固定、低刺激、可預測的流程。",
    examples: ["睡前 30 分鐘把平板放到客廳充電", "睡前流程只保留 4 個步驟"],
    strategies: ["建立睡前流程表", "螢幕充電位置移出臥室", "週末也保留大致相同的睡眠錨點"],
    forms: ["daily-routine", "weekly-review"],
  },
  {
    id: "school_collaboration",
    label: "家校協作",
    triggers: ["school_support_low", "forgetfulness", "homework_delay"],
    ageBands: ["lowerElementary", "upperElementary", "adolescent"],
    goal: "每週只追蹤 1-2 個具體目標，讓老師與家長用同一張表溝通。",
    examples: ["老師私下提醒聯絡簿", "作業拆成兩段交"],
    strategies: ["建立家校溝通表", "請老師使用私下提醒", "避免公開羞辱或過度懲罰"],
    forms: ["school-home-note", "weekly-review"],
  },
];

export const weekTemplates = {
  4: [
    "選 1-2 個目標行為，建立流程表",
    "加入即時正向增強與星星表",
    "作業短衝刺與情緒休息區",
    "家校溝通與維持計畫",
  ],
  8: [
    "家庭壓力盤點與目標設定",
    "視覺化生活流程",
    "正向增強與獎勵制度",
    "作業與執行功能",
    "情緒調節與親子衝突降溫",
    "每天 10 分鐘親子連結",
    "學校協作",
    "回顧、維持與復發預防",
  ],
};

export const familyAdjustments = {
  late_work: ["早晨流程前一晚準備", "晚上只追蹤 1-2 個目標", "每週固定 15 分鐘家庭回顧"],
  at_home_caregiver: ["可執行較完整流程", "保留照顧者休息安排", "每天 10 分鐘不糾正時間"],
  grandparent: ["表格文字要簡單", "使用固定口令與打勾", "父母與祖父母使用一致規則"],
  high_stress: ["只選一個最痛點", "優先降低每日衝突", "加入老師、親友或醫療團隊支持"],
};

export const schoolAdjustments = {
  low: ["先用家校溝通表提出一個具體請求", "請老師私下提醒，避免公開點名"],
  moderate: ["每週追蹤 1-2 個目標", "請老師回報哪個策略最有效"],
  high: ["可討論座位、作業拆段、提醒卡與每週回顧"],
};

export const rewardIdeas = {
  parent_child_time: {
    label: "親子時間",
    examples: ["一起玩桌遊 10 分鐘", "一起散步", "一起選晚餐"],
  },
  activity: {
    label: "活動獎勵",
    examples: ["公園時間", "球類活動", "畫畫材料"],
  },
  screen_time: {
    label: "螢幕時間",
    examples: ["額外 10 分鐘遊戲", "週末看一集節目"],
  },
};

export const formLabels = {
  "daily-routine": "日常流程表",
  "reward-chart": "獎勵星星表",
  "homework-sprint": "作業短衝刺表",
  "emotion-break-card": "情緒休息卡",
  "school-home-note": "家校溝通紀錄",
  "weekly-review": "每週回顧表",
};
