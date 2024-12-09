import { Outlet } from "react-router-dom";
import RoomSidebar from "../../../components/Navbar/SideNavbars/RoomSidebar";

const Room = () => {
  return (
    <div className="flex h-screen">
        <div>
      <RoomSidebar />
      </div>
      <div className="w-full" >
        <Outlet />
      </div>
    </div>
  );
};

export default Room;
