type CarIconProps = {
  className?: string;
};

export default function CarIcon({
  className = 'carIconImage',
}: CarIconProps) {
  return (
    <img
      src="/car-icon.svg"
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}