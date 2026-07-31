"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { formatRelativeTime } from "@/lib/format-time";
import {
  clearScanHistory,
  loadScanHistory,
  removeScanFromHistory,
  type ScanHistoryEntry,
} from "@/lib/scan-history";

export default function HistoryPage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    // Sync from localStorage (external system) after mount to avoid SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(loadScanHistory());
  }, []);

  function handleDelete(id: string) {
    setEntries(removeScanFromHistory(id));
  }

  function handleClearAll() {
    if (!window.confirm(t(lang, "clearHistoryConfirm"))) return;
    clearScanHistory();
    setEntries([]);
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/reader" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "history")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border-2 border-slate-300 bg-white p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {t(lang, "historyEmpty")}
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2 rounded-2xl border-2 border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {formatRelativeTime(entry.timestamp, lang)}
                  {entry.lowConfidence && ` · ⚠️`}
                </p>
                <p className="line-clamp-3 text-lg leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => speak(entry.text, lang, settings.speechRate)}
                    className="min-h-12 flex-1 rounded-xl bg-blue-700 text-base font-bold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
                  >
                    🔊 {t(lang, "readAloud")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    aria-label={`${t(lang, "deleteEntry")}: ${entry.text.slice(0, 40)}`}
                    className="min-h-12 rounded-xl border-2 border-slate-400 px-4 text-base font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:hover:bg-slate-800"
                  >
                    {t(lang, "deleteEntry")}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleClearAll}
            className="min-h-14 rounded-2xl border-2 border-red-400 text-lg font-bold text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            {t(lang, "clearHistory")}
          </button>
        </>
      )}
    </main>
  );
}
