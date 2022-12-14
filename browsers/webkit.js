const playwright = require('playwright');

(async () => {
  const browser = await playwright['webkit'].launch({
    headless: false
  });
  const context = browser.newContext();
  const page = await (await context).newPage();
  await page.goto('http://localhost:4200/warcry-companion');
})();
