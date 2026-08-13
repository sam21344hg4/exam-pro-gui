import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("artifacts/source-audit");
await fs.mkdir(outDir, { recursive: true });

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 768 }, deviceScaleFactor: 1 });
page.on("console", (message) => {
  if (message.type() === "error") console.error("BROWSER CONSOLE:", message.text());
});
page.on("pageerror", (error) => console.error("BROWSER PAGE ERROR:", error.message));

const shot = async (name) => page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });

try {
  await page.goto("http://127.0.0.1:8080", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Start Timed Exam/i }).click();
  await page.locator(".classic-exam-header").waitFor({ state: "visible" });

  await shot("01-initial-question");
  assert(await page.getByRole("button", { name: "Lock" }).count() === 1, "USMLE program 267 must show Lock");
  assert(await page.getByRole("button", { name: "Pause" }).count() === 0, "USMLE program 267 must not show Pause");
  assert(await page.locator(".source-exam-header .source-mark-trigger").count() === 1, "Mark Question must be in the top header");
  assert(await page.locator(".classic-exam-main .source-mark-trigger").count() === 0, "Mark Question must not be in the question body");

  await page.getByRole("button", { name: "Settings" }).click();
  const settings = page.locator(".source-settings-menu");
  await settings.waitFor({ state: "visible" });
  assert(await settings.getByText("Resize Text", { exact: true }).count() === 1, "Settings missing Resize Text");
  assert(await settings.getByText("Color Theme", { exact: true }).count() === 1, "Settings missing Color Theme");
  assert(await settings.getByText("Show/Hide Strikeout", { exact: true }).count() === 1, "Settings missing Show/Hide Strikeout");
  assert(await settings.getByText("Help", { exact: true }).count() === 1, "Settings missing Help");
  await settings.getByText("Resize Text", { exact: true }).click();
  const submenu = page.locator(".source-resize-menu");
  await submenu.waitFor({ state: "visible" });
  const menuBox = await settings.boundingBox();
  const submenuBox = await submenu.boundingBox();
  assert(menuBox && submenuBox && submenuBox.x >= menuBox.x + menuBox.width - 2, "Resize Text submenu must open to the right");
  await shot("02-settings-right-submenu");
  await page.mouse.click(500, 300);
  assert(await settings.count() === 0, "Settings must collapse on outside click");

  await page.locator(".source-timer-trigger").click();
  await page.getByText("Block Time Information", { exact: true }).waitFor();
  assert(await page.getByText("Day Time Information", { exact: true }).count() === 1, "Timer missing Day Time Information");
  assert(await page.getByText("Break Time Remaining:", { exact: true }).count() >= 1, "Timer missing Break Time Remaining");
  await shot("03-timer-panel");
  await page.locator(".source-timer-panel .source-panel-close").click();

  await page.locator(".source-item-info-trigger").click();
  await page.getByText("Exam Overview", { exact: true }).waitFor();
  assert(await page.getByText("Exam Block", { exact: true }).count() >= 1, "Exam Overview missing Exam Block rows");
  await shot("04-exam-overview");
  await page.locator(".source-overview-panel .source-panel-close").click();

  await page.getByRole("button", { name: "Notes" }).click();
  const note = page.getByRole("textbox", { name: "Notes" });
  await note.fill("source audit note");
  await page.getByRole("button", { name: "Save and Close" }).click();
  const noteIndicator = page.locator(".classic-status-note-wrap").first();
  await noteIndicator.waitFor({ state: "visible" });
  assert((await noteIndicator.getAttribute("title")) === "source audit note", "Saved note must be exposed on the status pencil");
  await shot("05-note-indicator");

  await page.getByRole("button", { name: "Lab Values" }).click();
  const lab = page.locator(".source-lab-panel");
  await lab.waitFor({ state: "visible" });
  const labBox = await lab.boundingBox();
  assert(labBox, "Lab Values panel did not render");
  const expectedHalf = (1365 - 105) / 2;
  assert(Math.abs(labBox.width - expectedHalf) <= 8, `Lab panel must start at a 50/50 split; got ${labBox.width}px expected ~${expectedHalf}px`);
  assert(await page.locator(".source-lab-splitter").count() === 1, "Lab splitter is missing");
  const labSearch = page.locator("#source-lab-search");
  await labSearch.fill("Glucose");
  await page.waitForTimeout(500);
  assert(await page.locator("mark[data-source-lab-mark]").count() > 0, "Lab search must mark matching text");
  assert(await page.locator(".source-lab-tabs li.searched").count() > 0, "Lab search must underline tabs containing results");
  await shot("06-lab-search-split");
  await page.locator(".source-lab-close-button").click();

  const timerBefore = await page.locator(".source-timer-trigger").innerText();
  await page.getByRole("button", { name: "Lock" }).click();
  await page.getByText("Unauthorized Break Warning", { exact: true }).waitFor();
  await shot("07-lock-warning");
  await page.getByRole("button", { name: "Unauthorized Break", exact: true }).click();
  await page.getByText("Unauthorized Break", { exact: true }).first().waitFor();
  await page.waitForTimeout(2200);
  await page.getByRole("button", { name: "Return to Exam" }).click();
  const timerAfter = await page.locator(".source-timer-trigger").innerText();
  assert(timerAfter !== timerBefore, "Lock/Unauthorized Break must not pause the block timer");

  await page.getByRole("button", { name: "End Block" }).click();
  await page.getByText("Warning - This block is incomplete!", { exact: true }).waitFor();
  assert(await page.getByText(/Number of unanswered items in this block:/).count() === 1, "Incomplete End Block warning missing unanswered count");
  assert(await page.getByText("If you end this block you will not be able to return.", { exact: true }).count() === 1, "End Block warning text differs from source");
  await shot("08-end-block-incomplete");
  await page.getByRole("button", { name: "Remain in Block" }).click();

  let zoomFound = false;
  for (let i = 0; i < 49; i += 1) {
    if (await page.getByRole("button", { name: "Zoom" }).count()) {
      zoomFound = true;
      break;
    }
    const next = page.getByRole("button", { name: "Next" });
    if (!(await next.isEnabled())) break;
    await next.click();
    await page.waitForTimeout(25);
  }

  if (zoomFound) {
    await page.getByRole("button", { name: "Settings" }).click();
    await page.locator(".source-settings-menu").getByText("Resize Text", { exact: true }).click();
    await page.locator(".source-resize-menu").getByText("150%", { exact: true }).click();
    await page.getByRole("button", { name: "Zoom" }).click();
    await page.locator(".source-image-viewer").waitFor({ state: "visible" });
    assert((await page.locator("html").getAttribute("data-exam-text-zoom")) === "100", "Fullscreen media must force UI zoom to 100%");
    assert(await page.locator(".classic-exam-header").getAttribute("inert") !== null, "Fullscreen media must disable header controls");
    await shot("09-fullscreen-media");
    await page.getByRole("button", { name: /Close magnified image/i }).click();
    assert((await page.locator("html").getAttribute("data-exam-text-zoom")) === "150", "Closing media must restore previous UI zoom");
  } else {
    await fs.writeFile(path.join(outDir, "09-zoom-not-present.txt"), "No image question was present in the first block; fullscreen media visual check was not run.\n");
  }

  await fs.writeFile(path.join(outDir, "audit-result.txt"), "PASS\n");
} finally {
  await browser.close();
}
