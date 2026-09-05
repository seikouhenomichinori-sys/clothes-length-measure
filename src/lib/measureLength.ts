type Rgb = readonly [number, number, number];

const BACKGROUND_SAMPLE_PATCH_SIZE = 20;
const FOREGROUND_COLOR_DISTANCE_THRESHOLD = 40;
const FOREGROUND_ROW_MIN_RATIO = 0.15;
// 服はガイド枠(左下)を避けて中央に置かれる前提のため、中央帯のみを走査する
const SCAN_BAND_START_RATIO = 0.25;
const SCAN_BAND_END_RATIO = 0.75;

function colorDistance(a: Rgb, b: Rgb): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function sampleBackgroundColor(imageData: ImageData): Rgb {
  const { width, height, data } = imageData;
  const size = BACKGROUND_SAMPLE_PATCH_SIZE;
  // 左下はカードガイド枠があるため、それ以外の3隅からサンプリングする
  const patches = [
    { x: 0, y: 0 },
    { x: width - size, y: 0 },
    { x: width - size, y: height - size },
  ];

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;

  for (const patch of patches) {
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const x = patch.x + dx;
        const y = patch.y + dy;
        const idx = (y * width + x) * 4;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
  }

  return [rSum / count, gSum / count, bSum / count];
}

export type ClothingBoundsPx = {
  topPx: number;
  bottomPx: number;
};

export function detectClothingBounds(
  imageData: ImageData,
): ClothingBoundsPx | null {
  const { width, height, data } = imageData;
  const backgroundColor = sampleBackgroundColor(imageData);

  const bandStartX = Math.floor(width * SCAN_BAND_START_RATIO);
  const bandEndX = Math.floor(width * SCAN_BAND_END_RATIO);
  const bandWidth = bandEndX - bandStartX;
  const minForegroundCount = bandWidth * FOREGROUND_ROW_MIN_RATIO;

  let topPx: number | null = null;
  let bottomPx: number | null = null;

  for (let y = 0; y < height; y++) {
    let foregroundCount = 0;
    for (let x = bandStartX; x < bandEndX; x++) {
      const idx = (y * width + x) * 4;
      const pixel: Rgb = [data[idx], data[idx + 1], data[idx + 2]];
      if (
        colorDistance(pixel, backgroundColor) >
        FOREGROUND_COLOR_DISTANCE_THRESHOLD
      ) {
        foregroundCount++;
      }
    }

    if (foregroundCount >= minForegroundCount) {
      if (topPx === null) topPx = y;
      bottomPx = y;
    }
  }

  if (topPx === null || bottomPx === null) return null;
  return { topPx, bottomPx };
}

export function calculateLengthMm(
  bounds: ClothingBoundsPx,
  mmPerPixel: number,
): number {
  return (bounds.bottomPx - bounds.topPx) * mmPerPixel;
}
