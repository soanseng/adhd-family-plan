import test from "node:test";
import assert from "node:assert/strict";
import { buildPlan } from "../assets/js/generator/plan-builder.js";
import { planToCSV } from "../assets/js/generator/export-csv.js";
import { planToJSON } from "../assets/js/generator/export-json.js";

test("buildPlan creates a deterministic 4-week starter plan for homework difficulty", () => {
  const input = {
    age: 8,
    grade: "小二",
    mainDifficulty: "homework_delay",
    familyPattern: "late_work",
    availableTime: "limited",
    schoolSupport: "moderate",
    planLengthWeeks: 4,
  };

  const first = buildPlan(input);
  const second = buildPlan(input);

  assert.equal(first.weeklyPlan.length, 4);
  assert.equal(first.strategies[0].id, "homework_delay");
  assert.deepEqual(
    first.weeklyPlan.map((week) => week.theme),
    second.weeklyPlan.map((week) => week.theme),
  );
  assert.ok(first.familyAdjustments.includes("晚上只追蹤 1-2 個目標"));
});

test("buildPlan creates 8-week plans and adapts content by age band", () => {
  const child = buildPlan({
    age: 6,
    mainDifficulty: "morning_routine",
    planLengthWeeks: 8,
    schoolSupport: "high",
  });
  const teen = buildPlan({
    age: 15,
    mainDifficulty: "homework_delay",
    planLengthWeeks: 8,
    schoolSupport: "low",
  });

  assert.equal(child.weeklyPlan.length, 8);
  assert.equal(teen.weeklyPlan.length, 8);
  assert.equal(child.ageBand.id, "lowerElementary");
  assert.equal(teen.ageBand.id, "adolescent");
  assert.notEqual(child.summary, teen.summary);
  assert.ok(teen.schoolSuggestions.some((text) => text.includes("具體請求")));
});

test("8-week plans default to standard depth when intensity is not forced", () => {
  const plan = buildPlan({
    age: 11,
    mainDifficulty: "homework_delay",
    schoolSupport: "low",
    sleepIssue: true,
    planLengthWeeks: 8,
  });

  assert.equal(plan.input.intensity, "standard");
  assert.equal(plan.strategies.length, 3);
});

test("sleep and screen flags add sleep-screen strategy without overloading output", () => {
  const plan = buildPlan({
    age: 11,
    mainDifficulty: "emotional_outburst",
    sleepIssue: true,
    screenIssue: true,
    intensity: "starter",
  });

  assert.ok(plan.strategies.length <= 2);
  assert.ok(plan.strategies.some((strategy) => strategy.id === "sleep_screen"));
  assert.ok(plan.forms.some((form) => form.id === "weekly-review"));
});

test("main difficulty stays ahead of low school support in generation priority", () => {
  const plan = buildPlan({
    age: 8,
    mainDifficulty: "homework_delay",
    schoolSupport: "low",
    planLengthWeeks: 4,
  });

  assert.equal(plan.strategies[0].id, "homework_delay");
  assert.match(plan.summary, /作業拖延/);
});

test("exporters produce JSON and CSV that contain weekly plan data", () => {
  const plan = buildPlan({
    age: 8,
    mainDifficulty: "homework_delay",
    planLengthWeeks: 4,
  });

  const json = planToJSON(plan);
  const csv = planToCSV(plan);

  assert.equal(JSON.parse(json).weeklyPlan.length, 4);
  assert.match(csv, /"week","theme","focus","actions","tracking"/);
  assert.match(csv, /作業/);
});
