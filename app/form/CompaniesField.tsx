"use client";

import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { findCompanies } from "../network";

interface CompanyInterface {
  companyId: number;
  name: string;
}

interface CompaniesFieldProps {
  selectedCompany: CompanyInterface;
  onChange: (name: string, companyId: number) => void;
  isDisabled?: boolean;
}

type SearchEvent = {
  query: string;
};

const CompaniesField = ({
  selectedCompany,
  onChange,
  isDisabled = false,
}: CompaniesFieldProps) => {
  const [filteredCompanies, setFilteredCompanies] = useState<
    CompanyInterface[]
  >([]);
  const [companiesList, setCompaniesList] = useState<CompanyInterface[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await findCompanies();
      setCompaniesList(response || []);
    };
    fetchCompanies();
  }, []);

  const search = (event: SearchEvent) => {
    const query = event.query.toLowerCase();
    const filtered = companiesList.filter((company) =>
      company.name.toLowerCase().includes(query)
    );
    setFilteredCompanies(filtered);
  };

  const handleCompanySelectOrInputChange = (e: { value: string }) => {
    const selected = companiesList.find((company) => company.name === e.value);

    if (selected) {
      onChange(selected.name, selected.companyId);
    } else {
      onChange(e.value, selectedCompany.companyId);
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
