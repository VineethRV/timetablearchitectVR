import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Signin from "./pages/SignIn";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard/dashboard";
import Teacher from "./pages/dashboard/teacher/teacher";
import Room from "./pages/dashboard/room/room";
import AdminPanel from "./pages/dashboard/adminpanel";
import AddTeacherpage from "./pages/dashboard/teacher/addteacher";
import Course from "./pages/dashboard/courses/course";
import AddRoomPage from "./pages/dashboard/room/addroom";
import Corecourse from "./pages/dashboard/courses/corecourse/corecoursedisplay";
import AddCoursepage from "./pages/dashboard/courses/corecourse/corecourseadd";
import Section from "./pages/dashboard/section/section";
import TeacherPage from "./pages/dashboard/teacher/teacherdisplay";
import EditTeacherpage from "./pages/dashboard/teacher/editteacher";
import RoomPage from "./pages/dashboard/room/roomdisplay";
import EditRoomPage from "./pages/dashboard/room/editroom";
import Labcourse from "./pages/dashboard/courses/lab/labdisplay";
import AddLabpage from "./pages/dashboard/courses/lab/labadd";
import { Toaster } from "sonner";
import AddSectionPage from "./pages/dashboard/section/addsection";
import AddElectivepage from "./pages/dashboard/courses/electives/electivesadd";
import Electivecourse from "./pages/dashboard/courses/electives/electivesdisplay";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<AdminPanel />} />
          <Route path="/dashboard/teachers" element={<Teacher />} >
            <Route index element={<TeacherPage />} />
            <Route path="/dashboard/teachers/add" element={<AddTeacherpage />} />
            <Route path="/dashboard/teachers/edit/:oldname/:olddepartment" element={<EditTeacherpage />} />
          </Route>
          <Route path="/dashboard/rooms" element={<Room />} >
            <  Route index element={<RoomPage />} />
            <Route path="/dashboard/rooms/add" element={<AddRoomPage />} />
            <Route path="/dashboard/rooms/edit" element={<EditRoomPage />} />
          </Route>
          <Route path="/dashboard/courses" element={<Course />} >
            <Route path="/dashboard/courses/core-courses" element={<Corecourse />} />
            <Route path="/dashboard/courses/core-courses/add" element={<AddCoursepage />} />
            <Route path="/dashboard/courses/labs" element={<Labcourse />} />
            <Route path="/dashboard/courses/labs/add" element={<AddLabpage />} />
            <Route path="/dashboard/courses/electives" element={<Electivecourse />} />
            <Route path="/dashboard/courses/electives/add" element={<AddElectivepage />} />
          </Route>
          <Route path="/dashboard/section" element={<Section />} >
            <Route path="/dashboard/section/add" element={<AddSectionPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );

}

export default App;
