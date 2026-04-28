import { describe, it, expect } from "vitest";
import { createApplicationSchema } from "./applicationSchema.js";

const VALID: Record<string, string> = {
  fullName: "John Tan",
  nricOrPassport: "S1234567D",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  nationality: "Singaporean",
  contactNumber: "91234567",
  email: "john@example.com",
  homeAddress: "123 Orchard Road Singapore 238895",
  businessName: "My Business Pte Ltd",
  businessAddress: "456 Shenton Way Singapore 068809",
  yearsInOperation: "5",
  licenceType: "Child Care Centre Licence",
  declarationAccuracy: "true",
  declarationConsent: "true",
};

describe("createApplicationSchema — valid input", () => {
  it("accepts a complete valid submission", () => {
    expect(createApplicationSchema.safeParse(VALID).success).toBe(true);
  });

  it("coerces yearsInOperation from string to number", () => {
    const result = createApplicationSchema.safeParse({ ...VALID, yearsInOperation: "10" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.yearsInOperation).toBe(10);
    }
  });

  it("accepts an NRIC starting with T", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, nricOrPassport: "T0234567B" }).success
    ).toBe(true);
  });

  it("accepts a valid passport number", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, nricOrPassport: "A123456" }).success
    ).toBe(true);
  });

  it("accepts a contact number with +65 prefix", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, contactNumber: "+65 91234567" }).success
    ).toBe(true);
  });

  it("normalises email to lowercase", () => {
    const result = createApplicationSchema.safeParse({ ...VALID, email: "JOHN@EXAMPLE.COM" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("john@example.com");
    }
  });
});

describe("createApplicationSchema — invalid input", () => {
  it("rejects a missing required field", () => {
    const { fullName: _, ...rest } = VALID;
    expect(createApplicationSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects an invalid NRIC/passport (special characters)", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, nricOrPassport: "BAD-VALUE!" }).success
    ).toBe(false);
  });

  it("rejects a future date of birth", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, dateOfBirth: "2099-01-01" }).success
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, email: "not-an-email" }).success
    ).toBe(false);
  });

  it("rejects a contact number that does not start with 8 or 9", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, contactNumber: "61234567" }).success
    ).toBe(false);
  });

  it("rejects declarationAccuracy of 'false'", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, declarationAccuracy: "false" }).success
    ).toBe(false);
  });

  it("rejects declarationConsent of 'false'", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, declarationConsent: "false" }).success
    ).toBe(false);
  });

  it("rejects an invalid gender value", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, gender: "unknown" }).success
    ).toBe(false);
  });

  it("rejects an invalid licence type", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, licenceType: "Invalid Licence" }).success
    ).toBe(false);
  });

  it("rejects negative yearsInOperation", () => {
    expect(
      createApplicationSchema.safeParse({ ...VALID, yearsInOperation: "-1" }).success
    ).toBe(false);
  });
});
