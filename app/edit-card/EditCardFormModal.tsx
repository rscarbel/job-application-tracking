"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { getCountryCode, getCurrencySymbol } from "@/utils/global";
import { findJobTitle } from "../network";
import FormFields from "../form/FormFields";
import { IndividualFormattedCardInterface } from "@/services/FormattedCardInterface";

interface ExistingJobDataInterface {
  jobTitle: string;
  lastApplicationToJobInThisBoard: string;
  lastApplicationToJobInOtherBoard: {
    date: string;
    boardName: string;
  };
}

interface EditCardFormModalProps {
  visible: boolean;
  onHide: () => void;
  cardData: IndividualFormattedCardInterface;
  onSaveChanges: (formData: IndividualFormattedCardInterface) => void;
  onDelete: (applicationId: number) => void;
}

const EditCardFormModal = ({
  visible,
  onHide,
  cardData,
  onSaveChanges,
  onDelete,
}: EditCardFormModalProps) => {
  const [formData, setFormData] = useState(cardData);
  const [existingJobData, setExistingJobData] =
    useState<ExistingJobDataInterface | null>(null);
  const [initialJobTitle, setInitialJobTitle] = useState<string | null>(null);

  const hasDataChanged = JSON.stringify(cardData) !== JSON.stringify(formData);
  const isDataValid = formData.company?.name && formData.jobTitle;
  const callToActionIcon =
    isDataValid && hasDataChanged ? "pi pi-check" : "pi pi-times";
  const callToActionStyle =
    isDataValid && hasDataChanged ? "success" : "secondary";

  useEffect(() => {
    setFormData(cardData);
    setInitialJobTitle(cardData.jobTitle);
  }, [cardData]);

  if (!cardData.company.name) return null;

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const checkIfJobExists = async () => {
    if (formData.jobTitle === initialJobTitle) return;

    const jobData = await findJobTitle({
      jobTitle: formData.jobTitle,
      companyName: formData.company.name,
      groupId: formData.groupId,
    });

    if (!jobData) return;
    setExistingJobData(jobData);
  };

  const handleCountryChange = (country: string) => {
    const currencySymbol = getCurrencySymbol(country);
    const countryData = { country: country, currency: currencySymbol };
    setFormData({ ...formData, ...countryData });
  };
  const handleCompanyChange = (name: string, companyId: number) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        companyId: companyId,
        name: name,
      },
    }));
  };

  const shutdownModal = () => {
    onHide();
  };

  const countrySymbol = getCountryCode(formData.country);
  const currencySymbol = getCurrencySymbol(formData.country);
  const isCanceling = !hasDataChanged || !isDataValid;
  const primaryActionText = isCanceling ? "Close" : "Save Changes";

  const handleHide = (confirmChanges = true) => {
    if (hasDataChanged && confirmChanges) {
      confirmDialog({
        content: null,
        message: "Would you like to save your changes?",
        header: "Save Changes",
        icon: "",
        acceptClassName: "p-button-success",
        accept: () => {
          onSaveChanges(formData);
          shutdownModal();
        },
        reject: () => {
          shutdownModal();
        },
      });
    } else {
      shutdownModal();
    }
  };

  const handleFormSubmission = () => {
    if (isCanceling) {
      handleHide(false);
    } else {
      onSaveChanges(formData);
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      content: null,
      message: "Are you sure you want to delete this job application?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => onDelete(cardData.applicationId),
    });
  };

  return (
    <Dialog
      content={null}
      className="lg:w-1/2 md:w-2/3 sm:w-full"
      visible={visible}
      onHide={handleHide}
      header="View Application"
      dismissableMask
    >
      <FormFields
        {...formData}
        onInputChange={handleInputChange}
        onCountryChange={handleCountryChange}
        onCompanyChange={handleCompanyChange}
        countrySymbol={countrySymbol}
        currencySymbol={currencySymbol}
        onJobBlur={checkIfJobExists}
        existingJobData={existingJobData}
      />
      <ConfirmDialog content={null} />
      <div className="flex flex-wrap gap-2 justify-content-center align-items-center">
        <Button
          onClick={handleFormSubmission}
          severity={callToActionStyle}
          icon={callToActionIcon}
          label={primaryActionText}
          className="mr-2 pr-10 pl-10"
        />
        <Button
          className="p-button-danger p-button-outlined p-button p-component"
          onClick={confirmDelete}
          icon="pi pi-times"
          label="Delete"
        />
      </div>
    </Dialog>
  );
};

export default EditCardFormModal;
