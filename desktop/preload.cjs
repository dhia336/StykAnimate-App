'use strict';
// BEGIN generated localization diagnostics
const diagnosticEnglish = {
  "desktop.preload.errors.aCallbackIsRequired": "A callback is required.",
  "desktop.preload.errors.uiScaleMustBe75200InStepsOf5": "UI scale must be 75–200 in steps of 5."
};
function diagnosticError(error, source, messageKey, messageParams = {}) {
  if (typeof source !== 'string') throw new TypeError(`Unknown error message: ${messageKey}`);
  messageParams = Object.fromEntries(Object.entries(messageParams).map(([name, value]) => {
    // Only an explicit scalar diagnostic value can accompany a display reference.
    // Original English diagnostics remain stable through worker/IPC round trips.
    if (value && typeof value.messageKey === 'string' && Object.hasOwn(value, 'diagnosticValue'))
      return [name, {messageKey:value.messageKey, diagnosticValue:String(value.diagnosticValue),
        ...(value.messageParams ? {messageParams:Object.fromEntries(Object.entries(value.messageParams).map(([key, scalar]) => [key, typeof scalar === 'number' && Number.isFinite(scalar) ? scalar : String(scalar)]))} : {})}];
    return [name, typeof value === 'number' && Number.isFinite(value) ? value : String(value)];
  }));
  const message = source.replace(/\{([A-Za-z]\w*)\}/g, (token, name) => Object.hasOwn(messageParams, name) ? String(messageParams[name]?.diagnosticValue ?? messageParams[name]) : token);
  Object.defineProperty(error, 'message', {value: message, configurable: true, writable: true});
  error.messageKey = messageKey;
  error.messageParams = messageParams;
  return error;
}
const messageError = (error, key, params) => diagnosticError(error, diagnosticEnglish[key], key, params);
// END generated localization diagnostics


const { contextBridge, ipcRenderer, webFrame } = require('electron');

