const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('https://www.booking.com', { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('[name="ss"]', { timeout: 60000 });
  await page.fill('[name="ss"]', 'Stockholm');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.click('[data-testid="searchbox-dates-container"]', { force: true });
  const today = new Date();
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const format = d => d.toISOString().split('T')[0];
  const checkin = format(addDays(today, 5));
  const checkout = format(addDays(today, 9));
  console.log('checkin', checkin, 'checkout', checkout);
  await page.waitForSelector(`[data-date="${checkin}"]`, { timeout: 60000 });
  await page.click(`[data-date="${checkin}"]`, { force: true });
  await page.click(`[data-date="${checkout}"]`, { force: true });
  await page.waitForTimeout(1000);
  await page.click('[data-testid="occupancy-config"]', { force: true });
  await page.waitForTimeout(1000);
  const occupancyHtml = await page.locator('[data-testid="occupancy-config"]').first().evaluate(el => el.outerHTML);
  console.log('occupancyHtml', occupancyHtml.slice(0, 500));
  const buttons = await page.locator('div[role="dialog"] button, div[role="dialog"] div button, div[role="application"] button, button').all();
  console.log('button count', buttons.length);
  for (let i = 0; i < Math.min(buttons.length, 50); i++) {
    const outer = await buttons[i].evaluate(el => el.outerHTML.slice(0,500));
    const text = await buttons[i].innerText().catch(() => '');
    const aria = await buttons[i].getAttribute('aria-label');
    console.log(i, 'text', text, 'aria', aria, 'outer', outer.replace(/\n/g,' '));
  }
  const selects = await page.locator('select').all();
  console.log('select count', selects.length);
  for (let i = 0; i < selects.length; i++) {
    console.log('select', i, await selects[i].evaluate(el => el.outerHTML.slice(0,300)));
  }
  await page.click('button[type="submit"]:has-text("Search")', { force: true }).catch(() => {});
  await page.waitForTimeout(5000);
  const pageText = await page.locator('body').innerText();
  console.log(pageText.slice(0,2000));
  await browser.close();
})();