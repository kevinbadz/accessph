"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";
import { getSpeechRecognitionCtor, speak, stopSpeaking } from "@/lib/speech";
import { useSpeechRecognitionSupported } from "@/hooks/useSpeechRecognitionSupported";

type CommandRoute = { pattern: RegExp; action: (router: ReturnType<typeof useRouter>) => void };

const COMMANDS: CommandRoute[] = [
  { pattern: /read|basa|scan/i, action: (r) => r.push("/reader") },
  { pattern: /benefit|benepisyo|discount|pwd id/i, action: (r) => r.push("/benefits") },
  { pattern: /emergency|tulong|help/i, action: (r) => r.push("/emergency") },
  { pattern: /setting|ayos/i, action: (r) => r.push("/settings") },
  { pattern: /home|balik|back/i, action: (r) => r.push("/") },
  { pattern: /stop|tigil|huwag/i, action: () => stopSpeaking() },
];

export default function VoiceCommandBar() {
  const router = useRouter();
  const { settings } = useSettings();
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported = useSpeechRecognitionSupported();

  function startListening() {
    if (!supported) {
      // Show this on screen, not just spoken — speech can fail silently for
      // reasons that have nothing to do with support (iPhone's physical mute
      // switch silences web speech audio in Safari, Bluetooth routing, etc.),
      // and relying on audio alone means "nothing happens" if it doesn't play.
      setStatus(t(settings.language, "micNotSupported"));
      speak(t(settings.language, "micNotSupported"), settings.language, settings.speechRate);
      return;
    }
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = settings.language === "fil" ? "fil-PH" : "en-PH";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setStatus(t(settings.language, "listening"));
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      const matched = COMMANDS.find((c) => c.pattern.test(transcript));
      if (matched) {
        matched.action(router);
        setStatus(transcript);
      } else {
        setStatus(t(settings.language, "didNotUnderstand"));
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setStatus(t(settings.language, "didNotUnderstand"));
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // Some browsers (notably iOS Safari) can throw synchronously instead of
      // firing onerror — fail into the same spoken message either way.
      setListening(false);
      setStatus(t(settings.language, "didNotUnderstand"));
    }
  }

  return (
    // A normal flex sibling (not `fixed`) so it always has its own reserved
    // space and never floats on top of page content, however tall that gets.
    <div
      className="flex shrink-0 flex-col items-center gap-2 border-t-2 border-slate-300 bg-slate-100 pt-3 dark:border-slate-800 dark:bg-slate-950"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      {status && (
        <p role="status" aria-live="polite" className="px-4 text-sm text-slate-700 dark:text-slate-300">
          {status}
        </p>
      )}
      {supported === false ? (
        // Apple has never implemented SpeechRecognition in Safari (or any iOS
        // browser, which all run on WebKit) — this is a permanent platform
        // limit, not a temporary error. Showing an inert, greyed-out icon with
        // a persistent explanation is more honest than a button that always
        // fails, and avoids a tap-then-fail-message dead end every time.
        <div className="flex flex-col items-center gap-1">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-400 text-3xl text-white opacity-60 dark:bg-slate-700"
          >
            🎙️
          </div>
          <p className="max-w-56 px-4 text-center text-xs text-slate-500 dark:text-slate-500">
            {t(settings.language, "micNotSupported")}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={startListening}
          aria-label={t(settings.language, "voiceCommands")}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-xl transition-transform focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:scale-95 ${
            listening ? "bg-red-600 animate-pulse" : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          <span aria-hidden="true">{listening ? "●" : "🎙️"}</span>
        </button>
      )}
    </div>
  );
}
