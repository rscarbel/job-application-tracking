import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { STYLE_CLASSES } from "@/utils/global";
import { payFrequencyOptions } from "../board/utils";
import CountriesField from "./CountriesField";
import CompaniesField from "./CompaniesField";
import SameJobMessage from "./SameJobMessage";

const FormFields = ({
  company,
  jobTitle,
  jobDescription,
  workMode,
  payAmount,
  payFrequency,
  streetAddress,
  city,
  state,
  country,
  postalCode,
  applicationLink,
  applicationDate,
  notes,
  status,
  onInputChange,
  onCountryChange,
  onCompanyChange,
  onJobBlur,
  existingJobData,
  countrySymbol,
  currencySymbol,
  isDisabled = false,
}) => {
  const companyName = company?.name;
  const companyId = company?.companyId;

  const previousBoardName =
    existingJobData?.lastApplicationToJobInOtherBoard?.boardName;
  const previousBoardDate =
    existingJobData?.lastApplicationToJobInOtherBoard?.date;

  const previousApplicationDateOnThisBoard =
    existingJobData?.lastApplicationToJobInThisBoard;

  return (
    <div className="p-fluid">
      <div className="p-field">
        <CompaniesField
          selectedCompany={{
            name: companyName || undefined,
            companyId: companyId || undefined,
          }}
          onChange={onCompanyChange}
          isDisabled={isDisabled}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8 flex items-center" htmlFor="jobTitle">
          Job Title{" "}
          <SameJobMessage
            previousApplicationDateOnThisBoard={
              previousApplicationDateOnThisBoard
            }
            companyName={companyName}
            previousBoardName={previousBoardName}
            previousBoardDate={previousBoardDate}
            jobTitle={jobTitle}
          />
        </label>
        <InputText
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          id="jobTitle"
          name="jobTitle"
          value={jobTitle}
          onBlur={onJobBlur}
          onChange={onInputChange}
          disabled={isDisabled}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8" htmlFor="jobDescription">
          Job Description
        </label>
        <InputTextarea
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          id="jobDescription"
          name="jobDescription"
          value={jobDescription}
          onChange={onInputChange}
          disabled={isDisabled}
          rows={5}
          cols={30}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8" htmlFor="pay">
          Job pay
        </label>
        <small id={`currency-${countrySymbol.toLowerCase()}-help`}>
          * If the job posting is a pay range, enter the pay you think you will
          get within that range.
        </small>
        <div className="flex items-center">
          <InputNumber
            inputId={`currency-${countrySymbol.toLowerCase()}`}
            name="payAmount"
            value={payAmount || 0}
            className={`flex-1 mr-2`}
            onValueChange={onInputChange}
            placeholder="0.00"
            mode="currency"
            currency={currencySymbol}
            locale={`en-${countrySymbol}`}
            disabled={isDisabled}
          />
          <Dropdown
            id="payFrequency"
            name="payFrequency"
            value={payFrequency}
            options={payFrequencyOptions}
            onChange={onInputChange}
            placeholder="Frequency"
            className="flex-1"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="p-field mb-4">
        <label className="block mt-8" htmlFor="workMode">
          Work mode
        </label>
        <Dropdown
          id="workMode"
          name="workMode"
          value={workMode}
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          options={["remote", "onsite", "hybrid"]}
          onChange={onInputChange}
          placeholder="Select a Status"
          disabled={isDisabled}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8" htmlFor="streetAddress">
          Street Address
        </label>
        <InputText
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          id="streetAddress"
          name="streetAddress"
          value={streetAddress}
          onChange={onInputChange}
          disabled={isDisabled}
        />
      </div>

      <div className="flex items-center">
        <div className="p-field flex-1 mr-2">
          <label className="block mt-8" htmlFor="city">
            City
          </label>
          <InputText
            className={STYLE_CLASSES.FORM_BASIC_INPUT}
            id="city"
            name="city"
            value={city}
            onChange={onInputChange}
            disabled={isDisabled}
          />
        </div>

        <div className="p-field flex-1">
          <label className="block mt-8" htmlFor="state">
            State
          </label>
          <InputText
            className={STYLE_CLASSES.FORM_BASIC_INPUT}
            id="state"
            name="state"
            value={state}
            onChange={onInputChange}
            disabled={isDisabled}
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="p-field flex-1 mr-2">
          <label className="block mt-8" htmlFor="postalCode">
            Postal Code
          </label>
          <InputText
            className={STYLE_CLASSES.FORM_BASIC_INPUT}
            id="postalCode"
            name="postalCode"
            value={postalCode}
            onChange={onInputChange}
            disabled={isDisabled}
          />
        </div>

        <CountriesField
          selectedCountry={country}
          onChange={onCountryChange}
          isDisabled={isDisabled}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8" htmlFor="applicationLink">
          Application Link
        </label>
        <InputText
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          id="applicationLink"
          name="applicationLink"
          value={applicationLink}
          onChange={onInputChange}
          disabled={isDisabled}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8" htmlFor="applicationDate">
          Application Date
        </label>
        <Calendar
          id="applicationDate"
          name="applicationDate"
          className="mt-1 w-full shadow-sm border-gray-300 rounded  focus:border-blue-500 focus:ring focus:ring-blue-200"
          value={new Date(applicationDate || Date.now())}
          onChange={onInputChange}
          dateFormat="mm/dd/yy"
          disabled={isDisabled}
        />
      </div>

      <div className="p-field">
        <label className="block mt-8" htmlFor="notes">
          Notes
        </label>
        <InputTextarea
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          id="notes"
          name="notes"
          value={notes}
          onChange={onInputChange}
          rows={5}
          cols={30}
          disabled={isDisabled}
        />
      </div>

      <div className="p-field mb-4">
        <label className="block mt-8" htmlFor="status">
          Status
        </label>
        <Dropdown
          id="status"
          name="status"
          value={status}
          className={STYLE_CLASSES.FORM_BASIC_INPUT}
          options={[
            "applied",
            "interview",
            "offer",
            "rejected",
            "accepted",
            "passed",
          ]}
          onChange={onInputChange}
          placeholder="Select a Status"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default FormFields;
