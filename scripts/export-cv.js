// Generates export/CV_light.pdf and export/CV_dark.pdf from the built site.
// Run: npm run export-cv  (builds first, then exports)
// Requires: npm install  (installs puppeteer)

// puppeteer is ESM-only since v25, so it has to be imported dynamically here.
const http      = require('http');
const fs        = require('fs');
const path      = require('path');

const SITE_DIR = path.join(__dirname, '../_site');
const OUT_DIR  = path.join(__dirname, '../export');
const PORT     = 4243;

const HIDE_CHROME = `
  .site-header, .site-footer, .theme-toggle, .back-to-top, .scroll-cue {
    display: none !important;
  }
  html, body { padding: 0 !important; margin: 0 !important; }
  .site-wrapper { max-width: none !important; margin: 0 !important; padding: 0 !important; }
  .site-main  { margin: 0 !important; opacity: 1 !important; transform: none !important; transition: none !important; }
`;

const COMPACT = `
  .site-main    { padding: 1.1cm 1.3cm 0.9cm !important; }
  .cvp-name     { font-size: 1.75rem !important; }
  .cvp-header   { padding-bottom: 0.5rem !important; margin-bottom: 0.7rem !important; }
  .cvp-tagline  { margin: 0 !important; }
  .cvp-about    { font-size: 0.82rem !important; line-height: 1.35 !important; }
  .cvp-section  { padding-bottom: 0.45rem !important; margin-bottom: 0.45rem !important; }
  .cvp-body     { gap: 2rem !important; }
  .cvp-skill-group  { margin-bottom: 0.45rem !important; }
  .section-label    { margin-bottom: 0.3rem !important; }
  .cv-body          { padding-bottom: 0.38rem !important; }
  .cvp-pub-meta     { margin-bottom: 0.2rem !important; }
  .cvp-entry-desc   { margin-top: 0.2rem !important; line-height: 1.32 !important; }
  .cvp-proj-desc    { line-height: 1.35 !important; }
  .cvp-jam-table    { gap: 0.18rem 0.9rem !important; }
  .cvp-contact-list { gap: 0.28rem !important; }
  .cvp-lang-list    { gap: 0.22rem !important; }
  .cvp-tags         { gap: 0.2rem !important; }
  .cvp-teach-grid   { gap: 0.4rem 1rem !important; }
  .cvp-proj-item    { padding-bottom: 0.5rem !important; margin-bottom: 0.5rem !important; }
  .cvp-jam-section  { margin-top: 0.7rem !important; padding-top: 0.7rem !important; }
`;

function startServer() {
  const mime = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.woff2': 'font/woff2', '.webp': 'image/webp',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  };
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      let filePath = path.join(SITE_DIR, urlPath);
      if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
      try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404); res.end();
      }
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

// A4 at 96dpi. Chrome lays a PDF out at (paper size / scale), so the CSS
// viewport that matches the print layout is A4_W / scale.
const A4_W = 8.27 * 96;
const A4_H = 11.69 * 96;
const MAX_SCALE = 0.78;

// .cvp-body is a flex container and Chrome will not fragment one across pages,
// so a document even a few px too tall pushes the whole body onto page 2 and
// leaves page 1 nearly blank. Solve for the scale that keeps it on one page.
async function fitScale(page) {
  let scale = MAX_SCALE;
  for (let i = 0; i < 2; i++) {
    await page.setViewport({ width: Math.round(A4_W / scale), height: 900 });
    await new Promise(r => setTimeout(r, 150));
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    scale = Math.min(MAX_SCALE, (A4_H - 2) / height);
  }
  return scale;
}

async function exportPDF(browser, outputPath, dark) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }]);
  await page.goto(`http://127.0.0.1:${PORT}/cv/`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('screen');
  await page.addStyleTag({ content: HIDE_CHROME });
  await page.addStyleTag({ content: COMPACT });
  await new Promise(r => setTimeout(r, 400));
  const scale = await fitScale(page);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    printBackground: true,
    displayHeaderFooter: false,
    scale,
  });
  await page.close();
  console.log(`  Saved ${outputPath} (scale ${scale.toFixed(4)})`);
}

async function main() {
  if (!fs.existsSync(SITE_DIR)) {
    console.error('_site/ not found — run `npm run build` first.');
    process.exit(1);
  }
  console.log('Starting export...');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { default: puppeteer } = await import('puppeteer');
  const server  = await startServer();
  const browser = await puppeteer.launch({ headless: true });
  try {
    await exportPDF(browser, path.join(OUT_DIR, 'CV_light.pdf'), false);
    await exportPDF(browser, path.join(OUT_DIR, 'CV_dark.pdf'),  true);
  } finally {
    await browser.close();
    server.close();
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
