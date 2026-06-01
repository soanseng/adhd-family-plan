export function readGeneratorForm(form) {
  const data = new FormData(form);
  return {
    age: data.get("age"),
    grade: data.get("grade"),
    mainDifficulty: data.get("mainDifficulty"),
    familyPattern: data.get("familyPattern"),
    availableTime: data.get("availableTime"),
    schoolSupport: data.get("schoolSupport"),
    planLengthWeeks: data.get("planLengthWeeks"),
    sleepIssue: data.has("sleepIssue"),
    screenIssue: data.has("screenIssue"),
    intensity: data.get("intensity"),
    rewardTypes: data.getAll("rewardTypes"),
  };
}
