import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { verifyReleaseAssets } from '../scripts/release-assets.mjs';
test('release verification requires the fork-branded installers', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'styk-release-'));
  try {
    const name = 'StykAnimate-Max-0.5.0-Setup-x64.exe';
    for (const file of [name, 'StykAnimate-Max-0.5.0-Portable-x64.exe']) await writeFile(path.join(directory, file), 'fixture');
    assert.equal((await verifyReleaseAssets(directory, '0.5.0', 'win32')).length, 2);
    await assert.rejects(verifyReleaseAssets(directory, '0.6.0', 'win32'));
    await writeFile(path.join(directory, name), '');
    await assert.rejects(verifyReleaseAssets(directory, '0.5.0', 'win32'));
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('release publishing requires explicit confirmation of this fork only', async () => {
  const { getReleaseRepository, FORK_RELEASE_REPOSITORY } = await import('../scripts/release-target.mjs');
  assert.equal(getReleaseRepository(FORK_RELEASE_REPOSITORY), FORK_RELEASE_REPOSITORY);
  for (const value of [undefined, '', 'filippocalippo/styk-animate-releases', 'filippocalippo/StykAnimate-App', 'someone/else']) {
    assert.throws(() => getReleaseRepository(value), /explicitly enable fork release publishing/);
  }
});
test('public update feed contains no private repository or credentials', async () => {
  const config = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(config.build.publish, undefined);
  assert.equal(config.build.productName, 'StykAnimate-Max');
  assert.equal(config.build.appId, 'com.github.dhia336.stykanimate-max');
  for (const script of ['pack', 'dist', 'dist:win', 'dist:mac', 'dist:linux']) {
    assert.match(config.scripts[script], /--publish never/, `${script} must never auto-publish`);
  }
  const notes = JSON.parse(await readFile('desktop/release-info.json', 'utf8'));
  assert.equal(notes.version, config.version);
  assert.ok(!config.build.extraResources.some(item => item.from.startsWith('..')));
});

test('a coordinated release requires verified Windows and Linux assets and excludes unrelated files', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'styk-platform-release-'));
  const version = '1.2.0', setup = `StykAnimate-Max-${version}-Setup-x64.exe`, portable = `StykAnimate-Max-${version}-Portable-x64.exe`, appimage = `StykAnimate-Max-${version}-linux-x86_64.AppImage`;
  try {
    for (const name of [setup, portable, appimage, 'private.log']) await writeFile(path.join(directory, name), 'fixture');
    const assets = await verifyReleaseAssets(directory, version);
    assert.equal(assets.length, 3);
    assert.ok(assets.includes(path.join(directory, appimage)));
    assert.ok(!assets.includes(path.join(directory, 'private.log')));
    assert.equal((await verifyReleaseAssets(directory, version, 'linux')).length, 1);
    await rm(path.join(directory, appimage));
    await assert.rejects(verifyReleaseAssets(directory, version));
    await assert.rejects(verifyReleaseAssets(directory, version, 'darwin'), /Choose/);
  } finally { await rm(directory, {recursive: true, force: true}); }
});
