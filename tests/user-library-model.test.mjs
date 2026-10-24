import test from 'node:test';
import assert from 'node:assert/strict';
import {UserLibrary} from '../src/user-library.mjs';
import {interfaceLocalization} from '../src/localization.mjs';

const owner = overrides => Object.assign(Object.create(UserLibrary.prototype), {
  entries: [],
  input: {value: ''}, filterValue: 'all', render() {},
}, overrides);

test('local listings retain folders in kind filters and update key and name lookups after replacement', () => {
  const entries = [{path: 'Characters', name: 'Characters', kind: 'folder'}, {path: 'Crowd.stkz', name: 'Crowd', kind: 'set'}, {path: 'Walk.stykmov', name: 'Walk', kind: 'movieclip'}];
  const library = owner({entries, filterValue: 'figure'});
  assert.deepEqual(library.visibleItems(), entries.slice(0, 2)); assert.strictEqual(library.itemFor('Crowd.stkz'), entries[1]);
  library.input.value = 'crowd'; assert.deepEqual(library.visibleItems(), [entries[1]]);
  const renamed = {path: 'People.stkz', name: 'People', kind: 'set'}; library.entries = [renamed];
  assert.equal(library.itemFor('Crowd.stkz'), null); assert.strictEqual(library.itemFor('People.stkz'), renamed);
  assert.deepEqual(library.visibleItems(), []); library.input.value = 'people'; assert.deepEqual(library.visibleItems(), [renamed]);
});

test('search uses the interface language and refreshes cached case folding after a language change', async () => {
  const previous = interfaceLocalization.locale;
  const local = owner({entries: [{path: 'Istanbul.stkz', name: 'Istanbul', kind: 'figure'}], input: {value: 'ıstanbul'}});
  try {
    await interfaceLocalization.setLocale('en');
    assert.equal(local.visibleItems().length, 0);
    await interfaceLocalization.setLocale('tr');
    assert.equal(local.visibleItems().length, 1);
    await interfaceLocalization.setLocale('en');
    assert.equal(local.visibleItems().length, 0);
  } finally { await interfaceLocalization.setLocale(previous); }
});
