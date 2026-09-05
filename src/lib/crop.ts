import type { ClothingBoundsPx } from './measureLength';

export type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

// 検出した服の上下端に対する余白(画像高さに対する割合)
const CROP_PADDING_RATIO = 0.02;

// 服の縦方向の検出範囲(bounds)を基準に、カードガイド枠の上端(guideFrameTopPx)を
// 下限としてクロップ範囲を決める。ガイド枠より下は常に切り落とされるため、
// 画面左下に置かれたカードは結果画像に含まれない。
export function calculateCropRect(
  bounds: ClothingBoundsPx,
  guideFrameTopPx: number,
  imageWidth: number,
  imageHeight: number,
): CropRect {
  const padding = imageHeight * CROP_PADDING_RATIO;
  const top = Math.max(0, bounds.topPx - padding);
  const bottomLimit = Math.min(guideFrameTopPx, imageHeight);
  const bottom = Math.max(
    top + 1,
    Math.min(bottomLimit, bounds.bottomPx + padding),
  );

  return {
    left: 0,
    top,
    width: imageWidth,
    height: bottom - top,
  };
}

export function cropCanvas(
  source: HTMLCanvasElement,
  rect: CropRect,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context を取得できませんでした');
  }

  ctx.drawImage(
    source,
    rect.left,
    rect.top,
    rect.width,
    rect.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas;
}
