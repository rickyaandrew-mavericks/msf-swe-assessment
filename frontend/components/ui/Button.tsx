import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({
  isLoading = false,
  variant = "primary",
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled ?? isLoading;

  const base =
    "inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2 rounded-md font-medium text-base transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-secondary focus:ring-primary",
    secondary:
      "bg-white text-primary border border-border hover:bg-muted focus:ring-primary",
  };

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      className={[base, variants[variant], className].join(" ")}
      {...rest}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {isLoading ? "Submitting…" : children}
    </button>
  );
}
