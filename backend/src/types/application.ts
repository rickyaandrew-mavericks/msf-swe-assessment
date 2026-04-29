export const APPLICATION_STATUSES = [
  "application_received",
  "submitted",
  "under_review",
  "pending_pre_site_resubmission",
  "pre_site_resubmitted",
  "site_visit_scheduled",
  "pending_site_visit",
  "site_visit_done",
  "pending_post_site_clarification",
  "awaiting_post_site_clarification",
  "pending_post_site_resubmission",
  "post_site_clarification_resubmitted",
  "post_site_resubmitted",
  "pending_approval",
  "route_to_approval",
  "approved",
  "rejected",
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

export type ApplicationDocumentInfo = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type UserInfo = {
  id: string;
  name: string;
  role: string;
};

export type CommentInfo = {
  id: string;
  comment: string;
  officer: UserInfo;
  createdAt: Date;
};

export type ApplicationDetail = Application & {
  documents: ApplicationDocumentInfo[];
  comments: CommentInfo[];
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
