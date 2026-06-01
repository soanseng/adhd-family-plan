import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderChapterHTML, renderMarkdown } from "../assets/js/docs/index.js";

test("docs sidebar routes chapters through rendered guide page", () => {
  const html = readFileSync("docs/index.html", "utf8");
  const sidebar = html.match(/<aside class="docs-sidebar">[\s\S]*?<\/aside>/)?.[0] || "";
  const hrefs = [...sidebar.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  assert.ok(hrefs.every((href) => !href.split("?")[0].endsWith(".md")));
  assert.match(sidebar, /index\.html\?chapter=README\.md/);
  assert.match(sidebar, /data-doc-link="references\.md"/);
  assert.match(sidebar, /參考文獻/);
});

test("markdown renderer emits HTML instead of raw markdown", () => {
  const html = renderMarkdown("# 標題\n\n- 項目\n\n> 提醒");

  assert.match(html, /<h1>標題<\/h1>/);
  assert.match(html, /<li>項目<\/li>/);
  assert.match(html, /class="safety-alert"/);
});

test("chapter renderer keeps full clinical disclaimer", () => {
  const html = renderChapterHTML("# 家長訓練\n\n一般內容");

  assert.match(html, /不能取代醫師、心理師、職能治療師、特教老師/);
  assert.match(html, /請勿自行停藥或調整劑量/);
});

test("footer references route through rendered docs shell", () => {
  const root = readFileSync("index.html", "utf8");
  const generator = readFileSync("generator.html", "utf8");

  assert.match(root, /docs\/index\.html\?chapter=references\.md/);
  assert.match(generator, /docs\/index\.html\?chapter=references\.md/);
  assert.match(root, /參考文獻/);
  assert.match(generator, /參考文獻/);
  assert.doesNotMatch(root, /href="docs\/references\.md"/);
  assert.doesNotMatch(generator, /href="docs\/references\.md"/);
});

test("entry pages load local vendored jQuery", () => {
  for (const file of ["index.html", "generator.html", "downloads.html"]) {
    const html = readFileSync(file, "utf8");
    assert.match(html, /assets\/vendor\/jquery-4\.0\.0\.min\.js/);
    assert.doesNotMatch(html, /https:\/\/code\.jquery\.com/);
  }
});

test("generator print button is disabled before output exists", () => {
  const html = readFileSync("generator.html", "utf8");

  assert.match(html, /data-print data-print-plan disabled/);
});
