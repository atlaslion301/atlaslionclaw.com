import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';

const root = process.cwd();
const htmlPath = path.join(root, 'free-guide', 'premium-template.html');
const outPath = path.join(root, 'public', 'free', 'openclaw-quick-fix-guide.pdf');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' }
});
await browser.close();
console.log('Generated', outPath);
