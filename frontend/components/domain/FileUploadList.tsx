"use client";

import { useRef } from "react";

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_MIME = "application/pdf";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileUploadListProps {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string[];
}

export function FileUploadList({ files, onChange, error }: FileUploadListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = error !== undefined && error.length > 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const clientErrors: string[] = [];
    const valid: File[] = [];

    for (const file of selected) {
      if (file.type !== ACCEPTED_MIME) {
        clientErrors.push(`"${file.name}" is not a PDF and was not added.`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        clientErrors.push(`"${file.name}" exceeds the 10 MB limit and was not added.`);
        continue;
      }
      valid.push(file);
    }

    const merged = [...files, ...valid].slice(0, MAX_FILES);
    onChange(merged);

    // Reset input so the same file can be re-added after removal
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  const remaining = MAX_FILES - files.length;

  return (
    <div className="flex flex-col gap-3" aria-describedby={hasError ? "documents-error" : undefined}>
      {files.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label="Selected documents">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg className="h-4 w-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span className="truncate font-medium text-foreground">{file.name}</span>
                <span className="text-secondary shrink-0">{formatBytes(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${file.name}`}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded text-secondary hover:text-destructive transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <div>
          <input
            ref={inputRef}
            id="documents"
            name="documents"
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload PDF documents"
          />
          <label
            htmlFor="documents"
            className={[
              "flex flex-col items-center justify-center gap-2",
              "min-h-[100px] rounded-md border-2 border-dashed px-4 py-6",
              "cursor-pointer transition-colors duration-150 text-center",
              hasError
                ? "border-destructive bg-red-50 hover:bg-red-100"
                : "border-border bg-muted hover:border-accent hover:bg-white",
            ].join(" ")}
          >
            <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <span className="text-sm font-medium text-accent">Click to upload PDFs</span>
              <p className="text-xs text-secondary mt-0.5">
                PDF only · Max 10 MB per file · Up to {remaining} more file{remaining !== 1 ? "s" : ""}
              </p>
            </div>
          </label>
        </div>
      )}

      {files.length >= MAX_FILES && (
        <p className="text-sm text-secondary">
          Maximum of {MAX_FILES} documents reached. Remove a file to add another.
        </p>
      )}

      {hasError && (
        <p id="documents-error" role="alert" className="text-sm text-destructive">
          {error[0]}
        </p>
      )}
    </div>
  );
}
