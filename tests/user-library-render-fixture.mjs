import {UserLibrary} from '../src/user-library.mjs';
import {interfaceLocalization} from '../src/localization.mjs';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
/** Real DOM and the production card/render methods. Run in an initialized app
 * page via T3 or a browser test; this measures registration and writes, not time. */
export async function verifyUserLibraryRender({localization = globalThis.styk?.localization} = {}) {
  assert(localization?.stats, 'An initialized AppLocalization is required.');
  const locale = interfaceLocalization.locale, focused = document.activeElement, checks = [];
  const host = document.createElement('section');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:900px;';
  host.innerHTML = '<nav></nav><input type="search"><span class="library-count"></span><div class="library-grid" role="listbox"></div><div class="library-empty" hidden></div>';
  document.body.append(host);
  const observed = new Set(); let disconnects = 0;
  const library = Object.assign(Object.create(UserLibrary.prototype), {
    folder: '', entries: [{path: 'Characters', name: 'Characters', kind: 'folder'}, ...Array.from({length: 199}, (_, index) => ({path: `Asset-${index}.stkz`, name: `Asset ${index}`, kind: index % 2 ? 'set' : 'figure', modified: 1}))],
    selected: 'Asset-40.stkz', generation: 1,
    input: host.querySelector('input'), filterValue: 'all', container: host, grid: host.querySelector('.library-grid'), empty: host.querySelector('.library-empty'),
    editor: {selectedObjects: []}, roots: [], propertySave: null, busy: false, menu: null, thumbnails: new Map(),
    hoverPreview: {stop() {}}, observer: {observe(card) {observed.add(card);}, disconnect() {disconnects++; observed.clear();}},
  });
  const pass = message => checks.push(message);
  const mutations = new MutationObserver(() => {});
  try {
    const applications = localization.stats.applications;
    library.render();
    assert(localization.stats.applications - applications === 1, 'A populated library must register translations once per render.');
    assert(library.grid.querySelectorAll('.library-card').length === 200 && library.cards.length === 200, 'Every local item must render.');
    assert(observed.size === 199 && [...observed].every(card => !card.classList.contains('folder')), 'Only asset thumbnails must be observed.');
    assert(library.grid.querySelectorAll('[aria-selected="true"]').length === 1 && library.cardFor('Asset-40.stkz').tabIndex === 0, 'Selection must survive rendering with one tab stop.');
    assert(library.grid.querySelectorAll('.library-card[tabindex="0"]').length === 1, 'The grid must have one tab stop.');
    pass('200 local cards register once, keep selection and observe asset thumbnails');

    mutations.observe(library.grid, {subtree: true, attributes: true});
    library.select('Asset-41.stkz');
    let records = mutations.takeRecords();
    assert(records.length > 0 && new Set(records.map(record => record.target)).size === 2, 'Changing selection must only write the prior and next cards.');
    library.select('Asset-41.stkz'); assert(mutations.takeRecords().length === 0, 'Selecting the same card must cause no DOM writes.');
    library.select(null); records = mutations.takeRecords();
    assert(new Set(records.map(record => record.target)).size === 2 && library.cards[0].tabIndex === 0, 'Clearing selection must restore the first tab stop.');
    pass('selection changes write only affected cards and repeated selection writes nothing');

    const draftCard = library.cardFor('Asset-41.stkz'), draft = document.createElement('input');
    draft.value = 'Uncommitted rename'; draftCard.querySelector('.library-name').replaceWith(draft); draft.focus();
    library.select('Asset-42.stkz');
    assert(document.activeElement === draft && draft.value === 'Uncommitted rename' && draft.parentElement, 'Selection must preserve an inline rename draft and focus.');
    pass('selection preserves inline rename nodes and focus');

    const oldCard = library.cardFor('Asset-40.stkz'); let resolveThumbnail, shown = 0;
    library.desktop = {getLibraryThumbnail: () => new Promise(resolve => {resolveThumbnail = resolve;})};
    library.showThumbnail = () => shown++;
    const thumbnail = library.loadThumbnail(oldCard, library.generation);
    library.input.value = 'Asset 42'; library.render(); resolveThumbnail('data:image/png;base64,unused'); await thumbnail;
    assert(shown === 0 && !oldCard.isConnected && !observed.has(oldCard), 'A filtered-out card must discard a late thumbnail result.');
    assert(library.cards.length === 1 && library.cardFor('Asset-40.stkz') === null && library.cards[0].tabIndex === 0, 'Filtering must replace card indexes and preserve one tab stop.');
    pass('filtering discards obsolete thumbnail work and replaces card indexes');

    library.input.value = '';
    const retained = library.cardFor('Asset-41.stkz'); await localization.setLocale('it');
    assert(retained === library.cardFor('Asset-41.stkz') && retained.querySelector('.library-kind span').textContent === interfaceLocalization.t('userLibrary.figure'), 'Inserted card captions must remain registered for language changes.');
    assert(retained.getAttribute('aria-label') === interfaceLocalization.t('userLibrary.assetLabel', {name: 'Asset 41', kind: {messageKey: 'userLibrary.figure'}}), 'Inserted ARIA captions must follow language changes.');
    pass('retained card captions and ARIA follow language changes');

    library.entries = [{path: 'Old.stkz', name: 'Old', kind: 'figure', modified: 1}]; library.input.value = 'old'; library.render();
    library.entries[0].path = 'New.stkz'; library.entries[0].name = 'New';
    library.desktop.listLibrary = async () => ({path: '', root: 'Library', entries: library.entries});
    await library.refresh('');
    assert(library.itemFor('Old.stkz') === null && library.itemFor('New.stkz').name === 'New' && library.cards.length === 0, 'Refresh must invalidate an API-reused local listing and its search text.');
    library.input.value = 'new'; library.render();
    assert(library.cardFor('New.stkz')?.tabIndex === 0 && library.cardFor('Old.stkz') === null, 'A renamed local asset must use its new indexed key.');
    pass('local refresh invalidates reused listing records, names and search text');
    return {checks, disconnects, localCards: 200};
  } finally {
    mutations.disconnect(); library.observer.disconnect(); host.remove(); localization.prune();
    await localization.setLocale(locale); if (focused?.isConnected) focused.focus({preventScroll: true});
  }
}
