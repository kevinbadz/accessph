import type { AppLanguage } from "./settings";

const LANG_TAGS: Record<AppLanguage, string[]> = {
  fil: ["fil-PH", "fil", "tl-PH", "tl"],
  en: ["en-PH", "en-US", "en-GB", "en"],
};

// Safari (especially iOS) often returns an empty voice list on the first call —
// the real list only arrives once the async "voiceschanged" event fires.
function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        clearTimeout(timeout);
        resolve(window.speechSynthesis.getVoices());
      },
      { once: true }
    );
  });
}

function findVoice(voices: SpeechSynthesisVoice[], language: AppLanguage): SpeechSynthesisVoice | null {
  for (const tag of LANG_TAGS[language]) {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(tag.toLowerCase()));
    if (match) return match;
  }
  return null;
}

// Exposed so Settings can tell the user whether a real Filipino voice exists
// on this device, instead of silently mispronouncing text with a fallback voice.
export async function findVoiceForLanguage(language: AppLanguage): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = await getVoicesAsync();
  return findVoice(voices, language);
}

export async function speak(text: string, language: AppLanguage, rate = 1): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!text.trim()) return;

  window.speechSynthesis.cancel();

  const voices = await getVoicesAsync();
  const voice = findVoice(voices, language);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = language === "fil" ? "fil-PH" : "en-US";
  }
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
}

export function getSpeechRecognitionCtor():
  | (new () => SpeechRecognition)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
