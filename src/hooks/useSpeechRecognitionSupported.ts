"use client";

import { useEffect, useState } from "react";
import { isSpeechRecognitionSupported } from "@/lib/speech";

// Starts as null (matching what the server renders, since it can't know the
// browser's capabilities) and resolves after mount — checking synchronously
// during render would make the client's first paint differ from the server's,
// which is a hydration mismatch, not just a wrong-but-harmless value.
export function useSpeechRecognitionSupported(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Sync from the browser (external system) after mount, once hydration is done.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(isSpeechRecognitionSupported());
  }, []);

  return supported;
}
