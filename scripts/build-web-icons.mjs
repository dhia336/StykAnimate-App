// Renders the install icons of the web build from mark.svg into web/icons/.
// The PNGs are committed; run this only when the mark changes:
//
//   node scripts/build-web-icons.mjs
//
// "any" icons keep the mark's rounded square. Maskable and Apple icons use a
// full-bleed background so platform masks do not reveal transparent corners.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../tests/support/playwright.mjs';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(appRoot, 'web', 'icons');

const mark = await readFile(path.join(appRoot, 'mark.svg'), 'utf8');
const fullBleed = mark.replace(/<rect x="16" y="16" width="480" height="480" rx="112" fill="#172B4D"\s*\/>/,
  '<rect width="512" height="512" fill="#172B4D"/>');
if (fullBleed === mark) throw new Error('mark.svg must contain the expected TwigAnimate app-icon background.');

const ICONS = [
  { file: 'icon-192.png', size: 192, svg: mark },
  { file: 'icon-512.png', size: 512, svg: mark },
  { file: 'icon-maskable-512.png', size: 512, svg: fullBleed },
  { file: 'apple-touch-icon.png', size: 180, svg: fullBleed },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
try {
  const page = await browser.newPage();
  for (const { file, size, svg } of ICONS) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
    await writeFile(path.join(output, file), await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }));
    console.log(`web/icons/${file}`);
  }
} finally { await browser.close(); }
