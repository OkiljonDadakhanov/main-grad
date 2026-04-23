import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import process from "node:process";
import readline from "node:readline";

import { chromium } from "playwright";

const DEFAULT_TIMEOUT_MS = Number(process.env.PW_TIMEOUT_MS || 45000);
const DEFAULT_READ_MAX_CHARS = Number(process.env.PW_READ_MAX_CHARS || 4000);
const headless = process.env.PW_HEADLESS !== "0";
const channel = process.env.PW_CHANNEL || "chrome";

let browser;
let context;
let page;

async function ensurePage() {
  if (!browser) {
    browser = await chromium.launch({
      channel,
      headless,
    });
  }

  if (!context) {
    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
  }

  if (!page) {
    page = await context.newPage();
    page.setDefaultTimeout(DEFAULT_TIMEOUT_MS);
  }

  return page;
}

function normalizeText(value) {
  return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

async function pageState(currentPage) {
  const state = await currentPage.evaluate(() => ({
    scrollY: window.scrollY,
    viewportHeight: window.innerHeight,
    pageHeight: document.documentElement.scrollHeight,
  }));

  return {
    url: currentPage.url(),
    title: await currentPage.title(),
    ...state,
  };
}

function respond(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function success(request, payload = {}) {
  respond({
    ok: true,
    id: request?.id ?? null,
    cmd: request?.cmd ?? null,
    ...payload,
  });
}

function failure(request, error) {
  respond({
    ok: false,
    id: request?.id ?? null,
    cmd: request?.cmd ?? null,
    error: error instanceof Error ? error.message : String(error),
  });
}

async function commandOpen(request) {
  if (!request.url) {
    throw new Error("open requires a url");
  }

  const currentPage = await ensurePage();
  await currentPage.goto(request.url, {
    timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
    waitUntil: request.waitUntil || "domcontentloaded",
  });

  if (request.networkIdle !== false) {
    await currentPage.waitForLoadState("networkidle", {
      timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
    }).catch(() => {});
  }

  return pageState(currentPage);
}

async function commandRead(request) {
  const currentPage = await ensurePage();
  const selector = request.selector || "body";
  const locator = currentPage.locator(selector).first();

  await locator.waitFor({
    state: "visible",
    timeout: request.timeout ?? 5000,
  });

  const text = normalizeText(
    await locator.evaluate((node) => node.innerText || node.textContent || ""),
  );
  const maxChars = request.maxChars ?? DEFAULT_READ_MAX_CHARS;

  return {
    ...(await pageState(currentPage)),
    selector,
    text: text.slice(0, maxChars),
    truncated: text.length > maxChars,
    textLength: text.length,
  };
}

async function commandScroll(request) {
  const currentPage = await ensurePage();
  const amount = Number(request.amount ?? 900);
  const direction = request.direction === "up" ? -1 : 1;
  const target = request.to;

  await currentPage.evaluate(
    ({ delta, to }) => {
      if (to === "top") {
        window.scrollTo({ left: 0, top: 0 });
        return;
      }

      if (to === "bottom") {
        window.scrollTo({
          left: 0,
          top: document.documentElement.scrollHeight,
        });
        return;
      }

      window.scrollBy({ left: 0, top: delta });
    },
    { delta: amount * direction, to: target },
  );

  if (request.waitMs) {
    await currentPage.waitForTimeout(Number(request.waitMs));
  }

  return pageState(currentPage);
}

async function commandClick(request) {
  if (!request.selector) {
    throw new Error("click requires a selector");
  }

  const currentPage = await ensurePage();
  const locator = currentPage.locator(request.selector).first();

  await locator.click({
    timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
  });

  if (request.networkIdle !== false) {
    await currentPage.waitForLoadState("networkidle", {
      timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
    }).catch(() => {});
  }

  return pageState(currentPage);
}

async function commandFill(request) {
  if (!request.selector) {
    throw new Error("fill requires a selector");
  }

  const currentPage = await ensurePage();
  const locator = currentPage.locator(request.selector).first();

  await locator.fill(String(request.value ?? ""));

  if (request.submit === true) {
    await locator.press(request.submitKey || "Enter");
    await currentPage.waitForLoadState("networkidle", {
      timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
    }).catch(() => {});
  }

  return pageState(currentPage);
}

async function commandPress(request) {
  if (!request.selector) {
    throw new Error("press requires a selector");
  }

  if (!request.key) {
    throw new Error("press requires a key");
  }

  const currentPage = await ensurePage();
  const locator = currentPage.locator(request.selector).first();

  await locator.press(String(request.key), {
    timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
  });

  if (request.networkIdle === true) {
    await currentPage.waitForLoadState("networkidle", {
      timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
    }).catch(() => {});
  }

  return pageState(currentPage);
}

async function commandSelect(request) {
  if (!request.selector) {
    throw new Error("select requires a selector");
  }

  if (request.value == null && request.label == null && request.index == null) {
    throw new Error("select requires value, label, or index");
  }

  const currentPage = await ensurePage();
  const locator = currentPage.locator(request.selector).first();
  const option =
    request.value != null
      ? { value: String(request.value) }
      : request.label != null
        ? { label: String(request.label) }
        : { index: Number(request.index) };

  await locator.selectOption(option, {
    timeout: request.timeout ?? DEFAULT_TIMEOUT_MS,
  });

  return pageState(currentPage);
}

async function commandScreenshot(request) {
  const currentPage = await ensurePage();
  const path = request.path || `tmp/playwright-${Date.now()}.png`;

  await mkdir(dirname(path), { recursive: true });
  await currentPage.screenshot({
    fullPage: request.fullPage !== false,
    path,
  });

  return {
    ...(await pageState(currentPage)),
    path,
  };
}

async function commandScrollElement(request) {
  if (!request.selector) {
    throw new Error("scrollElement requires a selector");
  }

  const currentPage = await ensurePage();
  const locator = currentPage.locator(request.selector).first();
  const amount = Number(request.amount ?? 900);
  const direction = request.direction === "up" ? -1 : 1;
  const target = request.to;

  await locator.evaluate(
    (node, { delta, to }) => {
      const el = node;

      if (to === "top") {
        el.scrollTo({ left: 0, top: 0 });
        return;
      }

      if (to === "bottom") {
        el.scrollTo({ left: 0, top: el.scrollHeight });
        return;
      }

      el.scrollBy({ left: 0, top: delta });
    },
    { delta: amount * direction, to: target },
  );

  if (request.waitMs) {
    await currentPage.waitForTimeout(Number(request.waitMs));
  }

  return pageState(currentPage);
}

async function commandUpload(request) {
  if (!request.selector) {
    throw new Error("upload requires a selector");
  }

  if (!request.files) {
    throw new Error("upload requires files");
  }

  const currentPage = await ensurePage();
  const locator = currentPage.locator(request.selector).first();
  const files = Array.isArray(request.files) ? request.files : [request.files];

  await locator.setInputFiles(files);

  return {
    ...(await pageState(currentPage)),
    files,
  };
}

async function commandHtml(request) {
  const currentPage = await ensurePage();
  const html = await currentPage.content();
  const maxChars = request.maxChars ?? DEFAULT_READ_MAX_CHARS;

  return {
    ...(await pageState(currentPage)),
    html: html.slice(0, maxChars),
    truncated: html.length > maxChars,
    htmlLength: html.length,
  };
}

async function commandEval(request) {
  if (!request.expression) {
    throw new Error("eval requires an expression");
  }

  const currentPage = await ensurePage();
  const result = await currentPage.evaluate(
    ({ expression }) => {
      return eval(expression);
    },
    { expression: String(request.expression) },
  );

  return {
    ...(await pageState(currentPage)),
    result,
  };
}

async function commandWait(request) {
  const currentPage = await ensurePage();
  const ms = Number(request.ms ?? 1000);

  await currentPage.waitForTimeout(ms);
  return {
    ...(await pageState(currentPage)),
    waitedMs: ms,
  };
}

async function commandClose() {
  await Promise.allSettled([page?.close(), context?.close(), browser?.close()]);

  page = undefined;
  context = undefined;
  browser = undefined;

  return {
    closed: true,
    channel,
    headless,
  };
}

const handlers = {
  click: commandClick,
  close: commandClose,
  eval: commandEval,
  fill: commandFill,
  html: commandHtml,
  open: commandOpen,
  press: commandPress,
  read: commandRead,
  screenshot: commandScreenshot,
  scrollElement: commandScrollElement,
  scroll: commandScroll,
  select: commandSelect,
  state: async () => pageState(await ensurePage()),
  upload: commandUpload,
  wait: commandWait,
};

async function shutdown() {
  if (!browser && !context && !page) {
    return;
  }

  await commandClose();
}

process.on("SIGINT", async () => {
  await shutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await shutdown();
  process.exit(0);
});

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
  terminal: false,
});

success(
  { cmd: "ready", id: "boot" },
  {
    message:
      "Send one JSON command per line: open, read, scroll, scrollElement, click, fill, press, select, upload, screenshot, html, eval, state, wait, close",
    channel,
    headless,
  },
);

for await (const line of rl) {
  const trimmed = line.trim();

  if (!trimmed) {
    continue;
  }

  let request;

  try {
    request = JSON.parse(trimmed);
  } catch (error) {
    failure({ cmd: "parse", id: null }, error);
    continue;
  }

  const handler = handlers[request.cmd];

  if (!handler) {
    failure(request, `Unknown command: ${request.cmd}`);
    continue;
  }

  try {
    const payload = await handler(request);
    success(request, payload);

    if (request.cmd === "close") {
      process.exit(0);
    }
  } catch (error) {
    failure(request, error);
  }
}
