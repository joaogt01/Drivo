import type { InputHTMLAttributes, ReactNode } from 'react';

type FieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children'
> & {
  label: string;
  wrapperClassName?: string;
  labelClassName?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export default function Field({
  label,
  wrapperClassName = 'field',
  labelClassName,
  error,
  leadingIcon,
  trailingIcon,
  className = '',
  id,
  ...inputProps
}: FieldProps) {
  const inputId =
    id || inputProps.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      htmlFor={inputId}
      className={[
        wrapperClassName,
        error ? 'field-error' : '',
        inputProps.disabled ? 'field-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={labelClassName}>{label}</span>

      <span className="field-control">
        {leadingIcon}

        <input
          {...inputProps}
          id={inputId}
          className={className}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />

        {trailingIcon}
      </span>

      {error && (
        <span id={`${inputId}-error`} className="field-error-message">
          {error}
        </span>
      )}
    </label>
  );
}