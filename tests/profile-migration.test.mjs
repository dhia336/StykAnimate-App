import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const { migrateLegacyProfileFiles } = createRequire(import.meta.url)('../desktop/profile-migration.cjs');

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'styk-profile-migration-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = path.join(root, 'StykAnimate Community'), legacySource = path.join(root, 'StykAnimate');
  const destination = path.join(root, 'StykAnimate-Max');
  await mkdir(path.join(source, 'project-library'), { recursive: true });
  await mkdir(path.join(source, 'Cache'), { recursive: true });
  await mkdir(legacySource);
  await writeFile(path.join(source, 'workspace-preferences.json'), '{"theme":"dark"}');
  await writeFile(path.join(legacySource, 'editor-settings.json'), '{"grid":true}');
  await writeFile(path.join(source, 'recovery-123e4567-e89b-12d3-a456-426614174000.styk'), 'recovery');
  await writeFile(path.join(source, 'community-downloads.json'), '{"ids":["public-id"]}');
  await writeFile(path.join(source, 'project-library', 'figure.stkz'), 'figure');
  await writeFile(path.join(source, 'Cache', 'cache.bin'), 'cache');
  await writeFile(path.join(source, 'SingletonLock'), 'lock');
  await writeFile(path.join(source, 'telemetry-state.json'), '{"consent":true}');
  return { root, source, sources: [source, legacySource], destination, marker: path.join(destination, '.legacy-profile-migrated') };
}

test('migration copies only persistent compatible data and keeps the old profile', async t => {
  const f = await fixture(t);
  await mkdir(f.destination);
  await writeFile(path.join(f.destination, 'workspace-preferences.json'), '{"theme":"light"}');
  assert.equal(await migrateLegacyProfileFiles({ ...f, enabled: true }), true);
  assert.equal(await readFile(path.join(f.destination, 'workspace-preferences.json'), 'utf8'), '{"theme":"light"}');
  assert.equal(await readFile(path.join(f.destination, 'editor-settings.json'), 'utf8'), '{"grid":true}');
  assert.equal(await readFile(path.join(f.destination, 'recovery-123e4567-e89b-12d3-a456-426614174000.styk'), 'utf8'), 'recovery');
  assert.equal(await readFile(path.join(f.destination, 'community-downloads.json'), 'utf8'), '{"ids":["public-id"]}');
  assert.equal(await readFile(path.join(f.destination, 'project-library', 'figure.stkz'), 'utf8'), 'figure');
  for (const name of ['Cache', 'SingletonLock', 'telemetry-state.json']) {
    await assert.rejects(readFile(path.join(f.destination, name)));
  }
  assert.equal(await readFile(path.join(f.source, 'workspace-preferences.json'), 'utf8'), '{"theme":"dark"}');
  assert.equal(await readFile(f.marker, 'utf8'), 'migrated\n');
  assert.equal(await migrateLegacyProfileFiles({ ...f, enabled: true }), false);
});

test('disabled migration leaves profiles untouched and failed migration does not mark completion', async t => {
  const f = await fixture(t);
  assert.equal(await migrateLegacyProfileFiles({ ...f, enabled: false }), false);
  await assert.rejects(readFile(f.marker));
  await writeFile(f.destination, 'not a directory');
  await assert.rejects(migrateLegacyProfileFiles({ ...f, enabled: true }));
  await assert.rejects(readFile(f.marker));
});
