import type {
  ApplicationDetail,
  ApplicationListItem,
  SubmissionResult,
  CommentInfo,
} from "@/types/application";

const API_BASE =
  process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:3001";

type RawSuccessBody = {
  id: string;
  status: string;
  createdAt: string;
};

type RawErrorBody = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function getApplications(): Promise<ApplicationListItem[]> {
  const res = await fetch(`${API_BASE}/api/applications`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as ApplicationListItem[];
}

export async function getApplicationById(
  id: string
): Promise<ApplicationDetail | null> {
  const res = await fetch(`${API_BASE}/api/applications/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return (await res.json()) as ApplicationDetail;
}

export async function createComment(
  applicationId: string,
  userId: string,
  comment: string
): Promise<CommentInfo | null> {
  const res = await fetch(`${API_BASE}/api/applications/${applicationId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, comment }),
  });

  if (!res.ok) return null;
  return (await res.json()) as CommentInfo;
}

export async function submitApplication(
  formData: FormData
): Promise<SubmissionResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type — browser sets multipart boundary automatically
    });
  } catch {
    return { kind: "server", message: "Unable to reach the server. Please check your connection and try again." };
  }

  if (res.status === 201) {
    const body = (await res.json()) as RawSuccessBody;
    if (typeof body.id !== "string" || typeof body.status !== "string") {
      return { kind: "server", message: "An unexpected server error occurred. Please try again later." };
    }
    return { kind: "success", id: body.id, status: body.status, createdAt: body.createdAt };
  }

  if (res.status === 400) {
    const body = (await res.json()) as RawErrorBody;
    return { kind: "validation", errors: body.errors ?? {} };
  }

  return { kind: "server", message: "An unexpected server error occurred. Please try again later." };
}
