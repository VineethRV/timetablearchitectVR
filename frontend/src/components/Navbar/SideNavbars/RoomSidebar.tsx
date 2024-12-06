import React from "react";

import { Divider, Button, Layout } from "antd";
import {
  FaCalendar,
  FaBuildingUser,
  FaCirclePlus,
  FaClockRotateLeft,
  FaPenToSquare,
} from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const RoomsSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (label: string, url: string) => {
    router.push(`/dashboard/rooms${url}`);
  };

  return (
    <Sider className="h-screen bg-white border-r-[0.5px]">
      <div className="flex justify-left text-black-bold items-center pt-[20px] pl-[20px] space-x-2 h-[7vh]">
        <FaBuildingUser className="w-[30px] h-[40px]" />
        <span
          className="text-xl font-semibold text-[#171A1FFF]"
          style={{ fontFamily: "Archivo" }}
        >
          Rooms
        </span>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4"
        style={{ fontFamily: "Inter" }}
      >
        <div
          onClick={() => handleClick("Add a rooms", "/add")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            pathname == "/dashboard/rooms/add"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCirclePlus className="w-5 h-5" />
          <span>Add a Room</span>
          {pathname == "/dashboard/rooms/add" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick("Modify Attributes", "")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            (pathname == "/dashboard/rooms" || pathname.includes("/dashboard/rooms/edit"))
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaPenToSquare className="w-5 h-5" />
          <span>Modify Attributes</span>
          {(pathname == "/dashboard/rooms" || pathname.includes("/dashboard/rooms/edit"))&& (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4"
        style={{ fontFamily: "Inter" }}
      >
        <div
          onClick={() => handleClick("Rank Timewise", "/")}
          className={`relative flex cursor-pointer space-x-2 p-2 ${
            pathname === "/dashboard/rank-timewise"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaClockRotateLeft className="w-5 h-5" />
          <span>Rank Timewise</span>
          {pathname === "/dashboard/rank-timewise" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick("Timeslot Dependent", "/")}
          className={`relative cursor-pointer flex space-x-2 p-2 ${
            pathname === "/dashboard/timeslot-dependent"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCalendar className="w-5 h-5" />
          <span>Timeslot Dependent</span>
          {pathname === "/dashboard/timeslot-dependent" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => router.push(`/rooms/consolidated`)}
          className="mt-2 bg-[#636AE8FF] text-white"
        >
          Generate Consolidated
        </Button>
      </div>
    </Sider>
  );
};

export default RoomsSidebar;
