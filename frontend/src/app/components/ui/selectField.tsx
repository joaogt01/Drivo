import type { SelectHTMLAttributes, ReactNode } from 'react';

type SelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> & {
  label: string;
  options: string[];
  wrapperClassName?: string;
  labelClassName?: string;
  error?: string;
  trailingIcon?: ReactNode;
};

export default function SelectField({
  label,
  options,
  wrapperClassName = 'field',
  labelClassName,
  error,
  trailingIcon,
  className = '',
  id,
  ...selectProps
}: SelectFieldProps) {
  const selectId =
    id || selectProps.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      htmlFor={selectId}
      className={[
        wrapperClassName,
        error ? 'field-error' : '',
        selectProps.disabled ? 'field-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={labelClassName}>{label}</span>

      <span className="field-control">
        <select
          {...selectProps}
          id={selectId}
          className={className}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {trailingIcon}
      </span>

      {error && (
        <span id={`${selectId}-error`} className="field-error-message">
          {error}
        </span>
      )}
    </label>
  );
}