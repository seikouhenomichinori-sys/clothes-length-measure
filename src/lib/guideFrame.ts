import {
  GUIDE_FRAME_HEIGHT_PX,
  GUIDE_FRAME_MARGIN_PX,
  GUIDE_FRAME_WIDTH_PX,
} from './constants';
import type { PixelRect } from './scale';

// GuideFrame.tsx の描画位置(左下固定)と対応させること
export function getGuideFrameRect(containerHeight: number): PixelRect {
  return {
    left: GUIDE_FRAME_MARGIN_PX,
    top: containerHeight - GUIDE_FRAME_MARGIN_PX - GUIDE_FRAME_HEIGHT_PX,
    width: GUIDE_FRAME_WIDTH_PX,
    height: GUIDE_FRAME_HEIGHT_PX,
  };
}
