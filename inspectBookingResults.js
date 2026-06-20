const { chromium } = require('@playwright/test');
test('Scenario 1', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('https://www.booking.com', { waitUntil: 'networkidle', timeout: 120000 });
  await page.click('button:has-text("EN")').catch(() => {});
  await page.click('button:has-text("English")').catch(() => {});
  await page.fill('[name="ss"]', 'Stockholm');
  await page.click('button[data-testid="searchbox-dates-container"]');
  const today = new Date();
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate()+n);
  const checkin = addDays(today, 5);
  const checkout = addDays(today, 9);
  const format = d => d.toISOString().split('T')[0];
  await page.click(`[data-date="${format(checkin)}"]`);
  await page.click(`[data-date="${format(checkout)}"]`);
  await page.click('[data-testid="occupancy-config"]');
  await page.click('button:has-text("+1 child")').catch(() => {});
  if (await page.locator('select[name="age"]').count() > 0) {
    await page.selectOption('select[name="age"]', '8').catch(() => {});
  } else {
    await page.locator('select').filter({ hasText: 'Age' }).selectOption('8').catch(() => {});
  }
  await page.click('button:has-text("Search")');
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 120000 });
  await page.screenshot({ path: 'booking_search_results.png', fullPage: true });
  console.log('RESULT URL', page.url());
  const text = await page.locator('body').innerText();
  console.log(text.slice(0, 1500));
  const filterElements = await page.locator('text=Breakfast included, text=Budget, text=Price, text=Price per night, [data-filters-group-name], [data-testid="filter"]').all();
  console.log('filters found', filterElements.length);
  for (let i = 0; i < Math.min(filterElements.length, 20); i++) {
    const el = filterElements[i];
    console.log(i, await el.evaluate((e) => e.outerHTML.slice(0, 300)));
  }
  await browser.close();
})();
