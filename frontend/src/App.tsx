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
import AddCoursepage from "./pages/dashboard/courses/corecourse/addcorecourse";
import Section from "./pages/dashboard/section/section";
import TeacherPage from "./pages/dashboard/teacher/teacherdisplay";
import ConsolidatedTeachers from "./pages/dashboard/teacher/consolidated";
import ConsolidatedRooms from "./pages/dashboard/room/consolidated";
import EditTeacherpage from "./pages/dashboard/teacher/editteacher";
import RoomPage from "./pages/dashboard/room/roomdisplay";
import EditRoomPage from "./pages/dashboard/room/editroom";
import Labcourse from "./pages/dashboard/courses/lab/labdisplay";
import AddLabpage from "./pages/dashboard/courses/lab/addlab";
import { Toaster } from "sonner";
import AddSectionPage from "./pages/dashboard/section/addsection";
import AddElectivepage from "./pages/dashboard/courses/electives/addelective";
import Electivecourse from "./pages/dashboard/courses/electives/electivesdisplay";
import OnboardingPage from "./pages/Onboarding";
import Onboard from "./pages/register";
import Access from "./pages/dashboard/admin/access";
import ForgetOTP from "./pages/ForgetPassword";
import VerifyComponent from "./pages/VerifyEmail";
import EditCoursepage from "./pages/dashboard/courses/corecourse/editcorecourse";
import { ChatBot } from "./components/ChatBot/ChatBot";
import { CoreCoursesTemplate, RoomTemplate, TeacherTemplate } from "./components/Templates/Page";
import SectionTabledisplay from "./pages/dashboard/section/sectiondisplay";
import EditLabPage from "./pages/dashboard/courses/lab/editlab";
import EditSectionPage from "./pages/dashboard/section/editsection";
import EditElectivepage from "./pages/dashboard/courses/electives/editelective";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/verify-email" element={<VerifyComponent />}/>
        <Route path="/forget-password" element={<ForgetOTP />} />
        <Route path="/templates/teacher" element={<TeacherTemplate />} />
        <Route path="/templates/rooms" element={<RoomTemplate />} />
        <Route path="/templates/core-courses" element={<CoreCoursesTemplate />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<AdminPanel />} />
          <Route path="/dashboard/teachers" element={<Teacher />}>
            <Route index element={<TeacherPage />} />
            <Route
              path="/dashboard/teachers/add"
              element={<AddTeacherpage />}
            />
            <Route
              path="/dashboard/teachers/edit/:oldname/:olddepartment"
              element={<EditTeacherpage />}
            />
            <Route
              path="/dashboard/teachers/timeslot-dependent"
              element={<ConsolidatedTeachers />}
            />
          </Route>
          <Route path="/dashboard/rooms" element={<Room />}>
            <Route index element={<RoomPage />} />
            <Route path="/dashboard/rooms/add" element={<AddRoomPage />} />
            <Route
              path="/dashboard/rooms/edit/:oldname/:olddepartment"
              element={<EditRoomPage />}
            />
            <Route
              path="/dashboard/rooms/timeslot-dependent"
              element={<ConsolidatedRooms />}
            />
          </Route>
          <Route path="/dashboard/courses" element={<Course />}>
            <Route
              path="/dashboard/courses/core-courses"
              element={<Corecourse />}
            />
            <Route path="/dashboard/courses/core-courses/edit/:oldname/:department" element={<EditCoursepage/>}/>
            <Route
              path="/dashboard/courses/core-courses/add"
              element={<AddCoursepage />}
            />
            <Route path="/dashboard/courses/labs" element={<Labcourse />} />
            <Route path="/dashboard/courses/labs/edit/:oldname/:olddepartment/:oldsemester" element={<EditLabPage/>}/>
            <Route
              path="/dashboard/courses/labs/add"
              element={<AddLabpage />}
            />
            <Route
              path="/dashboard/courses/electives"
              element={<Electivecourse />}
            />
            <Route
              path="/dashboard/courses/electives/add"
              element={<AddElectivepage />}
            />
          <Route path="/dashboard/courses/electives/edit/:oldname/:olddepartment/:oldsemester" element={<EditElectivepage/>}/>
          </Route>
          <Route path="/dashboard/section" element={<Section />}>
          <Route index element={<SectionTabledisplay />} />
            <Route path="/dashboard/section/add" element={<AddSectionPage />} />
            <Route path="/dashboard/section/edit/:id/:oldname" element={<EditSectionPage />} />
          </Route>
          <Route path="/dashboard/admin/access" element={<Access />} />
        </Route>
      </Routes>
      <Toaster />
      <ChatBot/>
    </BrowserRouter>
  );
}

export default App;