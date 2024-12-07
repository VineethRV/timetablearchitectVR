import { Outlet } from "react-router-dom"; // For rendering nested routes
import DashboardSidebar from "../components/Navbar/SideNavbars/DashboardSidebar"; // Sidebar component

const DashboardWithSidebar = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[9vh]">
      <DashboardSidebar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardWithSidebar;
