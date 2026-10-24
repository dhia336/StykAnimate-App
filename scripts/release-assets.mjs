import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
export async function fileHash(filename, algorithm = 'sha512', encoding = 'base64') {
  const hash = createHash(algorithm);
  for await (const chunk of createReadStream(filename)) hash.update(chunk);
  return hash.digest(encoding);
}
export async function verifyReleaseAssets(directory, version, platform = 'all') {
  assert.ok(['all', 'win32', 'linux'].includes(platform), 'Choose all, win32 or linux release assets.');
  const names = [];
  if (platform !== 'linux') {
    const setup = `TwigAnimate-${version}-Setup-x64.exe`;
    names.push(setup, `TwigAnimate-${version}-Portable-x64.exe`);
  }
  if (platform !== 'win32') {
    const appimage = `TwigAnimate-${version}-linux-x86_64.AppImage`;
    names.push(appimage);
  }
  for (const name of names) assert.ok((await stat(path.join(directory, name))).size > 0, `Missing release asset: ${name}`);
  return names.map(name => path.join(directory, name));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { version } = JSON.parse(await readFile('package.json', 'utf8'));
  const args = process.argv.slice(2);
  const platform = args.find(arg => arg.startsWith('--platform='))?.slice(11) ?? 'all';
  const assets = await verifyReleaseAssets(args.find(arg => !arg.startsWith('--')) || `release/${version}`, version, platform);
  console.log(`Verified ${assets.length} fork release installers for ${version} (${platform}).`);
}
