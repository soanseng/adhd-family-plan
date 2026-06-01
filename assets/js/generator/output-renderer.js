import { escapeHTML } from "../shared/validators.js";

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

export function renderPlan(plan) {
  const weeks = plan.weeklyPlan
    .map(
      (week) => `
        <article class="plan-card">
          <h3>第 ${week.week} 週：${escapeHTML(week.theme)}</h3>
          <p><strong>本週焦點：</strong>${escapeHTML(week.focus)}</p>
          ${list(week.actions)}
          <p class="reference-note">${escapeHTML(week.tracking)}</p>
        </article>
      `,
    )
    .join("");

  const forms = plan.forms
    .map((form) => `<li><a href="${escapeHTML(form.href)}">${escapeHTML(form.label)}</a></li>`)
    .join("");

  return `
    <div class="plan-preview">
      <article class="plan-card plan-card--highlight">
        <h2>你的 ${plan.input.planLengthWeeks} 週家庭計劃</h2>
        <p>${escapeHTML(plan.summary)}</p>
        <h3>先從這些可觀察目標開始</h3>
        ${list(plan.priorityGoals)}
      </article>

      <article class="plan-card">
        <h3>家庭條件調整</h3>
        ${list(plan.familyAdjustments)}
      </article>

      <article class="plan-card">
        <h3>學校合作建議</h3>
        ${list(plan.schoolSuggestions)}
      </article>

      <section class="timeline" aria-label="每週計畫">
        ${weeks}
      </section>

      <article class="plan-card">
        <h3>建議下載表格</h3>
        <ul>${forms}</ul>
      </article>

      <article class="safety-alert">
        <h3>專業協助提醒</h3>
        ${list(plan.referralReminders)}
        <p>${escapeHTML(plan.disclaimer)}</p>
      </article>
    </div>
  `;
}
