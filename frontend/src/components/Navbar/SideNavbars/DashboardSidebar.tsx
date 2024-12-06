import Sider from "antd/es/layout/Sider";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import {
  FaBook,
  FaUserGraduate,
  FaBuilding,
  FaChalkboardUser,
  FaGear,
} from "react-icons/fa6";
import Logo from "@/public/Logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (url: string) => {
    router.push(`/dashboard${url}`);
  };

  return (
    <Sider
      width="9vh"
      className="h-screen bg-[#1D2128FF] flex flex-col justify-between"
    >
      <div className="flex justify-center items-center my-4">
        <Image alt="Logo" src={Logo} className="w-8 h-8" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex flex-col justify-center items-center space-y-3 mt-[5vh] left-0"
      >
        <div
          onClick={() => handleClick("/")}
          className={`flex relative items-center p-2 cursor-pointer ${
            pathname == "/dashboard" ? "text-[#636AE8FF]" : "text-[#565E6CFF]"
          }`}
        >
          {pathname == "/dashboard" && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
          )}
          <FaGear className="m-1" />
        </div>
        <div
          onClick={() => handleClick("/teacher")}
          className={`flex relative items-center pl-2 pr-1 py-2 cursor-pointer ${
            pathname == "/dashboard/teacher" ||
            pathname.includes("/dashboard/teacher")
              ? "text-[#636AE8FF]"
              : "text-[#565E6CFF]"
          }`}
        >
          {(pathname == "/dashboard/teacher" ||
            pathname.includes("/dashboard/teacher")) && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
          <FaChalkboardUser className="m-1" />
        </div>

        <div
          onClick={() => handleClick("/rooms")}
          className={`flex relative items-center p-2 cursor-pointer ${
            pathname == "/dashboard/rooms" ||
            pathname.includes("/dashboard/rooms")
              ? "text-[#636AE8FF]"
              : "text-[#565E6CFF]"
          }`}
        >
          {(pathname == "/dashboard/rooms" ||
            pathname.includes("/dashboard/rooms")) && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
          )}
          <FaBuilding className="m-1" />
        </div>

        <div
          onClick={() => handleClick("/courses")}
          className={`flex relative items-center p-2 cursor-pointer ${
            pathname == "/dashboard/courses" ||
            pathname.includes("/dashboard/courses")
              ? "text-[#636AE8FF]"
              : "text-[#565E6CFF]"
          }`}
        >
          {(pathname == "/dashboard/courses" ||
            pathname.includes("/dashboard/courses")) && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
          )}
          <FaBook className="m-1" />
        </div>

        <div
          onClick={() => handleClick("/section")}
          className={`flex relative items-center p-2 cursor-pointer ${
            pathname == "/dashboard/section" ||
            pathname.includes("/dashboard/section")
              ? "text-[#636AE8FF]"
              : "text-[#565E6CFF]"
          }`}
        >
          {(pathname == "/dashboard/section" ||
            pathname.includes("/dashboard/section")) && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
          )}
          <FaUserGraduate className="m-1" />
        </div>
      </motion.div>
    </Sider>
  );
};

export default DashboardSidebar;
