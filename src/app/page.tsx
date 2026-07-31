"use client";

import BigButton from "@/components/BigButton";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";
import { useSpeechRecognitionSupported } from "@/hooks/useSpeechRecognitionSupported";

export default function Home() {
  const { settings } = useSettings();
  const lang = settings.language;
  const voiceSupported = useSpeechRecognitionSupported();

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-5 py-10">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">{t(lang, "appName")}</h1>
        <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">{t(lang, "tagline")}</p>
      </header>

      <nav aria-label="Main actions" className="flex flex-col gap-4">
        <BigButton
          href="/reader"
          icon="📷"
          label={t(lang, "readText")}
          sublabel={t(lang, "readTextSub")}
        />
        <BigButton
          href="/emergency"
          icon="🆘"
          label={t(lang, "emergency")}
          sublabel={t(lang, "emergencySub")}
          tone="danger"
        />
        <BigButton
          href="/benefits"
          icon="🏛️"
          label={t(lang, "benefits")}
          sublabel={t(lang, "benefitsSub")}
        />
        <BigButton
          href="/settings"
          icon="⚙️"
          label={t(lang, "settings")}
          sublabel={t(lang, "settingsSub")}
        />
      </nav>

      {voiceSupported !== false && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-500">
          {t(lang, "voiceCommandsSub")}
        </p>
      )}
    </main>
  );
}
