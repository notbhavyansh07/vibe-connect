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
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // 1. Capture empty state in lounge by clicking channel 2 (Cyberpunk Gaming with 0 messages)
  await page.evaluate(() => {
    const loungeBtn = document.querySelectorAll('.section-soundstage button');
    loungeBtn.forEach(btn => {
      if (btn.textContent.includes('Cyberpunk Gaming')) {
        btn.click();
      }
    });
  });
  await sleep(600);

  const loungeSection = await page.$('#lounge');
  if (loungeSection) {
    await loungeSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'empty_state_lounge.png') });
    console.log('Saved empty_state_lounge.png');
  }

  // 2. Capture empty state in feed by clicking AI Picks tab (0 posts)
  await page.evaluate(() => {
    const feedFilterBtns = document.querySelectorAll('#feed button');
    feedFilterBtns.forEach(btn => {
      if (btn.textContent.includes('AI Picks')) {
        btn.click();
      }
    });
  });
  await sleep(600);

  const feedSection = await page.$('#feed');
  if (feedSection) {
    await feedSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'empty_state_feed.png') });
    console.log('Saved empty_state_feed.png');
  }

  await browser.close();
  console.log('=== EMPTY STATES CAPTURED ===');
}

run().catch(console.error);
