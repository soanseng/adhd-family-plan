export function planToJSON(plan) {
  return JSON.stringify(plan, null, 2);
}

export function downloadJSON(plan, filename = "adhd-family-plan.json") {
  const blob = new Blob([planToJSON(plan)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
