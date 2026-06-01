const STORAGE_KEY = "adhd-family-plan-v1";

export function saveDraft(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
