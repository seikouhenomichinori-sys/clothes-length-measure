export function capturePhoto(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context を取得できませんでした');
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas;
}
