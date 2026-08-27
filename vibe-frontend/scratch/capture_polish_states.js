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

  // 1. Capture Loading Radar State during calculation
  const computeBtn = await page.$('.btn-hero-primary');
  if (computeBtn) {
    await computeBtn.click();
    await sleep(250); // mid-calculation sweep
    const matcherDeck = await page.$('.section-matcher-deck');
    if (matcherDeck) {
      await matcherDeck.screenshot({ path: path.join(ARTIFACTS_DIR, 'loading_radar_sweep.png') });
      console.log('Saved loading_radar_sweep.png');
    }
  }

  await sleep(1500);

  // 2. Capture Keyboard Focus Ring
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await sleep(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'keyboard_focus_ring.png') });
  console.log('Saved keyboard_focus_ring.png');

  // 3. Capture Empty State in Feed (click AI Picks tab with 0 posts)
  const tabs = await page.$$('.flex.items-center.gap-1.bg-slate-950 button');
  if (tabs.length >= 3) {
    await tabs[2].click(); // "AI Picks" tab
    await sleep(500);
    const feedSection = await page.$('#feed');
    if (feedSection) {
      await feedSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'empty_state_feed.png') });
      console.log('Saved empty_state_feed.png');
    }
  }

  // 4. Capture Empty State in Lounge (click Cyberpunk Gaming tab with 0 messages)
  const loungeTabs = await page.$$('.section-soundstage .grid button');
  if (loungeTabs.length >= 2) {
    await loungeTabs[1].click(); // "Cyberpunk Gaming" channel
    await sleep(500);
    const loungeSection = await page.$('#lounge');
    if (loungeSection) {
      await loungeSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'empty_state_lounge.png') });
      console.log('Saved empty_state_lounge.png');
    }
  }

  await browser.close();
  console.log('=== POLISH STATES CAPTURED SUCCESSFULLY ===');
}

run().catch(console.error);
