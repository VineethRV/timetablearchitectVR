import { Outlet } from "react-router-dom";
import ClassSidebar from "../../../components/Navbar/SideNavbars/ClassSidebar";

const Section = () => {
  return (
    <div className="flex h-screen">
        <div>
      <ClassSidebar />
      </div>
      <div className="w-full" >
        <Outlet />
      </div>
    </div>
  );
};

export default Section;
