# AccessPH

AccessPH is an open-source accessibility companion for persons with disabilities (PWDs) and seniors in the Philippines. It reads text aloud from a phone camera, understands voice commands, sends emergency alerts, and explains PWD government benefits — in English and Filipino.

**Live app:** https://accessph.vercel.app

This is a v1 (MVP) scope, deliberately narrow so it's actually usable rather than a pile of half-built ideas. See [Roadmap](#roadmap) for what's next.

## Why

Most accessibility apps are built for US/EU users and don't support Filipino or Taglish, don't know about Philippine government PWD services, and assume reliable connectivity. AccessPH is built PH-first: bilingual by default, works offline after first load, and free to run on cheap Android phones via any modern browser.

## Features (v1)

- **Camera text reader** — point the camera at a sign, menu, medicine label, or document; AccessPH reads it aloud in English or Filipino. Captures at high resolution, preprocesses the image for better OCR accuracy, warns you when it isn't confident in what it read instead of guessing silently, and offers "Choose Photo Instead" for anyone who can't hold or aim a live camera (or wants a caregiver to take the photo).
- **Scan history** — the last 20 things you've read are saved locally so you can hear them again without re-scanning.
- **Voice commands** — tap the mic and say "read" / "basahin", "benefits" / "benepisyo", "emergency" / "tulong", or "settings" to navigate hands-free. On browsers that don't support speech recognition, this is replaced with a clear explanation instead of a button that silently fails.
- **Emergency button** — supports multiple emergency contacts (family, neighbor, barangay hotline); one tap calls or texts any of them with your current location (you confirm before anything sends — the app never sends messages silently).
- **Government benefits finder** — plain-language guide to PWD ID requirements, the 20% discount/VAT exemption, PhilHealth coverage, education, and employment support, with read-aloud for each entry.
- **Bilingual UI** — English and Filipino interface and text-to-speech voice, switchable in Settings, with an in-app check for whether your device has a real Filipino voice installed (and how to get one if not).
- **Privacy page** — plain-language explanation of exactly what the camera, mic, and location are used for (all on-device, nothing uploaded).
- **Installable PWA** — add to home screen, works offline for pages you've already visited, with home-screen shortcuts straight to Read Text or Emergency.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Tesseract.js](https://github.com/naptha/tesseract.js) for on-device OCR (English + Filipino trained data)
- Browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for text-to-speech and speech recognition — no server, no API keys, works offline once loaded
- A minimal hand-written service worker for offline app-shell caching (no external PWA framework)

No backend, database, or auth in v1 — everything runs client-side and settings are stored in `localStorage`. That's intentional: it keeps the app free to run, offline-friendly, and simple to audit.

## Getting started

```bash
git clone https://github.com/kevinbadz/accessph.git
cd accessph
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Camera, microphone, and geolocation features require either `localhost` or HTTPS — both work for local dev.

### Regenerating app icons

```bash
node scripts/generate-icons.mjs
```

## Project structure

```
src/
  app/
    page.tsx           Home dashboard
    reader/             Camera OCR + text-to-speech
    history/             Past scans, saved locally
    benefits/            Government benefits finder
    emergency/          Emergency contacts call/SMS flow
    settings/           Language, voice speed, emergency contacts
    privacy/             Plain-language data usage explanation
    manifest.ts          PWA manifest + home-screen shortcuts
  components/
    SettingsProvider.tsx React context wrapping localStorage settings
    VoiceCommandBar.tsx  Persistent mic bar + voice command parsing
    ErrorBoundary.tsx    App-wide crash fallback (bilingual)
    BigButton.tsx        Shared large-tap-target button
  hooks/
    useSpeechRecognitionSupported.ts  Hydration-safe feature detection
  lib/
    speech.ts            Text-to-speech + speech recognition helpers
    image-preprocess.ts  Grayscale/contrast normalization for OCR accuracy (unit tested)
    geometry.ts           Camera-preview crop math (unit tested)
    error-messages.ts     Camera/mic error → user-facing message mapping (unit tested)
    settings.ts           Settings persistence + legacy-data migration (unit tested)
    scan-history.ts       Local scan history storage (unit tested)
    format-time.ts         Bilingual relative-time formatting (unit tested)
    i18n.ts               English/Filipino UI strings (unit tested for key parity)
    benefits.ts           Government benefits dataset (unit tested)
public/
  sw.js                  Offline app-shell service worker (production only)
```

## Testing

The pure logic in `src/lib/` (OCR preprocessing, crop math, error mapping, settings, i18n, benefits data) is covered by [Vitest](https://vitest.dev):

```bash
npm test
```

UI components aren't covered by automated tests yet — a manual screen reader/keyboard pass is the current substitute (see [CONTRIBUTING.md](./CONTRIBUTING.md)).

## Known limitations (v1)

- OCR language data downloads from a CDN on first use — you need internet the first time you use the reader. After that, the browser cache keeps it available offline.
- Voice recognition and synthesis quality depend entirely on the device/browser's built-in voices — Filipino voice support varies by phone and OS. Settings includes an in-app check and fix instructions for this.
- Not yet verified with a real screen reader (VoiceOver/TalkBack) — the UI is built to standard accessibility markup (ARIA labels, focus states, semantic HTML), but hasn't had a hands-on assistive-tech test pass yet. This is the top priority before calling v1 done.
- Primarily tested on iOS Safari so far — Android behavior (camera, TTS voices, SMS intent handling) needs real-device verification.
- No accounts, no cloud sync, no multi-device — settings live on one device/browser only.
- Scene description, obstacle detection, money identification, and Filipino Sign Language translation are **not** in v1 — they're much harder problems (real-time vision models, large FSL datasets) and are tracked as future work, not promised here.

## Roadmap

Rough order of what would extend this meaningfully, without over-promising a timeline:

1. Screen reader (VoiceOver/TalkBack) accessibility pass — the actual core purpose of this app, and not yet verified.
2. Android real-device testing.
3. Bundle/cache Tesseract language data for true first-run offline support.
4. Wheelchair-accessibility map layer (OpenStreetMap + Leaflet, community-contributed ratings).
5. Money identifier (₱ bill/coin recognition) as a dedicated on-device model.
6. Filipino Sign Language translator — the hardest item here; needs an FSL dataset before any model work starts.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
