import { useEffect, useRef, useState } from 'react';
import { computeContainBox } from '../lib/containFit';
import './MeasurementOverlay.css';

type Props = {
  naturalWidth: number;
  naturalHeight: number;
  topLinePx: number;
  bottomLinePx: number;
};

export function MeasurementOverlay({
  naturalWidth,
  naturalHeight,
  topLinePx,
  bottomLinePx,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const box =
    containerSize &&
    computeContainBox(containerSize, {
      width: naturalWidth,
      height: naturalHeight,
    });

  return (
    <div ref={containerRef} className="measurement-overlay">
      {box && (
        <>
          <div
            className="measurement-overlay__line"
            style={{ top: box.offsetY + topLinePx * box.scale }}
          />
          <div
            className="measurement-overlay__line"
            style={{ top: box.offsetY + bottomLinePx * box.scale }}
          />
        </>
      )}
    </div>
  );
}
