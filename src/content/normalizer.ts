/**
 * Text normalization module for CleanPaste
 * Cleans and normalizes text from various sources (AI assistants, documents, etc.)
 */

/**
 * Main normalization function
 * Applies all cleaning rules to the input text
 */
export function normalizeText(text: string): string {
  if (!text) return '';

  return (
    text
      // Step 1: Unicode normalization (NFKC - compatibility decomposition + canonical composition)
      .normalize('NFKC')

      // Step 2: Replace non-breaking and special spaces with standard space
      .replace(/[\u00A0\u2007\u202F\u2009\u200A\u2008\u205F\u3000]/g, ' ')

      // Step 3: Remove zero-width characters
      .replace(/[\u200B\u200C\u200D\u2060\uFEFF\u200E\u200F]/g, '')

      // Step 4: Normalize typographic quotes to standard quotes
      .replace(/[""„‟«»]/g, '"')
      .replace(/[''‚‛‹›]/g, "'")

      // Step 5: Normalize dashes to standard hyphen
      .replace(/[—–−‒―]/g, '-')

      // Step 6: Normalize bullets to hyphen for list compatibility
      .replace(/[•‣◦●○■□▪▫▸▹►▻·∙⁃⦾⦿]/g, '-')

      // Step 7: Normalize line breaks (Windows and old Mac to Unix)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')

      // Step 8: Limit consecutive blank lines to maximum 2
      .replace(/\n{3,}/g, '\n\n')

      // Step 9: Collapse multiple spaces to single space
      .replace(/ {2,}/g, ' ')

      // Step 10: Remove trailing whitespace from each line
      .replace(/ +\n/g, '\n')

      // Step 11: Remove leading whitespace from each line (optional, be careful with indentation)
      // .replace(/\n +/g, '\n')

      // Step 12: Trim leading and trailing whitespace from entire text
      .trim()
  );
}

/**
 * Split text by separator type
 */
export function splitText(
  text: string,
  separator: 'line' | 'paragraph'
): string[] {
  if (!text) return [];

  const normalized = normalizeText(text);

  if (separator === 'line') {
    // Split by single line break, filter empty lines
    return normalized.split('\n').filter((line) => line.trim().length > 0);
  } else {
    // Split by paragraph (double line break or more)
    return normalized
      .split(/\n\n+/)
      .filter((para) => para.trim().length > 0)
      .map((para) => para.replace(/\n/g, ' ').trim()); // Convert internal line breaks to spaces
  }
}

/**
 * Check if text needs normalization
 * Returns true if text contains characters that would be normalized
 */
export function needsNormalization(text: string): boolean {
  if (!text) return false;

  // Check for common problematic characters
  const problematicPatterns = [
    /[\u00A0\u2007\u202F\u2009\u200A\u2008\u205F\u3000]/, // Special spaces
    /[\u200B\u200C\u200D\u2060\uFEFF\u200E\u200F]/, // Zero-width chars
    /[""„‟«»''‚‛‹›]/, // Typographic quotes
    /[—–−‒―]/, // Special dashes
    /[•‣◦●○■□▪▫▸▹►▻·∙⁃⦾⦿]/, // Bullets
    /\r/, // Carriage returns
    /\n{3,}/, // Multiple blank lines
    / {2,}/, // Multiple spaces
  ];

  return problematicPatterns.some((pattern) => pattern.test(text));
}

/**
 * Get statistics about what was normalized
 */
export function getNormalizationStats(
  original: string,
  normalized: string
): {
  charsRemoved: number;
  charsChanged: number;
  linesReduced: number;
} {
  const originalLines = original.split('\n').length;
  const normalizedLines = normalized.split('\n').length;

  return {
    charsRemoved: original.length - normalized.length,
    charsChanged: countDifferences(original, normalized),
    linesReduced: Math.max(0, originalLines - normalizedLines),
  };
}

/**
 * Count character differences between two strings
 */
function countDifferences(a: string, b: string): number {
  let differences = 0;
  const maxLen = Math.max(a.length, b.length);

  for (let i = 0; i < maxLen; i++) {
    if (a[i] !== b[i]) {
      differences++;
    }
  }

  return differences;
}

/**
 * Remove WhatsApp metadata (timestamps and sender names) from text
 * Matches patterns like: [6:14 p. m., 15/12/2025] Maximiliano Keczeli:
 */
export function removeWhatsAppMetadata(text: string): string {
  if (!text) return '';

  // Pattern for WhatsApp timestamp and name
  // Matches: [HH:MM a/p. m., DD/MM/YYYY] Name:
  // Also handles variations like [HH:MM, DD/MM/YYYY] Name:
  const metadataPattern = /\[\d{1,2}:\d{2}(?:\s*[ap]\.?\s*m\.?)?,?\s*\d{1,2}\/\d{1,2}\/\d{2,4}\]\s*[^:\n]+:\s*/gi;

  return text.replace(metadataPattern, '');
}
