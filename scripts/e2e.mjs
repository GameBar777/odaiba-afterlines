// Playwright e2e: mobile 390x844 + desktop 1280x800. Usage: node scripts/e2e.mjs [baseURL]
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.argv[2] || 'http://localhost:4190/';
const OUT = 'docs/screenshots'; mkdirSync(OUT, { recursive: true });
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (info ? ' — ' + info : '')); };
const DISC = '本作は防災教育を目的としたシミュレーションゲームです。';
const browser = await chromium.launch();
async function run(label, viewport, preset, pick, shots) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, locale: 'ja-JP', hasTouch: label.startsWith('mobile'), isMobile: label.startsWith('mobile') });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.addInitScript(() => localStorage.setItem('odaiba-afterlines.calm', '1'));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('#new');
  ok(`${label}: disclaimer on title`, (await page.textContent('#disc')).includes(DISC));
  if (shots) await page.screenshot({ path: `${OUT}/${label}-01-title.png` });
  await page.click('#new');
  await page.check(`input[name=preset][value=${preset}]`);
  if (shots) await page.screenshot({ path: `${OUT}/${label}-02-setup.png`, fullPage: true });
  await page.click('#go');
  const done = { quake: false, info: false, map: false, death: false, lesson: false };
  let steps = 0;
  for (; steps < 300; steps++) {
    await page.waitForSelector('.choice, #go, #again', { timeout: 5000 });
    if (await page.$('#again')) break;
    if (await page.$('main.lesson')) { if (shots && !done.lesson) { await page.screenshot({ path: `${OUT}/${label}-06-lesson.png` }); done.lesson = true; } await page.click('#go'); continue; }
    if (shots && !done.quake && await page.$('main.fx-quake')) { await page.waitForTimeout(2500); await page.screenshot({ path: `${OUT}/${label}-03-quake.png` }); done.quake = true; }
    if (shots && !done.info && await page.$('.infos')) { await page.screenshot({ path: `${OUT}/${label}-04-info.png`, fullPage: true }); done.info = true; }
    if (shots && !done.map && steps > 25) { await page.click('[data-tab=map]'); await page.screenshot({ path: `${OUT}/${label}-05-map.png`, fullPage: true }); await page.click('[data-tab=map]'); done.map = true; }
    if (await page.$('.death')) { done.death = true; if (shots) await page.screenshot({ path: `${OUT}/${label}-07-death.png`, fullPage: true }); }
    const cs = await page.$$('.choice');
    await cs[pick(cs.length, steps)].click();
  }
  const reached = !!(await page.$('#again'));
  ok(`${label}: reached ending in ${steps} steps`, reached);
  if (reached) {
    const title = await page.textContent('.ending h1');
    ok(`${label}: report has disclaimer`, (await page.textContent('.report')).includes(DISC), title);
    if (shots) await page.screenshot({ path: `${OUT}/${label}-08-ending.png`, fullPage: true });
    // save survives reload? (ending clears on navigation only) -> test settings + export
    await page.click('#ttl'); await page.click('#set');
    ok(`${label}: settings has disclaimer`, (await page.textContent('main')).includes(DISC));
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  ok(`${label}: no horizontal overflow`, !overflow);
  ok(`${label}: no console errors`, errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
  return done;
}
// save/load + reload continuity
async function saveTest() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage();
  await page.goto(BASE); await page.click('#new'); await page.click('#go');
  for (let i = 0; i < 6; i++) { await page.waitForSelector('.choice'); await (await page.$$('.choice'))[0].click(); }
  const clock = await page.textContent('.clock');
  await page.reload(); await page.waitForSelector('#cont'); await page.click('#cont');
  ok('save: continue after reload restores clock', (await page.textContent('.clock')) === clock, clock);
  await ctx.close();
}
const first = () => 0; const last = n => n - 1; const mix = (n, i) => (i * 7 + 3) % n;
await run('mobile', { width: 390, height: 844 }, 'worker', first, true);
await run('mobile-student', { width: 390, height: 844 }, 'student', mix, false);
await run('mobile-parent', { width: 390, height: 844 }, 'parent', last, false);
const d = await run('desktop', { width: 1280, height: 800 }, 'student', last, true);
// find a death run for screenshot
let deathShot = d.death;
for (let k = 1; k < 12 && !deathShot; k++) { const r = await run(`mobile-d${k}`, { width: 390, height: 844 }, 'worker', (n, i) => (i * (k + 2) + k) % n, false); if (r.death) { deathShot = true; await run(`mobile-death`, { width: 390, height: 844 }, 'worker', (n, i) => (i * (k + 2) + k) % n, true); } }
ok('found a death route', deathShot);
await saveTest();
await browser.close();
writeFileSync('docs/e2e-results.json', JSON.stringify({ at: new Date().toISOString(), base: BASE, results }, null, 2));
const fail = results.filter(r => !r.pass).length; console.log(`\n${results.length - fail}/${results.length} passed`); process.exit(fail ? 1 : 0);
