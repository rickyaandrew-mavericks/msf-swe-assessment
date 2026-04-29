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

export type ApplicationListItem = {
  id: string;
  fullName: string;
  businessName: string;
  licenceType: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationDocumentInfo = {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type ApplicationDetail = {
  id: string;
  fullName: string;
  nricOrPassport: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  contactNumber: string;
  email: string;
  homeAddress: string;
  businessName: string;
  businessAddress: string;
  yearsInOperation: number;
  licenceType: string;
  declarationAccuracy: boolean;
  declarationConsent: boolean;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  documents: ApplicationDocumentInfo[];
};

export type SubmissionSuccess = {
  kind: "success";
  id: string;
  status: string;
  createdAt: string;
};

export type SubmissionValidationError = {
  kind: "validation";
  errors: Record<string, string[]>;
};

export type SubmissionServerError = {
  kind: "server";
  message: string;
};

export type SubmissionResult =
  | SubmissionSuccess
  | SubmissionValidationError
  | SubmissionServerError;

export type ApplicationFormValues = {
  fullName: string;
  nricOrPassport: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  contactNumber: string;
  email: string;
  homeAddress: string;
  businessName: string;
  businessAddress: string;
  yearsInOperation: string;
  licenceType: string;
  declarationAccuracy: boolean;
  declarationConsent: boolean;
};
