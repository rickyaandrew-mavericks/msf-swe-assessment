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
