/**
 * CleanPaste Popup Script
 * Handles settings UI and user interactions
 */

import { Settings } from '../shared/types';
import { getSettings, saveSettings } from '../shared/storage';

// DOM Elements
const elements = {
  enabled: document.getElementById('enabled') as HTMLInputElement,
  lineByLineEnabled: document.getElementById('lineByLineEnabled') as HTMLInputElement,
  lineByLineSeparator: document.getElementById('lineByLineSeparator') as HTMLSelectElement,
  lineByLineDelay: document.getElementById('lineByLineDelay') as HTMLInputElement,
  lineByLineMaxSegments: document.getElementById('lineByLineMaxSegments') as HTMLSelectElement,
  removeMetadata: document.getElementById('removeMetadata') as HTMLInputElement,
  showBadge: document.getElementById('showBadge') as HTMLInputElement,
  delayValue: document.getElementById('delayValue') as HTMLSpanElement,
  separatorRow: document.getElementById('separatorRow') as HTMLElement,
  delayRow: document.getElementById('delayRow') as HTMLElement,
  maxSegmentsRow: document.getElementById('maxSegmentsRow') as HTMLElement,
  upgradeBtn: document.getElementById('upgradeBtn') as HTMLButtonElement,
  feedbackLink: document.getElementById('feedbackLink') as HTMLAnchorElement,
  helpLink: document.getElementById('helpLink') as HTMLAnchorElement,
};

/**
 * Load settings and populate UI
 */
async function loadSettings(): Promise<void> {
  const settings = await getSettings();

  // Populate form values
  elements.enabled.checked = settings.enabled;
  elements.lineByLineEnabled.checked = settings.lineByLineEnabled;
  elements.lineByLineSeparator.value = settings.lineByLineSeparator;
  elements.lineByLineDelay.value = settings.lineByLineDelay.toString();
  elements.lineByLineMaxSegments.value = settings.lineByLineMaxSegments.toString();
  elements.removeMetadata.checked = settings.removeMetadata;
  elements.showBadge.checked = settings.showBadge;

  // Update delay display
  updateDelayDisplay(settings.lineByLineDelay);

  // Update line-by-line options visibility
  updateLineByLineOptions(settings.lineByLineEnabled);
}

/**
 * Update delay value display
 */
function updateDelayDisplay(value: number): void {
  elements.delayValue.textContent = `${value}ms`;
}

/**
 * Update line-by-line options visibility
 */
function updateLineByLineOptions(enabled: boolean): void {
  const rows = [elements.separatorRow, elements.delayRow, elements.maxSegmentsRow];

  rows.forEach((row) => {
    if (enabled) {
      row.classList.remove('disabled');
    } else {
      row.classList.add('disabled');
    }
  });
}

/**
 * Save a setting
 */
async function saveSetting(key: keyof Settings, value: Settings[keyof Settings]): Promise<void> {
  await saveSettings({ [key]: value });
}

/**
 * Setup event listeners
 */
function setupEventListeners(): void {
  // Master toggle
  elements.enabled.addEventListener('change', async () => {
    await saveSetting('enabled', elements.enabled.checked);
  });

  // Line-by-line toggle
  elements.lineByLineEnabled.addEventListener('change', async () => {
    const enabled = elements.lineByLineEnabled.checked;
    await saveSetting('lineByLineEnabled', enabled);
    updateLineByLineOptions(enabled);
  });

  // Separator select
  elements.lineByLineSeparator.addEventListener('change', async () => {
    await saveSetting(
      'lineByLineSeparator',
      elements.lineByLineSeparator.value as 'line' | 'paragraph'
    );
  });

  // Delay slider
  elements.lineByLineDelay.addEventListener('input', () => {
    updateDelayDisplay(parseInt(elements.lineByLineDelay.value, 10));
  });

  elements.lineByLineDelay.addEventListener('change', async () => {
    await saveSetting('lineByLineDelay', parseInt(elements.lineByLineDelay.value, 10));
  });

  // Max segments select
  elements.lineByLineMaxSegments.addEventListener('change', async () => {
    await saveSetting(
      'lineByLineMaxSegments',
      parseInt(elements.lineByLineMaxSegments.value, 10)
    );
  });

  // Remove metadata toggle
  elements.removeMetadata.addEventListener('change', async () => {
    await saveSetting('removeMetadata', elements.removeMetadata.checked);
  });

  // Badge toggle
  elements.showBadge.addEventListener('change', async () => {
    await saveSetting('showBadge', elements.showBadge.checked);

    // Clear badge if disabled
    if (!elements.showBadge.checked) {
      chrome.action.setBadgeText({ text: '' });
    }
  });

  // Upgrade button
  elements.upgradeBtn.addEventListener('click', () => {
    // TODO: Implement Pro upgrade flow
    chrome.tabs.create({ url: 'https://cleanpaste.app/pro' });
  });

  // Feedback link
  elements.feedbackLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://cleanpaste.app/feedback' });
  });

  // Help link
  elements.helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://cleanpaste.app/help' });
  });
}

/**
 * Initialize popup
 */
async function initialize(): Promise<void> {
  await loadSettings();
  setupEventListeners();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
