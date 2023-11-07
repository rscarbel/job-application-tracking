"use client";

import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { findCompanies } from "../network";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import EditIcon from "./EditIcon";
import Undo from "./Undo";

const PLACEHOLDER_USER_ID = 1;

const ReadEditCompaniesField = ({
  selectedCompany,
  onChange,
  isDisabled = false,
  onClick,
  originalValue,
  newValue,
  isReadOnly = false,
  editingClasses,
}) => {
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [company, setCompany] = useState(selectedCompany);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await findCompanies(PLACEHOLDER_USER_ID);
      setCompaniesList(response || []);
    };
    fetchCompanies();
  }, []);

  const handleInplaceClose = () => {
    onChange(company);
  };

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
      setCompany(selected);
    } else {
      setCompany({ name: e.value, companyId: "" });
    }
  };

  return (
    <div className="p-field w-full flex flex-col justify-evenly content-center items-center">
      <div className="flex w-full items-center justify-start">
        <Inplace
          closable
          closeIcon="pi pi-check w-full"
          onClose={handleInplaceClose}
          className="w-full"
          disabled={isReadOnly}
        >
          <InplaceDisplay>
            {
              <span className="text-5xl font-light text-slate-950 w-full">
                {selectedCompany.name}
              </span>
            }{" "}
            <EditIcon isVisible={!isReadOnly} />
          </InplaceDisplay>
          <InplaceContent>
            <AutoComplete
              value={company.name}
              className={`mt-1 w-full rounded focus:border-blue-500 focus:ring focus:ring-blue-200 ${editingClasses}`}
              suggestions={filteredCompanies.map((company) => company.name)}
              completeMethod={search}
              onChange={handleCompanySelectOrInputChange}
              placeholder="Company Name"
              disabled={isDisabled}
            />
          </InplaceContent>
        </Inplace>
        <Undo
          onClick={onClick}
          originalValue={originalValue}
          newValue={newValue}
          className="justify-self-start"
        />
      </div>
    </div>
  );
};

export default ReadEditCompaniesField;
