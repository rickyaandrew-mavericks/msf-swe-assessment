import type { ApplicationStatus } from "@/types/application";

export function formatStatus(status: ApplicationStatus): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
