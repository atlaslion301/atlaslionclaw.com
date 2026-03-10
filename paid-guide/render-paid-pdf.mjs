import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';

const root = process.cwd();
const htmlPath = path.join(root, 'paid-guide', 'premium-template.html');
const outPath = path.join(root, 'public', 'paid', 'openclaw-operator-playbook.pdf');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size:9px;width:100%;padding:0 10mm;color:#64748b;">AtlasLionClaw · OpenClaw Operator Playbook</div>`,
  footerTemplate: `<div style="font-size:9px;width:100%;padding:0 10mm;color:#64748b;display:flex;justify-content:space-between;"><span>atlaslionclaw.com</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
  margin: { top: '16mm', right: '10mm', bottom: '16mm', left: '10mm' }
});
await browser.close();
console.log('Generated', outPath);
