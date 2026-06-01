function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

export function planToCSV(plan) {
  const rows = [["week", "theme", "focus", "actions", "tracking"]];
  plan.weeklyPlan.forEach((week) => {
    rows.push([
      week.week,
      week.theme,
      week.focus,
      week.actions.join("；"),
      week.tracking,
    ]);
  });
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function downloadCSV(plan, filename = "adhd-family-plan.csv") {
  const blob = new Blob(["\uFEFF", planToCSV(plan)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
