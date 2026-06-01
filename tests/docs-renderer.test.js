import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderMarkdown } from "../assets/js/docs/index.js";

test("docs sidebar routes chapters through rendered guide page", () => {
  const html = readFileSync("docs/index.html", "utf8");
  const sidebar = html.match(/<aside class="docs-sidebar">[\s\S]*?<\/aside>/)?.[0] || "";
  const hrefs = [...sidebar.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  assert.ok(hrefs.every((href) => !href.split("?")[0].endsWith(".md")));
  assert.match(sidebar, /index\.html\?chapter=README\.md/);
  assert.match(sidebar, /data-doc-link="references\.md"/);
});

test("markdown renderer emits HTML instead of raw markdown", () => {
  const html = renderMarkdown("# 標題\n\n- 項目\n\n> 提醒");

  assert.match(html, /<h1>標題<\/h1>/);
  assert.match(html, /<li>項目<\/li>/);
  assert.match(html, /class="safety-alert"/);
});
