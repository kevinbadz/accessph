// Real-world phone photos have uneven lighting and color noise that hurts OCR
// accuracy far more than it hurts human reading. Converting to grayscale and
// stretching contrast to the full range is a well-known, cheap way to improve
// Tesseract's LSTM recognition — it's the same trick most OCR scanning apps use.
export function preprocessForOcr(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const pixelCount = pixels.length / 4;
  const gray = new Uint8ClampedArray(pixelCount);

  let min = 255;
  let max = 0;
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const luminance = 0.299 * pixels[offset] + 0.587 * pixels[offset + 1] + 0.114 * pixels[offset + 2];
    gray[i] = luminance;
    if (luminance < min) min = luminance;
    if (luminance > max) max = luminance;
  }

  const range = max - min || 1;
  for (let i = 0; i < pixelCount; i++) {
    const stretched = ((gray[i] - min) / range) * 255;
    const offset = i * 4;
    pixels[offset] = stretched;
    pixels[offset + 1] = stretched;
    pixels[offset + 2] = stretched;
  }

  ctx.putImageData(imageData, 0, 0);
}
