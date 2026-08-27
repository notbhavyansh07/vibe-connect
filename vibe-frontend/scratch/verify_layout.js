const puppeteer = require('puppeteer-core');
const fs = require('fs');
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
  const baseUrl = 'http://localhost:3000';

  console.log(`Connecting to fresh dev server on ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(3000);

  const results = {};

  // 1. Multi-breakpoint verification
  const breakpoints = [
    { name: '1920px', width: 1920, height: 1080 },
    { name: '1280px', width: 1280, height: 800 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '375px', width: 375, height: 812 }
  ];

  for (const bp of breakpoints) {
    await page.setViewport({ width: bp.width, height: bp.height });
    await sleep(1200);

    const layoutData = await page.evaluate(() => {
      const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12') || document.querySelector('.grid');
      const asides = document.querySelectorAll('aside');
      const main = document.querySelector('main');
      const bottomNav = document.querySelector('.fixed.bottom-0');

      const containerRect = container ? container.getBoundingClientRect() : null;
      const leftRailRect = asides[0] ? asides[0].getBoundingClientRect() : null;
      const mainRect = main ? main.getBoundingClientRect() : null;
      const rightRailRect = asides[1] ? asides[1].getBoundingClientRect() : null;
      const bottomNavRect = bottomNav ? bottomNav.getBoundingClientRect() : null;

      const leftComputed = asides[0] ? window.getComputedStyle(asides[0]) : null;
      const rightComputed = asides[1] ? window.getComputedStyle(asides[1]) : null;
      const bottomNavComputed = bottomNav ? window.getComputedStyle(bottomNav) : null;

      return {
        container: containerRect ? { width: Math.round(containerRect.width), left: Math.round(containerRect.left), right: Math.round(containerRect.right) } : null,
        leftRail: leftRailRect ? { width: Math.round(leftRailRect.width), display: leftComputed ? leftComputed.display : 'none' } : null,
        main: mainRect ? { width: Math.round(mainRect.width), left: Math.round(mainRect.left), right: Math.round(mainRect.right) } : null,
        rightRail: rightRailRect ? { width: Math.round(rightRailRect.width), display: rightComputed ? rightComputed.display : 'none' } : null,
        bottomNav: bottomNavRect ? { visible: bottomNavComputed && bottomNavComputed.display !== 'none' } : null
      };
    });

    const screenshotPath = path.join(ARTIFACTS_DIR, `screenshot_${bp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    results[bp.name] = { layoutData, screenshotPath };
    console.log(`Measured ${bp.name}:`, JSON.stringify(layoutData));
  }

  // 2. Verify RadarChart5D Instances at 1920px
  await page.setViewport({ width: 1920, height: 1080 });
  await sleep(1000);

  // Radar in Left Rail
  const radar1Path = path.join(ARTIFACTS_DIR, 'radar_left_rail.png');
  const leftRailEl = await page.$('aside');
  if (leftRailEl) {
    await leftRailEl.screenshot({ path: radar1Path });
    console.log('Captured radar_left_rail.png');
  }

  // Radar in Matcher Deck
  const radar2Path = path.join(ARTIFACTS_DIR, 'radar_matcher_deck.png');
  const matcherDeckEl = await page.$('.section-matcher-deck');
  if (matcherDeckEl) {
    await matcherDeckEl.screenshot({ path: radar2Path });
    console.log('Captured radar_matcher_deck.png');
  }

  // Click "COMPUTE 5D VECTOR RESONANCE"
  const computeBtn = await page.$('.btn-hero-primary');
  if (computeBtn) {
    await computeBtn.click();
    await sleep(1800);
    const candidateCard = await page.$('.border-pink-500\\/40') || await page.$('.section-matcher-deck');
    if (candidateCard) {
      await candidateCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'radar_candidate_card.png') });
      console.log('Captured radar_candidate_card.png');
    }
  }

  // Open Profile Modal (click user card in Left Rail)
  const profileCard = await page.$('.hud-rail-card');
  if (profileCard) {
    await profileCard.click();
    await sleep(1000);
    const modalEl = await page.$('.section-matcher-deck.max-w-lg') || await page.$('.fixed.inset-0');
    if (modalEl) {
      await modalEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'radar_profile_modal.png') });
      console.log('Captured radar_profile_modal.png');
    }
  }

  // 3. Full page screenshot
  await page.keyboard.press('Escape');
  await sleep(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'full_page_differentiated_sections.png'), fullPage: true });
  console.log('Captured full_page_differentiated_sections.png');

  await browser.close();
  console.log('=== VERIFICATION RUN COMPLETED ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
