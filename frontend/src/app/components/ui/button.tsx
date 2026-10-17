import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: ReactNode;
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: '',
    secondary: 'button-secondary',
    destructive: 'button-danger',
  }[variant];

  const classes = [
    'button',
    variantClass,
    fullWidth ? 'full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      type={type}
      className={classes}
    >
      {icon}
      {children}
    </button>
  );
}