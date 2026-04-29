"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { FileUploadList } from "@/components/domain/FileUploadList";
import { submitApplication } from "@/lib/api";
import { LICENCE_TYPES, GENDERS, DECLARATIONS } from "@/lib/applicationOptions";
import { validateField, validateAll } from "@/lib/applicationSchema";
import { FIELD_HINTS } from "@/lib/applicationHints";
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
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [successData, setSuccessData] = useState<{ id: string; status: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof ApplicationFormValues>(
    key: K,
    value: ApplicationFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change — re-validated on next blur
    if (errors[key] !== undefined) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleBlur(field: keyof ApplicationFormValues) {
    setTouched((prev) => new Set([...prev, field]));
    const fieldErrors = validateField(field, values[field]);
    if (fieldErrors !== null && fieldErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Mark all fields touched so errors show regardless of prior interaction
    const allFields = Object.keys(INITIAL_VALUES) as (keyof ApplicationFormValues)[];
    setTouched(new Set(allFields.map(String)));

    // Client-side validation before hitting the network
    const clientErrors = validateAll(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstKey = Object.keys(clientErrors)[0];
      if (firstKey !== undefined) {
        const el = document.getElementById(firstKey);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();

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
        fd.append("declarationAccuracy", values.declarationAccuracy ? "true" : "false");
        fd.append("declarationConsent", values.declarationConsent ? "true" : "false");

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
          setSuccessData({ id: result.id, status: result.status });
          return;
        }

        if (result.kind === "validation") {
          setErrors(result.errors);
          const firstErrorKey = Object.keys(result.errors)[0];
          if (firstErrorKey !== undefined) {
            const el = document.getElementById(firstErrorKey);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            el?.focus();
          }
          return;
        }

        // Server or network error
        setErrors({ _root: [result.message] });
      } catch {
        setErrors({ _root: ["An unexpected error occurred. Please try again."] });
      }
    });
  }

  if (successData !== null) {
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
        <div className="rounded-md bg-muted border border-border px-5 py-3 text-sm text-left w-full max-w-sm">
          <div className="flex justify-between items-center gap-2">
            <span className="text-secondary">Reference number:</span>
            <span className="font-mono font-semibold text-primary">{successData.id}</span>
          </div>
        </div>
        <p className="text-xs text-secondary">
          Please save your reference number for future correspondence.
        </p>
        <Link
          href={`/application/${successData.id}`}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          View Application
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Licence application form"
      aria-busy={isPending}
      className="flex flex-col gap-6"
    >
      {/* Root-level server or network error */}
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
              onBlur={() => handleBlur("fullName")}
              error={touched.has("fullName") ? errors["fullName"] : undefined}
              hint={FIELD_HINTS.fullName}
              required
              disabled={isPending}
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
            onBlur={() => handleBlur("nricOrPassport")}
            error={touched.has("nricOrPassport") ? errors["nricOrPassport"] : undefined}
            hint={FIELD_HINTS.nricOrPassport}
            required
            disabled={isPending}
            placeholder="e.g. S1234567A"
          />

          <Input
            label="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => setField("dateOfBirth", e.target.value)}
            onBlur={() => handleBlur("dateOfBirth")}
            error={touched.has("dateOfBirth") ? errors["dateOfBirth"] : undefined}
            hint={FIELD_HINTS.dateOfBirth}
            required
            disabled={isPending}
            max={new Date().toISOString().split("T")[0]}
          />

          <Select
            label="Gender"
            id="gender"
            name="gender"
            value={values.gender}
            onChange={(e) => setField("gender", e.target.value)}
            onBlur={() => handleBlur("gender")}
            options={GENDERS}
            error={touched.has("gender") ? errors["gender"] : undefined}
            hint={FIELD_HINTS.gender}
            required
            disabled={isPending}
            placeholder="Select gender"
          />

          <Input
            label="Nationality"
            id="nationality"
            name="nationality"
            value={values.nationality}
            onChange={(e) => setField("nationality", e.target.value)}
            onBlur={() => handleBlur("nationality")}
            error={touched.has("nationality") ? errors["nationality"] : undefined}
            hint={FIELD_HINTS.nationality}
            required
            disabled={isPending}
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
            onBlur={() => handleBlur("contactNumber")}
            error={touched.has("contactNumber") ? errors["contactNumber"] : undefined}
            hint={FIELD_HINTS.contactNumber}
            required
            disabled={isPending}
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
            onBlur={() => handleBlur("email")}
            error={touched.has("email") ? errors["email"] : undefined}
            hint={FIELD_HINTS.email}
            required
            disabled={isPending}
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
          onBlur={() => handleBlur("homeAddress")}
          error={touched.has("homeAddress") ? errors["homeAddress"] : undefined}
          hint={FIELD_HINTS.homeAddress}
          required
          disabled={isPending}
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
              onBlur={() => handleBlur("businessName")}
              error={touched.has("businessName") ? errors["businessName"] : undefined}
              hint={FIELD_HINTS.businessName}
              required
              disabled={isPending}
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
              onBlur={() => handleBlur("businessAddress")}
              error={touched.has("businessAddress") ? errors["businessAddress"] : undefined}
              hint={FIELD_HINTS.businessAddress}
              required
              disabled={isPending}
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
            onBlur={() => handleBlur("yearsInOperation")}
            error={touched.has("yearsInOperation") ? errors["yearsInOperation"] : undefined}
            hint={FIELD_HINTS.yearsInOperation}
            required
            disabled={isPending}
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
          onBlur={() => handleBlur("licenceType")}
          options={LICENCE_TYPES}
          error={touched.has("licenceType") ? errors["licenceType"] : undefined}
          hint={FIELD_HINTS.licenceType}
          required
          disabled={isPending}
          placeholder="Select licence type"
        />
      </FormSection>

      {/* Section 5: Supporting Documents */}
      <FormSection
        title="Supporting Documents"
        description="Optionally upload supporting documents in PDF format. PDF only, max 10 MB per file, up to 5 files."
      >
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Upload Documents
            <span className="text-xs text-secondary font-normal ml-2">(optional)</span>
          </p>
          <FileUploadList
            files={documents}
            onChange={setDocuments}
            error={errors["documents"]}
            disabled={isPending}
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
          onChange={(e) => {
            setField("declarationAccuracy", e.target.checked);
            setTouched((prev) => new Set([...prev, "declarationAccuracy"]));
          }}
          label={DECLARATIONS.accuracy}
          error={touched.has("declarationAccuracy") ? errors["declarationAccuracy"] : undefined}
          disabled={isPending}
        />
        <Checkbox
          id="declarationConsent"
          name="declarationConsent"
          checked={values.declarationConsent}
          onChange={(e) => {
            setField("declarationConsent", e.target.checked);
            setTouched((prev) => new Set([...prev, "declarationConsent"]));
          }}
          label={DECLARATIONS.consent}
          error={touched.has("declarationConsent") ? errors["declarationConsent"] : undefined}
          disabled={isPending}
        />
      </FormSection>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-secondary">
          By submitting, you confirm that all information provided is accurate.
        </p>
        <Button type="submit" isLoading={isPending} disabled={isPending} className="sm:w-auto w-full">
          Submit Application
        </Button>
      </div>
    </form>
  );
}
