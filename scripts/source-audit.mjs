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
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") {
    consoleErrors.push(message.text());
    console.error("BROWSER CONSOLE:", message.text());
  }
});
page.on("pageerror", (error) => {
  consoleErrors.push(error.message);
  console.error("BROWSER PAGE ERROR:", error.message);
});

const shot = async (name) => page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
const startTimed = async () => {
  await page.getByRole("button", { name: /Start Timed Exam/i }).click();
  await page.locator(".classic-exam-header").waitFor({ state: "visible" });
};

try {
  await page.goto("http://127.0.0.1:8080", { waitUntil: "networkidle" });
  await startTimed();

  await shot("01-initial-question");
  assert(await page.locator(".classic-lock-button").count() === 1, "USMLE program 267 must show Lock");
  assert(await page.locator('.classic-footer-button[title="Pause"]').count() === 0, "USMLE program 267 must not show Pause");
  assert(await page.locator(".source-exam-header .source-mark-trigger").count() === 1, "Mark Question must be in the top header");
  assert(await page.locator(".classic-exam-main .source-mark-trigger").count() === 0, "Mark Question must not be in the question body");

  const firstOption = page.locator(".classic-option-row").first();
  assert(await firstOption.locator(".classic-strike-button").isVisible(), "Strikeout must be enabled by default");
  await firstOption.click({ button: "right" });
  assert(await firstOption.locator(".classic-option-text.is-struck").count() === 1, "Right click must strike an option");
  await firstOption.locator('input[type="radio"]').click();
  assert(await firstOption.locator(".classic-option-text.is-struck").count() === 0, "Selecting a struck option must remove strikeout");

  await page.locator(".classic-header-settings").click();
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
  assert(submenuBox && submenuBox.x + submenuBox.width <= 1365, "Resize Text submenu must remain inside the viewport");
  await shot("02-settings-right-submenu");
  await page.mouse.click(800, 500);
  assert(await settings.count() === 0, "Settings must collapse on outside click");

  await page.locator(".classic-header-settings").click();
  await page.locator(".source-settings-menu").getByText("Help", { exact: true }).click();
  const help = page.locator("#helpContainer");
  await help.waitFor({ state: "visible" });
  assert(await help.getByText("Exam Interface and Features", { exact: true }).count() === 1, "Help title does not match source");
  assert(await page.locator(".classic-exam-main").getAttribute("inert") !== null, "Help must disable the question UI");
  await shot("03-help");
  await page.keyboard.press("Escape");
  await help.waitFor({ state: "hidden" });

  await page.locator(".source-timer-trigger").click();
  await page.getByText("Block Time Information", { exact: true }).waitFor();
  assert(await page.getByText("Day Time Information", { exact: true }).count() === 1, "Timer missing Day Time Information");
  assert(await page.getByText("Break Time Remaining:", { exact: true }).count() >= 1, "Timer missing Break Time Remaining");
  await shot("04-timer-panel");
  await page.locator(".source-timer-panel .source-panel-close").click();

  await page.locator(".source-item-info-trigger").click();
  await page.getByText("Exam Overview", { exact: true }).waitFor();
  assert(await page.getByText("Exam Block", { exact: true }).count() >= 1, "Exam Overview missing Exam Block rows");
  await shot("05-exam-overview");
  await page.locator(".source-overview-panel .source-panel-close").click();

  const notesTrigger = page.locator('.classic-header-tool-slot > .classic-tool-trigger[title="Notes"]');
  await notesTrigger.click();
  let note = page.getByRole("textbox", { name: "Notes" });
  await note.fill("source audit note");
  await page.getByRole("button", { name: "Save and Close" }).click();
  let noteIndicator = page.locator(".classic-status-note-wrap").first();
  await noteIndicator.waitFor({ state: "visible" });
  assert((await noteIndicator.getAttribute("title")) === "source audit note", "Saved note must be exposed on the status pencil");
  await shot("06-note-indicator");

  await notesTrigger.click();
  note = page.getByRole("textbox", { name: "Notes" });
  await note.fill("source audit coexistence note");
  await page.locator('.classic-header-tool-slot > .classic-tool-trigger[title="Calculator"]').click();
  assert(await page.locator(".nbme-notes-panel").count() === 1, "Notes must remain open with Calculator");
  assert(await page.locator(".nbme-calculator-panel.with-notes").count() === 1, "Calculator must move when Notes is open");
  await page.getByRole("button", { name: "1", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.locator(".nbme-calculator-panel").waitFor({ state: "hidden" });
  assert(await page.locator(".nbme-notes-panel").count() === 1, "Escape focused in Calculator must not close Notes");
  await note.focus();
  await page.keyboard.press("Escape");
  await page.locator(".nbme-notes-panel").waitFor({ state: "hidden" });
  noteIndicator = page.locator(".classic-status-note-wrap").first();
  await noteIndicator.waitFor({ state: "visible" });
  assert((await noteIndicator.getAttribute("title")) === "source audit coexistence note", "Escape from Notes must save the note");
  await notesTrigger.click();
  await page.getByRole("button", { name: "Delete Notes", exact: true }).click();
  assert(await page.locator(".classic-status-note-wrap").count() === 0, "Delete Notes must remove the status pencil");

  await page.locator('.classic-header-tool-slot > .classic-tool-trigger[title="Lab Values"]').click();
  const lab = page.locator(".source-lab-panel");
  await lab.waitFor({ state: "visible" });
  const labBox = await lab.boundingBox();
  assert(labBox, "Lab Values panel did not render");
  const expectedHalf = (1365 - 105) / 2;
  assert(Math.abs(labBox.width - expectedHalf) <= 8, `Lab panel must start at a 50/50 split; got ${labBox.width}px expected ~${expectedHalf}px`);
  assert(await page.locator(".source-lab-splitter").count() === 1, "Lab splitter is missing");
  const labSearch = page.locator("#source-lab-search");
  await labSearch.fill("Glucose");
  await page.waitForTimeout(700);
  assert(await page.locator("mark[data-source-lab-mark]").count() > 0, "Lab search must mark matching text");
  assert(await page.locator(".source-lab-tabs li.searched").count() > 0, "Lab search must underline tabs containing results");
  await shot("07-lab-search-split");
  await page.locator(".source-lab-close-button").click();

  const timerBefore = await page.locator(".source-timer-trigger").innerText();
  await page.locator(".classic-lock-button").click();
  await page.getByText("Unauthorized Break Warning", { exact: true }).waitFor();
  await shot("08-lock-warning");
  await page.getByRole("button", { name: "Unauthorized Break", exact: true }).click();
  await page.locator(".source-unauthorized-break").waitFor({ state: "visible" });
  await page.waitForTimeout(2200);
  await page.getByRole("button", { name: "Return to Exam" }).click();
  const timerAfter = await page.locator(".source-timer-trigger").innerText();
  assert(timerAfter !== timerBefore, "Lock/Unauthorized Break must not pause the block timer");

  await page.locator(".classic-end-button").click();
  await page.getByText("Warning - This block is incomplete!", { exact: true }).waitFor();
  assert(await page.getByText(/Number of unanswered items in this block:/).count() === 1, "Incomplete End Block warning missing unanswered count");
  assert(await page.getByText("If you end this block you will not be able to return.", { exact: true }).count() === 1, "End Block warning text differs from source");
  await shot("09-end-block-incomplete");
  await page.getByRole("button", { name: "Remain in Block" }).click();

  let zoomFound = false;
  for (let i = 0; i < 49; i += 1) {
    if (await page.locator('.classic-image-tools button[title="Zoom"]').count()) {
      zoomFound = true;
      break;
    }
    const next = page.locator('.classic-header-navigation button[title="Next"]');
    if (!(await next.isEnabled())) break;
    await next.click();
    await page.waitForTimeout(25);
  }

  if (zoomFound) {
    const invertButton = page.locator('.classic-image-tools button[title="Invert"]');
    await invertButton.click();
    const invertSlider = page.locator(".source-image-slider-invert");
    await invertSlider.waitFor({ state: "visible" });
    const invertBox = await invertButton.boundingBox();
    const sliderBox = await invertSlider.boundingBox();
    assert(invertBox && sliderBox && sliderBox.x >= invertBox.x + invertBox.width - 2, "Invert slider must attach immediately to the right of Invert");
    await shot("10-invert-attached-slider");
    await invertButton.click();

    await page.locator(".classic-header-settings").click();
    await page.locator(".source-settings-menu").getByText("Resize Text", { exact: true }).click();
    await page.locator(".source-resize-menu").getByText("150%", { exact: true }).click();
    await page.locator('.classic-header-tool-slot > .classic-tool-trigger[title="Lab Values"]').click();
    await page.locator(".source-lab-panel").waitFor({ state: "visible" });
    await page.locator('.classic-image-tools button[title="Zoom"]').click();
    await page.locator(".source-image-viewer").waitFor({ state: "visible" });
    assert(await page.locator(".source-lab-panel").count() === 0, "Fullscreen media must suspend Lab Values");
    assert((await page.locator("html").getAttribute("data-exam-text-zoom")) === "100", "Fullscreen media must force UI zoom to 100%");
    assert(await page.locator(".classic-exam-header").getAttribute("inert") !== null, "Fullscreen media must disable header controls");
    await shot("11-fullscreen-media");
    await page.locator(".source-viewer-close").click();
    assert((await page.locator("html").getAttribute("data-exam-text-zoom")) === "150", "Closing media must restore previous UI zoom");
    await page.locator(".source-lab-panel").waitFor({ state: "visible" });
    await page.locator(".source-lab-close-button").click();
  } else {
    await fs.writeFile(path.join(outDir, "11-zoom-not-present.txt"), "No image question was present in the first block; fullscreen media visual check was not run.\n");
  }

  await page.reload({ waitUntil: "networkidle" });
  await startTimed();
  for (let item = 1; item <= 50; item += 1) {
    await page.locator('.classic-radio-input').first().click();
    if (item < 50) {
      await page.locator('.classic-header-navigation button[title="Next"]').click();
      await page.waitForTimeout(15);
    }
  }
  assert(await page.locator(".classic-end-button.is-complete").count() === 1, "End Block must switch to its complete state after all items are answered");
  await page.locator(".classic-end-button").click();
  await page.getByText("Warning - You are about to end the block.", { exact: true }).waitFor();
  assert(await page.getByText("If you end this block you will not be able to return.", { exact: true }).count() === 1, "Completed End Block warning text differs from source");
  await shot("12-end-block-complete");
  await page.locator(".source-end-actions button").first().click();
  await page.locator(".source-break-card").waitFor({ state: "visible" });
  await shot("13-between-block-state");

  if (consoleErrors.length) {
    await fs.writeFile(path.join(outDir, "browser-console-errors.txt"), `${consoleErrors.join("\n\n")}\n`);
    throw new Error(`Browser console/page errors detected: ${consoleErrors.length}`);
  }
  await fs.writeFile(path.join(outDir, "audit-result.txt"), "PASS\n");
} finally {
  await browser.close();
}
