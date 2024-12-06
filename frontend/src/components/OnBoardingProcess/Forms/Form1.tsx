import { OrganisationSchema } from "@/app/types/main";
import { Input } from "antd";
import React, { Dispatch, SetStateAction } from "react";

const Form1 = ({organisationDetails,setOrganisationDetails}:{
  organisationDetails: OrganisationSchema,
  setOrganisationDetails: Dispatch<SetStateAction<OrganisationSchema>>
}) => {

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          What is the name of the organisation?
        </h1>
        <Input value={organisationDetails.name} onChange={(e)=>{
          setOrganisationDetails((org)=>{
            const new_org = {...org}
            new_org.name = e.target.value
            return new_org;
          })
        }} placeholder="John Doe" />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          What is your designation in organisation?
        </h1>
        <Input value={organisationDetails.designation} onChange={(e)=>{
          setOrganisationDetails((org)=>{
            const new_org = {...org}
            new_org.designation = e.target.value
            return new_org;
          })
        }} placeholder="Assistant Professor" />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-sm">
          Which department do you belong to?
        </h1>
        <Input value={organisationDetails.dept} onChange={(e)=>{
          setOrganisationDetails((org)=>{
            const new_org = {...org}
            new_org.dept = e.target.value
            return new_org;
          })
        }} placeholder="CSE" />
      </div>
    </div>
  );
};

export default Form1;
