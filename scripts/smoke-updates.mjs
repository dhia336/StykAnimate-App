import { _electron as electron } from '../tests/support/playwright.mjs';
import { openAppMenu } from '../tests/support/app-menu.mjs';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const output = path.join(root, 'artifacts', 'updates');
const profile = path.join(output, `profile-${Date.now()}`);
await mkdir(profile, { recursive: true });
await writeFile(path.join(profile, 'telemetry-state.json'), JSON.stringify({
  decided: true,
  consent: { analytics: false, diagnostics: false, policyVersion: '2026-09-10', updatedAt: Date.now() },
}));
const application = await electron.launch({
  executablePath: process.env.TWIGANIMATE_PACKAGED_EXECUTABLE,
  args: process.env.TWIGANIMATE_PACKAGED_EXECUTABLE ? [] : [root],
  cwd: root,
  timeout: 45000,
  env: { ...process.env, TWIGANIMATE_USER_DATA_DIR: profile },
});
try {
  const page = await application.firstWindow();
  await page.waitForFunction(() => window.styk?.ready, undefined, { timeout: 30000 });
  const splash = page.locator('.release-splash');
  await splash.waitFor({ state: 'visible' });
  assert.ok((await splash.innerText()).includes(`Version ${version}`));
  assert.ok((await splash.innerText()).includes('TwigAnimate'));
  assert.equal(await splash.locator('.support-donate, .splash-history').count(), 0);
  await page.screenshot({ path: path.join(output, 'startup.png') });

  const initial = await page.evaluate(() => window.stykDesktop.getUpdateState());
  assert.equal(initial.status, 'unavailable');
  assert.match(initial.message, /not configured for TwigAnimate/);
  assert.equal((await page.evaluate(() => window.stykDesktop.checkForUpdates())).status, 'unavailable');

  await splash.getByRole('button', { name: 'Close welcome screen' }).click();
  await (await openAppMenu(page, 'help')).locator('[data-action="check-updates"]').click();
  const notice = page.locator('.update-notice');
  await notice.waitFor({ state: 'visible' });
  assert.match(await notice.innerText(), /Automatic updates are not configured for TwigAnimate/);
  assert.equal(await notice.locator('.primary').isVisible(), false);
  await page.screenshot({ path: path.join(output, 'updates-unavailable.png') });

  const evidence = { maxSplash: true, noUpstreamPromotions: true, updaterUnavailable: true, noDownloadAction: true };
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'smoke.json'), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally {
  await application.evaluate(({ app }) => app.exit(0)).catch(() => {});
}
