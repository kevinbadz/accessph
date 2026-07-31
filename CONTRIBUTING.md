# Contributing to AccessPH

Thanks for considering a contribution. AccessPH is built for real accessibility needs in the Philippines, so the bar for changes is: does this make the app more usable for a blind, low-vision, deaf, mobility-impaired, or senior user, without adding cost or complexity that undermines it working on a low-end Android phone?

## Ground rules

- **No feature that requires a paid API key ships in the default path.** Free/offline-first is the whole point. If you want to add a cloud AI feature, gate it behind an optional setting with a clear "this needs internet and may cost the site owner money" note.
- **Every screen must work with a screen reader and a keyboard.** Test with VoiceOver (iOS/macOS) or TalkBack (Android) before opening a PR touching UI.
- **Bilingual by default.** Any new user-facing string goes into `src/lib/i18n.ts` for both `en` and `fil` — no hardcoded English strings in components.
- **No silent side effects.** Anything that sends a message, shares location, or leaves the app (SMS, calls, external links) must be a clear, deliberate user action — never automatic.

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
npm run build
```

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
