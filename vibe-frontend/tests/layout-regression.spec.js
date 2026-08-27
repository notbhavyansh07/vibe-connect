/**
 * VIBE CONNECT — AUTOMATED CONCRETE LAYOUT REGRESSION TEST SUITE
 * ============================================================================
 * Tests geometric and coordinate invariants across viewports (375px, 1024px, 1920px).
 * Asserts concrete DOM layout facts (bounding box coordinates, column spans,
 * alignment tolerances, and display styles) rather than brittle image hashes.
 * ============================================================================
 */

const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

async function runLayoutTestSuite() {
  console.log('======================================================================');
  console.log('     RUNNING VIBE CONNECT AUTOMATED LAYOUT REGRESSION TEST SUITE      ');
  console.log('======================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // =========================================================================
  // TEST SUITE 1: DESKTOP 1920px FULL VIEWPORT
  // =========================================================================
  console.log('[SUITE 1] Desktop Wide Viewport (1920x1080)');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2000);

  const d1920 = await page.evaluate(() => {
    const getRect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        width: Math.round(r.width),
        height: Math.round(r.height),
        x: Math.round(r.x),
        top: Math.round(r.top),
        display: s.display,
      };
    };

    const dashboardGrid = document.querySelector('.grid.lg\\:grid-cols-12, .grid.grid-cols-1.lg\\:grid-cols-12');
    const rails = dashboardGrid ? Array.from(dashboardGrid.querySelectorAll(':scope > aside')) : [];
    const mainEl = dashboardGrid ? dashboardGrid.querySelector(':scope > main') : null;

    const leftRail = getRect(rails[0]);
    const main = getRect(mainEl);
    const rightRail = getRect(rails[1]);

    // Bento
    const bentoCards = Array.from(document.querySelectorAll('#bento .glass-card')).map(c => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), x: Math.round(r.x), top: Math.round(r.top) };
    });

    // Hero stats
    const heroStats = Array.from(document.querySelectorAll('.section-hero-frame .grid.grid-cols-3 > div')).map(s => {
      const r = s.getBoundingClientRect();
      return { width: Math.round(r.width), x: Math.round(r.x), top: Math.round(r.top) };
    });

    // Lounge channels
    const channels = Array.from(document.querySelectorAll('#lounge .grid.grid-cols-2 > button, #lounge .grid.sm\\:grid-cols-4 > button')).map(b => {
      const r = b.getBoundingClientRect();
      return { width: Math.round(r.width), x: Math.round(r.x), top: Math.round(r.top) };
    });

    // Footer columns
    const footerCols = Array.from(document.querySelectorAll('footer .grid > div')).map(c => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), x: Math.round(r.x), top: Math.round(r.top) };
    });

    return { leftRail, main, rightRail, bentoCards, heroStats, channels, footerCols };
  });

  // Assert Dashboard 3-Column Split at 1920px
  assert(d1920.leftRail && d1920.leftRail.width > 250, '1920px: LeftRail rendered with desktop width (>250px)');
  assert(d1920.main && d1920.main.width > 600, '1920px: Center Main rendered with 6-col width (>600px)');
  assert(d1920.rightRail && d1920.rightRail.width > 250, '1920px: RightRail rendered with desktop width (>250px)');
  assert(
    Math.abs(d1920.leftRail.top - d1920.main.top) <= 2 && Math.abs(d1920.main.top - d1920.rightRail.top) <= 2,
    '1920px: LeftRail, CenterMain, and RightRail share matching top coordinate (side-by-side)'
  );
  assert(
    d1920.leftRail.x < d1920.main.x && d1920.main.x < d1920.rightRail.x,
    '1920px: 3 Columns are positioned sequentially left-to-right (no stacking or overlaps)'
  );

  // Assert Bento 2x2 Grid at 1920px
  assert(d1920.bentoCards.length === 4, '1920px: Bento section has exactly 4 feature cards');
  assert(
    Math.abs(d1920.bentoCards[0].top - d1920.bentoCards[1].top) <= 2,
    '1920px: Bento Row 1 cards (WebGL 3D & Binaural Sound) have identical top (side-by-side)'
  );
  assert(
    d1920.bentoCards[0].x < d1920.bentoCards[1].x,
    '1920px: Bento Row 1 Card 1 is to the left of Card 2'
  );
  assert(
    Math.abs(d1920.bentoCards[2].top - d1920.bentoCards[3].top) <= 2,
    '1920px: Bento Row 2 cards (AI Neural & Zero Trust) have identical top (side-by-side)'
  );
  assert(
    d1920.bentoCards[2].x < d1920.bentoCards[3].x,
    '1920px: Bento Row 2 Card 3 is to the left of Card 4'
  );
  assert(
    Math.abs(d1920.bentoCards[0].height - d1920.bentoCards[1].height) <= 2,
    '1920px: Bento Row 1 cards have equal height'
  );
  assert(
    Math.abs(d1920.bentoCards[2].height - d1920.bentoCards[3].height) <= 2,
    '1920px: Bento Row 2 cards have equal height'
  );

  // Assert Hero 3 Stats at 1920px
  assert(
    d1920.heroStats.length === 3 &&
    Math.abs(d1920.heroStats[0].top - d1920.heroStats[1].top) <= 2 &&
    Math.abs(d1920.heroStats[1].top - d1920.heroStats[2].top) <= 2,
    '1920px: Hero telemetry 3 stats render in a single horizontal row'
  );

  // Assert Footer 4 Columns at 1920px
  assert(
    d1920.footerCols.length === 4 &&
    Math.abs(d1920.footerCols[0].top - d1920.footerCols[1].top) <= 2 &&
    Math.abs(d1920.footerCols[1].top - d1920.footerCols[2].top) <= 2 &&
    Math.abs(d1920.footerCols[2].top - d1920.footerCols[3].top) <= 2,
    '1920px: Footer renders 4 columns side-by-side across full width'
  );

  // =========================================================================
  // TEST SUITE 2: DESKTOP 1024px THRESHOLD VIEWPORT
  // =========================================================================
  console.log('\n[SUITE 2] Desktop 1024px Breakpoint Floor (1024x768)');
  await page.setViewport({ width: 1024, height: 768 });
  await sleep(800);

  const d1024 = await page.evaluate(() => {
    const getRect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), x: Math.round(r.x), top: Math.round(r.top) };
    };

    const dashboardGrid = document.querySelector('.grid.lg\\:grid-cols-12, .grid.grid-cols-1.lg\\:grid-cols-12');
    const rails = dashboardGrid ? Array.from(dashboardGrid.querySelectorAll(':scope > aside')) : [];
    const mainEl = dashboardGrid ? dashboardGrid.querySelector(':scope > main') : null;

    const leftRail = getRect(rails[0]);
    const main = getRect(mainEl);
    const rightRail = getRect(rails[1]);
    const bentoCards = Array.from(document.querySelectorAll('#bento .glass-card')).map(c => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), x: Math.round(r.x), top: Math.round(r.top) };
    });

    return { leftRail, main, rightRail, bentoCards };
  });

  assert(d1024.leftRail && d1024.leftRail.width > 180, '1024px: LeftRail visible and >=180px wide');
  assert(d1024.main && d1024.main.width > 400, '1024px: CenterMain visible and >=400px wide');
  assert(d1024.rightRail && d1024.rightRail.width > 180, '1024px: RightRail visible and >=180px wide');
  assert(
    Math.abs(d1024.leftRail.top - d1024.main.top) <= 2 && Math.abs(d1024.main.top - d1024.rightRail.top) <= 2,
    '1024px: LeftRail, CenterMain, and RightRail share matching top coordinate (no collapse)'
  );
  assert(
    d1024.leftRail.x < d1024.main.x && d1024.main.x < d1024.rightRail.x,
    '1024px: 3 Columns are positioned sequentially left-to-right'
  );
  assert(
    Math.abs(d1024.bentoCards[0].top - d1024.bentoCards[1].top) <= 2,
    '1024px: Bento Row 1 cards arranged side-by-side'
  );
  assert(
    Math.abs(d1024.bentoCards[2].top - d1024.bentoCards[3].top) <= 2,
    '1024px: Bento Row 2 cards arranged side-by-side'
  );

  // =========================================================================
  // TEST SUITE 3: MOBILE 375px VIEWPORT
  // =========================================================================
  console.log('\n[SUITE 3] Mobile Viewport (375x812)');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await sleep(800);

  const m375 = await page.evaluate(() => {
    const dashboardGrid = document.querySelector('.grid.lg\\:grid-cols-12, .grid.grid-cols-1.lg\\:grid-cols-12');
    const rails = dashboardGrid ? Array.from(dashboardGrid.querySelectorAll(':scope > aside')) : [];
    const main = dashboardGrid ? dashboardGrid.querySelector(':scope > main') : null;
    const bottomNav = document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
    
    const bentoCards = Array.from(document.querySelectorAll('#bento .glass-card')).map(c => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), top: Math.round(r.top) };
    });

    const isLeftHidden = !rails[0] || window.getComputedStyle(rails[0]).display === 'none' || rails[0].getBoundingClientRect().width === 0;
    const isRightHidden = !rails[1] || window.getComputedStyle(rails[1]).display === 'none' || rails[1].getBoundingClientRect().width === 0;

    return {
      isLeftHidden,
      isRightHidden,
      mainWidth: main ? Math.round(main.getBoundingClientRect().width) : 0,
      bottomNavVisible: !!bottomNav && window.getComputedStyle(bottomNav).display !== 'none',
      bentoCards,
    };
  });

  assert(m375.isLeftHidden, '375px: LeftRail is hidden on mobile');
  assert(m375.isRightHidden, '375px: RightRail is hidden on mobile');
  assert(m375.mainWidth > 320, '375px: Main content spans mobile viewport (>320px)');
  assert(m375.bottomNavVisible, '375px: Mobile bottom navigation bar is active');
  assert(
    m375.bentoCards[0].top < m375.bentoCards[1].top &&
    m375.bentoCards[1].top < m375.bentoCards[2].top &&
    m375.bentoCards[2].top < m375.bentoCards[3].top,
    '375px: Bento feature cards stack in a single clean column on mobile'
  );

  try {
    await page.close();
    await browser.close();
  } catch (e) {
    // Ignore teardown close issues
  }

  // =========================================================================
  // TEST REPORT & EXIT CODE
  // =========================================================================
  console.log('\n======================================================================');
  console.log(`  TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('======================================================================\n');

  if (failedCount > 0) {
    console.error(`Layout regression test suite FAILED with ${failedCount} errors.`);
    process.exit(1);
  } else {
    console.log('All layout regression tests PASSED with 100% precision.');
    process.exit(0);
  }
}

runLayoutTestSuite().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
