"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import type { AppLanguage } from "@/lib/settings";
import { t, type TranslationKey } from "@/lib/i18n";
import { speak, findVoiceForLanguage } from "@/lib/speech";
import { isIOS, isAndroid } from "@/lib/platform";

function voiceInstructionsKey(): TranslationKey {
  if (isIOS()) return "voiceInstructionsIOS";
  if (isAndroid()) return "voiceInstructionsAndroid";
  return "voiceInstructionsGeneric";
}

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const lang = settings.language;

  const [name, setName] = useState(settings.emergencyContact?.name ?? "");
  const [phone, setPhone] = useState(settings.emergencyContact?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [filipinoVoice, setFilipinoVoice] = useState<SpeechSynthesisVoice | null | "checking">(
    "checking"
  );

  useEffect(() => {
    let cancelled = false;
    findVoiceForLanguage("fil").then((voice) => {
      if (!cancelled) setFilipinoVoice(voice);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function setLanguage(next: AppLanguage) {
    updateSettings({ language: next });
    speak(next === "fil" ? "Filipino ang napili." : "English selected.", next, settings.speechRate);
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    updateSettings({
      emergencyContact: name.trim() && phone.trim() ? { name: name.trim(), phone: phone.trim() } : null,
    });
    setSaved(true);
    speak(t(lang, "saved"), lang, settings.speechRate);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "settings")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">{t(lang, "language")}</h2>
        <div className="flex gap-3" role="radiogroup" aria-label={t(lang, "language")}>
          {(["en", "fil"] as const).map((code) => (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={lang === code}
              onClick={() => setLanguage(code)}
              className={`min-h-14 flex-1 rounded-xl border-2 text-lg font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 ${
                lang === code
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              }`}
            >
              {code === "en" ? "English" : "Filipino"}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-slate-300 p-4 dark:border-slate-700">
        <h2 className="mb-2 text-lg font-semibold">{t(lang, "voiceCheckHeading")}</h2>

        {filipinoVoice === "checking" && (
          <p className="text-slate-600 dark:text-slate-400">{t(lang, "checkingVoice")}</p>
        )}

        {filipinoVoice && filipinoVoice !== "checking" && (
          <div className="flex flex-col gap-3">
            <p className="text-slate-700 dark:text-slate-300">
              {t(lang, "voiceFoundGood")} <strong>{filipinoVoice.name}</strong>
            </p>
            <button
              type="button"
              onClick={() => speak("Magandang araw. Ito ang boses na gagamitin ko.", "fil", settings.speechRate)}
              className="min-h-12 rounded-xl bg-blue-700 px-4 text-lg font-bold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
            >
              🔊 {t(lang, "testVoice")}
            </button>
          </div>
        )}

        {filipinoVoice === null && (
          <div className="flex flex-col gap-3">
            <p className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-amber-900 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-100">
              {t(lang, "voiceMissingWarning")}
            </p>
            <p className="text-slate-700 dark:text-slate-300">{t(lang, voiceInstructionsKey())}</p>
            <button
              type="button"
              onClick={() => speak("Magandang araw. Ito ang boses na gagamitin ko.", "fil", settings.speechRate)}
              className="min-h-12 rounded-xl border-2 border-slate-400 px-4 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:hover:bg-slate-800"
            >
              🔊 {t(lang, "testVoice")}
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">{t(lang, "speechRate")}</h2>
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.1}
          value={settings.speechRate}
          onChange={(e) => updateSettings({ speechRate: Number(e.target.value) })}
          onMouseUp={() => speak(t(lang, "appName"), lang, settings.speechRate)}
          className="w-full"
          aria-label={t(lang, "speechRate")}
        />
      </section>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t(lang, "emergency")}</h2>

        <label className="flex flex-col gap-1">
          <span className="font-medium">{t(lang, "contactName")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-14 rounded-xl border-2 border-slate-300 px-4 text-lg dark:border-slate-700 dark:bg-slate-900"
            autoComplete="name"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">{t(lang, "contactPhone")}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="min-h-14 rounded-xl border-2 border-slate-300 px-4 text-lg dark:border-slate-700 dark:bg-slate-900"
            autoComplete="tel"
            placeholder="+63 9XX XXX XXXX"
          />
        </label>

        <button
          type="submit"
          className="min-h-16 rounded-2xl bg-blue-700 text-xl font-bold text-white shadow-md hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
        >
          {saved ? t(lang, "saved") : t(lang, "save")}
        </button>
      </form>

      <Link
        href="/privacy"
        className="text-center text-base font-medium text-blue-700 underline dark:text-blue-400"
      >
        {t(lang, "privacy")}
      </Link>
    </main>
  );
}
