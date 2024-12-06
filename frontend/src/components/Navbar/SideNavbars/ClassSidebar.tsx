import React from "react";

import { Divider,Layout, Select, SliderSingleProps,Slider } from "antd";
import {
  FaCirclePlus,
  FaPenToSquare,
  FaCircleMinus,
} from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { semesterOptions } from "@/app/components/semester/semester";
const { Sider } = Layout;

const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}%`;

const ClassSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (label: string, url: string) => {
    router.push(`/dashboard/section${url}`);
  };

  return (
    <Sider className="h-screen bg-white border-r-[0.5px]">
      <div className="flex justify-left text-black-bold items-center pt-[20px] pl-[20px] space-x-2 h-[7vh]">
      <SiGoogleclassroom className="w-[30px] h-[40px]" />
        <span
          className="text-xl font-semibold text-[#171A1FFF]"
          style={{ fontFamily: "Archivo" }}
        >
          Section
        </span>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4"
        style={{ fontFamily: "Inter" }}
      >
        <div
          onClick={() => handleClick("Add a Section", "/add")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            pathname == "/dashboard/section/add"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCirclePlus className="w-5 h-5" />
          <span>Add a Section</span>
          {pathname == "/dashboard/section/add" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick("Modify Section", "/")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            pathname == "/dashboard/section"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaPenToSquare className="w-5 h-5" />
          <span>Modify Section</span>
          {pathname == "/dashboard/section" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick("Deallocate Section", "/deallocate")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            pathname == "/dashboard/section/deallocate"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCircleMinus className="w-5 h-5" />
          <span>Deallocate Section</span>
          {pathname == "/dashboard/section/deallocate" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex justify-center items-center h-[10vh]">
           <Select
        placeholder="Select a semester"
        options={semesterOptions}
        className="font-normal"
      />
      </div>
      <Divider/>
      <div className="flex flex-col justify-center m-4">
      <Slider tooltip={{ formatter }} />
      <Slider tooltip={{ formatter }} />
      <Slider tooltip={{ formatter }} />
      <Slider tooltip={{ formatter }} />
      </div>
    </Sider>
  );
};

export default ClassSidebar;
