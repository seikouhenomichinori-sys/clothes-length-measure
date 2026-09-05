import { MeasurementOverlay } from './MeasurementOverlay';
import './PhotoReview.css';

type Props = {
  imageDataUrl: string;
  imageWidth: number;
  imageHeight: number;
  lengthMm: number | null;
  mmPerPixel: number | null;
  topLinePx: number | null;
  bottomLinePx: number | null;
  isSaving: boolean;
  onRetake: () => void;
  onSave: () => void;
};

export function PhotoReview({
  imageDataUrl,
  imageWidth,
  imageHeight,
  lengthMm,
  mmPerPixel,
  topLinePx,
  bottomLinePx,
  isSaving,
  onRetake,
  onSave,
}: Props) {
  return (
    <div className="photo-review">
      <div className="photo-review__image-area">
        <img
          src={imageDataUrl}
          className="photo-review__image"
          alt="撮影結果"
        />
        {topLinePx !== null && bottomLinePx !== null && (
          <MeasurementOverlay
            naturalWidth={imageWidth}
            naturalHeight={imageHeight}
            topLinePx={topLinePx}
            bottomLinePx={bottomLinePx}
          />
        )}
        <div className="photo-review__header">
          {lengthMm !== null ? (
            <div className="photo-review__result">
              着丈: {(lengthMm / 10).toFixed(1)} cm
            </div>
          ) : (
            <div className="photo-review__result photo-review__result--error">
              服の輪郭を検出できませんでした。背景とのコントラストを確認して撮り直してください。
            </div>
          )}
          {mmPerPixel !== null && (
            <div className="photo-review__debug">
              スケール: {mmPerPixel.toFixed(4)} mm/px
            </div>
          )}
        </div>
      </div>
      <div className="photo-review__bottom-bar">
        <div className="photo-review__actions">
          <button
            type="button"
            className="photo-review__button photo-review__button--secondary"
            onClick={onRetake}
            disabled={isSaving}
          >
            撮り直す
          </button>
          {lengthMm !== null && (
            <button
              type="button"
              className="photo-review__button photo-review__button--primary"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存する'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
