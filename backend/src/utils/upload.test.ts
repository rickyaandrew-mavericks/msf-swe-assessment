import { describe, it, expect } from "vitest";
import { safeFilename, applicationUploadDir, tmpUploadDir } from "./upload.js";

describe("safeFilename", () => {
  it("returns an already-safe filename unchanged", () => {
    expect(safeFilename("business_registration.pdf")).toBe("business_registration.pdf");
  });

  it("strips directory components, keeping only the basename", () => {
    expect(safeFilename("../../../etc/passwd")).toBe("passwd");
  });

  it("replaces special characters with underscores", () => {
    expect(safeFilename("my file (1).pdf")).toBe("my file _1_.pdf");
  });

  it("returns _unnamed.pdf for a single dot", () => {
    expect(safeFilename(".")).toBe("_unnamed.pdf");
  });

  it("returns _unnamed.pdf for double dot", () => {
    expect(safeFilename("..")).toBe("_unnamed.pdf");
  });

  it("returns _unnamed.pdf for an empty string", () => {
    expect(safeFilename("")).toBe("_unnamed.pdf");
  });

  it("preserves spaces and hyphens", () => {
    expect(safeFilename("my-document 2024.pdf")).toBe("my-document 2024.pdf");
  });
});

describe("applicationUploadDir", () => {
  it("constructs the upload path for an application", () => {
    const result = applicationUploadDir("/uploads", "abc-123");
    expect(result).toMatch(/uploads[/\\]abc-123$/);
  });
});

describe("tmpUploadDir", () => {
  it("appends _tmp to the base directory", () => {
    const result = tmpUploadDir("/uploads");
    expect(result).toMatch(/uploads[/\\]_tmp$/);
  });
});
