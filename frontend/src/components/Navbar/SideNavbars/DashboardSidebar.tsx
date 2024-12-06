import { Layout } from "antd";
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
import { useLocation, useNavigate } from "react-router-dom";  // Using React Router

const DashboardSidebar = () => {
  const location = useLocation();  // Correctly using useLocation from React Router
  const navigate = useNavigate();  // Using useNavigate for programmatic navigation

  const handleClick = (url) => {
    navigate(`/dashboard${url}`);
  };

  return (
    <Layout>
      <div className="w-full h-screen flex">
        <Sider
          width="9vh"  // Setting a fixed width for the sidebar
          className="h-screen bg-[#1D2128FF] flex flex-col justify-between"
        >
          <div className="flex justify-center items-center my-4">
            <img src={Logo} alt="Signin2" className="w-8 h-8" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="flex flex-col justify-center items-center space-y-3 mt-[5vh]"
          >
            <div
              onClick={() => handleClick("")}
              className={`flex relative items-center p-2 cursor-pointer ${
                location.pathname === "/dashboard" ? "text-[#636AE8FF]" : "text-[#565E6CFF]"
              }`}
            >
              {location.pathname === "/dashboard" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
              )}
              <FaGear className="m-1" />
            </div>
            <div
              onClick={() => handleClick("/teachers")}
              className={`flex relative items-center p-2 cursor-pointer ${
                ((location.pathname === "/dashboard/teachers") || (location.pathname.includes("/dashboard/teachers"))) ? "text-[#636AE8FF]" : "text-[#565E6CFF]"
              }`}
            >
              {((location.pathname === "/dashboard/teachers") || (location.pathname.includes("/dashboard/teachers"))) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
              )}
              <FaChalkboardUser className="m-1" />
            </div>
            <div
              onClick={() => handleClick("/rooms")}
              className={`flex relative items-center p-2 cursor-pointer ${
                location.pathname === "/dashboard/rooms" ? "text-[#636AE8FF]" : "text-[#565E6CFF]"
              }`}
            >
              {location.pathname === "/dashboard/rooms" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
              )}
              <FaBuilding className="m-1" />
            </div>
            <div
              onClick={() => handleClick("/courses")}
              className={`flex relative items-center p-2 cursor-pointer ${
                location.pathname === "/dashboard/courses" ? "text-[#636AE8FF]" : "text-[#565E6CFF]"
              }`}
            >
              {location.pathname === "/dashboard/courses" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
              )}
              <FaBook className="m-1" />
            </div>
            <div
              onClick={() => handleClick("/section")}
              className={`flex relative items-center p-2 cursor-pointer ${
                location.pathname === "/dashboard/section" ? "text-[#636AE8FF]" : "text-[#565E6CFF]"
              }`}
            >
              {location.pathname === "/dashboard/section" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[80%] bg-[#636AE8FF] rounded-full"></div>
              )}
              <FaUserGraduate className="m-1" />
            </div>
          </motion.div>
        </Sider>
      </div>
    </Layout>
  );
};

export default DashboardSidebar;
