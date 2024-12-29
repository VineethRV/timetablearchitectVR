import { Divider, Layout, Select, SliderSingleProps, Slider } from "antd";
import { FaCirclePlus, FaPenToSquare, FaCircleMinus } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";
import { semesterOptions } from "../../../components/semester/semester";
import { useEffect, useState } from "react";

const { Sider } = Layout;

const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
  value
) => `${value}%`;

const ClassSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (url: string) => {
    navigate(`/dashboard/section${url}`);
  };

  // State to track the selected semester
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Fetch semester value from localStorage on component load
    const storedSemester = localStorage.getItem("semester");
    if (storedSemester) {
      setSelectedSemester(Number(storedSemester)); // Convert to number
    }
  }, []);

  const handleSemesterChange = (value: number) => {
    setSelectedSemester(value);
    localStorage.setItem("semester", value.toString()); // Save to localStorage
  };

  return (
    <Sider className="h-screen bg-white border-r-[0.5px] font-sans">
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
      <div className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4">
        <div
          onClick={() => handleClick("/add")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            pathname === "/dashboard/section/add"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCirclePlus className="w-5 h-5" />
          <span>Add a Section</span>
          {pathname === "/dashboard/section/add" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick("")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            pathname === "/dashboard/section"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaPenToSquare className="w-5 h-5" />
          <span>Modify Section</span>
          {pathname === "/dashboard/section" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick("/deallocate")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            pathname === "/dashboard/section/deallocate"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCircleMinus className="w-5 h-5" />
          <span>Deallocate Section</span>
          {pathname === "/dashboard/section/deallocate" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex justify-center w-full items-center h-[10vh]">
        <Select
          options={semesterOptions}
          className="font-normal"
          value={selectedSemester} // Default value from localStorage
          onChange={handleSemesterChange} // Update state and localStorage on change
          style={{
            width: "80%"
          }}
        />
      </div>
      <Divider />
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
