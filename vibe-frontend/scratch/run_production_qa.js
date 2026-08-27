const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f2361cd9-1549-4858-a610-24c70a42acea';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Starting Production Readiness & Cross-Device QA runner...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // ── TEST 1: Safari / WebKit User-Agent Emulation ──
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15');
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // Capture Safari emulation screenshot
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'safari_emulation_render.png') });
  console.log('Saved safari_emulation_render.png');

  // ── TEST 2: Real Mobile Device Emulation (iPhone 14 Pro — 393 x 852, touch: true) ──
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await sleep(1000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_device_emulation.png') });
  console.log('Saved mobile_device_emulation.png');

  // ── TEST 3: Network Throttling & Offline Diagnostic Banner ──
  await page.setOfflineMode(true);
  await sleep(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'offline_network_banner.png') });
  console.log('Saved offline_network_banner.png');
  await page.setOfflineMode(false);
  await sleep(500);

  // ── TEST 4: Open Auth Modal & Trigger Form Validation ──
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    if (window.__openAuthModal) {
      window.__openAuthModal();
    }
  });
  await sleep(800);

  const authEmail = await page.$('#auth-email');
  if (authEmail) {
    await page.type('#auth-email', 'invalid-email-string');
    await page.type('#auth-password', '123'); // < 6 chars
    await page.evaluate(() => {
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await sleep(500);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'auth_validation_error.png') });
    console.log('Saved auth_validation_error.png');
  }

  // ── TEST 5: SEO and Metadata Verification ──
  const seoReport = await page.evaluate(() => {
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

    return {
      title,
      metaDescription,
      ogTitle,
      ogImage,
      twitterCard,
      canonical,
    };
  });

  console.log('=== SEO METADATA AUDIT REPORT ===');
  console.log(JSON.stringify(seoReport, null, 2));

  await browser.close();
  console.log('=== QA RUNNER FINISHED SUCCESSFULLY ===');
}

run().catch(console.error);
