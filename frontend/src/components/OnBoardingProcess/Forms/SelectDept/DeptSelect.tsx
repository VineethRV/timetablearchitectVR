import React, { Dispatch, SetStateAction } from "react";
import { Select } from "antd";
import { OrganisationSchema } from "@/app/types/main";

const OPTIONS = [
  "Aeronautical Engineering",
  "Automobile Engineering",
  "Biotechnology Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Computer Science and Engineering",
  "Computer Science and Design",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Environmental Engineering",
  "Information Science and Engineering",
  "Industrial and Production Engineering",
  "Instrumentation Technology",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Medical Electronics",
  "Mining Engineering",
  "Robotics and Automation Engineering",
  "Telecommunication Engineering",
  "Computer Science and Cybersecurity",
  "Computer Science and Data Science",
];

const DeptSelect = ({
  organisationDetails,
  setOrganisationDetails,
}: {
  organisationDetails: OrganisationSchema;
  setOrganisationDetails: Dispatch<SetStateAction<OrganisationSchema>>;
}) => {
  const filteredOptions = OPTIONS.filter((o) => !organisationDetails.depts_list.includes(o));

  return (
    <Select
      mode="multiple"
      placeholder="Select your departments"
      value={organisationDetails.depts_list}
      onChange={(e) => {
        const new_org = { ...organisationDetails };
        new_org.depts_list = e;
        setOrganisationDetails(new_org);
      }}
      style={{ width: "100%" }}
      options={filteredOptions.map((item) => ({
        value: item,
        label: item,
      }))}
    />
  );
};

export default DeptSelect;
