import { buildPlan } from "./plan-builder.js";
import { downloadCSV } from "./export-csv.js";
import { downloadJSON } from "./export-json.js";
import { readGeneratorForm } from "./form-state.js";
import { renderPlan } from "./output-renderer.js";
import { clearDraft, loadDraft, saveDraft } from "../shared/storage.js";

let currentPlan = null;

function applyDraft(form, draft) {
  if (!draft) return;
  Object.entries(draft).forEach(([key, value]) => {
    const fields = form.querySelectorAll(`[name="${key}"]`);
    fields.forEach((field) => {
      if (field.type === "checkbox") {
        field.checked = Array.isArray(value) ? value.includes(field.value) : Boolean(value);
      } else if (field.type === "radio") {
        field.checked = field.value === String(value);
      } else {
        field.value = value;
      }
    });
  });
}

export function initGenerator($) {
  const form = document.querySelector("[data-generator-form]");
  const output = document.querySelector("[data-plan-output]");
  const printButton = document.querySelector("[data-print-plan]");
  if (!form || !output) return;

  applyDraft(form, loadDraft());

  $(form).on("submit", (event) => {
    event.preventDefault();
    const formState = readGeneratorForm(form);
    currentPlan = buildPlan(formState);
    if (formState.saveDraft) {
      saveDraft(formState);
    } else {
      clearDraft();
    }
    output.innerHTML = renderPlan(currentPlan);
    output.removeAttribute("hidden");
    if (printButton) printButton.disabled = false;
    output.focus();
  });

  $("[data-download-json]").on("click", () => {
    if (currentPlan) downloadJSON(currentPlan);
  });

  $("[data-download-csv]").on("click", () => {
    if (currentPlan) downloadCSV(currentPlan);
  });

  $("[data-clear-draft]").on("click", () => {
    clearDraft();
    form.reset();
    output.innerHTML = "";
    output.setAttribute("hidden", "");
    if (printButton) printButton.disabled = true;
    currentPlan = null;
  });
}
