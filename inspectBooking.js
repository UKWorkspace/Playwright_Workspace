const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' });
  const page = await context.newPage();
  await page.goto('https://www.booking.com', { waitUntil: 'networkidle', timeout: 120000 });
  await page.screenshot({ path: 'booking_homepage.png', fullPage: true });
  const html = await page.content();
  console.log('TITLE:', await page.title());
  console.log('URL:', page.url());
  const snippets = html.match(/.{1,1000}/g).slice(0,10);
  snippets.forEach((s, i) => console.log(`SNIPPET ${i}:
${s}\n---`));
  await browser.close();
})();
