import { ID1_CARD_WIDTH_MM } from './constants';

export type PixelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Size = {
  width: number;
  height: number;
};

// object-fit: cover で表示された video 要素上のCSSピクセル座標のRectを、
// video のネイティブ解像度ピクセル座標系のRectに変換する。
// cover は縦横比を保ったまま短辺基準で拡大しコンテナ全体を覆うため、
// はみ出した分(offsetX/offsetY)を差し引いてからネイティブ解像度に戻す。
export function containerRectToNativeRect(
  rect: PixelRect,
  container: Size,
  native: Size,
): PixelRect {
  const scale = Math.max(
    container.width / native.width,
    container.height / native.height,
  );
  const renderedWidth = native.width * scale;
  const renderedHeight = native.height * scale;
  const offsetX = (renderedWidth - container.width) / 2;
  const offsetY = (renderedHeight - container.height) / 2;

  return {
    left: (rect.left + offsetX) / scale,
    top: (rect.top + offsetY) / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  };
}

export function calculateMmPerPixel(guideFrameNativeWidthPx: number): number {
  return ID1_CARD_WIDTH_MM / guideFrameNativeWidthPx;
}
