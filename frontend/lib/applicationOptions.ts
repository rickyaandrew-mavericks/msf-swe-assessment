// These arrays must stay in sync with the backend const tuples in
// src/types/application.ts. Both are validated by the backend at runtime.

export const LICENCE_TYPES = [
  "Child Care Centre Licence",
  "Centre-Based Student Care Licence",
  "Residential Child Care Service Licence",
  "Foster Care Service Licence",
  "Family Group Home Licence",
  "Social Service Agency Licence",
] as const;

export const GENDERS = ["Male", "Female", "Prefer not to say"] as const;

export const DECLARATIONS = {
  accuracy:
    "I declare that all information provided in this application is true, complete and accurate to the best of my knowledge.",
  consent:
    "I consent to the Ministry of Social and Family Development conducting relevant checks and verifications in connection with this application.",
} as const;
