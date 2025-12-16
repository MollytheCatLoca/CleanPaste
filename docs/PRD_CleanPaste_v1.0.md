# CleanPaste - Product Requirements Document

**Version:** 1.0
**Last Updated:** December 2025
**Status:** Ready for Development

---

## Table of Contents

1. [Context & Problem](#1-context--problem)
2. [Product Objective](#2-product-objective)
3. [Design Principles](#3-design-principles)
4. [Target Audience](#4-target-audience)
5. [Value Proposition](#5-value-proposition)
6. [Initial Scope](#6-initial-scope)
7. [MVP Definition](#7-mvp-definition)
8. [Competitive Analysis](#8-competitive-analysis)
9. [Monetization Model](#9-monetization-model)
10. [Success Metrics](#10-success-metrics)
11. [Distribution Strategy](#11-distribution-strategy)
12. [Roadmap](#12-roadmap)
13. [Risks & Mitigation](#13-risks--mitigation)
14. [Appendices](#14-appendices)

---

## 1. Context & Problem

### 1.1 The Current Reality

AI assistants (ChatGPT, Gemini, Claude) have become professional writing tools. Millions of users rely on them daily to:

- Draft business messages and proposals
- Structure complex ideas clearly
- Improve communication clarity
- Prepare elaborate technical responses

WhatsApp Web is where many of these messages end up being sent, especially in B2B and professional contexts.

### 1.2 The Problem

When users copy text from an AI assistant and paste it into WhatsApp Web, the formatting breaks in predictable ways:

| Symptom | Technical Cause |
|---------|-----------------|
| Strange spaces between words | Non-breaking spaces (NBSP, thin space) |
| Bullets that don't render | Unicode characters (-, -, -) |
| Excessive blank lines | Multiple consecutive \n |
| "Weird" quotes | Typographic quotes ("") |
| Long dashes | Em-dash (-) and en-dash (-) |

**The result**: The message looks sloppy and "copied," revealing the process.

### 1.3 The Real Pain Point

The problem is NOT about authorship. The user IS the author of their content - AI is a writing tool, like an advanced spell checker.

The problem is PERCEPTION:
- A poorly formatted message looks careless
- Format artifacts expose the copy-paste process
- Recipients may perceive lack of effort or attention
- In professional contexts, this affects credibility

### 1.4 Why Ctrl+Shift+V Isn't Enough

"Paste without formatting" (Ctrl+Shift+V) removes styles but does NOT solve:

- Invisible Unicode characters (zero-width)
- Non-breaking spaces
- Bullet and list normalization
- Collapsing multiple blank lines
- Typographic character conversion

CleanPaste performs deep technical normalization, not just style removal.

---

## 2. Product Objective

Develop a Chrome extension for WhatsApp Web that acts as an invisible technical editing layer, cleaning and normalizing text at paste time, so messages appear clear, professional, and readable without manual intervention.

### Core Goals

| Goal | Description |
|------|-------------|
| Improve visual quality | Messages look clean and professional |
| Reduce friction | No manual corrections needed |
| Preserve semantics | Content meaning unchanged |
| Zero complexity | No learning curve for users |

---

## 3. Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Invisible by default** | User doesn't "use" the extension - it just works |
| **Zero learning curve** | No tutorial or initial setup required |
| **Conservative** | Doesn't rewrite text, only normalizes it |
| **Professional focus** | Optimized for long or sensitive messages |
| **Low risk** | Minimal permissions, no external data access |
| **Frictionless monetization** | Free is useful, Pro is clearly valuable |

---

## 4. Target Audience

### 4.1 Primary Users

Intensive WhatsApp Web users who:
- Send long messages regularly
- Care about form and clarity
- Work in B2B or professional contexts

### 4.2 User Personas

#### Persona 1: Sofia - Sales Development Rep

| Attribute | Detail |
|-----------|--------|
| Role | SDR at a B2B SaaS company |
| Age | 28 |
| Daily WhatsApp messages | 30-50 |
| Pain | Uses ChatGPT to craft personalized outreach, but pasted messages look "robotic" |
| Quote | "I spend 5 minutes per message fixing the formatting. That's an hour a day wasted." |

#### Persona 2: Martin - Real Estate Broker

| Attribute | Detail |
|-----------|--------|
| Role | Independent real estate agent |
| Age | 42 |
| Daily WhatsApp messages | 20-30 |
| Pain | Sends property descriptions drafted with AI, needs them to look personal |
| Quote | "My clients can tell when something is copy-pasted. It feels impersonal." |

#### Persona 3: Laura - Tech Recruiter

| Attribute | Detail |
|-----------|--------|
| Role | Senior recruiter at a staffing firm |
| Age | 35 |
| Daily WhatsApp messages | 40-60 |
| Pain | Crafts candidate outreach with AI assistance, formatting issues hurt response rates |
| Quote | "First impressions matter. A messy message gets ignored." |

---

## 5. Value Proposition

### Primary Statement

> **"Your content, your format. No copy-paste traces."**

### Promise to Users

Every time you paste text into WhatsApp Web from any source (ChatGPT, Gemini, Notion, Google Docs, emails), the message looks like you typed it directly.

### What CleanPaste IS

- An invisible technical normalization layer
- A format artifact eliminator
- A professional presentation tool
- A time saver (no manual corrections)

### What CleanPaste IS NOT

- A content rewriter
- An AI usage concealer
- A grammar checker
- A style or tone editor

### Analogy

CleanPaste is to formatting what spell check is to writing: it doesn't change your message, it improves how it's presented.

### Differentiation

| Alternative | Limitation |
|-------------|------------|
| Ctrl+Shift+V | Doesn't normalize Unicode or special characters |
| Manual pasting | Requires manual correction, time-consuming |
| Do nothing | Message looks sloppy, reveals process |
| **CleanPaste** | **Automatic, invisible, complete** |

---

## 6. Initial Scope

### Included

| Item | Status |
|------|--------|
| WhatsApp Web (web.whatsapp.com) | Yes |
| Chrome / Chromium (MV3) | Yes |
| Plain text paste | Yes |

### Excluded (for now)

| Item | Reason |
|------|--------|
| WhatsApp Desktop native | Different architecture |
| Mobile | Not technically feasible |
| Other platforms (Telegram, LinkedIn, Gmail) | Post-validation expansion |
| Semantic or tone rewriting | Out of scope - we normalize, not rewrite |

---

## 7. MVP Definition

### 7.1 MVP Objective

Validate that:
- The problem exists and hurts
- The solution is perceived as useful
- Users keep it installed
- There's willingness to pay for improvements

### 7.2 Core Features

#### 7.2.1 Automatic Clean Paste (Core)

When detecting a paste event in a WhatsApp Web editable field:

1. Intercept clipboard text in text/plain format
2. Cancel original paste
3. Apply normalization function
4. Insert clean text at cursor position

**Normalization includes:**
- Unicode normalization (NFKC)
- Replace non-breaking and invisible spaces with standard space
- Remove zero-width characters
- Unify line breaks
- Limit consecutive blank lines
- Collapse multiple spaces
- Remove trailing spaces

**Does NOT include:**
- Grammar correction
- Word changes
- Text shortening
- Phrase rewriting

#### 7.2.2 Basic List Normalization

When text contains:
- Bullets like -
- Long dashes - or -

MVP will:
- Convert to standard `-`
- Maintain simple list structure

#### 7.2.3 Passive Mode by Default

The extension:
- Activates automatically on install
- Shows no visible UI
- Doesn't interrupt flow

#### 7.2.4 Functional Free Tier

MVP includes a free mode that:
- Allows Clean Paste usage
- May have a simple limitation (e.g., daily paste count)
- Never breaks user messages

#### 7.2.5 Settings Panel (MVP)

Accessible via extension popup icon. Designed to be extensible for future features.

**MVP Settings:**

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Enable CleanPaste | Toggle | ON | Master on/off switch |
| Line-by-Line Mode | Toggle | OFF | Send each line as separate message |
| Line Delay | Slider | 800ms | Delay between line sends (300-2000ms) |
| Separator | Select | Paragraph | Split by: Line / Paragraph |
| Show Badge | Toggle | ON | Show processed count on extension icon |

**Future Settings (extensible):**
- Custom normalization rules
- Platform-specific configurations
- Keyboard shortcuts customization
- Theme (light/dark)
- Export/import settings

#### 7.2.6 Line-by-Line Mode (Burst Send) - MVP Core Feature

Instead of pasting all text at once, CleanPaste sends each line/paragraph as a separate message automatically.

**Why this matters:**
- Multiple short messages look more natural than one long block
- Simulates real typing behavior
- Significantly reduces "copy-paste" perception
- Better engagement in chat contexts
- Messages appear conversational, not robotic

**How it works:**
1. User pastes multi-line text (Ctrl+V)
2. CleanPaste normalizes the text
3. Splits content by configured separator (line/paragraph)
4. Inserts first segment into input field
5. Simulates "Send" action (Enter key)
6. Waits configured delay (shows typing indicator)
7. Repeats for remaining segments
8. Shows subtle progress indicator

**Configuration Options:**
| Option | Values | Default |
|--------|--------|---------|
| Separator | Line / Paragraph | Paragraph |
| Delay | 300ms - 2000ms | 800ms |
| Max segments | 5 - 20 | 10 |
| Preview before send | On / Off | Off |

**Safety Features:**
- **Preview mode**: Shows message split before sending (optional)
- **Cancel**: Escape key stops the sequence immediately
- **Max limit**: Never sends more than configured max without confirmation
- **Visual feedback**: Progress indicator shows remaining messages

### 7.3 What MVP Does NOT Include

To avoid scope creep:
- Style profiles
- Floating buttons
- Complex UI
- Mandatory login
- Dashboards
- Advanced analytics
- Multi-platform support
- External integrations

### 7.4 Technical Architecture

| Component | Specification |
|-----------|---------------|
| Type | Chrome Extension Manifest V3 |
| Injection | Content Script on web.whatsapp.com only |
| Background | Service worker for settings sync |
| Popup | Settings panel UI (HTML/CSS/JS) |
| Storage | chrome.storage.sync for user preferences |
| Network | No external network access (MVP) |
| Data | Settings only, no message content stored |
| Language | TypeScript |
| Framework | None (keep it light) |
| Build | Vite or esbuild (simple bundler) |

**Architecture Diagram:**
```
┌─────────────────────────────────────────────────────┐
│                    Chrome Extension                  │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │   Popup UI   │    │    Content Script        │   │
│  │  (Settings)  │    │  (web.whatsapp.com)      │   │
│  │              │    │                          │   │
│  │ - Toggles    │    │ - Paste interceptor      │   │
│  │ - Sliders    │    │ - Text normalizer        │   │
│  │ - Selects    │    │ - Line-by-line sender    │   │
│  └──────┬───────┘    │ - Progress indicator     │   │
│         │            └────────────┬─────────────┘   │
│         │                         │                 │
│         ▼                         ▼                 │
│  ┌─────────────────────────────────────────────┐   │
│  │           chrome.storage.sync               │   │
│  │         (User preferences)                  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 7.5 Minimal Permissions

```json
{
  "host_permissions": ["https://web.whatsapp.com/*"]
}
```

- No global clipboard permissions
- No tab access
- No tracking

This reduces Store approval friction.

### 7.6 Known MVP Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WhatsApp DOM changes | High | High | Resilient selectors, monitoring |
| contenteditable behavior changes | Medium | High | Multiple fallback strategies |
| execCommand deprecation | Medium | High | Input Events API migration path |
| Chromium browser differences | Low | Medium | Testing across browsers |

---

## 8. Competitive Analysis

### 8.1 Direct Competition

**None identified** - No specific solution for WhatsApp Web + AI output normalization exists.

### 8.2 Indirect Competition

| Product | What it does | Why it doesn't compete |
|---------|--------------|----------------------|
| Grammarly | Grammar correction | Doesn't normalize technical format |
| Clipboard managers | Clipboard history | Don't clean content |
| Paste as Plain Text | Remove styles | Doesn't normalize Unicode |
| Text Blaze | Text expansion | Doesn't intercept paste |

### 8.3 Barriers to Entry

| Level | Barrier |
|-------|---------|
| Low | Technically simple to replicate |
| Medium | Requires Unicode and WhatsApp DOM knowledge |
| High | Distribution and user trust (extension permissions) |

### 8.4 Competitive Advantage

- First mover in specific niche (WhatsApp + AI output)
- Laser focus on one concrete problem
- Lightweight extension vs. heavy solutions
- Deep understanding of the user pain point

---

## 9. Monetization Model

### 9.1 Strategy: Functional Freemium

**Principle**: Free must be useful. Pro must be clearly better.

### 9.2 Free Tier

| Feature | Included |
|---------|----------|
| Automatic Clean Paste | Unlimited |
| Standard normalization | Complete |
| Registration | Not required |
| Artificial limits | None that frustrate |

### 9.3 Pro Tier ($4.99/month or $39/year)

| Feature | Description |
|---------|-------------|
| **AI Smart Format** | Intelligent formatting improvements based on message context |
| **AI Tone Adjustment** | Adjust tone: formal, casual, friendly, concise |
| **Message Variations** | Generate 2-3 alternative versions of your message |
| **Advanced Line-by-Line** | Smart paragraph detection, custom delays per context |
| Format profiles | Save configurations by context |
| Custom shortcuts | Ctrl+Shift+P for profile-specific paste |
| Usage statistics | Messages cleaned, AI suggestions used |
| Priority support | 24h response time |
| Early access | New features before free users |

#### 9.3.1 AI Features Detail

**AI Smart Format (Pro):**
- Analyzes message structure and intent
- Suggests optimal paragraph breaks
- Recommends bullet points vs. prose format
- Detects and smooths awkward AI-generated phrasing
- Removes repetitive sentence starters

**AI Tone Adjustment (Pro):**
| Option | What it does |
|--------|--------------|
| More formal | Business-appropriate language, removes contractions |
| More casual | Friendly tone, adds natural language patterns |
| More concise | Reduces word count while preserving meaning |
| More detailed | Expands key points for clarity |

**Message Variations (Pro):**
- Generates 2-3 alternative versions
- User selects preferred version
- One-click to apply variation
- Preserves original as option

#### 9.3.2 AI Implementation Options

Users can choose how to access AI features:

**Option A: Use Your Own API Key**
- User provides OpenAI or Anthropic API key
- Stored securely in chrome.storage.local (encrypted)
- No additional cost beyond their API usage
- Full control over model selection

**Option B: Included Credits**
- 100 AI operations/month included with Pro subscription
- Additional credits: $2 per 100 operations
- No API key management needed
- We handle the infrastructure

| Comparison | Own API Key | Included Credits |
|------------|-------------|------------------|
| Setup | Requires API account | Zero setup |
| Cost | Pay-as-you-go to provider | Predictable monthly cost |
| Privacy | Direct to provider | Through our proxy |
| Model choice | User selects | We optimize |

### 9.4 Conversion Projections

| Metric | Conservative Target |
|--------|---------------------|
| Month 1 installations | 500 |
| D30 retention | 25% (125 active users) |
| Pro conversion | 3% (15 users) |
| Month 1 MRR | $75 |

### 9.5 Cost Estimates

| Item | Cost |
|------|------|
| Chrome Web Store | $5 (one-time registration) |
| Domain + landing hosting | $10/month |
| Payment processor (Stripe) | 2.9% + $0.30/transaction |
| Initial development | 40-60 hours |
| Maintenance | 4-8 hours/month |

### 9.6 Break-even Analysis

With fixed costs of ~$15/month and ~$4.50 margin per Pro user:
- **Break-even**: 4 Pro users
- **Month 6 target**: 50 Pro users ($225 MRR)

---

## 10. Success Metrics

### 10.1 Adoption Metrics

| Metric | MVP Target | 6-Month Target |
|--------|------------|----------------|
| Total installations | 500 | 5,000 |
| Weekly active users | 100 | 1,000 |
| D7 retention | 40% | 50% |
| D30 retention | 20% | 30% |

### 10.2 Product Metrics

| Metric | Target |
|--------|--------|
| Pastes processed/user/day | >3 |
| Error/crash rate | <0.1% |
| Processing time | <50ms |

### 10.3 Business Metrics

| Metric | 6-Month Target |
|--------|----------------|
| Free - Pro conversion | 3-5% |
| MRR | $250+ |
| Monthly Pro churn | <10% |
| NPS | >40 |

### 10.4 Stability Metrics

| Metric | Threshold |
|--------|-----------|
| Critical bugs/week | <1 |
| Break response time | <48h |
| Test coverage | >80% |

---

## 11. Distribution Strategy

### 11.1 Primary Channel: Chrome Web Store

| Element | Specification |
|---------|---------------|
| Category | Productivity |
| Keywords | WhatsApp, paste, format, clean, text, AI |
| Screenshots | Clear before/after comparisons |
| Demo video | 30 seconds showing problem and solution |

### 11.2 Landing Page

- **URL**: cleanpaste.app (or similar)
- **Content flow**: Problem - Solution - Demo - Install CTA
- **Interactive demo**: Before/after comparison
- **Testimonials**: Post-launch addition

### 11.3 Organic Distribution

| Channel | Action |
|---------|--------|
| Product Hunt | Day 1 launch |
| Reddit | r/WhatsApp, r/productivity, r/ChatGPT |
| Twitter/X | Thread explaining the problem |
| LinkedIn | Post for B2B audience |
| Indie Hackers | Build in public |

### 11.4 SEO/Content

- **Blog posts**: "How to paste ChatGPT text in WhatsApp without it looking bad"
- **YouTube**: Short tutorial video
- **Comparisons**: "CleanPaste vs paste without formatting"

---

## 12. Roadmap

### Phase 1: MVP (Weeks 1-4)

- [ ] Core: Intercept paste and normalize text
- [ ] **Line-by-Line mode** (core differentiator)
- [ ] **Settings Panel** (popup UI)
- [ ] Manifest V3 compliant
- [ ] Basic tests
- [ ] Publish to Chrome Web Store

**Deliverables:**
- Working extension with Clean Paste + Line-by-Line
- Settings panel with core configurations
- Chrome Web Store listing

### Phase 2: Polish & Launch (Weeks 5-8)

- [ ] Landing page with before/after demos
- [ ] Advanced settings options
- [ ] Progress indicator improvements
- [ ] Bug fixes based on early feedback
- [ ] Product Hunt launch

**Deliverables:**
- Landing page live
- Product Hunt launch completed
- 500+ installations target

### Phase 3: Validation & Iteration (Weeks 9-12)

- [ ] Monitor retention metrics (D7, D30)
- [ ] Collect user feedback systematically
- [ ] Iterate normalization based on real cases
- [ ] A/B test Line-by-Line configurations
- [ ] Prepare Pro infrastructure

**Deliverables:**
- Validated retention metrics
- User feedback documented
- Pro feature specifications finalized

### Phase 4: Pro & AI Features (Weeks 13-18)

- [ ] Payment integration (Stripe)
- [ ] AI API integration (OpenAI/Anthropic)
- [ ] **AI Smart Format** feature
- [ ] **AI Tone Adjustment** feature
- [ ] **Message Variations** feature
- [ ] API key management UI
- [ ] Credits system implementation
- [ ] Pro onboarding flow

**Deliverables:**
- Pro tier live with AI features
- Payment system working
- 50+ Pro subscribers target

### Phase 5: Expansion (Post week 18)

- [ ] Firefox support
- [ ] Other platforms (Telegram, LinkedIn, Slack)
- [ ] Advanced format profiles
- [ ] Enterprise version
- [ ] API for third-party integrations

**Deliverables:**
- Multi-browser support
- Multi-platform expansion started

---

## 13. Risks & Mitigation

### 13.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WhatsApp DOM changes | High | High | Resilient selectors, monitoring, rapid hotfix |
| execCommand deprecated | Medium | High | Migrate to Input Events API |
| Chrome policy changes | Low | High | MV3 compliance, minimal permissions |

### 13.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low Pro conversion | Medium | Medium | Iterate Pro value proposition |
| Large competitor | Low | High | Speed, niche focus, community |
| Users don't perceive value | Medium | High | Improve "aha moment", onboarding |

### 13.3 Market Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WhatsApp Web deprecated | Low | Critical | Platform diversification |
| AI improves output formatting | Medium | Medium | Remain useful for other sources |

### 13.4 AI-Specific Risks (Pro Features)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API costs exceed revenue | Medium | High | Usage limits, user-provided keys option, cost monitoring |
| AI rate limiting | Medium | Medium | Queue system, graceful degradation, retry logic |
| AI output quality inconsistent | Medium | Medium | Prompt engineering, model selection, fallback to basic |
| Privacy concerns (sending to AI) | Medium | High | Clear disclosure, user consent, local-first when possible |
| API provider changes pricing | Medium | Medium | Support multiple providers, user-key option as fallback |
| Latency affects UX | Medium | Medium | Async processing, loading indicators, caching |

**AI Risk Mitigation Strategies:**

1. **Cost Control:**
   - Hard limits on API calls per user/month
   - User-provided API keys as primary option
   - Credits system with clear pricing
   - Monitor usage patterns and adjust limits

2. **Quality Assurance:**
   - Extensive prompt testing
   - A/B testing different prompts
   - User feedback loop for quality issues
   - Fallback to basic normalization on AI failure

3. **Privacy:**
   - Clear disclosure: "Message content sent to AI for processing"
   - Option to use own API key (direct to provider)
   - No message storage on our servers
   - GDPR/CCPA compliant data handling

---

## 14. Appendices

### Appendix A: Technical Normalization Specification

#### Characters to Normalize

| Character Type | Unicode Range | Replace With |
|----------------|---------------|--------------|
| Non-breaking space | U+00A0 | Standard space (U+0020) |
| Thin space | U+2009 | Standard space |
| Hair space | U+200A | Standard space |
| Zero-width space | U+200B | Remove |
| Zero-width non-joiner | U+200C | Remove |
| Zero-width joiner | U+200D | Remove |
| Word joiner | U+2060 | Remove |
| Left double quote | U+201C | Standard quote (U+0022) |
| Right double quote | U+201D | Standard quote |
| Left single quote | U+2018 | Apostrophe (U+0027) |
| Right single quote | U+2019 | Apostrophe |
| Em dash | U+2014 | Hyphen-minus (U+002D) |
| En dash | U+2013 | Hyphen-minus |
| Bullet | U+2022 | Hyphen-minus |
| Triangle bullet | U+2023 | Hyphen-minus |
| White bullet | U+25E6 | Hyphen-minus |

#### Line Normalization Rules

| Rule | Implementation |
|------|----------------|
| Line break unification | Replace \r\n and \r with \n |
| Max consecutive blank lines | 2 |
| Trailing whitespace | Remove from each line |
| Multiple spaces | Collapse to single space |

### Appendix B: User Personas (Extended)

*See Section 4.2 for detailed personas*

### Appendix C: Landing Page Wireframe

```
+------------------------------------------+
|  LOGO          [Install Free]            |
+------------------------------------------+
|                                          |
|  "Your content, your format.             |
|   No copy-paste traces."                 |
|                                          |
|  [Before/After Interactive Demo]         |
|                                          |
+------------------------------------------+
|  HOW IT WORKS                            |
|  1. Install  2. Paste  3. Done           |
+------------------------------------------+
|  TESTIMONIALS (post-launch)              |
+------------------------------------------+
|  [Install Free]  |  [Get Pro]            |
+------------------------------------------+
```

### Appendix D: Settings Panel Wireframe

```
┌────────────────────────────────────┐
│  CleanPaste Settings          [X]  │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Enable CleanPaste    [===ON] │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────── Line-by-Line Mode ─────── │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Enable Line-by-Line  [==OFF] │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Separator:                   │  │
│  │ ( ) Line                     │  │
│  │ (•) Paragraph                │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Delay between messages:      │  │
│  │ [----●---------] 800ms       │  │
│  │  300ms              2000ms   │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Max segments: [10] ▼         │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────── Display ───────────── │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Show badge count     [===ON] │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────── Pro Features ──────── │
│  ┌──────────────────────────────┐  │
│  │  🔒 AI Smart Format          │  │
│  │  🔒 Tone Adjustment          │  │
│  │  🔒 Message Variations       │  │
│  │                              │  │
│  │     [Upgrade to Pro]         │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  v1.0.0  |  Feedback  |  Help     │
└────────────────────────────────────┘
```

### Appendix E: Line-by-Line Flow Diagram

```
User pastes text (Ctrl+V)
         │
         ▼
┌─────────────────────┐
│ CleanPaste detects  │
│    paste event      │
└─────────┬───────────┘
         │
         ▼
┌─────────────────────┐
│  Normalize text     │
│  (remove artifacts) │
└─────────┬───────────┘
         │
         ▼
┌─────────────────────┐     Line-by-Line OFF
│ Line-by-Line mode?  │─────────────────────────┐
└─────────┬───────────┘                         │
         │ ON                                   │
         ▼                                      ▼
┌─────────────────────┐               ┌─────────────────┐
│ Split by separator  │               │ Insert all text │
│ (line/paragraph)    │               │   at once       │
└─────────┬───────────┘               └─────────────────┘
         │
         ▼
┌─────────────────────┐
│ For each segment:   │◄────────────┐
│ 1. Insert text      │             │
│ 2. Send (Enter)     │             │
│ 3. Wait delay       │             │
│ 4. Show progress    │─────────────┘
└─────────┬───────────┘   More segments
         │
         │ Done
         ▼
┌─────────────────────┐
│  Update badge count │
│  Show completion    │
└─────────────────────┘
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 2025 | Initial complete PRD |
| 1.1 | December 2025 | Added: Settings Panel, Line-by-Line Mode, AI Pro Features, Updated Roadmap |

---

*End of Document*
