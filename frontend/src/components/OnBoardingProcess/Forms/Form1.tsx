import { OrganisationSchema } from "../../../types/main";
import { Input, Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import { DEPARTMENTS_OPTIONS } from "../../../../info";

const Form1 = ({
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
          What is the name of the organisation?
        </h1>
        <Input
          value={organisationDetails.name}
          onChange={(e) => {
            setOrganisationDetails((org) => {
              const new_org = { ...org };
              new_org.name = e.target.value;
              return new_org;
            });
          }}
          placeholder="XYZ University"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          Which department do you belong to?
        </h1>
        <Select
          className="w-full"
          defaultValue="All Departments"
          value={organisationDetails.dept}
          options={DEPARTMENTS_OPTIONS}
          onChange={(value) => {
            setOrganisationDetails((org) => {
              const new_org = { ...org };
              new_org.dept = value;
              return new_org;
            });
          }}
        />
      </div>
    </div>
  );
};

export default Form1;
