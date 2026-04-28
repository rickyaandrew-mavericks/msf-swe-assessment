"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { FileUploadList } from "@/components/domain/FileUploadList";
import { submitApplication } from "@/lib/api";
import { LICENCE_TYPES, GENDERS, DECLARATIONS } from "@/lib/applicationOptions";
import type { ApplicationFormValues } from "@/types/application";

const INITIAL_VALUES: ApplicationFormValues = {
  fullName: "",
  nricOrPassport: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  contactNumber: "",
  email: "",
  homeAddress: "",
  businessName: "",
  businessAddress: "",
  yearsInOperation: "",
  licenceType: "",
  declarationAccuracy: false,
  declarationConsent: false,
};

export function ApplicationForm() {
  const [values, setValues] = useState<ApplicationFormValues>(INITIAL_VALUES);
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successId, setSuccessId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof ApplicationFormValues>(
    key: K,
    value: ApplicationFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change
    if (errors[key] !== undefined) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      try {
      const fd = new FormData();

      // Text fields
      fd.append("fullName", values.fullName);
      fd.append("nricOrPassport", values.nricOrPassport);
      fd.append("dateOfBirth", values.dateOfBirth);
      fd.append("gender", values.gender);
      fd.append("nationality", values.nationality);
      fd.append("contactNumber", values.contactNumber);
      fd.append("email", values.email);
      fd.append("homeAddress", values.homeAddress);
      fd.append("businessName", values.businessName);
      fd.append("businessAddress", values.businessAddress);
      fd.append("yearsInOperation", values.yearsInOperation);
      fd.append("licenceType", values.licenceType);
      // Declarations: backend expects string "true"
      fd.append("declarationAccuracy", values.declarationAccuracy ? "true" : "false");
      fd.append("declarationConsent", values.declarationConsent ? "true" : "false");

      // Files
      for (const file of documents) {
        fd.append("documents", file);
      }

      const result = await submitApplication(fd);

      if (result.kind === "success") {
        const UUID_RE =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!UUID_RE.test(result.id)) {
          setErrors({ _root: ["An unexpected error occurred. Please try again."] });
          return;
        }
        setSuccessId(result.id);
        return;
      }

      if (result.kind === "validation") {
        setErrors(result.errors);
        // Scroll to first error
        const firstErrorKey = Object.keys(result.errors)[0];
        if (firstErrorKey !== undefined) {
          const el = document.getElementById(firstErrorKey);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          el?.focus();
        }
        return;
      }

      // Server error
      setErrors({ _root: [result.message] });
      } catch {
        setErrors({ _root: ["An unexpected error occurred. Please try again."] });
      }
    });
  }

  if (successId !== null) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white rounded-lg border border-border p-10 text-center flex flex-col items-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold text-primary">
            Application Submitted
          </h2>
          <p className="mt-2 text-secondary text-sm max-w-md mx-auto">
            Your licence application has been received. A Licensing Officer will
            review your submission and contact you at the email address provided.
          </p>
        </div>
        <div className="rounded-md bg-muted border border-border px-5 py-3 text-sm">
          <span className="text-secondary">Reference number: </span>
          <span className="font-mono font-semibold text-primary">{successId}</span>
        </div>
        <p className="text-xs text-secondary">
          Please save your reference number for future correspondence.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Licence application form"
      className="flex flex-col gap-6"
    >
      {/* Root-level server error */}
      {errors["_root"] !== undefined && (
        <div role="alert" className="rounded-md border border-destructive bg-red-50 px-4 py-3 text-sm text-destructive">
          {errors["_root"][0]}
        </div>
      )}

      {/* Section 1: Personal Details */}
      <FormSection
        title="Personal Details"
        description="Enter your personal particulars as shown on your NRIC or passport."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              value={values.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              error={errors["fullName"]}
              required
              autoComplete="name"
              placeholder="As shown on NRIC or passport"
            />
          </div>

          <Input
            label="NRIC / Passport Number"
            id="nricOrPassport"
            name="nricOrPassport"
            value={values.nricOrPassport}
            onChange={(e) => setField("nricOrPassport", e.target.value)}
            error={errors["nricOrPassport"]}
            required
            placeholder="e.g. S1234567A"
          />

          <Input
            label="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => setField("dateOfBirth", e.target.value)}
            error={errors["dateOfBirth"]}
            required
            max={new Date().toISOString().split("T")[0]}
          />

          <Select
            label="Gender"
            id="gender"
            name="gender"
            value={values.gender}
            onChange={(e) => setField("gender", e.target.value)}
            options={GENDERS}
            error={errors["gender"]}
            required
            placeholder="Select gender"
          />

          <Input
            label="Nationality"
            id="nationality"
            name="nationality"
            value={values.nationality}
            onChange={(e) => setField("nationality", e.target.value)}
            error={errors["nationality"]}
            required
            autoComplete="country-name"
            placeholder="e.g. Singaporean"
          />

          <Input
            label="Contact Number"
            id="contactNumber"
            name="contactNumber"
            type="tel"
            value={values.contactNumber}
            onChange={(e) => setField("contactNumber", e.target.value)}
            error={errors["contactNumber"]}
            required
            autoComplete="tel"
            placeholder="e.g. 91234567 or +65 9123 4567"
          />

          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            error={errors["email"]}
            required
            autoComplete="email"
            placeholder="your@email.com"
          />
        </div>
      </FormSection>

      {/* Section 2: Residential Details */}
      <FormSection
        title="Residential Details"
        description="Provide your current residential address."
      >
        <Textarea
          label="Home Address"
          id="homeAddress"
          name="homeAddress"
          value={values.homeAddress}
          onChange={(e) => setField("homeAddress", e.target.value)}
          error={errors["homeAddress"]}
          required
          rows={3}
          autoComplete="street-address"
          placeholder="Block/Unit number, Street name, Postal code"
        />
      </FormSection>

      {/* Section 3: Business Details */}
      <FormSection
        title="Business Details"
        description="Provide information about the organisation or business applying for the licence."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Business / Organisation Name"
              id="businessName"
              name="businessName"
              value={values.businessName}
              onChange={(e) => setField("businessName", e.target.value)}
              error={errors["businessName"]}
              required
              autoComplete="organization"
              placeholder="Registered name of the organisation"
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              label="Business Address"
              id="businessAddress"
              name="businessAddress"
              value={values.businessAddress}
              onChange={(e) => setField("businessAddress", e.target.value)}
              error={errors["businessAddress"]}
              required
              rows={3}
              placeholder="Block/Unit number, Street name, Postal code"
            />
          </div>

          <Input
            label="Years in Operation"
            id="yearsInOperation"
            name="yearsInOperation"
            type="number"
            value={values.yearsInOperation}
            onChange={(e) => setField("yearsInOperation", e.target.value)}
            error={errors["yearsInOperation"]}
            required
            min={0}
            max={100}
            placeholder="0"
          />
        </div>
      </FormSection>

      {/* Section 4: Licence Details */}
      <FormSection
        title="Licence Details"
        description="Select the type of social service licence you are applying for."
      >
        <Select
          label="Licence Type"
          id="licenceType"
          name="licenceType"
          value={values.licenceType}
          onChange={(e) => setField("licenceType", e.target.value)}
          options={LICENCE_TYPES}
          error={errors["licenceType"]}
          required
          placeholder="Select licence type"
        />
      </FormSection>

      {/* Section 5: Supporting Documents */}
      <FormSection
        title="Supporting Documents"
        description="Upload all relevant supporting documents in PDF format. At least one document is required."
      >
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Upload Documents
            <span className="text-destructive ml-1" aria-hidden="true">*</span>
          </p>
          <FileUploadList
            files={documents}
            onChange={setDocuments}
            error={errors["documents"]}
          />
        </div>
      </FormSection>

      {/* Section 6: Declarations */}
      <FormSection
        title="Declarations"
        description="You must agree to both declarations before submitting your application."
        as="fieldset"
      >
        <Checkbox
          id="declarationAccuracy"
          name="declarationAccuracy"
          checked={values.declarationAccuracy}
          onChange={(e) => setField("declarationAccuracy", e.target.checked)}
          label={DECLARATIONS.accuracy}
          error={errors["declarationAccuracy"]}
        />
        <Checkbox
          id="declarationConsent"
          name="declarationConsent"
          checked={values.declarationConsent}
          onChange={(e) => setField("declarationConsent", e.target.checked)}
          label={DECLARATIONS.consent}
          error={errors["declarationConsent"]}
        />
      </FormSection>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-secondary">
          By submitting, you confirm that all information provided is accurate.
        </p>
        <Button type="submit" isLoading={isPending} className="sm:w-auto w-full">
          Submit Application
        </Button>
      </div>
    </form>
  );
}
