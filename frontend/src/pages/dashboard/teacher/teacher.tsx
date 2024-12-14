import { Outlet } from "react-router-dom";
import TeachersSidebar from "../../../components/Navbar/SideNavbars/TeachersSidebar";

const Teacher = () => {
  return (
    <div className="flex h-screen">
        <div>
      <TeachersSidebar />
      </div>
      <div className="w-full" >
        <Outlet />
      </div>
    </div>
  );
};

export default Teacher;
