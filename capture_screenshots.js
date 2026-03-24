const { chromium } = require('playwright');

async function safeGoto(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
}

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const base = 'http://127.0.0.1:8000';

    await safeGoto(page, `${base}/admin/`);
    await page.fill('#id_username', 'root');
    await page.fill('#id_password', 'root');
    await page.click('input[type="submit"]');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'admin_login.png', fullPage: true });

    await page.click('text=Log out');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'admin_logout.png', fullPage: true });

    await safeGoto(page, `${base}/dealers`);
    await page.screenshot({ path: 'get_dealers.png', fullPage: true });

    await safeGoto(page, `${base}/login`);
    await page.fill('input[name="username"]', 'root');
    await page.fill('input[name="psw"]', 'root');
    await page.click('input[type="submit"][value="Login"]');
    await page.waitForTimeout(1800);

    await safeGoto(page, `${base}/dealers`);
    await page.screenshot({ path: 'get_dealers_loggedin.png', fullPage: true });

    const stateSelect = page.locator('select#state');
    if (await stateSelect.count()) {
        await stateSelect.selectOption({ label: 'Kansas' });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'dealersbystate.png', fullPage: true });
    }

    const dealerLink = page.locator('table a[href^="/dealer/"]').first();
    if (await dealerLink.count()) {
        await dealerLink.click();
        await page.waitForTimeout(1800);
        await page.screenshot({ path: 'dealer_id_reviews.png', fullPage: true });
    }

    const reviewLink = page.locator('a[href^="/postreview/"]').first();
    if (await reviewLink.count()) {
        await reviewLink.click();
        await page.waitForTimeout(1500);
        await page.fill('textarea#review', 'Fantastic services. Quick response and helpful staff.');
        const dateInput = page.locator('input[type="date"]');
        if (await dateInput.count()) {
            await dateInput.fill('2023-01-12');
        }

        const carSelect = page.locator('select#cars');
        if (await carSelect.count()) {
            const options = await carSelect.locator('option').allTextContents();
            if (options.length > 1) {
                const firstReal = options.find((o) => !o.includes('Choose Car Make'));
                if (firstReal) {
                    await carSelect.selectOption({ label: firstReal.trim() });
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
            await page.waitForTimeout(2200);
            await page.screenshot({ path: 'added_review.png', fullPage: true });
        }
    }

    // Deployment-equivalent screenshots from local URL fallback.
    await safeGoto(page, `${base}/`);
    await page.screenshot({ path: 'deployed_landingpage.png', fullPage: true });

    await safeGoto(page, `${base}/dealers`);
    await page.screenshot({ path: 'deployed_loggedin.png', fullPage: true });

    const deployedDealer = page.locator('table a[href^="/dealer/"]').first();
    if (await deployedDealer.count()) {
        await deployedDealer.click();
        await page.waitForTimeout(1700);
        await page.screenshot({ path: 'deployed_dealer_detail.png', fullPage: true });
        await page.screenshot({ path: 'deployed_add_review.png', fullPage: true });
    }

    await browser.close();
    console.log('Screenshots capture attempt complete.');
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
