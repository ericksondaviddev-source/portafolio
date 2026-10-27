import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: 'C:\\Users\\USUARIO\\Desktop\\Apps\\portafolio\\02 LISTOS\\Portafolio-Caverna\\evidencia-pieza-1', size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5175/test-mundo.html');
  await page.waitForTimeout(2000);
  // toggle to garden after 6s
  await page.waitForTimeout(6000);
  await page.click('button');
  await page.waitForTimeout(6000);
  await context.close();
  await browser.close();
})();
