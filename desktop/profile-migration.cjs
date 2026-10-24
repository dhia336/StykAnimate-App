'use strict';
const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');
const path = require('node:path');

const allowedFiles = new Set([
  'workspace-preferences.json', 'editor-settings.json', 'vfx-presets.json', 'recent-files.json',
  'frame-clipboard.styk', 'community-downloads.json',
]);

async function migrateLegacyProfileFiles({ source, sources = source ? [source] : [], destination, marker, enabled }) {
  if (!enabled || existsSync(marker)) return false;
  const availableSources = sources.filter(directory => existsSync(directory));
  if (!availableSources.length) return false;
  await fs.mkdir(destination, { recursive: true });
  for (const directory of availableSources) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const recovery = /^recovery(?:-[0-9a-f-]{36})?\.(?:styk|json)$/.test(entry.name);
      if (!(allowedFiles.has(entry.name) || recovery || entry.name === 'project-library') ||
          !(entry.isFile() || entry.isDirectory()) || entry.isSymbolicLink()) continue;
      await fs.cp(path.join(directory, entry.name), path.join(destination, entry.name), {
        recursive: true,
        force: false,
        errorOnExist: false,
        dereference: false,
        filter: async filename => !(await fs.lstat(filename)).isSymbolicLink(),
      });
    }
  }
  await fs.writeFile(marker, 'migrated\n', { flag: 'wx' }).catch(error => {
    if (error.code !== 'EEXIST') throw error;
  });
  return true;
}

module.exports = { migrateLegacyProfileFiles };
