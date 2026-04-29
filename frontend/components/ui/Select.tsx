import type { ChangeEvent, FocusEvent } from "react";

interface SelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  error?: string[];
  hint?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function Select({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  hint,
  required = false,
  placeholder = "Select an option",
  disabled = false,
}: SelectProps) {
  const hasError = error !== undefined && error.length > 0;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [hint ? hintId : null, hasError ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        )}
      </label>

      {hint && !hasError && (
        <p id={hintId} className="text-xs text-secondary">
          {hint}
        </p>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-describedby={describedBy}
        aria-invalid={hasError}
        className={[
          "min-h-[44px] w-full rounded-md border px-3 py-2",
          "bg-white text-foreground text-base",
          "cursor-pointer transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-destructive focus:ring-destructive/30"
            : "border-border focus:border-accent focus:ring-accent/20",
          value === "" ? "text-secondary" : "text-foreground",
        ].join(" ")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error[0]}
        </p>
      )}
    </div>
  );
}
