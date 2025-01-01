import Sider from "antd/es/layout/Sider";
import { motion } from "framer-motion";
import {
  FaBook,
  FaUserGraduate,
  FaBuilding,
  FaChalkboardUser,
  FaGear,
} from "react-icons/fa6";
import Logo from "/Logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { toast } from "sonner";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function logoutHandler() {
    localStorage.setItem("token", "");
    navigate("/signin");
    toast.success("Logged out successfully !!");
  }

  const handleClick = (url: string) => {
    navigate(`/dashboard${url}`);
  };

  return (
    <Sider
      width="9vh"
      className="h-screen bg-[#1D2128FF] flex flex-col justify-between"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-center items-center my-4">
            <img alt="Logo" src={Logo} className="w-8 h-8" />
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
              onClick={() => handleClick("")}
              className={`flex relative items-center p-2 cursor-pointer ${
                pathname == "/dashboard"
                  ? "text-[#636AE8FF]"
                  : "text-[#565E6CFF]"
              }`}
            >
              {pathname == "/dashboard" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
              )}
              <FaGear className="m-1" />
            </div>
            <div
              onClick={() => handleClick("/teachers")}
              className={`flex relative items-center pl-2 pr-1 py-2 cursor-pointer ${
                pathname == "/dashboard/teachers" ||
                pathname.includes("/dashboard/teachers")
                  ? "text-[#636AE8FF]"
                  : "text-[#565E6CFF]"
              }`}
            >
              {(pathname == "/dashboard/teachers" ||
                pathname.includes("/dashboard/teachers")) && (
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
              onClick={() => handleClick("/courses/core-courses")}
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
        </div>
        <div className="flex justify-center py-4">
          <IoLogOut
            onClick={logoutHandler}
            fontSize={22}
            className="text-[#565E6CFF] cursor-pointer"
          />
        </div>
      </div>
    </Sider>
  );
};

export default DashboardSidebar;
