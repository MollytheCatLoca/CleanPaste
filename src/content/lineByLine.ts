/**
 * Line-by-Line sending module for CleanPaste
 * Sends text segments one by one with configurable delay
 */

import { Settings, LineByLineProgress } from '../shared/types';
import { splitText } from './normalizer';

// State management
let isRunning = false;
let isCancelled = false;
let currentProgress: LineByLineProgress = { current: 0, total: 0, cancelled: false };

/**
 * Cancel the current line-by-line operation
 */
export function cancelLineByLine(): void {
  if (isRunning) {
    isCancelled = true;
    currentProgress.cancelled = true;
  }
}

/**
 * Check if line-by-line is currently running
 */
export function isLineByLineRunning(): boolean {
  return isRunning;
}

/**
 * Get current progress
 */
export function getProgress(): LineByLineProgress {
  return { ...currentProgress };
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Find WhatsApp Web input element
 */
function findWhatsAppInput(): HTMLElement | null {
  // WhatsApp Web uses a contenteditable div for the message input
  // Try multiple selectors for resilience
  const selectors = [
    '[contenteditable="true"][data-tab="10"]',
    'div[contenteditable="true"][role="textbox"]',
    'footer [contenteditable="true"]',
    '#main footer [contenteditable="true"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }

  return null;
}

/**
 * Find WhatsApp Web send button
 */
function findSendButton(): HTMLElement | null {
  const selectors = [
    '[data-icon="send"]',
    'button[aria-label="Send"]',
    'span[data-icon="send"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      // If it's the icon, get the parent button
      return element.closest('button') || element;
    }
  }

  return null;
}

/**
 * Insert text into WhatsApp input
 */
function insertText(input: HTMLElement, text: string): void {
  // Focus the input
  input.focus();

  // Clear existing content
  input.innerHTML = '';

  // Create text node and insert
  const textNode = document.createTextNode(text);
  input.appendChild(textNode);

  // Dispatch input event to trigger WhatsApp's internal handlers
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: text,
  });
  input.dispatchEvent(inputEvent);

  // Move cursor to end
  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(input);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/**
 * Send the current message (click send or press Enter)
 */
function sendMessage(): boolean {
  // Try clicking the send button first
  const sendButton = findSendButton();
  if (sendButton) {
    sendButton.click();
    return true;
  }

  // Fallback: simulate Enter key
  const input = findWhatsAppInput();
  if (input) {
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(enterEvent);
    return true;
  }

  return false;
}

/**
 * Show progress indicator
 */
function showProgressIndicator(current: number, total: number): void {
  let indicator = document.getElementById('cleanpaste-progress');

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'cleanpaste-progress';
    document.body.appendChild(indicator);
  }

  indicator.textContent = `CleanPaste: Sending ${current}/${total}... (Esc to cancel)`;
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
}

/**
 * Hide progress indicator
 */
function hideProgressIndicator(): void {
  const indicator = document.getElementById('cleanpaste-progress');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Show completion message
 */
function showCompletionMessage(sent: number, cancelled: boolean): void {
  let indicator = document.getElementById('cleanpaste-progress');

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'cleanpaste-progress';
    document.body.appendChild(indicator);
  }

  const message = cancelled
    ? `CleanPaste: Cancelled after ${sent} messages`
    : `CleanPaste: Sent ${sent} messages`;

  indicator.textContent = message;
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${cancelled ? 'rgba(255, 152, 0, 0.9)' : 'rgba(76, 175, 80, 0.9)'};
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Auto-hide after 2 seconds
  setTimeout(() => {
    hideProgressIndicator();
  }, 2000);
}

/**
 * Main line-by-line send function
 */
export async function sendLineByLine(
  text: string,
  settings: Settings
): Promise<{ sent: number; cancelled: boolean }> {
  // Don't start if already running
  if (isRunning) {
    return { sent: 0, cancelled: false };
  }

  // Reset state
  isRunning = true;
  isCancelled = false;

  // Split text into segments
  const segments = splitText(text, settings.lineByLineSeparator);

  // Limit to max segments
  const limitedSegments = segments.slice(0, settings.lineByLineMaxSegments);
  const total = limitedSegments.length;

  if (total === 0) {
    isRunning = false;
    return { sent: 0, cancelled: false };
  }

  // Update progress
  currentProgress = { current: 0, total, cancelled: false };

  let sent = 0;

  // Setup escape key listener
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelLineByLine();
    }
  };
  document.addEventListener('keydown', escapeHandler);

  try {
    for (let i = 0; i < total; i++) {
      // Check for cancellation
      if (isCancelled) {
        break;
      }

      const segment = limitedSegments[i];
      currentProgress.current = i + 1;

      // Show progress
      showProgressIndicator(i + 1, total);

      // Find input
      const input = findWhatsAppInput();
      if (!input) {
        console.error('CleanPaste: Could not find WhatsApp input');
        break;
      }

      // Insert text
      insertText(input, segment);

      // Wait a bit for WhatsApp to process
      await sleep(100);

      // Send message
      const sendSuccess = sendMessage();
      if (!sendSuccess) {
        console.error('CleanPaste: Could not send message');
        break;
      }

      sent++;

      // Wait before next message (except for the last one)
      if (i < total - 1 && !isCancelled) {
        await sleep(settings.lineByLineDelay);
      }
    }
  } finally {
    // Cleanup
    document.removeEventListener('keydown', escapeHandler);
    isRunning = false;

    // Show completion message
    showCompletionMessage(sent, isCancelled);

    currentProgress = { current: sent, total, cancelled: isCancelled };
  }

  return { sent, cancelled: isCancelled };
}
