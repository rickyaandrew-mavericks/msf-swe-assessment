import type { ChangeEvent } from "react";

interface SelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  error?: string[];
  required?: boolean;
  placeholder?: string;
}

export function Select({
  label,
  id,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select an option",
}: SelectProps) {
  const hasError = error !== undefined && error.length > 0;
  const errorId = `${id}-error`;

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

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError}
        className={[
          "min-h-[44px] w-full rounded-md border px-3 py-2",
          "bg-white text-foreground text-base",
          "cursor-pointer transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
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
