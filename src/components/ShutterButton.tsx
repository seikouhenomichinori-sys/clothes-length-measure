import './ShutterButton.css';

type Props = {
  onShutter: () => void;
};

export function ShutterButton({ onShutter }: Props) {
  return (
    <button
      type="button"
      className="shutter-button"
      onClick={onShutter}
      aria-label="撮影"
    />
  );
}
