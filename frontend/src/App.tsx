import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./dashboard/dashboard";
import Teacher from "./dashboard/teacher/teacher";
import Room from "./dashboard/room/room";
import AdminPanel from "./dashboard/adminpanel";
import AddTeacherpage from "./dashboard/teacher/addteacher";
import Course from "./dashboard/courses/course";
import AddRoomPage from "./dashboard/room/addroom";
import Corecourse from "./dashboard/courses/corecoursedisplay";
import AddCoursepage from "./dashboard/courses/corecourseadd";
import Section from "./dashboard/section/section";
import TeacherPage from "./dashboard/teacher/teacherdisplay";
import EditTeacherpage from "./dashboard/teacher/editteacher";
import RoomPage from "./dashboard/room/roomdisplay";
import EditRoomPage from "./dashboard/room/editroom";
import Labcourse from "./dashboard/courses/labdisplay";
import AddLabpage from "./dashboard/courses/labadd";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<AdminPanel />} />
        <Route path="/dashboard/teachers" element={<Teacher />} >
        <Route index element={<TeacherPage/>} />
          <Route path="/dashboard/teachers/add" element={<AddTeacherpage />} />
          <Route path="/dashboard/teachers/edit" element={<EditTeacherpage />} />
          </Route>
        <Route path="/dashboard/rooms" element={<Room/>} >
      <  Route index element={<RoomPage/>} />
          <Route path="/dashboard/rooms/add" element={<AddRoomPage />} />
          <Route path="/dashboard/rooms/edit" element={<EditRoomPage />} />
        </Route>
        <Route path="/dashboard/courses" element={<Course />} >
          <Route path="/dashboard/courses/core-courses" element={<Corecourse/>}/>
          <Route path="/dashboard/courses/core-courses/add" element={<AddCoursepage />} />
          <Route path="/dashboard/courses/labs" element={<Labcourse/>}/>
          <Route path="/dashboard/courses/labs/add" element={<AddLabpage />} />
        </Route>
        <Route path="/dashboard/section" element={<Section/>} >
          <Route path="/dashboard/section" element={<AddRoomPage />} />
        </Route>
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
