"use client";

import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import countriesList from "@/lib/data/countriesList";

const CountriesField = ({ selectedCountry, onChange, isDisabled = false }) => {
  const [filteredCountries, setFilteredCountries] = useState(null);

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
      <label className="block mt-8" htmlFor="country">
        Country
      </label>
      <AutoComplete
        value={selectedCountry}
        className="mt-1 w-full rounded  focus:border-blue-500 focus:ring focus:ring-blue-200"
        suggestions={filteredCountries}
        completeMethod={search}
        onChange={(e) => onChange(e.value)}
        placeholder="United States"
        disabled={isDisabled}
      />
    </div>
  );
};

export default CountriesField;
