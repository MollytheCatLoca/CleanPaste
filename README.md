# CleanPaste

**Chrome extension para WhatsApp Web que limpia y normaliza texto pegado.**

---

## El Problema

Cuando copiamos texto de ChatGPT, Claude, Notion o cualquier fuente y lo pegamos en WhatsApp Web:

| Lo que pasa | Por qué |
|-------------|---------|
| Espacios raros entre palabras | Non-breaking spaces (NBSP) |
| Bullets que no renderizan | Caracteres Unicode (•, ▸, ◦) |
| Saltos de línea excesivos | Múltiples `\n` consecutivos |
| Comillas "raras" | Comillas tipográficas ("") |
| Guiones largos | Em-dash (—) y en-dash (–) |

**Resultado**: El mensaje se ve "copiado" y poco profesional.

---

## MVP Actual (v1.0.0)

### Features Implementados

| Feature | Descripción | Estado |
|---------|-------------|--------|
| **Clean Paste** | Normaliza automáticamente al pegar | ✅ |
| **Line-by-Line** | Envía cada párrafo como mensaje separado | ✅ |
| **Remove Metadata** | Quita timestamps de WhatsApp exportado | ✅ |
| **Settings Popup** | Panel de configuración completo | ✅ |

### Qué normaliza Clean Paste

- Unicode NFKC normalization
- Espacios invisibles → espacio normal
- Zero-width characters → eliminados
- Comillas tipográficas → comillas estándar
- Guiones especiales → guión normal
- Bullets Unicode → guión
- Múltiples líneas vacías → máximo 2
- Espacios múltiples → uno solo

### Stack Técnico

```
TypeScript + Vite + @crxjs/vite-plugin
Chrome Extension Manifest V3
chrome.storage.sync para settings
```

---

## Cómo Probar

### 1. Clonar e instalar

```bash
git clone https://github.com/MollytheCatLoca/CleanPaste.git
cd CleanPaste
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Cargar en Chrome

1. Abrir `chrome://extensions/`
2. Activar "Developer mode" (esquina superior derecha)
3. Click "Load unpacked"
4. Seleccionar la carpeta `dist/`

### 4. Probar

1. Abrir [WhatsApp Web](https://web.whatsapp.com)
2. Copiar texto de ChatGPT o cualquier fuente
3. Pegar en un chat → se limpia automáticamente
4. Click en icono de extensión → ver settings

### Testing Line-by-Line

1. Activar "Enable Line-by-Line" en settings
2. Copiar texto con múltiples párrafos
3. Pegar → envía cada párrafo como mensaje separado
4. Presionar `Escape` para cancelar

### Testing Remove Metadata

1. Activar "Remove WhatsApp metadata" en settings
2. Copiar texto exportado de WhatsApp:
   ```
   [6:14 p. m., 15/12/2025] Juan: Hola!
   ```
3. Pegar → solo aparece "Hola!"

---

## Estructura del Proyecto

```
cleanpaste/
├── src/
│   ├── content/         # Content script (corre en WhatsApp Web)
│   │   ├── content.ts   # Entry point, paste interceptor
│   │   ├── normalizer.ts# Lógica de normalización
│   │   ├── lineByLine.ts# Envío mensaje por mensaje
│   │   └── styles.css   # Estilos del indicador
│   ├── popup/           # Settings UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.ts
│   ├── background/      # Service worker
│   └── shared/          # Types y storage helpers
├── assets/              # Iconos
├── docs/                # PRD y documentación
└── manifest.json        # Extension manifest
```

---

## Roadmap

### Fase 2: Polish & Launch (próximo)

- [ ] Landing page con demo interactivo
- [ ] Product Hunt launch
- [ ] Bug fixes de feedback inicial
- [ ] Chrome Web Store submission

### Fase 3: Pro Features (futuro)

- [ ] **AI Smart Format** - Mejoras inteligentes de formato
- [ ] **AI Tone Adjustment** - Ajustar tono (formal/casual)
- [ ] **Message Variations** - Generar alternativas
- [ ] Payment integration (Stripe)

### Fase 4: Expansión

- [ ] Firefox support
- [ ] Otras plataformas (Telegram, Slack, LinkedIn)

---

## Ideas y Contribuciones

**Tenés una idea?** Abrí un issue o comentá directamente.

Algunas áreas donde necesitamos input:

- **UX**: Mejoras al popup de settings
- **Edge cases**: Textos que no se normalizan bien
- **Features**: Qué más necesitan los usuarios?
- **Testing**: Ayuda probando en diferentes sistemas

---

## Links

| Recurso | URL |
|---------|-----|
| Repo | https://github.com/MollytheCatLoca/CleanPaste |
| PRD Completo | [docs/PRD_CleanPaste_v1.0.md](docs/PRD_CleanPaste_v1.0.md) |

---

## Dev Commands

```bash
npm install      # Instalar dependencias
npm run dev      # Watch mode (rebuild on changes)
npm run build    # Build para producción
```

---

*CleanPaste v1.0.0 - Diciembre 2024*
