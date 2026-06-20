const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.booking.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('TITLE:', await page.title());
  console.log('URL:', page.url());
  const selectors = [
    'button:has-text("English")',
    'button[aria-label*="language"]',
    '[name="ss"]',
    '[data-date]'
  ];
  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    console.log(`SELECTOR ${selector} count=${count}`);
    if (count > 0) {
      console.log(await page.locator(selector).first().textContent());
      console.log(await page.locator(selector).first().getAttribute('aria-label'));
    }
  }
  await browser.close();
})();
