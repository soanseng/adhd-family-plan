import { initGenerator } from "./generator/index.js";
import { ensureJQuery } from "./jquery-init.js";
import { bindPrintButtons } from "./shared/ui.js";

const $ = ensureJQuery();

$(function () {
  bindPrintButtons();
  initGenerator($);
});
