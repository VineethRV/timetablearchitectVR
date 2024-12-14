import { Outlet, Route, Routes, useNavigate } from "react-router-dom"; // For rendering nested routes
import DashboardSidebar from "../../components/Navbar/SideNavbars/DashboardSidebar.tsx"; // Sidebar component
import axios from "axios";
import { BACKEND_URL } from "../../../config.ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading/Loading.tsx";
import AdminPanel from "./adminpanel.tsx";
import Teacher from "./teacher/teacher.tsx";
import TeacherPage from "./teacher/teacherdisplay.tsx";
import AddTeacherpage from "./teacher/addteacher.tsx";
import EditTeacherpage from "./teacher/editteacher.tsx";
import Room from "./room/room.tsx";
import RoomPage from "./room/roomdisplay.tsx";
import AddRoomPage from "./room/addroom.tsx";
import EditRoomPage from "./room/editroom.tsx";
import Course from "./courses/course.tsx";
import AddCoursepage from "./courses/corecourse/addcorecourse.tsx";
import AddSectionPage from "./section/addsection.tsx";
import Section from "./section/section.tsx";
import AddElectivepage from "./courses/electives/addelective.tsx";
import Electivecourse from "./courses/electives/electivesdisplay.tsx";
import AddLabpage from "./courses/lab/addlab.tsx";
import Labcourse from "./courses/lab/labdisplay";
import Corecourse from "./courses/corecourse/corecoursedisplay";

const DashboardWithSidebar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .post(
        BACKEND_URL + "/checkAuthentication",
        {},
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.data.status;
        
        if (status != 200) {
          navigate("/signin");
          toast.error("User not authenticated !!");
        } else {
          axios
            .get(BACKEND_URL + "/user/check_org", {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then(({ data }) => {
              
              if (!data.result) {
                navigate("/onboard");
                toast.info("Please complete onboarding process");
              }

        setLoading(false);
      });
  }, []);

  if (loading) <Loading />;

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
export default function Dashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardWithSidebar />}>
        <Route index element={<AdminPanel />} />
        <Route path="teachers" element={<Teacher />}>
          <Route index element={<TeacherPage />} />
          <Route path="add" element={<AddTeacherpage />} />
          <Route
            path="edit/:oldname/:olddepartment"
            element={<EditTeacherpage />}
          />
        </Route>
        <Route path="rooms" element={<Room />}>
          <Route index element={<RoomPage />} />
          <Route path="add" element={<AddRoomPage />} />
          <Route
            path="edit/:oldname/:olddepartment"
            element={<EditRoomPage />}
          />
        </Route>
        <Route path="courses" element={<Course />}>
          <Route path="core-courses" element={<Corecourse />} />
          <Route path="core-courses/add" element={<AddCoursepage />} />
          <Route path="labs" element={<Labcourse />} />
          <Route path="labs/add" element={<AddLabpage />} />
          <Route path="electives" element={<Electivecourse />} />
          <Route path="electives/add" element={<AddElectivepage />} />
        </Route>
        <Route path="section" element={<Section />}>
          <Route path="add" element={<AddSectionPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
