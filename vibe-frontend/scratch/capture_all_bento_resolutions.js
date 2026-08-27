const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f2361cd9-1549-4858-a610-24c70a42acea';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. 1920px (Desktop Full)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2000);
  await page.evaluate(() => {
    const el = document.querySelector('#bento');
    if (el) el.scrollIntoView();
  });
  await sleep(600);
  let el = await page.$('#bento');
  if (el) await el.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_1920px.png') });
  console.log('Saved bento_grid_1920px.png');

  // 2. 1440px (Laptop)
  await page.setViewport({ width: 1440, height: 900 });
  await sleep(600);
  await page.evaluate(() => {
    const el = document.querySelector('#bento');
    if (el) el.scrollIntoView();
  });
  await sleep(400);
  el = await page.$('#bento');
  if (el) await el.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_1440px.png') });
  console.log('Saved bento_grid_1440px.png');

  // 3. 768px (Tablet)
  await page.setViewport({ width: 768, height: 1024 });
  await sleep(600);
  await page.evaluate(() => {
    const el = document.querySelector('#bento');
    if (el) el.scrollIntoView();
  });
  await sleep(400);
  el = await page.$('#bento');
  if (el) await el.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_768px.png') });
  console.log('Saved bento_grid_768px.png');

  // 4. 375px (Mobile)
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await sleep(600);
  await page.evaluate(() => {
    const el = document.querySelector('#bento');
    if (el) el.scrollIntoView();
  });
  await sleep(400);
  el = await page.$('#bento');
  if (el) await el.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_375px.png') });
  console.log('Saved bento_grid_375px.png');

  await browser.close();
  console.log('ALL BENTO RESOLUTION SCREENSHOTS CAPTURED');
}

run().catch(console.error);
