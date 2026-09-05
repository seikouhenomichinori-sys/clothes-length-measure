import type { RefObject } from 'react';
import './CameraPreview.css';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  error: string | null;
};

export function CameraPreview({ videoRef, isReady, error }: Props) {
  return (
    <div className="camera-preview">
      <video
        ref={videoRef}
        className="camera-preview__video"
        playsInline
        muted
      />
      {error && <div className="camera-preview__message">{error}</div>}
      {!isReady && !error && (
        <div className="camera-preview__message">
          カメラを起動しています...
        </div>
      )}
    </div>
  );
}
