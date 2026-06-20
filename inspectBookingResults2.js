const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('https://www.booking.com', { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('[name="ss"]', { timeout: 60000 });
  await page.fill('[name="ss"]', 'Stockholm');
  await page.click('[data-testid="searchbox-dates-container"]');
  const today = new Date();
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const format = d => d.toISOString().split('T')[0];
  const checkin = format(addDays(today, 5));
  const checkout = format(addDays(today, 9));
  console.log('checkin', checkin, 'checkout', checkout);
  await page.waitForSelector(`[data-date="${checkin}"]`, { timeout: 60000 });
  await page.click(`[data-date="${checkin}"]`);
  await page.click(`[data-date="${checkout}"]`);
  await page.click('[data-testid="occupancy-config"]');
  await page.waitForSelector('button:has-text("+1 child")', { timeout: 60000 }).catch(() => {});
  console.log('clicked occupancy');
  const plusChild = page.locator('button:has-text("+1 child")');
  if (await plusChild.count()) {
    await plusChild.first().click();
  } else {
    const increaseChild = page.locator('button[aria-label*="Children"]:has-text("+")');
    if (await increaseChild.count()) await increaseChild.first().click();
  }
  await page.waitForTimeout(1000);
  const ageSelects = await page.locator('select').all();
  console.log('age select count', ageSelects.length);
  for (let i = 0; i < ageSelects.length; i++) {
    console.log('select', i, await ageSelects[i].evaluate((el) => el.outerHTML.slice(0, 300)));
  }
  if (await ageSelects.length > 0) {
    await ageSelects[0].selectOption('8');
    console.log('selected child age 8');
  }
  await page.click('button:has-text("Search")');
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 120000 });
  console.log('results url', page.url());
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'booking_search_results2.png', fullPage: true });
  const breakfast = await page.locator('text=Breakfast included').count();
  const budget = await page.locator('text=Price').count();
  const budget2 = await page.locator('text=Budget per night').count();
  console.log('Breakfast included count', breakfast, 'Price count', budget, 'Budget per night count', budget2);
  const breakfastHtml = await page.locator('text=Breakfast included').first().evaluate((el) => el.outerHTML).catch(() => 'none');
  console.log('Breakfast html', breakfastHtml.slice(0, 1000));
  const priceHtml = await page.locator('text=Price').first().evaluate((el) => el.outerHTML).catch(() => 'none');
  console.log('Price html', priceHtml.slice(0, 1000));
  const items = await page.locator('[data-filters-group-name]').all();
  console.log('data-filters-group-name count', items.length);
  for (let i = 0; i < Math.min(items.length, 10); i++) {
    console.log(`group ${i}:`, await items[i].evaluate((el) => el.outerHTML.slice(0, 400)));
  }
  await browser.close();
})();
