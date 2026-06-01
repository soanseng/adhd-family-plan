const allowedChapters = new Set([
  "README.md",
  "01-adhd-family-plan.md",
  "02-parent-training.md",
  "03-home-structure.md",
  "04-reward-system.md",
  "05-homework-executive-function.md",
  "06-emotion-regulation.md",
  "07-school-collaboration.md",
  "08-sleep-screen-time.md",
  "09-medication-and-referral.md",
  "10-templates.md",
  "references.md",
]);

const clinicalDisclaimer =
  "本網站提供 ADHD 家庭支持與教育資訊，不能取代醫師、心理師、職能治療師、特教老師或其他專業人員的評估與治療。若孩子出現明顯情緒低落、強烈焦慮、攻擊行為、嚴重睡眠問題、學習退化、疑似自閉症或其他發展困難，請尋求專業協助。若孩子正在使用藥物，請勿自行停藥或調整劑量，請與醫師討論。";

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInline(text) {
  return escapeHTML(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listType = null;

  function closeList() {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  }

  lines.forEach((line) => {
    if (!line.trim()) {
      closeList();
      return;
    }
    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${renderInline(line.slice(2))}</h1>`);
      return;
    }
    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      return;
    }
    if (line.startsWith("> ")) {
      closeList();
      html.push(`<div class="safety-alert">${renderInline(line.slice(2))}</div>`);
      return;
    }
    if (line.startsWith("- ")) {
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${renderInline(line.slice(2))}</li>`);
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${renderInline(line.replace(/^\d+\.\s/, ""))}</li>`);
      return;
    }
    closeList();
    html.push(`<p>${renderInline(line)}</p>`);
  });
  closeList();
  return html.join("\n");
}

export function renderChapterHTML(markdown) {
  const html = renderMarkdown(markdown);
  if (html.includes(clinicalDisclaimer)) return html;
  return `${html}\n<div class="safety-alert">${escapeHTML(clinicalDisclaimer)}</div>`;
}

function selectedChapter() {
  const requested = new URLSearchParams(window.location.search).get("chapter") || "README.md";
  return allowedChapters.has(requested) ? requested : "README.md";
}

async function loadChapter() {
  const content = document.querySelector("[data-doc-content]");
  if (!content) return;
  const chapter = selectedChapter();
  document.querySelectorAll("[data-doc-link]").forEach((link) => {
    if (link.dataset.docLink === chapter) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  const response = await fetch(chapter);
  if (!response.ok) throw new Error(`Unable to load ${chapter}`);
  content.innerHTML = renderChapterHTML(await response.text());
}

if (typeof window !== "undefined") {
  loadChapter().catch(() => {
    const content = document.querySelector("[data-doc-content]");
    if (content) {
      content.insertAdjacentHTML("afterbegin", '<p class="safety-alert">文件載入失敗，請稍後再試。</p>');
    }
  });
}
