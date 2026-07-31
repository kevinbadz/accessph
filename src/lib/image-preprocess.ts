// Real-world phone photos have uneven lighting and color noise that hurts OCR
// accuracy far more than it hurts human reading. Converting to grayscale and
// stretching contrast to the full range is a well-known, cheap way to improve
// Tesseract's LSTM recognition — it's the same trick most OCR scanning apps use.
//
// Clipping to the 1st/99th percentile (instead of the true min/max) before
// stretching keeps a single stray glare highlight or shadow corner from
// skewing the whole image — the same idea behind "Auto Contrast" in photo
// editors, and meaningfully more robust for phone-camera conditions.
const CLIP_PERCENTILE = 0.01;

// Pure pixel math, deliberately decoupled from the Canvas API so it can be
// unit tested without a DOM/canvas environment. Mutates `pixels` in place.
export function stretchContrast(pixels: Uint8ClampedArray, pixelCount: number): void {
  const gray = new Uint8ClampedArray(pixelCount);
  const histogram = new Uint32Array(256);

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const luminance = 0.299 * pixels[offset] + 0.587 * pixels[offset + 1] + 0.114 * pixels[offset + 2];
    gray[i] = luminance;
    histogram[gray[i]]++;
  }

  const clipCount = Math.floor(pixelCount * CLIP_PERCENTILE);
  let low = 0;
  let seen = 0;
  for (; low < 255; low++) {
    seen += histogram[low];
    if (seen > clipCount) break;
  }
  let high = 255;
  seen = 0;
  for (; high > 0; high--) {
    seen += histogram[high];
    if (seen > clipCount) break;
  }

  const range = high - low || 1;
  for (let i = 0; i < pixelCount; i++) {
    const stretched = ((gray[i] - low) / range) * 255;
    const offset = i * 4;
    pixels[offset] = stretched;
    pixels[offset + 1] = stretched;
    pixels[offset + 2] = stretched;
  }
}

export function preprocessForOcr(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  stretchContrast(imageData.data, imageData.data.length / 4);
  ctx.putImageData(imageData, 0, 0);
}
