import React, { useState,useEffect } from "react";

import { Divider,Layout, Select } from "antd";
import {
    FaBasketShopping,
    FaFlask,
    FaBook,
    FaCirclePlus,
    FaPenToSquare,
  } from "react-icons/fa6"
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { semesterOptions } from "@/app/components/semester/semester";

const { Sider } = Layout;

const CoursesSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selected,setSelected]=useState("/core-courses")

  const isCoreCourseSelected =  pathname === "/dashboard/courses/core-courses" || pathname === "/dashboard/courses/core-courses/add";
  const isElectiveSelected =  pathname === "/dashboard/courses/electives" || pathname === "/dashboard/courses/electives/add";
  const isLabSelected =  pathname === "/dashboard/courses/labs" || pathname === "/dashboard/courses/labs/add";

    
  const handleClick1 = (url: string) => {
    setSelected(url);
    router.push(`/dashboard/courses${url}`);
  };

  const handleClick2=(url:string)=>{
    router.push(`/dashboard/courses${selected}${url}`);
  };
  useEffect(() => {
    let path = window.location.pathname;

    path = path.replace(/^\/dashboard\/courses/, "").replace(/\/add$/, "");
    
    setSelected(path || "/");
  }, []);

  return (
    <Sider className="h-screen bg-white border-r-[0.5px]">
      <div className="flex justify-left text-black-bold items-center pt-[20px] pl-[20px] space-x-2 h-[7vh]">
      <FaBook className="w-[30px] h-[40px]" />
        <span
          className="text-xl font-semibold text-[#171A1FFF]"
          style={{ fontFamily: "Archivo" }}
        >
          Courses
        </span>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4"
        style={{ fontFamily: "Inter" }}
      >
        <div
          onClick={() => handleClick1( "/electives")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            isElectiveSelected
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaBasketShopping className="w-5 h-5" />
          <span>Electives</span>
          {isElectiveSelected && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick1("/labs")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            isLabSelected
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaFlask className="w-5 h-5" />
          <span>Labs</span>
          {isLabSelected && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
        <div
          onClick={() => handleClick1("/core-courses")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            isCoreCourseSelected
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaBook className="w-5 h-5" />
          <span>Core Courses</span>
          { isCoreCourseSelected && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex justify-center items-center h-[7vh]">
           <Select
        placeholder="Select a semester"
        options={semesterOptions}
        className="font-normal"
      />
      </div>
      <Divider/>
      <div
        className="flex flex-col items-left justify-center h-[15vh] space-y-2 font-medium text-[#565E6C] pl-4"
        style={{ fontFamily: "Inter" }}
      >
        <div
          onClick={() => handleClick2("/add")}
          className={`relative flex cursor-pointer space-x-2 p-2 ${
            pathname ===  `/dashboard/courses${selected}/add`
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCirclePlus className="w-5 h-5" />
          <span>Add a Course</span>
          {pathname ===  `/dashboard/courses${selected}/add` && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick2( "/")}
          className={`relative cursor-pointer flex space-x-2 p-2 ${
            pathname === `/dashboard/courses${selected}`
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaPenToSquare className="w-5 h-5" />
          <span>Modify Course</span>
          {pathname ===  `/dashboard/courses${selected}` && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default CoursesSidebar;
