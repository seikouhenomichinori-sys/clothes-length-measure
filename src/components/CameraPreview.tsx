import './CameraPreview.css';

type Props = {
  videoCallbackRef: (node: HTMLVideoElement | null) => void;
  isReady: boolean;
  error: string | null;
};

export function CameraPreview({ videoCallbackRef, isReady, error }: Props) {
  return (
    <div className="camera-preview">
      <video
        ref={videoCallbackRef}
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
