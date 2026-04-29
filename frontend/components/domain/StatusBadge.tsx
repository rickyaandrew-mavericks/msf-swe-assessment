import type { ApplicationStatus } from "@/types/application";
import { formatStatus } from "@/lib/statusFormatter";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

function getStatusStyle(status: ApplicationStatus): string {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending_pre_site_resubmission":
    case "pending_post_site_resubmission":
    case "pending_post_site_clarification":
    case "pending_site_visit":
    case "pending_approval":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "under_review":
    case "route_to_approval":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pre_site_resubmitted":
    case "post_site_resubmitted":
    case "post_site_clarification_resubmitted":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "site_visit_scheduled":
    case "site_visit_done":
      return "bg-sky-100 text-sky-800 border-sky-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : "px-3 py-1 text-sm font-medium";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border",
        sizeClass,
        getStatusStyle(status),
      ].join(" ")}
    >
      {formatStatus(status)}
    </span>
  );
}
