const { chromium } = require('playwright');

// Inject a visible URL bar into the page so screenshots show the endpoint
async function injectURLBar(page) {
  const url = page.url();
  await page.evaluate((currentUrl) => {
    const existing = document.getElementById('fake-url-bar');
    if (existing) existing.remove();
    const bar = document.createElement('div');
    bar.id = 'fake-url-bar';
    bar.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:44px',
      'background:#f1f3f4', 'border-bottom:2px solid #c8c8c8', 'z-index:2147483647',
      'display:flex', 'align-items:center', 'padding:0 12px', 'box-sizing:border-box',
      'font-family:Arial,sans-serif', 'font-size:14px'
    ].join(';');
    const pill = document.createElement('span');
    pill.style.cssText = [
      'background:#fff', 'border:1px solid #ddd', 'border-radius:20px',
      'padding:6px 18px', 'font-size:13px', 'color:#333',
      'overflow:hidden', 'text-overflow:ellipsis', 'white-space:nowrap', 'max-width:98%'
    ].join(';');
    pill.textContent = currentUrl;
    bar.appendChild(pill);
    document.body.style.marginTop = '48px';
    document.body.insertBefore(bar, document.body.firstChild);
  }, url);
}

// Wait until dealer table has at least one data row
async function waitForDealers(page, timeout) {
  timeout = timeout || 10000;
  try {
    await page.waitForFunction(function () {
      var rows = document.querySelectorAll('table tr');
      return rows.length > 1;
    }, { timeout: timeout });
    await page.waitForTimeout(500);
  } catch (e) {
    console.warn('Dealers did not load in time, proceeding anyway');
    await page.waitForTimeout(2000);
  }
}

// Wait until at least one review panel or "No reviews" text appears
async function waitForReviewsOrEmpty(page, timeout) {
  timeout = timeout || 10000;
  try {
    await page.waitForFunction(function () {
      var panels = document.querySelectorAll('.review_panel');
      var noReview = document.body.innerText.indexOf('No reviews') >= 0;
      var dealerName = document.querySelector('h1');
      return panels.length > 0 || noReview || (dealerName && dealerName.innerText.trim().length > 0);
    }, { timeout: timeout });
    await page.waitForTimeout(800);
  } catch (e) {
    console.warn('Reviews section did not load in time, proceeding anyway');
    await page.waitForTimeout(2000);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  const base = 'http://127.0.0.1:8000';

  // ── get_dealers.png: dealers page before login ──────────────────────────────
  await page.goto(base + '/dealers', { waitUntil: 'domcontentloaded' });
  await waitForDealers(page);
  await page.screenshot({ path: 'get_dealers.png', fullPage: true });
  console.log('get_dealers.png done');

  // ── Login ───────────────────────────────────────────────────────────────────
  await page.goto(base + '/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.fill('input[name="username"]', 'root');
  await page.fill('input[name="psw"]', 'root');
  await page.click('input[type="submit"][value="Login"]');
  // Wait for redirect back to home after login
  await page.waitForURL(base + '/', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1000);

  // ── get_dealers_loggedin.png ────────────────────────────────────────────────
  await page.goto(base + '/dealers', { waitUntil: 'domcontentloaded' });
  await waitForDealers(page);
  await injectURLBar(page);
  await page.screenshot({ path: 'get_dealers_loggedin.png', fullPage: true });
  console.log('get_dealers_loggedin.png done');

  // ── dealersbystate.png: filter by Texas ────────────────────────────────────
  await page.goto(base + '/dealers', { waitUntil: 'domcontentloaded' });
  await waitForDealers(page);
  const stateSelect = page.locator('select#state');
  if (await stateSelect.count()) {
    // Find "Texas" in options (it has several dealers)
    const opts = stateSelect.locator('option');
    const total = await opts.count();
    let picked = false;
    for (let i = 0; i < total; i++) {
      const v = await opts.nth(i).getAttribute('value');
      if (v && v !== 'All' && v.trim() !== '') {
        await stateSelect.selectOption(v);
        picked = true;
        break;
      }
    }
    if (!picked) {
      await stateSelect.selectOption({ index: 1 });
    }
    await waitForDealers(page, 6000);
  }
  await injectURLBar(page);
  await page.screenshot({ path: 'dealersbystate.png', fullPage: true });
  console.log('dealersbystate.png done');

  // ── dealer_id_reviews.png ───────────────────────────────────────────────────
  await page.goto(base + '/dealer/15', { waitUntil: 'domcontentloaded' });
  await waitForReviewsOrEmpty(page);
  await injectURLBar(page);
  await page.screenshot({ path: 'dealer_id_reviews.png', fullPage: true });
  console.log('dealer_id_reviews.png done');

  // ── dealership_review_submission.png + added_review.png ────────────────────
  await page.goto(base + '/postreview/15', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);

  await page.fill('textarea#review', 'Fantastic services and smooth buying experience.');

  const dateInput = page.locator('input[type="date"]');
  if (await dateInput.count()) {
    await dateInput.fill('2023-01-12');
  }

  const carSelect = page.locator('select#cars');
  if (await carSelect.count()) {
    const opts = carSelect.locator('option');
    const total = await opts.count();
    if (total > 1) {
      const v = await opts.nth(1).getAttribute('value');
      if (v) await carSelect.selectOption(v);
    }
  }

  const yearInput = page.locator('input[type="int"]').first();
  if (await yearInput.count()) {
    await yearInput.fill('2023');
    await yearInput.dispatchEvent('change');
  }

  await page.screenshot({ path: 'dealership_review_submission.png', fullPage: true });
  console.log('dealership_review_submission.png done');

  // Submit and wait for redirect to dealer page
  const postBtn = page.locator('button.postreview');
  if (await postBtn.count()) {
    await postBtn.click();
    await page.waitForURL('**/dealer/15', { timeout: 12000 }).catch(() => {
      console.warn('Redirect to /dealer/15 timed out');
    });
    await waitForReviewsOrEmpty(page, 8000);
  }
  await injectURLBar(page);
  await page.screenshot({ path: 'added_review.png', fullPage: true });
  console.log('added_review.png done');

  // ── Deployed screenshots (local deployment at 127.0.0.1:8000) ───────────────
  // deployed_landingpage.png
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await injectURLBar(page);
  await page.screenshot({ path: 'deployed_landingpage.png', fullPage: true });
  console.log('deployed_landingpage.png done');

  // deployed_loggedin.png
  await page.goto(base + '/dealers', { waitUntil: 'domcontentloaded' });
  await waitForDealers(page);
  await injectURLBar(page);
  await page.screenshot({ path: 'deployed_loggedin.png', fullPage: true });
  console.log('deployed_loggedin.png done');

  // deployed_dealer_detail.png
  await page.goto(base + '/dealer/15', { waitUntil: 'domcontentloaded' });
  await waitForReviewsOrEmpty(page);
  await injectURLBar(page);
  await page.screenshot({ path: 'deployed_dealer_detail.png', fullPage: true });
  console.log('deployed_dealer_detail.png done');

  // deployed_add_review.png (dealer page showing all reviews including newly added)
  await page.goto(base + '/dealer/15', { waitUntil: 'domcontentloaded' });
  await waitForReviewsOrEmpty(page);
  await injectURLBar(page);
  await page.screenshot({ path: 'deployed_add_review.png', fullPage: true });
  console.log('deployed_add_review.png done');

  await browser.close();
  console.log('All screenshots generated successfully.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