function subscribe(channel, callback) {
  if (typeof callback !== 'function') throw messageError(new TypeError(''), 'desktop.preload.errors.aCallbackIsRequired', {});
  const listener = (_event, value) => callback(value);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

// Sandboxed preloads cannot require('os'); total memory is a synchronous
// main-process value. Failure degrades to the navigator.deviceMemory hint.
function systemMemoryBytes() {
  try { return ipcRenderer.sendSync('twiganimate:memory-bytes') || 0; } catch { return 0; }
}

// The loopback codec rejects /api/* requests without this per-launch token.
function apiToken() {
  try { return ipcRenderer.sendSync('twiganimate:api-token') || ''; } catch { return ''; }
}

// Where this window starts ('home' or 'editor'), when the launch decides it (main.cjs startupView); else null.
function startupView() {
  const value = (process.argv ?? []).find(argument => argument.startsWith('--twig-startup-view='))?.slice('--twig-startup-view='.length);
  return value === 'home' || value === 'editor' ? value : null;
}

// Every privileged operation has a narrow handler in main.cjs. No filesystem,
// Node.js, Electron object, or arbitrary IPC channel crosses this boundary.
contextBridge.exposeInMainWorld('stykDesktop', Object.freeze({
  isDesktop: true,
  apiToken: apiToken(),
  startupView: startupView(),
  // Page zoom keeps CSS layout, pointer coordinates and devicePixelRatio aligned.
  setUIScale: percent => {
    if (!Number.isFinite(percent) || percent < 75 || percent > 200 || percent % 5 !== 0)
      throw messageError(new RangeError(''), 'desktop.preload.errors.uiScaleMustBe75200InStepsOf5', {});
    webFrame.setZoomFactor(percent / 100);
  },
  newWindow: () => ipcRenderer.invoke('twiganimate:new-window'),
  beginSharedClipboardWrite: () => ipcRenderer.invoke('twiganimate:shared-clipboard-write-begin'),
  writeSharedClipboardChunk: (token, bytes) => ipcRenderer.invoke('twiganimate:shared-clipboard-write', token, bytes),
  finishSharedClipboardWrite: token => ipcRenderer.invoke('twiganimate:shared-clipboard-finish', token),
  beginSharedClipboardRead: id => ipcRenderer.invoke('twiganimate:shared-clipboard-read-begin', id),
  readSharedClipboardChunk: token => ipcRenderer.invoke('twiganimate:shared-clipboard-read', token),
  cancelSharedClipboardTransfer: token => ipcRenderer.invoke('twiganimate:shared-clipboard-cancel', token),
  platform: process.platform,
  memoryBytes: systemMemoryBytes(),
  streamingFileWrite: true,
  importTransport: 'source-bytes-v1',
  getUpdateState: () => ipcRenderer.invoke('twiganimate:update-state'),
  checkForUpdates: () => ipcRenderer.invoke('twiganimate:update-check'),
  restartForUpdate: checkpoint => ipcRenderer.invoke('twiganimate:update-restart', checkpoint),
  onUpdateState: callback => subscribe('twiganimate:update-state-changed', callback),
  getReleaseInfo: (startup = false) => ipcRenderer.invoke('twiganimate:release-info', Boolean(startup)),
  recordPerformanceTrace: () => ipcRenderer.invoke('twiganimate:performance-trace'),
  listLibrary: folder => ipcRenderer.invoke('twiganimate:library-list', folder),
  createLibraryFolder: options => ipcRenderer.invoke('twiganimate:library-mkdir', options),
  getLibraryThumbnail: path => ipcRenderer.invoke('twiganimate:library-thumbnail', path),
  beginLibrarySave: options => ipcRenderer.invoke('twiganimate:library-save-begin', options),
  writeLibraryChunk: (token, bytes) => ipcRenderer.invoke('twiganimate:library-write', token, bytes),
  finishLibrarySave: token => ipcRenderer.invoke('twiganimate:library-finish', token),
  cancelLibraryTransfer: token => ipcRenderer.invoke('twiganimate:library-cancel', token),
  beginLibraryRead: path => ipcRenderer.invoke('twiganimate:library-read-begin', path),
  readLibraryChunk: token => ipcRenderer.invoke('twiganimate:library-read', token),
  changeLibraryItem: options => ipcRenderer.invoke('twiganimate:library-change', options),
  revealLibrary: folder => ipcRenderer.invoke('twiganimate:library-reveal', folder),
  trashLibraryItem: path => ipcRenderer.invoke('twiganimate:library-trash', path),
  cacheLibraryThumbnail: options => ipcRenderer.invoke('twiganimate:library-thumbnail-cache', options),
  getWorkspacePreferences: () => ipcRenderer.invoke('twiganimate:workspace-preferences-get'),
  setWorkspacePreferences: (preferences) => ipcRenderer.invoke('twiganimate:workspace-preferences-set', preferences),
  getEditorSettings: () => ipcRenderer.invoke('twiganimate:editor-settings-get'),
  setEditorSettings: (settings) => ipcRenderer.invoke('twiganimate:editor-settings-set', settings),
  getVfxPresets: () => ipcRenderer.invoke('twiganimate:vfx-presets-get'),
  setVfxPresets: (presets) => ipcRenderer.invoke('twiganimate:vfx-presets-set', presets),
  listFonts: () => ipcRenderer.invoke('twiganimate:fonts-list'),
  readFont: (id) => ipcRenderer.invoke('twiganimate:fonts-read', id),
  readClipboardText: () => ipcRenderer.invoke('twiganimate:clipboard-text-read'),
  writeClipboardText: text => ipcRenderer.invoke('twiganimate:clipboard-text-write', text),
  getVideoCapabilities: options => ipcRenderer.invoke('twiganimate:video-capabilities', options),
  beginVideoExport: options => ipcRenderer.invoke('twiganimate:video-begin', options),
  writeVideoAudioChunk: (token, bytes) => ipcRenderer.invoke('twiganimate:video-audio-chunk', token, bytes),
  beginAudioImport: options => ipcRenderer.invoke('twiganimate:audio-begin', options),
  writeAudioImport: (token, bytes) => ipcRenderer.invoke('twiganimate:audio-write', token, bytes),
  finishAudioImport: token => ipcRenderer.invoke('twiganimate:audio-finish', token),
  readAudioImport: token => ipcRenderer.invoke('twiganimate:audio-read', token),
  cancelAudioImport: token => ipcRenderer.invoke('twiganimate:audio-cancel', token),
  beginVideoFrame: (token, options) => ipcRenderer.invoke('twiganimate:video-frame-begin', token, options),
  writeVideoChunk: (token, bytes) => ipcRenderer.invoke('twiganimate:video-frame-chunk', token, bytes),
  endVideoFrame: token => ipcRenderer.invoke('twiganimate:video-frame-end', token),
  finishVideoExport: token => ipcRenderer.invoke('twiganimate:video-finish', token),
  readVideoChunk: token => ipcRenderer.invoke('twiganimate:video-read', token),
  saveVideoExport: (token, options) => ipcRenderer.invoke('twiganimate:video-save', token, options),
  cancelVideoExport: token => ipcRenderer.invoke('twiganimate:video-cancel', token),
  getVfwCapabilities: options => ipcRenderer.invoke('twiganimate:vfw-capabilities', options),
  configureVfwCodec: options => ipcRenderer.invoke('twiganimate:vfw-configure', options),
  beginVfwExport: options => ipcRenderer.invoke('twiganimate:vfw-begin', options),
  beginVfwFrame: (token, options) => ipcRenderer.invoke('twiganimate:vfw-frame-begin', token, options),
  writeVfwChunk: (token, bytes) => ipcRenderer.invoke('twiganimate:vfw-frame-chunk', token, bytes),
  endVfwFrame: token => ipcRenderer.invoke('twiganimate:vfw-frame-end', token),
  finishVfwExport: token => ipcRenderer.invoke('twiganimate:vfw-finish', token),
  readVfwChunk: token => ipcRenderer.invoke('twiganimate:vfw-read', token),
  saveVfwExport: (token, options) => ipcRenderer.invoke('twiganimate:vfw-save', token, options),
  cancelVfwExport: token => ipcRenderer.invoke('twiganimate:vfw-cancel', token),
  activateDocument: (options) => ipcRenderer.invoke('twiganimate:document-activate', options),
  selectDocument: (documentToken) => ipcRenderer.invoke('twiganimate:document-select', documentToken),
  releaseDocument: (documentToken) => ipcRenderer.invoke('twiganimate:document-release', documentToken),
  openFile: () => ipcRenderer.invoke('twiganimate:open-file'),
  listRecentFiles: () => ipcRenderer.invoke('twiganimate:recent-list'),
  openRecentFile: id => ipcRenderer.invoke('twiganimate:recent-open', id),
  clearRecentFiles: () => ipcRenderer.invoke('twiganimate:recent-clear'),
  listProjects: () => ipcRenderer.invoke('twiganimate:projects-list'),
  openProject: id => ipcRenderer.invoke('twiganimate:projects-open', id),
  updateProject: (id, changes) => ipcRenderer.invoke('twiganimate:projects-update', id, changes),
  removeProject: id => ipcRenderer.invoke('twiganimate:projects-remove', id),
  revealProject: id => ipcRenderer.invoke('twiganimate:projects-reveal', id),
  getProjectPreview: id => ipcRenderer.invoke('twiganimate:projects-preview', id),
  setProjectPreview: options => ipcRenderer.invoke('twiganimate:projects-preview-set', options),
  changeProjectFolder: change => ipcRenderer.invoke('twiganimate:projects-folder', change),
  saveFile: (options) => ipcRenderer.invoke('twiganimate:save-file', options),
  beginFileWrite: (options) => ipcRenderer.invoke('twiganimate:file-write-begin', options),
  beginProjectWrite: (options) => ipcRenderer.invoke('twiganimate:project-write-begin', options),
  beginRecoveryWrite: (options) => ipcRenderer.invoke('twiganimate:recovery-write-begin', options),
  beginClipboardWrite: (options) => ipcRenderer.invoke('twiganimate:clipboard-write-begin', options),
  beginClipboardRead: () => ipcRenderer.invoke('twiganimate:clipboard-read-begin'),
  writeFileChunk: (token, bytes) => ipcRenderer.invoke('twiganimate:file-write-chunk', token, bytes),
  patchFileWrite: (token, offset, bytes) => ipcRenderer.invoke('twiganimate:file-write-patch', token, offset, bytes),
  finishFileWrite: (token) => ipcRenderer.invoke('twiganimate:file-write-finish', token),
  cancelFileWrite: (token) => ipcRenderer.invoke('twiganimate:file-write-cancel', token),
  getRecoveryInfo: () => ipcRenderer.invoke('twiganimate:recovery-info'),
  listRecoveries: () => ipcRenderer.invoke('twiganimate:recovery-list'),
  beginRecoveryRead: (id) => ipcRenderer.invoke('twiganimate:recovery-read-begin', id),
  readFileChunk: (token) => ipcRenderer.invoke('twiganimate:file-read-chunk', token),
  closeFileRead: (token) => ipcRenderer.invoke('twiganimate:file-read-close', token),
  saveRecovery: (options) => ipcRenderer.invoke('twiganimate:recovery-save', options),
  getRecovery: () => ipcRenderer.invoke('twiganimate:recovery-get'),
  deleteRecovery: (target) => ipcRenderer.invoke('twiganimate:recovery-delete', target),
  minimize: () => ipcRenderer.invoke('twiganimate:window', 'minimize'),
  maximize: () => ipcRenderer.invoke('twiganimate:window', 'maximize'),
  close: checkpoint => ipcRenderer.invoke('twiganimate:window', 'close', checkpoint),
  getWindowState: () => ipcRenderer.invoke('twiganimate:window-state'),
  setDocumentState: (state) => ipcRenderer.invoke('twiganimate:document-state', state),
  onMenuAction: (callback) => subscribe('twiganimate:menu-action', callback),
  onOpenFile: (callback) => subscribe('twiganimate:file-opened', callback),
  onWindowState: (callback) => subscribe('twiganimate:window-state', callback),
  onBackendError: (callback) => subscribe('twiganimate:backend-error', callback),
}));
