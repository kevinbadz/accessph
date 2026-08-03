# AccessPH

AccessPH is a free, open-source accessibility and safety companion for the Philippines. It reads text aloud from a phone camera, understands voice commands, sends emergency alerts, explains PWD government benefits, and helps motorcycle riders share their trip details before accepting a passenger — in English and Filipino.

**Live app:** https://accessph.vercel.app

This started as an accessibility app for PWDs and seniors. **Share My Trip** was added after a real, reported pattern of robbery and violence in the Philippines, where an attacker poses as a passenger and attacks the rider once in an isolated location to steal the motorcycle — it reuses the same proven, tested patterns (contacts, geolocation, camera, SMS deep-linking) already built for the accessibility features. See [Known limitations](#known-limitations-v1) for the honest scope of that feature: it's a deterrent and a record, not protection.

This is a v1 (MVP) scope, deliberately narrow so it's actually usable rather than a pile of half-built ideas. See [Roadmap](#roadmap) for what's next.

## Why

Most accessibility apps are built for US/EU users and don't support Filipino or Taglish, don't know about Philippine government PWD services, and assume reliable connectivity. AccessPH is built PH-first: bilingual by default, works offline after first load, and free to run on cheap Android phones via any modern browser.

## Features (v1)

- **Camera text reader** — point the camera at a sign, menu, medicine label, or document; AccessPH reads it aloud in English or Filipino. Captures at high resolution, preprocesses the image for better OCR accuracy, warns you when it isn't confident in what it read instead of guessing silently, and offers "Choose Photo Instead" for anyone who can't hold or aim a live camera (or wants a caregiver to take the photo).
- **Scan history** — the last 20 things you've read are saved locally so you can hear them again without re-scanning.
- **Voice commands** — tap the mic and say "read" / "basahin", "benefits" / "benepisyo", "emergency" / "tulong", or "settings" to navigate hands-free. On browsers that don't support speech recognition, this is replaced with a clear explanation instead of a button that silently fails.
- **Emergency button** — supports multiple emergency contacts (family, neighbor, barangay hotline); one tap calls or texts any of them with your current location (you confirm before anything sends — the app never sends messages silently).
- **Share My Trip** — built for motorcycle riders: before accepting a passenger, take a quick visible photo of them and share your location with a contact in one flow. The act of visibly doing this is itself a deterrent. Every trip you share is saved locally in your Trip Log (photo, location, timestamp), so the record exists even if the SMS itself fails to send. **No app prevents an ambush in the moment it happens** — this creates a deterrent and a record before the danger starts, not a guarantee of safety.
- **Government benefits finder** — plain-language guide to PWD ID requirements, the 20% discount/VAT exemption, PhilHealth coverage, education, and employment support, with read-aloud for each entry.
- **Bilingual UI** — English and Filipino interface and text-to-speech voice, switchable in Settings, with an in-app check for whether your device has a real Filipino voice installed (and how to get one if not).
- **Privacy page** — plain-language explanation of exactly what the camera, mic, and location are used for (all on-device, nothing uploaded).
- **Installable PWA** — add to home screen, works offline for pages you've already visited, with home-screen shortcuts straight to Read Text, Emergency, or Share My Trip.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Tesseract.js](https://github.com/naptha/tesseract.js) for on-device OCR (English + Filipino trained data)
- Browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for text-to-speech and speech recognition — no server, no API keys, works offline once loaded
- A minimal hand-written service worker for offline app-shell caching (no external PWA framework)

No backend, database, or auth in v1 — everything runs client-side and settings, scan history, and trip log (including passenger photos) are stored in `localStorage` on your device. That's intentional: it keeps the app free to run, offline-friendly, auditable, and means there's no company database of contacts or trips to ever be breached.

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
    trip/                 Share My Trip — camera, location, notify flow
    trip-log/             Local trip history (photo, location, timestamp)
    settings/           Language, voice speed, contacts
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
    scan-history.ts       Local OCR scan history storage (unit tested)
    trip-log.ts            Local trip history storage, quota-safe (unit tested)
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
- **Share My Trip has not yet been tested on a real ride, by a real rider.** It was built to address a real, serious problem quickly and carefully, but feedback from people who actually do this job (Angkas/Grab/JoyRide/habal-habal drivers) matters more than anything else here.
- No live continuous location tracking during a trip (like Grab's "share ride") — that needs a backend to relay real-time location between phones, which is a real architecture and cost decision this v1 deliberately doesn't take on.
- The SMS sent for Share My Trip notes that a photo was taken but doesn't attach it — MMS/photo attachment via `sms:` deep links isn't reliable across iOS and Android. The photo lives in the local Trip Log instead.

## Roadmap

Rough order of what would extend this meaningfully, without over-promising a timeline:

1. Screen reader (VoiceOver/TalkBack) accessibility pass — the actual core purpose of this app, and not yet verified.
2. Android real-device testing.
3. Real-world feedback from actual riders on Share My Trip — the most important open item for that feature.
4. Bundle/cache Tesseract language data for true first-run offline support.
5. Live trip tracking for Share My Trip (needs a backend — a bigger decision, not taken on lightly).
6. Wheelchair-accessibility map layer (OpenStreetMap + Leaflet, community-contributed ratings).
7. Money identifier (₱ bill/coin recognition) as a dedicated on-device model.
8. Filipino Sign Language translator — the hardest item here; needs an FSL dataset before any model work starts.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
