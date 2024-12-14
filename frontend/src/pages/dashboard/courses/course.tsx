import { Outlet } from "react-router-dom";
import CourseSidebar from "../../../components/Navbar/SideNavbars/CourseSidebar";

const Course = () => {
  return (
    <div className="flex h-screen">
        <div>
      <CourseSidebar />
      </div>
      <div className="w-full" >
        <Outlet />
      </div>
    </div>
  );
};

export default Course;
