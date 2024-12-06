import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./dashboard/dashboard";
import Teacher from "./dashboard/teacher/teacher";
import Room from "./dashboard/room";
import AdminPanel from "./dashboard/adminpanel";
import TeachersSidebar from "./components/Navbar/SideNavbars/TeachersSidebar";
import AddTeacherpage from "./dashboard/teacher/addteacher";

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
          <Route path="/dashboard/teachers/add" element={<AddTeacherpage />} />
          </Route>
        <Route path="/dashboard/rooms" element={<Room/>}/>
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
