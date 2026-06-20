const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  const today = new Date();
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const format = d => d.toISOString().split('T')[0];
  const checkin = format(addDays(today, 5));
  const checkout = format(addDays(today, 9));
  const url = `https://www.booking.com/searchresults.html?lang=en-us&ss=Stockholm&selected_currency=SEK&group_adults=2&group_children=1&no_rooms=1&checkin_year_month_monthday=${checkin}&checkout_year_month_monthday=${checkout}`;
  console.log('goto', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'booking_results_url.png', fullPage: true });
  const txt = await page.locator('body').innerText();
  console.log('body text char', txt.length);
  const snippet = txt.slice(0, 2000);
  console.log(snippet);
  const filters = await page.locator('div[data-filters-group-name], div[class*="filter"] , [role="group"]').all();
  console.log('filter groups', filters.length);
  for (let i = 0; i < Math.min(filters.length, 20); i++) {
    const outer = await filters[i].evaluate(el => el.outerHTML.slice(0,500)).catch(() => 'error');
    console.log('group', i, outer.replace(/\n/g,' '));
  }
  const breakfast = await page.locator('text=Breakfast included').count();
  console.log('Breakfast included count', breakfast);
  const breakfastEl = await page.locator('text=Breakfast included').first().evaluate(el => el.outerHTML).catch(() => 'none');
  console.log('breakfastEl', breakfastEl.slice(0,500));
  const ratingSpans = await page.locator('span, div').filter({ hasText: 'Review score' }).all();
  console.log('review score spans', ratingSpans.length);
  for (let i = 0; i < Math.min(ratingSpans.length, 15); i++) {
    const html = await ratingSpans[i].evaluate(el => el.outerHTML);
    console.log('score span', i, html.slice(0,300));
  }
  const cards = await page.locator('div[data-testid="property-card"]').all();
  console.log('property cards', cards.length);
  for (let i = 0; i < Math.min(cards.length, 5); i++) {
    const html = await cards[i].evaluate(el => el.outerHTML.slice(0,500));
    console.log('card', i, html.replace(/\n/g,' ').slice(0,500));
  }
  await browser.close();
})();