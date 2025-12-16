/**
 * CleanPaste Settings Interface
 */
export interface Settings {
  /** Master enable/disable switch */
  enabled: boolean;

  /** Line-by-line mode enabled */
  lineByLineEnabled: boolean;

  /** Delay between messages in ms (300-2000) */
  lineByLineDelay: number;

  /** How to split text: by line or paragraph */
  lineByLineSeparator: 'line' | 'paragraph';

  /** Maximum segments to send (5-20) */
  lineByLineMaxSegments: number;

  /** Show badge count on extension icon */
  showBadge: boolean;

  /** Remove WhatsApp metadata (timestamps, names) from pasted text */
  removeMetadata: boolean;
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  lineByLineEnabled: false,
  lineByLineDelay: 800,
  lineByLineSeparator: 'paragraph',
  lineByLineMaxSegments: 10,
  showBadge: true,
  removeMetadata: false,
};

/**
 * Message types for communication between content script and popup
 */
export interface CleanPasteMessage {
  type: 'SETTINGS_UPDATED' | 'PASTE_PROCESSED' | 'LINE_BY_LINE_PROGRESS' | 'LINE_BY_LINE_CANCELLED';
  payload?: unknown;
}

/**
 * Line-by-line progress info
 */
export interface LineByLineProgress {
  current: number;
  total: number;
  cancelled: boolean;
}
