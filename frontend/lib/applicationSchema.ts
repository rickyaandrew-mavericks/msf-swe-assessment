import { z } from "zod";
import { LICENCE_TYPES, GENDERS } from "./applicationOptions";
import type { ApplicationFormValues } from "@/types/application";

// Kept in sync with backend/src/utils/applicationSchema.ts.
// Frontend validates raw form state: boolean declarations, string yearsInOperation.
// Backend validates FormData strings: "true"/"false" declarations, coerced number.

const NRIC_REGEX = /^[STFGM]\d{7}[A-Z]$/;
const PASSPORT_REGEX = /^[A-Z0-9]{6,20}$/;
const SG_PHONE_REGEX = /^(\+65\s?)?[89]\d{3}\s?\d{4}$/;

export const createApplicationFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required.")
    .trim()
    .min(2, "Must be at least 2 characters.")
    .max(100, "Must be at most 100 characters."),

  nricOrPassport: z
    .string()
    .min(1, "NRIC or passport number is required.")
    .trim()
    .transform((s) => s.toUpperCase())
    .refine((v) => NRIC_REGEX.test(v) || PASSPORT_REGEX.test(v), {
      message:
        "Must be a valid Singapore NRIC (e.g. S1234567A) or passport number (6–20 alphanumeric characters).",
    }),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((v) => !isNaN(new Date(v).getTime()), "Enter a valid date.")
    .refine((v) => new Date(v) <= new Date(), "Date of birth cannot be in the future."),

  gender: z.enum(GENDERS, "Please select a gender."),

  nationality: z
    .string()
    .min(1, "Nationality is required.")
    .trim()
    .min(2, "Must be at least 2 characters.")
    .max(60, "Must be at most 60 characters."),

  contactNumber: z
    .string()
    .min(1, "Contact number is required.")
    .trim()
    .regex(SG_PHONE_REGEX, "Must be a valid Singapore contact number (e.g. 91234567 or +65 9123 4567)."),

  email: z
    .string()
    .min(1, "Email address is required.")
    .trim()
    .email("Must be a valid email address.")
    .max(255, "Must be at most 255 characters."),

  homeAddress: z
    .string()
    .min(1, "Home address is required.")
    .trim()
    .min(10, "Must be at least 10 characters.")
    .max(500, "Must be at most 500 characters."),

  businessName: z
    .string()
    .min(1, "Business name is required.")
    .trim()
    .min(2, "Must be at least 2 characters.")
    .max(200, "Must be at most 200 characters."),

  businessAddress: z
    .string()
    .min(1, "Business address is required.")
    .trim()
    .min(10, "Must be at least 10 characters.")
    .max(500, "Must be at most 500 characters."),

  yearsInOperation: z
    .string()
    .min(1, "Years in operation is required. Enter 0 if newly established.")
    .refine((v) => {
      const n = Number(v);
      return !isNaN(n) && Number.isInteger(n) && n >= 0 && n <= 100;
    }, "Must be a whole number from 0 to 100."),

  licenceType: z.enum(LICENCE_TYPES, "Please select a licence type."),

  declarationAccuracy: z.literal(
    true,
    "You must agree to this declaration before submitting."
  ),

  declarationConsent: z.literal(
    true,
    "You must agree to this declaration before submitting."
  ),
});

export type ValidatedApplicationForm = z.infer<typeof createApplicationFormSchema>;

/**
 * Validates a single form field. Returns error messages, or null if valid.
 * Documents are optional and not part of this schema.
 */
export function validateField(
  field: keyof ApplicationFormValues,
  value: ApplicationFormValues[keyof ApplicationFormValues]
): string[] | null {
  // Parse just this one field against the full schema; filter issues by field path.
  // Other missing fields produce errors but we ignore them here.
  const result = createApplicationFormSchema.safeParse({ [field]: value });
  if (result.success) return null;
  const fieldErrors = result.error.issues
    .filter((i) => i.path[0] === field)
    .map((i) => i.message);
  return fieldErrors.length > 0 ? fieldErrors : null;
}

/**
 * Validates all form fields. Returns a map of field → error messages.
 * An empty object means all fields are valid.
 */
export function validateAll(
  values: ApplicationFormValues
): Record<string, string[]> {
  const result = createApplicationFormSchema.safeParse(values);
  if (result.success) return {};
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() ?? "_root";
    const existing = errors[key];
    if (existing !== undefined) {
      existing.push(issue.message);
    } else {
      errors[key] = [issue.message];
    }
  }
  return errors;
}
