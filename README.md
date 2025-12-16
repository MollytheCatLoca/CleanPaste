# CleanPaste

Chrome extension for WhatsApp Web that cleans and normalizes pasted text, with line-by-line sending mode.

## Features

- **Clean Paste**: Automatically normalizes text when pasting
  - Removes invisible Unicode characters
  - Fixes typographic quotes and dashes
  - Normalizes spacing and line breaks
  - Converts bullets to standard format

- **Line-by-Line Mode**: Send each paragraph as a separate message
  - Configurable delay between messages
  - Split by line or paragraph
  - Cancel with Escape key

## Installation

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## Usage

1. Install the extension
2. Open WhatsApp Web (web.whatsapp.com)
3. Paste text (Ctrl+V) - it will be automatically cleaned
4. Enable Line-by-Line mode in settings to send paragraphs separately

## Settings

Click the extension icon to access settings:

- **Enable CleanPaste**: Master on/off switch
- **Line-by-Line Mode**: Send each line/paragraph as separate message
- **Split by**: Line or Paragraph
- **Delay**: Time between messages (300-2000ms)
- **Max messages**: Limit messages per paste (5-20)
- **Show badge**: Display paste count on icon

## Project Structure

```
cleanpaste/
├── src/
│   ├── content/      # Content script (runs on WhatsApp Web)
│   ├── popup/        # Settings UI
│   ├── background/   # Service worker
│   └── shared/       # Shared types and utilities
├── assets/           # Icons
└── manifest.json     # Extension manifest
```

## License

MIT
