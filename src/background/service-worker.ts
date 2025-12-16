/**
 * CleanPaste Service Worker
 * Handles background tasks and message passing
 */

import { getSettings, updateBadgeCount } from '../shared/storage';

// Session paste count
let sessionPasteCount = 0;

/**
 * Handle messages from content script
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PASTE_PROCESSED') {
    handlePasteProcessed(message.payload);
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});

/**
 * Handle paste processed event
 */
async function handlePasteProcessed(payload: {
  originalLength: number;
  normalizedLength: number;
  wasNormalized: boolean;
  lineByLine: boolean;
}): Promise<void> {
  // Increment paste count
  sessionPasteCount++;

  // Update badge
  const settings = await getSettings();
  if (settings.showBadge) {
    await updateBadgeCount(sessionPasteCount);
  }

  // Log for debugging
  console.log('CleanPaste: Paste processed', {
    ...payload,
    sessionCount: sessionPasteCount,
  });
}

/**
 * Handle extension install/update
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('CleanPaste: Extension installed');

    // Open welcome page or WhatsApp Web
    chrome.tabs.create({ url: 'https://web.whatsapp.com' });
  } else if (details.reason === 'update') {
    console.log('CleanPaste: Extension updated to', chrome.runtime.getManifest().version);
  }
});

/**
 * Reset badge count when popup is opened
 */
chrome.action.onClicked.addListener(() => {
  // This won't fire if we have a popup, but keeping for reference
  sessionPasteCount = 0;
  chrome.action.setBadgeText({ text: '' });
});

// Initialize
console.log('CleanPaste: Service worker started');
