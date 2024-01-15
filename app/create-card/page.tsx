"use client";

import FormFields from "../form/FormFields";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { NewApplicationFormData } from "../types";

const TODAY: string = new Date().toISOString();

type ChangeEvent = {
  target: {
    name: string;
    value: any;
  };
};

type Company = {
  companyId: number;
  name: string;
};

const defaultFormData: NewApplicationFormData = {
  groupId: 1,
  company: {
    companyId: undefined,
    name: "",
  },
  jobId: undefined,
  jobTitle: "",
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
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  const [formData, setFormData] =
    useState<NewApplicationFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingJobData, setExistingJobData] = useState<any>(null);

  const toast = useRef<Toast>(null);
  const isDataValid: boolean = Boolean(
    formData?.company?.name && formData?.jobTitle
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
      jobTitle: formData.jobTitle,
      companyName: formData.company.name,
      groupId: formData.groupId,
    });
    setExistingJobData(jobData);
  };

  const handleCountryChange = (country: string) => {
    const currencySymbol = getCurrencySymbol(country);
    const countryData = { country: country, currency: currencySymbol };
    setFormData({ ...formData, ...countryData });
  };

  const handleCompanyChange = (company: Company) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        companyId: company.companyId,
        name: company.name,
      },
    }));
  };

  const countrySymbol = getCountryCode(formData.country || "United States");
  const currencySymbol = getCurrencySymbol(formData.country || "United States");

  const handleFormSubmission = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createCard(formData);
      const data = result?.data;
      if (result?.response.status === 200) {
        router.push("/board");
      } else {
        showError(data?.error || "There was a problem with the submission.");
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
          {...(formData as any)}
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
          // @ts-ignore - PrimeReact types are not up to date
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
