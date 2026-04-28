import { z } from "zod";
import { APPLICATION_STATUSES, LICENCE_TYPES, GENDERS } from "../types/application.js";

// NRIC: S/T/F/G/M + 7 digits + uppercase letter (format check only, no checksum)
const NRIC_REGEX = /^[STFGM]\d{7}[A-Z]$/;
// Passport: 6–20 uppercase alphanumeric characters
const PASSPORT_REGEX = /^[A-Z0-9]{6,20}$/;
// Singapore mobile: optional +65, then 8 or 9 followed by 7 digits (spaces optional)
const SG_PHONE_REGEX = /^(\+65\s?)?[89]\d{3}\s?\d{4}$/;

const declarationField = z
  .string()
  .transform((v) => v === "true")
  .pipe(z.literal(true));

export const createApplicationSchema = z.object({
  fullName: z.string().trim().min(2).max(100),

  nricOrPassport: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .refine(
      (v) => NRIC_REGEX.test(v) || PASSPORT_REGEX.test(v),
      {
        message:
          "Must be a valid Singapore NRIC (e.g. S1234567A) or passport number (6–20 alphanumeric characters).",
      }
    ),

  dateOfBirth: z.coerce
    .date()
    .max(new Date(), { message: "Date of birth cannot be in the future." }),

  gender: z.enum(GENDERS),

  nationality: z.string().trim().min(2).max(60),

  contactNumber: z
    .string()
    .trim()
    .regex(SG_PHONE_REGEX, {
      message:
        "Must be a valid Singapore contact number (e.g. 91234567 or +65 9123 4567).",
    }),

  email: z.string().trim().toLowerCase().email().max(255),

  homeAddress: z.string().trim().min(10).max(500),

  businessName: z.string().trim().min(2).max(200),

  businessAddress: z.string().trim().min(10).max(500),

  yearsInOperation: z.coerce.number().int().min(0).max(100),

  licenceType: z.enum(LICENCE_TYPES),

  declarationAccuracy: declarationField,

  declarationConsent: declarationField,
});

export type CreateApplicationBody = z.infer<typeof createApplicationSchema>;

export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);
