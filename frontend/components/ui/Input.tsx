import type { ChangeEvent, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string[];
  hint?: string;
  required?: boolean;
}

export function Input({
  label,
  id,
  name,
  value,
  onChange,
  error,
  hint,
  required = false,
  type = "text",
  ...rest
}: InputProps) {
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

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-describedby={describedBy}
        aria-invalid={hasError}
        className={[
          "min-h-[44px] w-full rounded-md border px-3 py-2",
          "bg-white text-foreground text-base",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          hasError
            ? "border-destructive focus:ring-destructive/30"
            : "border-border focus:border-accent focus:ring-accent/20",
        ].join(" ")}
        {...rest}
      />

      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error[0]}
        </p>
      )}
    </div>
  );
}
