"use client";

import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { findCompanies } from "../network";

const PLACEHOLDER_USER_ID = 1;

const CompaniesField = ({ selectedCompany, onChange, isDisabled = false }) => {
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await findCompanies(PLACEHOLDER_USER_ID);
      setCompaniesList(response || []);
    };
    fetchCompanies();
  }, []);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const filtered = companiesList.filter((company) =>
      company.name.toLowerCase().includes(query)
    );
    setFilteredCompanies(filtered);
  };

  const handleCompanySelectOrInputChange = (e) => {
    const selected = companiesList.find((company) => company.name === e.value);

    if (selected) {
      onChange(selected);
    } else {
      onChange({ name: e.value, companyId: null });
    }
  };

  return (
    <div className="p-field flex-1">
      <label className="block mt-8" htmlFor="company">
        Company
      </label>
      <AutoComplete
        value={selectedCompany ? selectedCompany.name : ""}
        className="mt-1 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
        suggestions={filteredCompanies.map((company) => company.name)}
        completeMethod={search}
        onChange={handleCompanySelectOrInputChange}
        placeholder="Company Name"
        disabled={isDisabled}
      />
    </div>
  );
};

export default CompaniesField;
