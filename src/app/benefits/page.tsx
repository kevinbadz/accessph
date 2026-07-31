"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";
import { BENEFIT_CATEGORIES } from "@/lib/benefits";
import { speak } from "@/lib/speech";

export default function BenefitsPage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  function readAloud(id: string) {
    const category = BENEFIT_CATEGORIES.find((c) => c.id === id);
    if (!category) return;
    const text = [category.summary[lang], ...category.points[lang]].join(". ");
    speak(text, lang, settings.speechRate);
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "benefits")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      <p className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-100">
        {t(lang, "benefitsDisclaimer")}
      </p>

      <ul className="flex flex-col gap-3">
        {BENEFIT_CATEGORIES.map((category) => {
          const expanded = expandedId === category.id;
          return (
            <li key={category.id} className="rounded-2xl border-2 border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => toggle(category.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-4 p-4 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
              >
                <span className="text-3xl" aria-hidden="true">
                  {category.icon}
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-bold">{category.title[lang]}</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-400">
                    {category.summary[lang]}
                  </span>
                </span>
                <span aria-hidden="true" className="text-xl">
                  {expanded ? "−" : "+"}
                </span>
              </button>

              {expanded && (
                <div className="flex flex-col gap-3 border-t-2 border-slate-200 p-4 dark:border-slate-800">
                  <ul className="flex flex-col gap-2 pl-1 text-base leading-relaxed">
                    {category.points[lang].map((point, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden="true">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                    <p className="text-sm font-semibold">{t(lang, "whereToGo")}</p>
                    <p className="text-base">{category.whereToGo[lang]}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => readAloud(category.id)}
                    className="min-h-12 rounded-xl bg-blue-700 text-lg font-bold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
                  >
                    🔊 {t(lang, "readAloud")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
