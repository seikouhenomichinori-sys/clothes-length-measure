import {
  GUIDE_FRAME_WIDTH_PX,
  GUIDE_FRAME_HEIGHT_PX,
  GUIDE_FRAME_MARGIN_PX,
} from '../lib/constants';
import './GuideFrame.css';

export function GuideFrame() {
  return (
    <div
      className="guide-frame"
      style={{
        width: GUIDE_FRAME_WIDTH_PX,
        height: GUIDE_FRAME_HEIGHT_PX,
        left: GUIDE_FRAME_MARGIN_PX,
        bottom: GUIDE_FRAME_MARGIN_PX,
      }}
    >
      <span className="guide-frame__label">カードを合わせてください</span>
    </div>
  );
}
