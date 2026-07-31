# AccessPH

AccessPH is an open-source accessibility companion for persons with disabilities (PWDs) and seniors in the Philippines. It reads text aloud from a phone camera, understands voice commands, and sends emergency alerts — in English and Filipino.

This is a v1 (MVP) scope, deliberately narrow so it's actually usable rather than a pile of half-built ideas. See [Roadmap](#roadmap) for what's next.

## Why

Most accessibility apps are built for US/EU users and don't support Filipino or Taglish, don't know about Philippine government PWD services, and assume reliable connectivity. AccessPH is built PH-first: bilingual by default, works offline after first load, and free to run on cheap Android phones via any modern browser.

## Features (v1)

- **Camera text reader** — point the camera at a sign, menu, medicine label, or document; AccessPH reads it aloud in English or Filipino.
- **Voice commands** — tap the mic and say "read" / "basahin", "emergency" / "tulong", or "settings" to navigate hands-free.
- **Emergency button** — one tap calls or texts your emergency contact with your current location (you confirm before anything sends — the app never sends messages silently).
- **Bilingual UI** — English and Filipino interface and text-to-speech voice, switchable in Settings.
- **Installable PWA** — add to home screen, works offline for pages you've already visited.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Tesseract.js](https://github.com/naptha/tesseract.js) for on-device OCR (English + Filipino trained data)
- Browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for text-to-speech and speech recognition — no server, no API keys, works offline once loaded
- A minimal hand-written service worker for offline app-shell caching (no external PWA framework)

No backend, database, or auth in v1 — everything runs client-side and settings are stored in `localStorage`. That's intentional: it keeps the app free to run, offline-friendly, and simple to audit.

## Getting started

```bash
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
    emergency/          Emergency contact call/SMS flow
    settings/           Language, voice speed, emergency contact
    manifest.ts          PWA manifest
  components/
    SettingsProvider.tsx React context wrapping localStorage settings
    VoiceCommandBar.tsx  Global floating mic button + command parsing
    BigButton.tsx        Shared large-tap-target button
  lib/
    speech.ts            Text-to-speech + speech recognition helpers
    settings.ts           Settings persistence
    i18n.ts               English/Filipino UI strings
public/
  sw.js                  Offline app-shell service worker
```

## Known limitations (v1)

- OCR language data downloads from a CDN on first use — you need internet the first time you use the reader. After that, the browser cache keeps it available offline.
- Voice recognition and synthesis quality depend entirely on the device/browser's built-in voices — Filipino voice support varies by phone and OS.
- No accounts, no cloud sync, no multi-device — settings live on one device/browser only.
- Scene description, obstacle detection, money identification, and Filipino Sign Language translation are **not** in v1 — they're much harder problems (real-time vision models, large FSL datasets) and are tracked as future work, not promised here.

## Roadmap

Rough order of what would extend this meaningfully, without over-promising a timeline:

1. Bundle/cache Tesseract language data for true first-run offline support.
2. Government assistance finder (PWD ID, PhilHealth, discounts) as a static, community-maintained dataset.
3. Wheelchair-accessibility map layer (OpenStreetMap + Leaflet, community-contributed ratings).
4. Money identifier (₱ bill/coin recognition) as a dedicated on-device model.
5. Filipino Sign Language translator — the hardest item here; needs an FSL dataset before any model work starts.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
