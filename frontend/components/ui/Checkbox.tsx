import type { ChangeEvent, ReactNode } from "react";

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;
  error?: string[];
  disabled?: boolean;
}

export function Checkbox({
  id,
  name,
  checked,
  onChange,
  label,
  error,
  disabled = false,
}: CheckboxProps) {
  const hasError = error !== undefined && error.length > 0;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          className={[
            "mt-1 h-5 w-5 min-w-[20px] rounded border cursor-pointer",
            "accent-accent transition-colors duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError ? "border-destructive" : "border-border",
          ].join(" ")}
        />
        <label
          htmlFor={id}
          className="text-sm text-foreground leading-relaxed cursor-pointer"
        >
          {label}
        </label>
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-destructive ml-8">
          {error[0]}
        </p>
      )}
    </div>
  );
}
