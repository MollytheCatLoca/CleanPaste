import { Settings, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'cleanpaste_settings';

/**
 * Get settings from chrome.storage.sync
 */
export async function getSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      const stored = result[STORAGE_KEY] as Partial<Settings> | undefined;
      resolve({ ...DEFAULT_SETTINGS, ...stored });
    });
  });
}

/**
 * Save settings to chrome.storage.sync
 */
export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };

  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: updated }, () => {
      resolve();
    });
  });
}

/**
 * Listen for settings changes
 */
export function onSettingsChange(callback: (settings: Settings) => void): void {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes[STORAGE_KEY]) {
      const newSettings = changes[STORAGE_KEY].newValue as Settings;
      callback({ ...DEFAULT_SETTINGS, ...newSettings });
    }
  });
}

/**
 * Update badge count
 */
export async function updateBadgeCount(count: number): Promise<void> {
  const settings = await getSettings();

  if (settings.showBadge && count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

/**
 * Get and increment paste count for badge
 */
let sessionPasteCount = 0;

export function incrementPasteCount(): number {
  sessionPasteCount++;
  return sessionPasteCount;
}

export function getPasteCount(): number {
  return sessionPasteCount;
}

export function resetPasteCount(): void {
  sessionPasteCount = 0;
}
