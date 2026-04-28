import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitApplication } from "./api";

function makeFetch(status: number, body?: unknown) {
  return vi.fn().mockResolvedValue({
    status,
    json: async () => body,
  });
}

describe("submitApplication", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns success with id on 201", async () => {
    vi.stubGlobal("fetch", makeFetch(201, {
      id: "550e8400-e29b-41d4-a716-446655440000",
      status: "submitted",
      createdAt: "2026-01-01T00:00:00.000Z",
    }));
    const result = await submitApplication(new FormData());
    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(result.id).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(result.status).toBe("submitted");
    }
  });

  it("returns server error when 201 body has no string id", async () => {
    vi.stubGlobal("fetch", makeFetch(201, { id: 12345, status: "submitted" }));
    const result = await submitApplication(new FormData());
    expect(result.kind).toBe("server");
  });

  it("returns validation errors on 400", async () => {
    vi.stubGlobal("fetch", makeFetch(400, { errors: { email: ["Invalid email address."] } }));
    const result = await submitApplication(new FormData());
    expect(result.kind).toBe("validation");
    if (result.kind === "validation") {
      expect(result.errors["email"]).toEqual(["Invalid email address."]);
    }
  });

  it("returns empty errors object when 400 body has no errors field", async () => {
    vi.stubGlobal("fetch", makeFetch(400, {}));
    const result = await submitApplication(new FormData());
    expect(result.kind).toBe("validation");
    if (result.kind === "validation") {
      expect(result.errors).toEqual({});
    }
  });

  it("returns server error on 500", async () => {
    vi.stubGlobal("fetch", makeFetch(500));
    const result = await submitApplication(new FormData());
    expect(result.kind).toBe("server");
  });

  it("returns server error when fetch throws a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    const result = await submitApplication(new FormData());
    expect(result.kind).toBe("server");
  });
});
