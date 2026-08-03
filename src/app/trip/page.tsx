"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t, type TranslationKey } from "@/lib/i18n";
import { cameraErrorKey } from "@/lib/error-messages";
import { addTripLogEntry } from "@/lib/trip-log";
import { isIOS } from "@/lib/platform";

type Status = "starting-camera" | "camera-error" | "ready" | "captured";

function smsHref(phone: string, body: string): string {
  const separator = isIOS() ? "&" : "?";
  return `sms:${phone}${separator}body=${encodeURIComponent(body)}`;
}

export default function TripPage() {
  const { settings } = useSettings();
  const lang = settings.language;
  const contacts = settings.emergencyContacts;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState<Status>("starting-camera");
  const [errorKey, setErrorKey] = useState<TranslationKey>("cameraError");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [notifiedContacts, setNotifiedContacts] = useState<string[]>([]);

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
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
      } catch (preferredError) {
        if (
          preferredError instanceof DOMException &&
          (preferredError.name === "OverconstrainedError" || preferredError.name === "NotFoundError")
        ) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 960 } },
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
    };
  }, [startCamera, stopStream]);

  function getLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  async function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // JPEG at moderate quality — this goes into localStorage, which has a
    // real size ceiling, and a passenger's face doesn't need full resolution
    // to be useful as a deterrent/record.
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

    stopStream();
    setPhotoDataUrl(dataUrl);
    setStatus("captured");
    setLocating(true);
    const loc = await getLocation();
    setLocation(loc);
    setLocating(false);
  }

  async function skipPhoto() {
    stopStream();
    setPhotoDataUrl(null);
    setStatus("captured");
    setLocating(true);
    const loc = await getLocation();
    setLocation(loc);
    setLocating(false);
  }

  function notifyContact(contact: { name: string; phone: string }) {
    const mapsUrl = location ? `https://maps.google.com/?q=${location.lat},${location.lng}` : null;
    const photoNote = photoDataUrl
      ? lang === "fil"
        ? " May kuha akong litrato ng pasahero."
        : " I took a photo of the passenger."
      : "";
    const body =
      lang === "fil"
        ? `Nagsisimula ako ng byahe.${photoNote}${mapsUrl ? ` Lokasyon ko: ${mapsUrl}` : ""}`
        : `Starting a trip now.${photoNote}${mapsUrl ? ` My location: ${mapsUrl}` : ""}`;

    addTripLogEntry({
      photoDataUrl,
      location,
      notifiedContacts: [contact.name],
    });
    setNotifiedContacts((prev) => [...prev, contact.name]);
    // Standard sms: link navigation, not a React-tracked value — a known
    // false positive from the react-hooks/immutability rule on this exact
    // safe, standard browser API usage.
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = smsHref(contact.phone, body);
  }

  function retake() {
    setPhotoDataUrl(null);
    setLocation(null);
    setNotifiedContacts([]);
    startCamera();
  }

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-blue-700 dark:text-blue-400">
          ← {t(lang, "back")}
        </Link>
        <h1 className="text-xl font-bold">{t(lang, "shareTrip")}</h1>
        <Link
          href="/trip-log"
          aria-label={t(lang, "viewTripLog")}
          className="flex w-16 justify-end text-2xl text-blue-700 dark:text-blue-400"
        >
          <span aria-hidden="true">🕘</span>
        </Link>
      </div>

      {status !== "captured" && (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
            aria-hidden="true"
          />

          {status === "camera-error" && (
            <div
              role="alert"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white"
            >
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
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {status === "ready" && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">{t(lang, "photoHint")}</p>
          <button
            type="button"
            onClick={capturePhoto}
            className="min-h-16 rounded-2xl bg-blue-700 text-2xl font-bold text-white shadow-md hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
          >
            📷 {t(lang, "takePhoto")}
          </button>
          <button
            type="button"
            onClick={skipPhoto}
            className="min-h-14 rounded-2xl border-2 border-slate-400 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {t(lang, "skipPhoto")}
          </button>
        </div>
      )}

      {status === "camera-error" && (
        <button
          type="button"
          onClick={skipPhoto}
          className="min-h-14 rounded-2xl border-2 border-slate-400 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          {t(lang, "skipPhoto")}
        </button>
      )}

      {status === "captured" && (
        <>
          {photoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- a locally captured data URL, not an optimizable remote asset
            <img
              src={photoDataUrl}
              alt=""
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          )}

          {locating && (
            <p role="status" aria-live="polite" className="text-center text-sm text-slate-500">
              {t(lang, "locatingYou")}
            </p>
          )}

          {contacts.length === 0 ? (
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
              <p className="text-center font-semibold">{t(lang, "selectContacts")}</p>
              <div className="flex flex-col gap-3">
                {contacts.map((contact) => {
                  const alreadyNotified = notifiedContacts.includes(contact.name);
                  return (
                    <button
                      key={`${contact.name}-${contact.phone}`}
                      type="button"
                      onClick={() => notifyContact(contact)}
                      disabled={locating}
                      className={`min-h-16 rounded-2xl text-xl font-bold shadow-md focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 disabled:opacity-60 ${
                        alreadyNotified
                          ? "border-2 border-green-600 bg-green-50 text-green-800 dark:border-green-500 dark:bg-green-950 dark:text-green-300"
                          : "bg-blue-700 text-white hover:bg-blue-800"
                      }`}
                    >
                      {alreadyNotified ? "✅ " : "✉️ "}
                      {contact.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={retake}
            className="min-h-14 rounded-2xl border-2 border-slate-400 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {t(lang, "retakePhoto")}
          </button>
        </>
      )}
    </main>
  );
}
