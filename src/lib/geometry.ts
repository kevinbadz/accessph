export interface CropRect {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

// Computes the same source rectangle CSS `object-cover` would display for a
// box of `targetAspect` (width/height). Used so OCR reads exactly the region
// the preview box shows — not the full native camera frame, which is often a
// different aspect ratio and would include pixels the user never actually saw.
export function computeObjectCoverCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetAspect: number
): CropRect {
  const sourceAspect = sourceWidth / sourceHeight;

  if (sourceAspect > targetAspect) {
    const sWidth = sourceHeight * targetAspect;
    return { sx: (sourceWidth - sWidth) / 2, sy: 0, sWidth, sHeight: sourceHeight };
  }

  const sHeight = sourceWidth / targetAspect;
  return { sx: 0, sy: (sourceHeight - sHeight) / 2, sWidth: sourceWidth, sHeight };
}
