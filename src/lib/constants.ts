// ID-1規格カード(クレジットカード/免許証サイズ)の実寸(mm)
export const ID1_CARD_WIDTH_MM = 85.6;
export const ID1_CARD_HEIGHT_MM = 53.98;
export const ID1_ASPECT_RATIO = ID1_CARD_WIDTH_MM / ID1_CARD_HEIGHT_MM;

// 画面上のガイド枠サイズ(CSSピクセル)
// 縦長画面(幅390px想定)で着丈約58cmの服を余裕を持って収める撮影距離を想定し、
// その距離でカードが実際に写る大きさに合わせた値(詳細はCLAUDE.md参照)
export const GUIDE_FRAME_WIDTH_PX = 115;
export const GUIDE_FRAME_HEIGHT_PX = GUIDE_FRAME_WIDTH_PX / ID1_ASPECT_RATIO;
export const GUIDE_FRAME_MARGIN_PX = 40;
