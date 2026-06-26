#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "../docs/screenshots");
const output = path.join(outDir, "storefront.jpg");
const url = process.env.STORE_URL ?? "https://nordstrand-commerce.netlify.app";

const chromePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

async function run() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  page.setDefaultTimeout(90_000);

  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: "Tidlös heminredning från Norden" }).waitFor();
  await page.getByRole("link", { name: "Linnekudde Nord" }).first().waitFor();

  await page.screenshot({
    path: output,
    fullPage: false,
    type: "jpeg",
    quality: 88
  });

  await browser.close();
  console.log(`Saved ${output}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
