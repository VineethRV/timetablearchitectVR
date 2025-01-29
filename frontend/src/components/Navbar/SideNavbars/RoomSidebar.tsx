import { Divider, Button, Layout } from "antd";
import axios from "axios";
import {
  FaCalendar,
  FaBuildingUser,
  FaCirclePlus,
  FaClockRotateLeft,
  FaPenToSquare,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../config";

const { Sider } = Layout;

const RoomsSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (url: string) => {
    navigate(`/dashboard/rooms${url}`);
  };

  return (
    <Sider className="h-screen bg-white border-r-[0.5px] font-sans">
      <div className="flex justify-left text-black-bold items-center pt-[20px] pl-[20px] space-x-2 h-[7vh]">
        <FaBuildingUser className="w-[30px] h-[40px]" />
        <span
          className="text-xl font-semibold text-[#171A1FFF]"
          style={{ fontFamily: "Archivo" }}
        >
          Rooms
        </span>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4">
        <div
          onClick={() => handleClick("/add")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            pathname == "/dashboard/rooms/add"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCirclePlus className="w-5 h-5" />
          <span>Add a Room</span>
          {pathname == "/dashboard/rooms/add" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick( "")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            pathname == "/dashboard/rooms" ||
            pathname.includes("/dashboard/rooms/edit")
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaPenToSquare className="w-5 h-5" />
          <span>Modify Attributes</span>
          {(pathname == "/dashboard/rooms" ||
            pathname.includes("/dashboard/rooms/edit")) && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4">
        {/* <div
          onClick={() => handleClick( "/")}
          className={`relative flex cursor-pointer space-x-2 p-2 ${
            pathname === "/dashboard/rank-timewise"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaClockRotateLeft className="w-5 h-5" />
          <span>Rank Timewise</span>
          {pathname === "/dashboard/rank-timewise" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div> */}

        <div
          onClick={() => handleClick( "/timeslot-dependent")}
          className={`relative cursor-pointer flex space-x-2 p-2 ${
            pathname === "/dashboard/timeslot-dependent"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaCalendar className="w-5 h-5" />
          <span>Timeslot Dependent</span>
          {pathname === "/dashboard/timeslot-dependent" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      <div className="flex justify-center mr-4">
        <Button
          onClick={() => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        toast.promise(
          axios.get(`${BACKEND_URL}/rooms/consolidated`, {
          headers: { Authorization: token }
          }),
          {
          loading: 'Fetching room data...',
          success: (response) => {
        if (response.status === 200 && response.data.consolidatedTable) {
          const rows = [];
          const days = [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ];
          
          for (let day = 0; day < 6; day++) {
            for (let slot = 0; slot < 6; slot++) {
        const rooms = response.data.consolidatedTable[day][slot] || [];
        rows.push([`${days[day]} ${slot + 1}st Hour`, rooms.join(',')]);
            }
          }

          const csvContent = rows.map(row => row.join(",")).join("\n");
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);

          link.setAttribute("href", url);
          link.setAttribute("download", "roomData.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          return 'Room data exported successfully';
        }
        throw new Error('Failed to export room data');
          },
          error: 'Failed to fetch room data'
          }
        );
          }}
          className="mt-2 bg-[#636AE8FF] text-white"
        >
          Generate Consolidated
        </Button>
      </div>
      </div>
    </Sider>
  );
};

export default RoomsSidebar;
