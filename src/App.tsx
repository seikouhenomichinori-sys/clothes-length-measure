import { useEffect, useRef, useState } from 'react';
import { CameraPreview } from './components/CameraPreview';
import { GuideFrame } from './components/GuideFrame';
import { MenuBar } from './components/MenuBar';
import { PhotoReview } from './components/PhotoReview';
import { ShutterButton } from './components/ShutterButton';
import { useCamera } from './hooks/useCamera';
import { capturePhoto } from './lib/capturePhoto';
import { calculateCropRect, cropCanvas } from './lib/crop';
import { getGuideFrameRect } from './lib/guideFrame';
import { calculateLengthMm, detectClothingBounds } from './lib/measureLength';
import { calculateMmPerPixel, containerRectToNativeRect } from './lib/scale';
import { savePhoto } from './storage/photoStore';
import './App.css';

type ReviewState = {
  imageDataUrl: string;
  imageWidth: number;
  imageHeight: number;
  lengthMm: number | null;
  mmPerPixel: number;
  topLinePx: number | null;
  bottomLinePx: number | null;
};

function App() {
  const { videoRef, videoCallbackRef, isReady, error } = useCamera();
  const [review, setReview] = useState<ReviewState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const croppedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleShutter = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const containerRect = video.getBoundingClientRect();
    const guideFrameRect = getGuideFrameRect(containerRect.height);
    const nativeGuideFrameRect = containerRectToNativeRect(
      guideFrameRect,
      { width: containerRect.width, height: containerRect.height },
      { width: video.videoWidth, height: video.videoHeight },
    );
    const mmPerPixel = calculateMmPerPixel(nativeGuideFrameRect.width);

    const rawCanvas = capturePhoto(video);
    const ctx = rawCanvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, rawCanvas.width, rawCanvas.height);
    const bounds = detectClothingBounds(imageData);

    if (!bounds) {
      croppedCanvasRef.current = null;
      setReview({
        imageDataUrl: rawCanvas.toDataURL('image/jpeg', 0.92),
        imageWidth: rawCanvas.width,
        imageHeight: rawCanvas.height,
        lengthMm: null,
        mmPerPixel,
        topLinePx: null,
        bottomLinePx: null,
      });
      return;
    }

    const cropRect = calculateCropRect(
      bounds,
      nativeGuideFrameRect.top,
      rawCanvas.width,
      rawCanvas.height,
    );
    const croppedCanvas = cropCanvas(rawCanvas, cropRect);
    croppedCanvasRef.current = croppedCanvas;

    setReview({
      imageDataUrl: croppedCanvas.toDataURL('image/jpeg', 0.92),
      imageWidth: croppedCanvas.width,
      imageHeight: croppedCanvas.height,
      lengthMm: calculateLengthMm(bounds, mmPerPixel),
      mmPerPixel,
      topLinePx: bounds.topPx - cropRect.top,
      bottomLinePx: bounds.bottomPx - cropRect.top,
    });
  };

  const handleRetake = () => {
    croppedCanvasRef.current = null;
    setReview(null);
  };

  const handleSave = async () => {
    const canvas = croppedCanvasRef.current;
    if (!canvas || review?.lengthMm == null) return;

    setIsSaving(true);
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92),
      );
      if (!blob) throw new Error('画像の変換に失敗しました');
      await savePhoto(blob, review.lengthMm);
      setToastMessage('保存しました');
      handleRetake();
    } catch {
      setToastMessage('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app">
      {review ? (
        <PhotoReview
          imageDataUrl={review.imageDataUrl}
          imageWidth={review.imageWidth}
          imageHeight={review.imageHeight}
          lengthMm={review.lengthMm}
          mmPerPixel={review.mmPerPixel}
          topLinePx={review.topLinePx}
          bottomLinePx={review.bottomLinePx}
          isSaving={isSaving}
          onRetake={handleRetake}
          onSave={handleSave}
        />
      ) : (
        <div className="camera-screen">
          <div className="camera-screen__preview">
            <CameraPreview
              videoCallbackRef={videoCallbackRef}
              isReady={isReady}
              error={error}
            />
            <GuideFrame />
            <MenuBar />
          </div>
          <div className="camera-screen__bottom-bar">
            <ShutterButton onShutter={handleShutter} />
          </div>
        </div>
      )}
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}

export default App;
