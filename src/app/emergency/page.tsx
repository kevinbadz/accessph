"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { isIOS } from "@/lib/platform";

function smsHref(phone: string, body: string): string {
  const separator = isIOS() ? "&" : "?";
  return `sms:${phone}${separator}body=${encodeURIComponent(body)}`;
}

export default function EmergencyPage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const contact = settings.emergencyContact;
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState("");

  async function handleSendSms() {
    if (!contact) return;
    setLocating(true);
    setLocationNote(t(lang, "locatingYou"));
    speak(t(lang, "locatingYou"), lang, settings.speechRate);

    const finish = (mapsUrl: string | null) => {
      setLocating(false);
      const body =
        lang === "fil"
          ? `Emergency! Kailangan ko ng tulong.${mapsUrl ? ` Lokasyon ko: ${mapsUrl}` : ""}`
          : `Emergency! I need help.${mapsUrl ? ` My location: ${mapsUrl}` : ""}`;
      window.location.href = smsHref(contact.phone, body);
    };

    if (!("geolocation" in navigator)) {
      setLocationNote(t(lang, "locationUnavailable"));
      finish(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        finish(`https://maps.google.com/?q=${latitude},${longitude}`);
      },
      () => {
        setLocationNote(t(lang, "locationUnavailable"));
        finish(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function handleCall() {
    if (!contact) return;
    window.location.href = `tel:${contact.phone}`;
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "emergency")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      {!contact ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 text-center dark:border-amber-600 dark:bg-amber-950">
          <p className="text-lg font-semibold">{t(lang, "noContactSet")}</p>
          <Link
            href="/settings"
            className="min-h-14 rounded-xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800"
          >
            {t(lang, "goToSettings")}
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border-2 border-slate-300 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-semibold">{contact.name}</p>
            <p className="text-slate-600 dark:text-slate-400">{contact.phone}</p>
          </div>

          <p className="text-center text-base text-slate-600 dark:text-slate-400">
            {t(lang, "emergencyConfirmBody")}
          </p>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleCall}
              className="min-h-20 rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-md hover:bg-red-700 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
            >
              📞 {t(lang, "call")}
            </button>
            <button
              type="button"
              onClick={handleSendSms}
              disabled={locating}
              className="min-h-20 rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-md hover:bg-red-700 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 disabled:opacity-60"
            >
              ✉️ {t(lang, "sendSms")}
            </button>
          </div>

          {locationNote && (
            <p role="status" aria-live="polite" className="text-center text-sm text-slate-500">
              {locationNote}
            </p>
          )}
        </>
      )}
    </main>
  );
}
