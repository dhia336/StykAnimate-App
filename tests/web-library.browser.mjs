// My library in the browser build, in a real browser (TWIGANIMATE_BROWSER=chrome|firefox|webkit),
// driving the real Library panel: saving, folders, renaming, moving, removing and inserting; what is saved is still
// there after a reload, and blocked local storage fails in plain words.
//
//   node tests/web-library.browser.mjs            build the site into a temp directory first
//   TWIGANIMATE_WEB_DIR=build/web node tests/...         test an existing build
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { BROWSER, launchBrowser } from './support/cross-browser.mjs';
import { buildWeb } from '../scripts/build-web.mjs';
import { startWebServer } from '../scripts/serve-web.mjs';

const temp = await mkdtemp(path.join(os.tmpdir(), 'styk-library-'));
const existing = process.env.TWIGANIMATE_WEB_DIR && path.resolve(process.env.TWIGANIMATE_WEB_DIR);
const site = await startWebServer({ root: existing ?? (await buildWeb({ output: path.join(temp, 'site') })).output });
const browser = await launchBrowser();
const checks = [];
const check = (name, condition) => { assert.ok(condition, `[${BROWSER}] ${name}`); checks.push(name); console.log('PASS', `[${BROWSER}]`, name); };
const until = async (description, read, timeout = 45000) => {
  const deadline = Date.now() + timeout;
  for (;;) {
    const value = await read();
    if (value) return value;
    if (Date.now() > deadline) throw new Error(`[${BROWSER}] Timed out waiting for ${description}.`);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
};

async function open(context, { blockStorage = false } = {}) {
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error' && !/Failed to load resource|Viewport argument key "interactive-widget"/.test(message.text())) problems.push(message.text()); });
  await page.addInitScript((block) => {
    document.addEventListener('securitypolicyviolation', (event) => console.error(`CSP violation: ${event.violatedDirective} ${event.blockedURI}`));
    // Patch the prototype: WebKit can recreate the indexedDB wrapper, dropping properties set on it.
    if (block) IDBFactory.prototype.open = () => { throw new DOMException('Storage is blocked.', 'SecurityError'); };
  }, blockStorage);
  await page.goto(site.origin, { waitUntil: 'load' });
  await page.waitForFunction(() => window.styk?.ready === true, undefined, { timeout: 90000 });
  return { page, problems };
}
const panel = (page) => page.locator('#user-library');
const cards = (page) => panel(page).locator('.library-card:not(.is-skeleton)');
const names = (page) => cards(page).locator('.library-name').allTextContents();
const showLibrary = async (page) => {
  if (!(await panel(page).isVisible())) await page.locator('.shell-tabs [role="tab"][data-panel="library"]').first().click();
  await panel(page).waitFor({ state: 'visible', timeout: 15000 });
};
const message = (page) => panel(page).locator('.library-message').textContent();
const figureCount = (page) => page.evaluate(() => window.styk.editor.selectionFrame.objects.length);

try {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const { page, problems } = await open(context);
  await showLibrary(page);
  await until('the empty library', async () => (await panel(page).innerText()).includes('No saved assets yet'));
  check('The panel opens on My library with nothing in it', true);
  check('and it says where the library lives', !(await panel(page).innerText()).includes('available in the desktop app') && (await page.evaluate(() => window.styk.library.desktop.inBrowser === true)));

  // --- Saving the selection.
  await page.evaluate(() => { const { editor } = window.styk; editor.select(editor.frame.objects[0].unique_id, -1); });
  await panel(page).locator('[data-library-action="save"]').first().click();
  await until('the saved asset', async () => (await cards(page).count()) === 1);
  const savedName = (await names(page))[0];
  await until('its preview', () => cards(page).first().evaluate((card) => card.classList.contains('is-loaded')));
  check('Add selection saves the figure with a preview', !!savedName && /saved to/i.test(await message(page)));
  check('The kind is shown', /Figure/i.test(await cards(page).first().locator('.library-kind').textContent()));

  // --- It is still there after a reload.
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.styk?.ready === true, undefined, { timeout: 90000 });
  await showLibrary(page);
  await until('the saved asset after reload', async () => (await cards(page).count()) === 1);
  await until('its preview after reload', () => cards(page).first().evaluate((card) => card.classList.contains('is-loaded')));
  check('What is saved is still there after a reload, preview and all', (await names(page))[0] === savedName);

  // --- Folders, renaming, moving.
  await panel(page).locator('[data-library-action="folder"]').click();
  await page.locator('dialog.library-dialog input[name="name"]').fill('Heroes');
  await page.locator('dialog.library-dialog').getByRole('button', { name: /create|ok|add|new folder|save/i }).last().click();
  await until('the folder', async () => (await names(page)).includes('Heroes'));
  check('A new folder appears first', (await names(page))[0] === 'Heroes');
  await panel(page).locator('.library-card', { hasText: 'Heroes' }).dblclick();
  await until('the folder to open', async () => (await panel(page).locator('.library-breadcrumbs').innerText()).includes('Heroes'));
  check('A folder opens, and is empty', (await cards(page).count()) === 0 && (await panel(page).innerText()).includes('Empty folder'));
  await panel(page).locator('.library-breadcrumbs button', { hasText: 'Library' }).click();
  await until('the top folder', async () => (await cards(page).count()) === 2);
  // Move the figure into the folder through the same call the drag makes, then rename it with the keyboard.
  const moved = await page.evaluate((name) => window.styk.library.desktop.changeLibraryItem({ path: `${name}.stkz`, folder: 'Heroes' }), savedName);
  check('A figure moves into a folder', moved.path === `Heroes/${savedName}.stkz`);
  await page.evaluate(() => window.styk.library.refresh());
  await until('the move to show', async () => (await names(page)).length === 1);
  await panel(page).locator('.library-card', { hasText: 'Heroes' }).dblclick();
  await until('the figure inside the folder', async () => (await names(page)).includes(savedName));
  await cards(page).first().click();
  await page.keyboard.press('F2');
  await panel(page).locator('.library-rename').fill('Blue hero');
  await page.keyboard.press('Enter');
  await until('the new name', async () => (await names(page)).includes('Blue hero'));
  check('Renaming keeps the file in its folder', (await names(page)).join() === 'Blue hero');

  // --- Inserting.
  const before = await figureCount(page);
  await cards(page).first().dblclick();
  await until('the inserted figure', async () => (await figureCount(page)) === before + 1);
  check('Double-clicking an asset puts it in the scene', true);

  // --- Removing.
  await cards(page).first().click();
  await page.keyboard.press('Delete');
  const dialog = page.locator('dialog.library-dialog[open]');
  check('Removing says the browser has no recycle bin', /deleted from this browser/i.test(await dialog.innerText()) && !/Recycle/i.test(await dialog.innerText()));
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
  await until('the figure to go', async () => (await cards(page).count()) === 0);
  check('A removed asset is gone, and the scene keeps its copy', (await figureCount(page)) === before + 1);
  await panel(page).locator('.library-breadcrumbs button', { hasText: 'Library' }).click();

  // --- A browser that blocks storage.
  const blocked = await open(context, { blockStorage: true });
  await showLibrary(blocked.page);
  await blocked.page.waitForTimeout(1500);
  const text = await blocked.page.locator('#user-library').innerText();
  check('Blocked storage is explained instead of failing silently', /does not allow the library|Storage is blocked/.test(`${text} ${await message(blocked.page)}`));
  check('and the editor keeps working', await blocked.page.evaluate(() => window.styk.ready === true));
  check('No console errors, page errors or CSP violations', problems.length === 0 || (console.error(problems), false));
  await context.close();
  console.log(`\n[${BROWSER}] ${checks.length} checks passed`);
} finally {
  await browser.close();
  await site.close();
  await rm(temp, { recursive: true, force: true });
}
