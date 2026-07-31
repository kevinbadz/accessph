"use client";

import Link from "next/link";
import { createWorker, PSM, type Worker as TesseractWorker } from "tesseract.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t, type TranslationKey } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { preprocessForOcr } from "@/lib/image-preprocess";

// A page-level mean confidence below this (0-100 scale) is treated as
// unreliable enough to warn the user rather than reading it back as fact.
const LOW_CONFIDENCE_THRESHOLD = 60;

type Status = "starting-camera" | "camera-error" | "ready" | "scanning" | "result";

function cameraErrorKey(error: unknown): TranslationKey {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "cameraPermissionDenied";
      case "NotFoundError":
      case "OverconstrainedError":
        return "cameraNotFound";
      case "NotReadableError":
      case "TrackStartError":
        return "cameraInUse";
      default:
        return "cameraError";
    }
  }
  return "cameraError";
}

export default function ReaderPage() {
  const { settings } = useSettings();
  const lang = settings.language;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<TesseractWorker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState<Status>("starting-camera");
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState("");
  const [errorKey, setErrorKey] = useState<TranslationKey>("cameraError");
  const [lowConfidence, setLowConfidence] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setStatus("starting-camera");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorKey("cameraNotSupported");
      setStatus("camera-error");
      return;
    }

    try {
      // Ask for a high-resolution stream — OCR accuracy on small/distant text
      // depends heavily on how many pixels the captured frame actually has.
      // These are "ideal" hints, not requirements, so browsers still fall back
      // to whatever the camera actually supports.
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
      } catch (preferredError) {
        // Devices with only one camera (most laptops) can reject a facingMode
        // constraint outright instead of ignoring it — fall back to any camera.
        if (
          preferredError instanceof DOMException &&
          (preferredError.name === "OverconstrainedError" || preferredError.name === "NotFoundError")
        ) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false,
          });
        } else {
          throw preferredError;
        }
      }

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (mountedRef.current) setStatus("ready");
    } catch (error) {
      console.error("AccessPH: camera start failed", error);
      if (mountedRef.current) {
        setErrorKey(cameraErrorKey(error));
        setStatus("camera-error");
      }
    }
  }, [stopStream]);

  useEffect(() => {
    mountedRef.current = true;
    // Synchronizing with the camera (external system) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera();

    return () => {
      mountedRef.current = false;
      stopStream();
      workerRef.current?.terminate();
    };
  }, [startCamera, stopStream]);

  async function getWorker(): Promise<TesseractWorker> {
    if (workerRef.current) return workerRef.current;
    const worker = await createWorker(["eng", "fil"], 1, {
      logger: (m) => {
        if (m.status === "recognizing text") setProgress(m.progress);
      },
    });
    // AUTO handles the mixed layouts (signs, labels, forms) this app is built
    // for better than letting Tesseract fall back to its default segmentation.
    await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO });
    workerRef.current = worker;
    return worker;
  }

  async function captureAndRead() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    preprocessForOcr(canvas);

    setStatus("scanning");
    setProgress(0);

    try {
      const worker = await getWorker();
      const { data } = await worker.recognize(canvas);
      const text = data.text.trim();
      const isLowConfidence = text.length > 0 && data.confidence < LOW_CONFIDENCE_THRESHOLD;
      setResultText(text);
      setLowConfidence(isLowConfidence);
      setStatus("result");

      if (!text) {
        speak(t(lang, "noTextFound"), lang, settings.speechRate);
      } else if (isLowConfidence) {
        speak(`${t(lang, "lowConfidenceSpokenPrefix")} ${text}`, lang, settings.speechRate);
      } else {
        speak(text, lang, settings.speechRate);
      }
    } catch {
      setResultText("");
      setLowConfidence(false);
      setStatus("result");
      speak(t(lang, "cameraError"), lang, settings.speechRate);
    }
  }

  function retake() {
    setResultText("");
    setLowConfidence(false);
    setStatus("ready");
  }

  function readAgain() {
    speak(resultText || t(lang, "noTextFound"), lang, settings.speechRate);
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "readText")}</h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${status === "result" ? "hidden" : ""}`}
          playsInline
          muted
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className={`h-full w-full object-cover ${status === "result" ? "" : "hidden"}`} />

        {status === "ready" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-4">
            <div className="mt-8 flex-1 w-full max-w-[85%] rounded-2xl border-4 border-dashed border-white/70" />
            <p className="mb-2 rounded-full bg-black/60 px-4 py-2 text-center text-sm text-white">
              {t(lang, "framingHint")}
            </p>
          </div>
        )}

        {status === "camera-error" && (
          <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <p className="text-lg">{t(lang, errorKey)}</p>
            <button
              type="button"
              onClick={startCamera}
              className="min-h-12 rounded-xl bg-blue-700 px-6 text-lg font-bold hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
            >
              {t(lang, "tryAgain")}
            </button>
          </div>
        )}

        {status === "scanning" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
            <p className="text-lg font-semibold">{t(lang, "scanning")}</p>
            <div className="h-2 w-2/3 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {status === "result" && (
        <section aria-live="polite" className="flex flex-col gap-3 rounded-2xl border-2 border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          {lowConfidence && (
            <p className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-sm font-medium text-amber-900 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-100">
              ⚠️ {t(lang, "lowConfidenceWarning")}
            </p>
          )}
          <p className="text-xl leading-relaxed whitespace-pre-wrap">
            {resultText || t(lang, "noTextFound")}
          </p>
        </section>
      )}

      <div className="flex flex-col gap-3">
        {status === "ready" && (
          <button
            type="button"
            onClick={captureAndRead}
            className="min-h-16 rounded-2xl bg-blue-700 text-2xl font-bold text-white shadow-md hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
          >
            {t(lang, "captureAndRead")}
          </button>
        )}

        {status === "result" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={readAgain}
              className="min-h-16 flex-1 rounded-2xl bg-blue-700 text-xl font-bold text-white shadow-md hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
            >
              {t(lang, "readAgain")}
            </button>
            <button
              type="button"
              onClick={retake}
              className="min-h-16 flex-1 rounded-2xl border-2 border-slate-400 text-xl font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:hover:bg-slate-800"
            >
              {t(lang, "retake")}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
