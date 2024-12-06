import { OrganisationSchema } from "@/app/types/main";
import { Input } from "antd";
import React, { Dispatch, SetStateAction } from "react";

const Form2 = ({
  organisationDetails,
  setOrganisationDetails,
}: {
  organisationDetails: OrganisationSchema;
  setOrganisationDetails: Dispatch<SetStateAction<OrganisationSchema>>;
}) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          For how many sections will you be creating timetables?
        </h1>
        <Input
          type="number"
          min={0}
          value={organisationDetails.sections}
          onChange={(e) => {
            setOrganisationDetails((org) => {
              const new_org = { ...org };
              new_org.sections = Number(e.target.value);
              return new_org;
            });
          }}
          placeholder=""
        />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          For how many teachers and rooms do you plan to allocate?
        </h1>
        <Input
          type="number"
          min={0}
          value={organisationDetails.teachers}
          onChange={(e) => {
            setOrganisationDetails((org) => {
              const new_org = { ...org };
              new_org.teachers = Number(e.target.value);
              return new_org;
            });
          }}
          placeholder=""
        />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          What is the total no of students in your organisation?
        </h1>
        <Input
          type="number"
          min={0}
          value={organisationDetails.students}
          onChange={(e) => {
            setOrganisationDetails((org) => {
              const new_org = { ...org };
              new_org.students = Number(e.target.value);
              return new_org;
            });
          }}
          placeholder=""
        />
      </div>
    </div>
  );
};

export default Form2;
