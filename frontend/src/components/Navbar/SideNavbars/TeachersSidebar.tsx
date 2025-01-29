import { Divider, Button, Layout } from "antd";
import axios from "axios";
import {
  FaCalendar,
  FaUserPen,
  FaUserPlus,
  FaChalkboardUser,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../config";

const { Sider } = Layout;

const TeachersSidebar = () => {
  const navigate = useNavigate();  
  const { pathname } = useLocation(); 

  const handleClick = (url:string) => {
    navigate(`/dashboard/teachers${url}`);
  };

  return (
    <Sider className="h-screen bg-white border-r-[0.5px] font-sans ">
      <div className="flex justify-left text-black-bold items-center pt-[20px] pl-[20px] space-x-2 h-[7vh]">
      <FaChalkboardUser className="w-[30px] h-[40px]" />
        <span
          className="text-xl font-semibold text-[#171A1FFF]"
          style={{ fontFamily: "Archivo" }}
        >
          Teachers
        </span>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4">
        <div
          onClick={() => handleClick( "/add")}
          className={`flex relative space-x-2 p-2 cursor-pointer ${
            pathname == "/dashboard/teachers/add"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaUserPlus className="w-5 h-5" />
          <span>Add a Teacher</span>
          {pathname == "/dashboard/teachers/add" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>

        <div
          onClick={() => handleClick( "")}
          className={`flex cursor-pointer relative space-x-2 p-2 ${
            (pathname == "/dashboard/teachers" || pathname.includes("/dashboard/teachers/edit"))
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaUserPen className="w-5 h-5" />
          <span>Modify Attributes</span>
          {(pathname == "/dashboard/teachers" || pathname.includes("/dashboard/teachers/edit")) && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      </div>
      <Divider />
      <div
        className="flex flex-col items-left justify-center h-[25vh] space-y-2 font-medium text-[#565E6C] pl-4">
        <div
          onClick={() => handleClick("/")}
          className={`relative flex cursor-pointer space-x-2 p-2 ${
            pathname === "/dashboard/teachers/rank-timewise"
              ? "text-[#636AE8FF] font-bold"
              : "text-[#565E6C]"
          }`}
        >
          <FaClockRotateLeft className="w-5 h-5" />
          <span>Rank Timewise</span>
          {pathname === "/dashboard/teachers/rank-timewise" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[4px] h-[70%] bg-[#636AE8FF] rounded-full"></div>
          )}
        </div>
      <div className="flex justify-center mr-4">
        <Button
          className="mt-2 bg-[#636AE8FF] text-white"
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('No token found');
              return;
            }

            toast.promise(
              axios.get(`${BACKEND_URL}/teachers/consolidated`, {
          headers: { Authorization: token }
              }),
              {
          loading: 'Fetching teacher data...',
          success: (response) => {
            if (response.status === 200 && response.data.consolidatedTable) {
              const days = [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
              ];
              const rows = [];
              
              // Create CSV rows
              for (let day = 0; day < 6; day++) {
                for (let slot = 0; slot < 6; slot++) {
            const teachers = response.data.consolidatedTable[day][slot] || [];
            rows.push([
              `${days[day]} ${slot + 1}st Hour`,
              teachers.join(',')
            ]);
                }
              }

              // Generate and download CSV
              const csvContent = rows.map(row => row.join(",")).join("\n");
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "teacherData.csv";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              return 'Teacher data exported successfully';
            }
            throw new Error('Failed to export teacher data');
          },
          error: 'Failed to fetch teacher data'
              }
            );
          }}
        >
          Generate Consolidated
        </Button>
      </div>
      </div>
    </Sider>
  );
};

export default TeachersSidebar;
