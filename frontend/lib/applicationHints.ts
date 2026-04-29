export const FIELD_HINTS = {
  fullName:
    "Enter your name exactly as it appears on your NRIC or passport. 2–100 characters.",
  nricOrPassport:
    "NRIC: letter (S/T/F/G/M) + 7 digits + letter, e.g. S1234567A. Passport: 6–20 uppercase letters or digits.",
  dateOfBirth: "Use the date picker. Date must not be in the future.",
  gender: "Select one option.",
  nationality: "e.g. Singaporean, Malaysian. 2–60 characters.",
  contactNumber:
    "Singapore mobile starting with 8 or 9. With or without +65 prefix, e.g. 91234567 or +65 9123 4567.",
  email: "We will send updates about your application to this address.",
  homeAddress:
    "Include block/unit number, street name, and postal code. 10–500 characters.",
  businessName: "Registered name of the organisation. 2–200 characters.",
  businessAddress:
    "Include block/unit number, street name, and postal code. 10–500 characters.",
  yearsInOperation: "Whole number from 0 to 100. Enter 0 if newly established.",
  licenceType: "Select the licence category that matches your service.",
} as const;
