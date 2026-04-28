export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "pending_information",
  "information_submitted",
  "site_assessment_scheduled",
  "site_assessment_completed",
  "pending_approval",
  "approved",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const LICENCE_TYPES = [
  "Child Care Centre Licence",
  "Centre-Based Student Care Licence",
  "Residential Child Care Service Licence",
  "Foster Care Service Licence",
  "Family Group Home Licence",
  "Social Service Agency Licence",
] as const;

export type LicenceType = (typeof LICENCE_TYPES)[number];

export const GENDERS = ["Male", "Female", "Prefer not to say"] as const;

export type Gender = (typeof GENDERS)[number];

export type ApplicationDocumentMetadata = {
  originalName: string;
  storedPath: string;
  mimeType: string;
  sizeBytes: number;
};

export type Application = {
  id: string;
  fullName: string;
  nricOrPassport: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  contactNumber: string;
  email: string;
  homeAddress: string;
  businessName: string;
  businessAddress: string;
  yearsInOperation: number;
  licenceType: LicenceType;
  declarationAccuracy: boolean;
  declarationConsent: boolean;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};
