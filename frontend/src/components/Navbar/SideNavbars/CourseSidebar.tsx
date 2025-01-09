import { useState, useEffect } from "react";
import { Divider, Layout, Select } from "antd";
import {
  FaBasketShopping,
  FaFlask,
  FaBook,
  FaCirclePlus,
  FaPenToSquare,
} from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { semesterOptions } from "../../../components/semester/semester";

const { Sider } = Layout;

const CoursesSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selected, setSelected] = useState("/core-courses");
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(undefined);

  const isCoreCourseSelected =pathname.includes("/dashboard/courses/core-courses");
  const isElectiveSelected =pathname.includes("/dashboard/courses/electives" )
  const isLabSelected =pathname.includes("/dashboard/courses/labs" )

  const handleClick1 = (url: string) => {
    setSelected(url);
    navigate(`/dashboard/courses${url}`);
  };

  const handleClick2 = (url: string) => {
    navigate(`/dashboard/courses${selected}${url}`);
  };

  useEffect(() => {
    let path = window.location.pathname;
    path = path.replace(/^\/dashboard\/courses/, "").replace(/\/add$/, "");
    setSelected(path || "/");

    // Fetch semester value from localStorage
    const storedSemester = localStorage.getItem("semester");
    if (storedSemester) {
      setSelectedSemester(Number(storedSemester)); // Convert to number and set as selected
    }
  }, []);

  const handleSemesterChange = (value: number) => {
    setSelectedSemester(value);
    localStorage.setItem("semester", value.toString()); // Update localStorage
    // should be done using state variables 
    window.location.reload(); // Refresh the page
  };

  return (
    <Sider className="h-screen bg-white border-r-[0.5px] font-sans">
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
      <div className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4">
        <div
          onClick={() => handleClick1("/electives")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            isElectiveSelected ? "text-[#636AE8FF] font-bold" : "text-[#565E6C]"
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
            isLabSelected ? "text-[#636AE8FF] font-bold" : "text-[#565E6C]"
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
          {isCoreCourseSelected && (
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
          value={selectedSemester} // Default value from localStorage
          onChange={handleSemesterChange} // Update state and localStorage on change
          style={{ width: "80%" }}
        />
      </div>
      <Divider />
      <div className="flex flex-col items-left justify-center h-[15vh] space-y-2 font-medium text-[#565E6C] pl-4">
        <div
          onClick={() => handleClick2("/add")}
          className={`relative flex cursor-pointer space-x-2 p-2 ${
            pathname === `/dashboard/courses${selected}/add`
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCirclePlus className="w-5 h-5" />
          <span>Add a Course</span>
          {pathname === `/dashboard/courses${selected}/add` && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick2("")}
          className={`relative cursor-pointer flex space-x-2 p-2 ${
            pathname === `/dashboard/courses${selected}`||pathname.includes(`/dashboard/courses${selected}/edit`)
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaPenToSquare className="w-5 h-5" />
          <span>Modify Course</span>
          {(pathname === `/dashboard/courses${selected}`||pathname.includes(`/dashboard/courses${selected}/edit`)) && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default CoursesSidebar;
