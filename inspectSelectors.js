const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('https://www.booking.com', { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(5000);
  const searchContainers = await page.locator('form').all();
  console.log('Forms:', searchContainers.length);
  for (let i = 0; i < Math.min(searchContainers.length, 5); i++) {
    const html = await searchContainers[i].evaluate((el) => el.outerHTML.slice(0, 2000));
    console.log(`FORM ${i}: ${html}`);
  }
  const items = [
    'text=English',
    'text=English (US)',
    '[aria-label*="language"]',
    'button:has-text("English")',
    'button:has-text("EN")',
    '[name="ss"]',
    '[placeholder*="Where are you going"]',
    'input[aria-label*="Destination"]',
    '[data-testid="searchbox-input"]',
    'input[type="search"]',
    'button:has-text("Search")',
    'button:has-text("Show results")',
    'button:has-text("Breakfast included")',
    'text=Breakfast included',
    'text=Adults',
    'text=Children',
    '[data-testid*="guest"]',
    '[data-testid*="occupancy"]',
    'button[aria-label*="Adult"]',
    'button[aria-label*="Children"]',
    'button[aria-label*="Decrease number of adults"]',
    'button[aria-label*="Increase number of adults"]',
  ];
  for (const sel of items) {
    try {
      const count = await page.locator(sel).count();
      console.log(`${sel} => ${count}`);
      if (count > 0) {
        const text = await page.locator(sel).first().innerText().catch(() => 'NO TEXT');
        const outer = await page.locator(sel).first().evaluate((el) => el.outerHTML.slice(0, 500)).catch(() => 'NO HTML');
        console.log('  text:', text);
        console.log('  outer:', outer);
      }
    } catch (e) {
      console.log(`${sel} => ERROR ${e.message}`);
    }
  }
  await browser.close();
})();
