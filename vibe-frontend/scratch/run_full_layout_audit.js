const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f2361cd9-1549-4858-a610-24c70a42acea';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VIEWPORTS = [
  { name: '375px', width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: '768px', width: 768, height: 1024, isMobile: false, hasTouch: false },
  { name: '1024px', width: 1024, height: 768, isMobile: false, hasTouch: false },
  { name: '1440px', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: '1920px', width: 1920, height: 1080, isMobile: false, hasTouch: false },
];

async function run() {
  console.log('===========================================================');
  console.log('  STARTING APP-WIDE LAYOUT AUDIT & REGRESSION INSPECTION  ');
  console.log('===========================================================');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const auditResults = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Auditing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewport(vp);
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await sleep(2000);

    const vpMetrics = await page.evaluate((vpWidth) => {
      const getBox = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          top: Math.round(rect.top),
          display: style.display,
          gridTemplateColumns: style.gridTemplateColumns,
          visibility: style.visibility,
        };
      };

      // 1. Dashboard 3-Column Split
      const dashboardGrid = getBox('.grid.grid-cols-1.lg\\:grid-cols-12, .grid.lg\\:grid-cols-12');
      const leftRail = getBox('aside.lg\\:col-span-3:first-of-type, aside:first-of-type');
      const centerMain = getBox('main.lg\\:col-span-6, main');
      const rightRail = getBox('aside.lg\\:col-span-3:last-of-type, aside:last-of-type');

      // 2. Bento Grid (#bento)
      const bentoSection = getBox('#bento');
      const bentoGrid = getBox('#bento .grid-bento-2col, #bento .grid');
      const bentoCards = Array.from(document.querySelectorAll('#bento .glass-card')).map(c => {
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height), x: Math.round(r.x), top: Math.round(r.top) };
      });

      // 3. Hero Telemetry Stats (3 cols)
      const heroStats = Array.from(document.querySelectorAll('.section-hero-frame .grid.grid-cols-3 > div')).map(s => {
        const r = s.getBoundingClientRect();
        return { width: Math.round(r.width), top: Math.round(r.top) };
      });

      // 4. Vibe Matcher Deck (Faders + Radar)
      const matcherFaders = getBox('#matcher .lg\\:col-span-7');
      const matcherRadar = getBox('#matcher .lg\\:col-span-5');

      // 5. Live Lounge 4 Channels
      const loungeChannels = Array.from(document.querySelectorAll('#lounge .grid.grid-cols-2 > button, #lounge .grid.sm\\:grid-cols-4 > button')).map(b => {
        const r = b.getBoundingClientRect();
        return { width: Math.round(r.width), top: Math.round(r.top) };
      });

      // 6. Story Circles Row
      const storiesContainer = getBox('#feed .overflow-x-auto');
      const storyNodes = Array.from(document.querySelectorAll('#feed .overflow-x-auto > div')).map(s => {
        const r = s.getBoundingClientRect();
        return { x: Math.round(r.x), top: Math.round(r.top) };
      });

      // 7. Footer Grid
      const footerGrid = getBox('footer .grid');
      const footerCols = Array.from(document.querySelectorAll('footer .grid > div')).map(c => {
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), x: Math.round(r.x), top: Math.round(r.top) };
      });

      return {
        vpWidth,
        dashboardGrid,
        leftRail,
        centerMain,
        rightRail,
        bentoSection,
        bentoGrid,
        bentoCards,
        heroStats,
        matcherFaders,
        matcherRadar,
        loungeChannels,
        storiesContainer,
        storyNodes,
        footerGrid,
        footerCols,
      };
    }, vp.width);

    // Save full page screenshot per breakpoint
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, `audit_full_page_${vp.name}.png`),
      fullPage: false,
    });

    auditResults.push({ viewport: vp.name, metrics: vpMetrics });
  }

  await browser.close();

  console.log('\n===========================================================');
  console.log('            APP-WIDE AUDIT METRICS SUMMARY               ');
  console.log('===========================================================');
  console.log(JSON.stringify(auditResults, null, 2));

  return auditResults;
}

run().catch(console.error);
