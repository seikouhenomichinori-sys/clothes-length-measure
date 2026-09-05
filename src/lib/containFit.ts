export type Size = {
  width: number;
  height: number;
};

export type ContainBox = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

// object-fit: contain で表示された画像の、コンテナ内でのレンダリング位置・倍率を計算する
export function computeContainBox(container: Size, natural: Size): ContainBox {
  const scale = Math.min(
    container.width / natural.width,
    container.height / natural.height,
  );
  const renderedWidth = natural.width * scale;
  const renderedHeight = natural.height * scale;

  return {
    scale,
    offsetX: (container.width - renderedWidth) / 2,
    offsetY: (container.height - renderedHeight) / 2,
  };
}
