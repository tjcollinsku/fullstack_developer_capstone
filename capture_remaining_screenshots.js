const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const base = 'http://127.0.0.1:8000';

  await page.goto(base + '/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.fill('input[name="username"]', 'root');
  await page.fill('input[name="psw"]', 'root');
  await page.click('input[type="submit"][value="Login"]');
  await page.waitForTimeout(1800);

  await page.goto(base + '/dealers', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1400);

  const stateSelect = page.locator('select#state');
  if (await stateSelect.count()) {
    try {
      const options = stateSelect.locator('option');
      const count = await options.count();
      let selected = false;
      for (let i = 0; i < count; i += 1) {
        const value = await options.nth(i).getAttribute('value');
        const label = (await options.nth(i).innerText()).trim();
        if (!value || value === 'All' || label.toLowerCase().includes('state')) {
          continue;
        }
        await stateSelect.selectOption(value);
        selected = true;
        break;
      }
      if (!selected) {
        await stateSelect.selectOption({ index: 1 });
      }
      await page.waitForTimeout(1400);
    } catch (e) {
      console.error('State filter selection failed, continuing:', e.message);
    }
  }
  await page.screenshot({ path: 'dealersbystate.png', fullPage: true });

  await page.goto(base + '/dealer/15', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'dealer_id_reviews.png', fullPage: true });

  await page.goto(base + '/postreview/15', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.fill('textarea#review', 'Fantastic services and smooth buying experience.');

  const dateInput = page.locator('input[type="date"]');
  if (await dateInput.count()) {
    await dateInput.fill('2023-01-12');
  }

  const carSelect = page.locator('select#cars');
  if (await carSelect.count()) {
    const options = carSelect.locator('option');
    const count = await options.count();
    if (count > 1) {
      const value = await options.nth(1).getAttribute('value');
      if (value) {
        await carSelect.selectOption(value);
      }
    }
  }

  const yearInput = page.locator('input[type="int"], input[type="number"]').first();
  if (await yearInput.count()) {
    await yearInput.fill('2023');
  }

  await page.screenshot({ path: 'dealership_review_submission.png', fullPage: true });

  const postButton = page.locator('button.postreview');
  if (await postButton.count()) {
    await postButton.click();
    await page.waitForTimeout(2500);
  }
  await page.screenshot({ path: 'added_review.png', fullPage: true });

  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'deployed_landingpage.png', fullPage: true });

  await page.goto(base + '/dealers', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'deployed_loggedin.png', fullPage: true });

  await page.goto(base + '/dealer/15', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1300);
  await page.screenshot({ path: 'deployed_dealer_detail.png', fullPage: true });

  await page.goto(base + '/dealer/15', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1300);
  await page.screenshot({ path: 'deployed_add_review.png', fullPage: true });

  await browser.close();
  console.log('Remaining screenshots generated');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
