"use client";

import Link from "next/link";
import { useSettings } from "@/components/SettingsProvider";
import { t, type TranslationKey } from "@/lib/i18n";

const SECTIONS: { heading: TranslationKey; body: TranslationKey; icon: string }[] = [
  { heading: "privacyCameraHeading", body: "privacyCameraBody", icon: "📷" },
  { heading: "privacyMicHeading", body: "privacyMicBody", icon: "🎙️" },
  { heading: "privacyLocationHeading", body: "privacyLocationBody", icon: "📍" },
  { heading: "privacyStorageHeading", body: "privacyStorageBody", icon: "💾" },
  { heading: "privacyNoAccountsHeading", body: "privacyNoAccountsBody", icon: "🚫" },
  { heading: "privacyDeletionHeading", body: "privacyDeletionBody", icon: "🗑️" },
];

export default function PrivacyPage() {
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/settings" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "privacy")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      <p className="text-slate-600 dark:text-slate-400">{t(lang, "privacySub")}</p>

      <p className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-4 text-base leading-relaxed text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
        {t(lang, "privacyIntro")}
      </p>

      <ul className="flex flex-col gap-3">
        {SECTIONS.map((section) => (
          <li
            key={section.heading}
            className="flex gap-4 rounded-2xl border-2 border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-3xl" aria-hidden="true">
              {section.icon}
            </span>
            <div>
              <h2 className="text-lg font-bold">{t(lang, section.heading)}</h2>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {t(lang, section.body)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
