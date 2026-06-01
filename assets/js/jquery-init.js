export function ensureJQuery() {
  if (!window.jQuery) {
    throw new Error("jQuery 4 is required for progressive enhancement.");
  }
  return window.jQuery;
}
