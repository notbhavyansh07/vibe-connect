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
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(1500);

  await page.evaluate(() => {
    if (window.__openAuthModal) {
      window.__openAuthModal();
    }
  });
  await sleep(600);

  await page.evaluate(() => {
    if (window.__setAuthTestError) {
      window.__setAuthTestError('[VALIDATION_ERROR] Please enter a valid email address format.');
    }
  });
  await sleep(400);

  const authModal = await page.$('.section-matcher-deck');
  if (authModal) {
    await authModal.screenshot({ path: path.join(ARTIFACTS_DIR, 'auth_validation_error.png') });
    console.log('Saved auth_validation_error.png with diagnostic error banner');
  }

  await browser.close();
}

run().catch(console.error);
