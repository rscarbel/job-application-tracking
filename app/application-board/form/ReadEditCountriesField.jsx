"use client";

import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import countriesList from "@/lib/data/countriesList";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import EditIcon from "./EditIcon";

const ReadEditCountriesField = ({
  selectedCountry,
  onChange,
  isDisabled = false,
  isReadOnly = false,
  editingClasses,
}) => {
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [country, setCountry] = useState(selectedCountry);

  const handleInplaceClose = () => {
    onChange(country);
  };

  const search = (event) => {
    let filtered;

    if (!event.query.trim().length) {
      filtered = [...countriesList];
    } else {
      filtered = countriesList.filter((country) => {
        return country.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }

    setFilteredCountries(filtered);
  };

  return (
    <div className="p-field flex-1">
      <label
        className="block mb-2 flex items-center text-xl text-slate-600"
        htmlFor="country"
      >
        Country
      </label>
      <Inplace
        closable
        closeIcon="pi pi-check"
        onClose={() => handleInplaceClose()}
        disabled={isReadOnly}
      >
        <InplaceDisplay>
          {selectedCountry} <EditIcon isVisible={!isReadOnly} />
        </InplaceDisplay>
        <InplaceContent>
          <AutoComplete
            value={country}
            className={`mt-1 w-full rounded  focus:border-blue-500 focus:ring focus:ring-blue-200 ${editingClasses}`}
            suggestions={filteredCountries}
            completeMethod={search}
            onChange={(e) => setCountry(e.value)}
            placeholder="United States"
            disabled={isDisabled}
          />
        </InplaceContent>
      </Inplace>
    </div>
  );
};

export default ReadEditCountriesField;
