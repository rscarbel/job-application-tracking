"use client";

import FormFields from "../form/FormFields";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { getCountryCode, getCurrencySymbol } from "@/utils/global";
import { createCard } from "../network";
import "primereact/resources/themes/viva-light/theme.css";
import "primeicons/primeicons.css";
import { findJobTitle } from "../network";
import { ApplicationStatus, PayFrequency, WorkMode } from "@prisma/client";

const MILLISECONDS_FOR_MESSAGES = 5000;
const PLACEHOLDER_USER_ID = 1;

const TODAY = new Date().toISOString();

const defaultFormData = {
  applicationCardId: "",
  applicationBoardId: 1,
  boardId: 1,
  company: {
    companyId: "",
    name: "",
  },
  jobTitle: "",
  description: "",
  workMode: WorkMode.onsite,
  payAmount: 0,
  payFrequency: PayFrequency.hourly,
  currency: "USD",
  streetAddress: "",
  city: "",
  state: "",
  country: "United States",
  postalCode: "",
  applicationLink: "",
  applicationDate: TODAY,
  positionIndex: 0,
  notes: "",
  status: ApplicationStatus.applied,
};

const CreateCard = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [existingJobData, setExistingJobData] = useState(null);

  const toast = useRef();
  const isDataValid = formData.company.name && formData.jobTitle;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showError = (errorMessage) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: MILLISECONDS_FOR_MESSAGES,
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

  const handleFormSubmission = async () => {
    setLoading(true);
    try {
      console.log(formData);
      const result = await createCard(formData);
      const data = result.data;
      console.log(JSON.parse(data));

      // window.location.href = "/application-board/board";
    } catch (error) {
      showError(error.message);
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
