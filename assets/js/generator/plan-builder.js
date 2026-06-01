import { getAgeBand } from "./age-bands.js";
import {
  familyAdjustments,
  formLabels,
  rewardIdeas,
  ruleModules,
  schoolAdjustments,
  weekTemplates,
} from "./plan-rules.js";
import { clamp, toInt, unique } from "../shared/validators.js";

const disclaimer =
  "本網站提供 ADHD 家庭支持與教育資訊，不能取代醫師、心理師、職能治療師、特教老師或其他專業人員的評估與治療。若孩子出現明顯情緒低落、強烈焦慮、攻擊行為、嚴重睡眠問題、學習退化、疑似自閉症或其他發展困難，請尋求專業協助。若孩子正在使用藥物，請勿自行停藥或調整劑量，請與醫師討論。";

function buildTriggers(input) {
  const triggers = [input.mainDifficulty, input.schoolSupport === "low" ? "school_support_low" : ""];
  if (input.sleepIssue) triggers.push("sleep_issue");
  if (input.screenIssue) triggers.push("screen_issue");
  return unique(triggers);
}

function scoreRule(rule, triggers, ageBandId) {
  const triggerScore = rule.triggers.filter((trigger) => triggers.includes(trigger)).length * 4;
  const ageScore = rule.ageBands.includes(ageBandId) ? 2 : 0;
  return triggerScore + ageScore;
}

function selectRules(input, ageBand) {
  const triggers = buildTriggers(input);
  const scoredRules = ruleModules
    .map((rule) => ({ rule, score: scoreRule(rule, triggers, ageBand.id) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.rule.label.localeCompare(b.rule.label, "zh-Hant"));
  const primary =
    scoredRules.find(({ rule }) => rule.id === input.mainDifficulty) ||
    scoredRules.find(({ rule }) => rule.triggers[0] === input.mainDifficulty);
  const orderedRules = primary
    ? [primary, ...scoredRules.filter(({ rule }) => rule.id !== primary.rule.id)]
    : scoredRules;

  return orderedRules
    .slice(0, input.intensity === "starter" ? 2 : 3)
    .map(({ rule }) => rule);
}

function buildWeeklyPlan(length, selectedRules, input) {
  const themes = weekTemplates[length] || weekTemplates[4];
  const familyNotes = familyAdjustments[input.familyPattern] || familyAdjustments.high_stress;
  const schoolNotes = schoolAdjustments[input.schoolSupport] || schoolAdjustments.moderate;

  return themes.map((theme, index) => {
    const rule = selectedRules[index % selectedRules.length] || selectedRules[0];
    return {
      week: index + 1,
      theme,
      focus: rule?.label || "家庭支持流程",
      actions: unique([
        rule?.strategies?.[index % rule.strategies.length],
        familyNotes[index % familyNotes.length],
        schoolNotes[index % schoolNotes.length],
      ]),
      tracking: index < 2 ? "每天只記錄成功次數，不記錄失敗次數。" : "每週回顧一次，保留有效策略，刪掉太難的要求。",
    };
  });
}

function buildRewardSuggestions(rewardTypes) {
  return unique(rewardTypes)
    .map((type) => rewardIdeas[type])
    .filter(Boolean)
    .flatMap((reward) => reward.examples.map((example) => `${reward.label}：${example}`))
    .slice(0, 4);
}

export function normalizePlanInput(rawInput = {}) {
  const age = clamp(toInt(rawInput.age, 8), 4, 17);
  const length = toInt(rawInput.planLengthWeeks, 4) === 8 ? 8 : 4;

  return {
    age,
    grade: rawInput.grade || "未填",
    mainDifficulty: rawInput.mainDifficulty || "homework_delay",
    familyPattern: rawInput.familyPattern || "high_stress",
    availableTime: rawInput.availableTime || "limited",
    schoolSupport: rawInput.schoolSupport || "moderate",
    planLengthWeeks: length,
    sleepIssue: Boolean(rawInput.sleepIssue),
    screenIssue: Boolean(rawInput.screenIssue),
    intensity: rawInput.intensity || (length === 4 ? "starter" : "standard"),
    rewardTypes: Array.isArray(rawInput.rewardTypes) && rawInput.rewardTypes.length > 0
      ? rawInput.rewardTypes
      : ["parent_child_time"],
  };
}

export function buildPlan(rawInput) {
  const input = normalizePlanInput(rawInput);
  const ageBand = getAgeBand(input.age);
  const selectedRules = selectRules(input, ageBand);
  const forms = unique(selectedRules.flatMap((rule) => rule.forms));
  const weeklyPlan = buildWeeklyPlan(input.planLengthWeeks, selectedRules, input);
  const rewardSuggestions = buildRewardSuggestions(input.rewardTypes);
  const timeNote =
    input.availableTime === "very_limited"
      ? "每天先保留 10 分鐘，目標少一點也可以。"
      : "每天選一個固定時段執行，不追求整天都完美。";

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      version: "0.1.0",
    },
    input,
    ageBand,
    summary: `${ageBand.label}孩子，主要先處理「${selectedRules[0]?.label || "家庭流程"}」。${timeNote}`,
    priorityGoals: selectedRules.flatMap((rule) => rule.examples).slice(0, 3),
    strategies: selectedRules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      goal: rule.goal,
      strategies: rule.strategies,
    })),
    familyAdjustments: familyAdjustments[input.familyPattern] || [],
    schoolSuggestions: schoolAdjustments[input.schoolSupport] || [],
    rewardSuggestions,
    weeklyPlan,
    trackingIndicators: [
      "本週成功完成目標的天數",
      "親子衝突降低的時段",
      "孩子最容易成功的一個步驟",
    ],
    forms: forms.map((id) => ({ id, label: formLabels[id], href: `forms/${id}.html` })),
    referralReminders: [
      "若孩子有明顯情緒低落、強烈焦慮、攻擊行為或自傷風險，請立即尋求專業協助。",
      "若有嚴重睡眠問題、學習退化、疑似自閉症或其他發展困難，請與醫師、心理師、職能治療師或特教老師討論。",
      "若孩子正在使用藥物，請勿自行停藥或調整劑量。",
    ],
    disclaimer,
  };
}
