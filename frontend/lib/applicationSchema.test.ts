import { describe, it, expect } from "vitest";
import {
  createApplicationFormSchema,
  validateField,
  validateAll,
} from "./applicationSchema";

const VALID = {
  fullName: "John Tan",
  nricOrPassport: "S1234567A",
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
  declarationAccuracy: true,
  declarationConsent: true,
};

describe("createApplicationFormSchema — valid input", () => {
  it("accepts a complete valid submission", () => {
    expect(createApplicationFormSchema.safeParse(VALID).success).toBe(true);
  });

  it("normalises NRIC to uppercase", () => {
    const result = createApplicationFormSchema.safeParse({
      ...VALID,
      nricOrPassport: "s1234567a",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nricOrPassport).toBe("S1234567A");
    }
  });

  it("accepts a valid passport number", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, nricOrPassport: "A123456" }).success
    ).toBe(true);
  });

  it("accepts a contact number with +65 prefix", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, contactNumber: "+65 91234567" }).success
    ).toBe(true);
  });

  it("trims and accepts email with surrounding spaces", () => {
    const result = createApplicationFormSchema.safeParse({
      ...VALID,
      email: "  john@example.com  ",
    });
    expect(result.success).toBe(true);
  });
});

describe("createApplicationFormSchema — invalid input", () => {
  it("rejects a value that is neither a valid NRIC nor a valid passport", () => {
    // "BAD-VALUE!" contains a hyphen and exclamation mark — fails both NRIC and passport regex
    const result = createApplicationFormSchema.safeParse({
      ...VALID,
      nricOrPassport: "BAD-VALUE!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a passport that is too short (< 6 chars)", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, nricOrPassport: "A1234" }).success
    ).toBe(false);
  });

  it("rejects a contact number not starting with 8 or 9", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, contactNumber: "61234567" }).success
    ).toBe(false);
  });

  it("rejects an invalid email address", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, email: "not-an-email" }).success
    ).toBe(false);
  });

  it("rejects a future date of birth", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, dateOfBirth: "2099-01-01" }).success
    ).toBe(false);
  });

  it("rejects an empty yearsInOperation string", () => {
    const result = createApplicationFormSchema.safeParse({ ...VALID, yearsInOperation: "" });
    expect(result.success).toBe(false);
  });

  it("rejects yearsInOperation out of range (> 100)", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, yearsInOperation: "101" }).success
    ).toBe(false);
  });

  it("rejects declarationAccuracy = false", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, declarationAccuracy: false }).success
    ).toBe(false);
  });

  it("rejects declarationConsent = false", () => {
    expect(
      createApplicationFormSchema.safeParse({ ...VALID, declarationConsent: false }).success
    ).toBe(false);
  });
});

describe("validateField", () => {
  it("returns null for a valid field value", () => {
    expect(validateField("email", "john@example.com")).toBeNull();
  });

  it("returns error messages for an invalid email", () => {
    const errors = validateField("email", "not-an-email");
    expect(errors).not.toBeNull();
    expect(errors?.length).toBeGreaterThan(0);
  });

  it("returns null for an empty optional touch (field matches valid state)", () => {
    expect(validateField("fullName", "John Tan")).toBeNull();
  });
});

describe("validateAll", () => {
  it("returns an empty object for a fully valid form", () => {
    expect(validateAll(VALID as Parameters<typeof validateAll>[0])).toEqual({});
  });

  it("returns errors keyed by field name for invalid form", () => {
    const errors = validateAll({
      ...VALID,
      email: "bad",
      contactNumber: "12345678",
    } as Parameters<typeof validateAll>[0]);
    expect(errors["email"]).toBeDefined();
    expect(errors["contactNumber"]).toBeDefined();
    expect(errors["fullName"]).toBeUndefined();
  });
});
