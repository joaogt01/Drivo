import type { HTMLAttributes } from 'react';

type MaterialIconProps = HTMLAttributes<HTMLSpanElement> & {
  name: string;
  filled?: boolean;
};

export default function MaterialIcon({
  name,
  filled = false,
  className = '',
  ...props
}: MaterialIconProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={[
        'material-symbols-rounded',
        filled ? 'material-symbols-filled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {name}
    </span>
  );
}