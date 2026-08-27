const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f2361cd9-1549-4858-a610-24c70a42acea';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('--- STARTING BENTO GRID LAYOUT VERIFICATION ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // ── TEST 1: 1920px Viewport (Desktop Full) ──
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // Scroll to #bento
  await page.evaluate(() => {
    const bento = document.querySelector('#bento');
    if (bento) bento.scrollIntoView();
  });
  await sleep(800);

  const bentoMetrics1920 = await page.evaluate(() => {
    const section = document.querySelector('#bento');
    const gridContainer = section.querySelector('.grid-bento-2col, .grid');
    const cards = gridContainer.querySelectorAll('.glass-card');
    const computedGrid = window.getComputedStyle(gridContainer);

    const cardBoxes = Array.from(cards).map((c, i) => {
      const rect = c.getBoundingClientRect();
      return {
        cardIndex: i + 1,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        top: Math.round(rect.top),
      };
    });

    return {
      sectionWidth: Math.round(section.getBoundingClientRect().width),
      gridWidth: Math.round(gridContainer.getBoundingClientRect().width),
      display: computedGrid.display,
      gridTemplateColumns: computedGrid.gridTemplateColumns,
      cardBoxes,
    };
  });

  console.log('1920px Bento Metrics:', JSON.stringify(bentoMetrics1920, null, 2));

  const bentoSectionEl = await page.$('#bento');
  if (bentoSectionEl) {
    await bentoSectionEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_1920px.png') });
    console.log('Saved bento_grid_1920px.png');
  }

  // ── TEST 2: 1440px Viewport ──
  await page.setViewport({ width: 1440, height: 900 });
  await sleep(800);
  if (bentoSectionEl) {
    await bentoSectionEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_1440px.png') });
    console.log('Saved bento_grid_1440px.png');
  }

  // ── TEST 3: 375px Viewport (Mobile) ──
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await sleep(800);
  if (bentoSectionEl) {
    await bentoSectionEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'bento_grid_375px.png') });
    console.log('Saved bento_grid_375px.png');
  }

  await browser.close();
  console.log('--- BENTO VERIFICATION COMPLETE ---');
}

run().catch(console.error);
