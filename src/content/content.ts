/**
 * CleanPaste Content Script
 * Main entry point for WhatsApp Web integration
 */

import { Settings } from '../shared/types';
import { getSettings, onSettingsChange, incrementPasteCount } from '../shared/storage';
import { normalizeText, needsNormalization, removeWhatsAppMetadata } from './normalizer';
import { sendLineByLine, cancelLineByLine, isLineByLineRunning } from './lineByLine';

// Current settings
let settings: Settings;

/**
 * Initialize the content script
 */
async function initialize(): Promise<void> {
  console.log('CleanPaste: Initializing...');

  // Load initial settings
  settings = await getSettings();
  console.log('CleanPaste: Settings loaded', settings);

  // Listen for settings changes
  onSettingsChange((newSettings) => {
    settings = newSettings;
    console.log('CleanPaste: Settings updated', settings);
  });

  // Setup paste interceptor
  setupPasteInterceptor();

  // Setup escape key handler for cancelling line-by-line
  setupEscapeHandler();

  console.log('CleanPaste: Ready!');
}

/**
 * Setup paste event interceptor
 */
function setupPasteInterceptor(): void {
  document.addEventListener('paste', handlePaste, true);
}

/**
 * Handle paste event
 */
async function handlePaste(event: ClipboardEvent): Promise<void> {
  console.log('CleanPaste: Paste event detected', { target: event.target });

  // Check if extension is enabled
  if (!settings.enabled) {
    console.log('CleanPaste: Extension disabled, skipping');
    return;
  }

  // Check if we're in a WhatsApp input
  const target = event.target as HTMLElement;
  console.log('CleanPaste: Checking if WhatsApp input', {
    contenteditable: target?.getAttribute('contenteditable'),
    role: target?.getAttribute('role'),
    dataTab: target?.getAttribute('data-tab'),
    closest: target?.closest('footer') ? 'has footer' : 'no footer'
  });

  if (!isWhatsAppInput(target)) {
    console.log('CleanPaste: Not a WhatsApp input, skipping');
    return;
  }

  console.log('CleanPaste: Valid WhatsApp input, processing paste');

  // Find the actual contenteditable element
  let inputElement = target.closest('[contenteditable="true"]') as HTMLElement;
  if (!inputElement) {
    const footer = target.closest('footer');
    if (footer) {
      inputElement = footer.querySelector('[contenteditable="true"]') as HTMLElement;
    }
  }

  if (!inputElement) {
    console.log('CleanPaste: Could not find input element');
    return;
  }

  // Get clipboard text
  const clipboardData = event.clipboardData;
  if (!clipboardData) {
    return;
  }

  const originalText = clipboardData.getData('text/plain');
  if (!originalText) {
    return;
  }

  // Prevent default paste
  event.preventDefault();
  event.stopPropagation();

  // Remove WhatsApp metadata if enabled
  let textToProcess = originalText;
  if (settings.removeMetadata) {
    textToProcess = removeWhatsAppMetadata(textToProcess);
    console.log('CleanPaste: Metadata removed');
  }

  // Normalize the text
  const normalizedText = normalizeText(textToProcess);

  // Log if text was changed
  if (needsNormalization(originalText)) {
    console.log('CleanPaste: Text normalized', {
      originalLength: originalText.length,
      normalizedLength: normalizedText.length,
    });
  }

  // Handle line-by-line mode
  if (settings.lineByLineEnabled && normalizedText.includes('\n')) {
    // Send line by line
    await sendLineByLine(normalizedText, settings);
  } else {
    // Normal paste: insert normalized text
    insertNormalizedText(inputElement, normalizedText);
  }

  // Increment paste count
  incrementPasteCount();

  // Notify background script
  chrome.runtime.sendMessage({
    type: 'PASTE_PROCESSED',
    payload: {
      originalLength: originalText.length,
      normalizedLength: normalizedText.length,
      wasNormalized: needsNormalization(originalText),
      lineByLine: settings.lineByLineEnabled,
    },
  }).catch(() => {
    // Ignore errors if background script is not available
  });
}

/**
 * Check if element is a WhatsApp input
 */
function isWhatsAppInput(element: HTMLElement): boolean {
  if (!element) return false;

  // The target might be an inner element (like <br> or <span>)
  // We need to find the contenteditable parent
  const editableElement = element.closest('[contenteditable="true"]') ||
    (element.getAttribute('contenteditable') === 'true' ? element : null);

  if (!editableElement) {
    // Also check if we're inside the footer (WhatsApp input area)
    // and there's a contenteditable nearby
    const footer = element.closest('footer');
    if (footer) {
      const input = footer.querySelector('[contenteditable="true"]');
      if (input) {
        return true;
      }
    }
    return false;
  }

  // Check if it's in the message composition area
  const selectors = [
    '[data-tab="10"]',
    '[role="textbox"]',
  ];

  for (const selector of selectors) {
    if (editableElement.matches(selector) || editableElement.closest(selector)) {
      return true;
    }
  }

  // Check if it's inside footer (message input area)
  if (editableElement.closest('footer')) {
    return true;
  }

  return false;
}

/**
 * Insert normalized text into input
 */
function insertNormalizedText(target: HTMLElement, text: string): void {
  // Focus the target
  target.focus();

  // Try using execCommand first (deprecated but still works)
  const success = document.execCommand('insertText', false, text);

  if (!success) {
    // Fallback: use Input Events API
    const inputEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text,
    });

    const prevented = !target.dispatchEvent(inputEvent);

    if (!prevented) {
      // Manual insertion as last resort
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move cursor to end of inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Append to element
        target.textContent = text;
      }

      // Dispatch input event
      target.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: text,
        })
      );
    }
  }
}

/**
 * Setup escape key handler
 */
function setupEscapeHandler(): void {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isLineByLineRunning()) {
      cancelLineByLine();
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Export for CRXJS vite plugin
export const onExecute = () => {
  // Already initialized above
};
