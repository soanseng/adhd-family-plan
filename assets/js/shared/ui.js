export function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
}

export function bindPrintButtons() {
  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });
}
