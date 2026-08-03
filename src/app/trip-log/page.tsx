"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";
import { clearTripLog, loadTripLog, removeTripLogEntry, type TripLogEntry } from "@/lib/trip-log";

export default function TripLogPage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const [entries, setEntries] = useState<TripLogEntry[]>([]);

  useEffect(() => {
    // Sync from localStorage (external system) after mount to avoid SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(loadTripLog());
  }, []);

  function handleDelete(id: string) {
    setEntries(removeTripLogEntry(id));
  }

  function handleClearAll() {
    if (!window.confirm(t(lang, "clearLogConfirm"))) return;
    clearTripLog();
    setEntries([]);
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "tripLog")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border-2 border-slate-300 bg-white p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {t(lang, "noTripsYet")}
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex gap-3 rounded-2xl border-2 border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                {entry.photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a locally stored data URL
                  <img
                    src={entry.photoDataUrl}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-3xl dark:bg-slate-800">
                    🛵
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {new Date(entry.timestamp).toLocaleString(lang === "fil" ? "fil-PH" : "en-PH")}
                  </p>
                  <p className="font-medium">{entry.notifiedContacts.join(", ")}</p>
                  {entry.location && (
                    <a
                      href={`https://maps.google.com/?q=${entry.location.lat},${entry.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 underline dark:text-blue-400"
                    >
                      📍 {entry.location.lat.toFixed(4)}, {entry.location.lng.toFixed(4)}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="mt-1 self-start text-sm font-medium text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
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
            {t(lang, "clearLog")}
          </button>
        </>
      )}
    </main>
  );
}
