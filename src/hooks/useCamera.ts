import { useCallback, useEffect, useRef, useState } from 'react';

type CameraState = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoCallbackRef: (node: HTMLVideoElement | null) => void;
  isReady: boolean;
  error: string | null;
};

export function useCamera(): CameraState {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attachStream = useCallback((video: HTMLVideoElement) => {
    const stream = streamRef.current;
    if (!stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
  }, []);

  // <video>要素は撮影確認画面の表示/非表示に伴って再マウントされるため、
  // plain な ref ではなくコールバックrefで検知し、都度ストリームを再接続する
  const videoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node) attachStream(node);
    },
    [attachStream],
  );

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          attachStream(videoRef.current);
        }
        setIsReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'カメラの起動に失敗しました',
          );
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [attachStream]);

  return { videoRef, videoCallbackRef, isReady, error };
}
