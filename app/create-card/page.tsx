"use client";

import FormFields from "../form/FormFields";
import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { getCountryCode, getCurrencySymbol } from "@/utils/global";
import { createCard } from "../network";
import "primereact/resources/themes/viva-light/theme.css";
import "primeicons/primeicons.css";
import { findJobTitle } from "../network";
import { ApplicationStatus, PayFrequency, WorkMode } from "@prisma/client";
import { useRouter } from "next/navigation";

const PLACEHOLDER_USER_ID = 1;

const TODAY: string = new Date().toISOString();

interface Company {
  companyId: string;
  name: string;
}

interface ChangeEvent {
  target: {
    name: string;
    value: any;
  };
}

interface FormData {
  applicationCardId?: string;
  boardId: number;
  company: Company;
  jobTitle: string;
  jobDescription: string;
  workMode: WorkMode;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  applicationLink: string;
  applicationDate: string;
  positionIndex: number;
  notes: string;
  status: ApplicationStatus;
}

const defaultFormData: FormData = {
  applicationCardId: undefined,
  boardId: 1,
  company: {
    companyId: undefined,
    name: undefined,
  },
  jobTitle: undefined,
  jobDescription: undefined,
  workMode: WorkMode.onsite,
  payAmount: 0,
  payFrequency: PayFrequency.hourly,
  currency: "USD",
  streetAddress: undefined,
  city: undefined,
  state: undefined,
  country: "United States",
  postalCode: undefined,
  applicationLink: undefined,
  applicationDate: TODAY,
  positionIndex: 0,
  notes: undefined,
  status: ApplicationStatus.applied,
};

const CreateCard: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingJobData, setExistingJobData] = useState<any>(null);

  const toast = useRef<Toast>(null);
  const isDataValid: boolean = Boolean(
    formData.company.name && formData.jobTitle
  );

  const handleInputChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showError = (errorMessage: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      sticky: true,
    });
  };

  const checkIfJobExists = async () => {
    const jobData = await findJobTitle({
      userId: PLACEHOLDER_USER_ID,
      jobTitle: formData.jobTitle,
      companyName: formData.company.name,
      boardId: formData.boardId,
    });
    setExistingJobData(jobData);
  };

  const handleCountryChange = (country) => {
    const currencySymbol = getCurrencySymbol(country);
    const countryData = { country: country, currency: currencySymbol };
    setFormData({ ...formData, ...countryData });
  };

  const handleCompanyChange = (company) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        companyId: company.companyId,
        name: company.name,
      },
    }));
  };

  const countrySymbol = getCountryCode(formData.country);
  const currencySymbol = getCurrencySymbol(formData.country);

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createCard(formData);
      console.log(result);
      if (result.ok) {
        router.push("/board");
      } else {
        showError(
          result?.data?.error || "There was a problem with the submission."
        );
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-10 mb-10 mx-auto p-10 bg-white rounded-lg shadow-md xs:w-full md:w-1/2 claymorphic-shadow">
        <FormFields
          {...formData}
          onInputChange={handleInputChange}
          onCountryChange={handleCountryChange}
          onCompanyChange={handleCompanyChange}
          countrySymbol={countrySymbol}
          currencySymbol={currencySymbol}
          onJobBlur={checkIfJobExists}
          existingJobData={existingJobData}
          isDisabled={loading}
        />
        <Button
          onClick={handleFormSubmission}
          icon={loading ? <ProgressSpinner /> : "pi pi-check"}
          label={loading ? "Saving Application..." : "Create Application"}
          className="mr-2 pr-10 pl-10"
          disabled={!isDataValid || loading}
        />
      </div>
      <Toast ref={toast} />
    </>
  );
};

export default CreateCard;
