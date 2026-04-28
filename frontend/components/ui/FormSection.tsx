import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  as?: "section" | "fieldset";
}

export function FormSection({
  title,
  description,
  children,
  as: Tag = "section",
}: FormSectionProps) {
  return (
    <Tag className="bg-white rounded-lg border border-border p-6 flex flex-col gap-5">
      <div className="border-l-4 border-accent pl-4">
        {Tag === "fieldset" ? (
          <legend className="font-heading text-lg font-semibold text-primary">
            {title}
          </legend>
        ) : (
          <h2 className="font-heading text-lg font-semibold text-primary">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-secondary mt-1">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </Tag>
  );
}
