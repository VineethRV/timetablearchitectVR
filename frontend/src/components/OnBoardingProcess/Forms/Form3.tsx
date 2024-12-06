"use client";
import React, { Dispatch, SetStateAction } from "react";
import DeptSelect from "./SelectDept/DeptSelect";
import { OrganisationSchema } from "@/app/types/main";

const Form3 = ({
  organisationDetails,
  setOrganisationDetails,
}: {
  organisationDetails: OrganisationSchema;
  setOrganisationDetails: Dispatch<SetStateAction<OrganisationSchema>>;
}) => {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="font-bold text-sm">
        Select the departments in your organizations
      </h1>
      <DeptSelect setOrganisationDetails={setOrganisationDetails} organisationDetails={organisationDetails} />
    </div>
  );
};

export default Form3;
