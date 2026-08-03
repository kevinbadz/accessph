# Contributing to AccessPH

Thanks for considering a contribution. AccessPH is built for real accessibility and safety needs in the Philippines, so the bar for changes is: does this make the app more usable for a blind, low-vision, deaf, mobility-impaired, or senior user — or genuinely safer for a rider using Share My Trip — without adding cost or complexity that undermines it working on a low-end Android phone?

## Ground rules

- **No feature that requires a paid API key ships in the default path.** Free/offline-first is the whole point. If you want to add a cloud AI feature, gate it behind an optional setting with a clear "this needs internet and may cost the site owner money" note.
- **Every screen must work with a screen reader and a keyboard.** Test with VoiceOver (iOS/macOS) or TalkBack (Android) before opening a PR touching UI.
- **Bilingual by default.** Any new user-facing string goes into `src/lib/i18n.ts` for both `en` and `fil` — no hardcoded English strings in components.
- **No silent side effects.** Anything that sends a message, shares location, calls someone, or leaves the app must be a clear, deliberate action the user takes — never automatic. This matters most for Emergency and Share My Trip: a user who can't trust exactly what the app will and won't do on its own is a user who can't trust it when it counts.
- **Don't overpromise safety.** Share My Trip cannot prevent an ambush in progress. Copy, UI, and marketing language should never imply otherwise — the honest claim is deterrence and evidence, not protection.

## Development setup

```bash
git clone <your fork>
cd accessph
npm install
npm run dev
```

Run before committing:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Tests

`src/lib/` holds the pure logic — image preprocessing, the object-cover crop math, error-message mapping, settings persistence, i18n — deliberately decoupled from React/DOM so it's cheap to test with Vitest. If you touch anything in there, add or update a test alongside it. UI components aren't covered yet; a screen reader/keyboard pass (see above) is the current substitute for component tests.

## Reporting bugs / requesting features

Open a GitHub issue. For accessibility bugs, please include:

- What assistive technology you were using (screen reader, switch access, etc.) and its version
- Device and browser
- What you expected vs. what happened

## Pull requests

1. Keep PRs focused — one feature or fix per PR.
2. Update `README.md` if you change setup steps, add a dependency, or change scope.
3. Add yourself to nothing — no contributor list to maintain; `git log` is the record.
4. Be ready to explain the accessibility reasoning behind UI decisions, not just "it looks fine."

## Translation help

Filipino strings in `src/lib/i18n.ts` were written for clarity to a general Filipino-speaking audience, mixing in common English/Taglish terms where that's how people actually speak (e.g. "Emergency" instead of a formal translation). If you're a native speaker and something reads awkwardly, please open a PR — this is exactly the kind of contribution the project needs most.
