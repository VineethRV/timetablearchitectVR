import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Tooltip, Upload } from "antd";
import { motion } from "framer-motion";
import { CiExport, CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import TimeTable from "../../../components/TimetableComponents/timetable";
import { DEPARTMENTS_OPTIONS } from "../../../../info";
import axios from "axios";
import { statusCodes } from "../../../types/statusCodes";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../config";
import { formItemLayout, getPosition, timeslots, weekdays } from "../../../utils/main";
import StatusTable from "../../../components/TimetableComponents/statusTable";
import { List } from "antd";
import { PaginationPosition } from "antd/es/pagination/Pagination";

export function buttonConvert(buttonStatus: string[][]): string[][] {
  return buttonStatus.map((row) =>
    row.map((status) => (status === "Free" ? "0" : status))
  );
}


const consolidated = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Check"))
  );
  let [data, setData] = useState([""]);
  let [RoomList,setRoomList]=useState( Array(6).fill(null).map(() =>
    Array(0).fill(null).map(() =>
      Array(0).fill("")
    )
  ));const exportToCSV = () => {
      // Create rows directly from RoomList
      const rows = [];
      const days = [
        "Monday 1st Hour", "Monday 2nd Hour", "Monday 3rd Hour", "Monday 4th Hour", "Monday 5th Hour", "Monday 6th Hour",
        "Tuesday 1st Hour", "Tuesday 2nd Hour", "Tuesday 3rd Hour", "Tuesday 4th Hour", "Tuesday 5th Hour", "Tuesday 6th Hour",
        "Wednesday 1st Hour", "Wednesday 2nd Hour", "Wednesday 3rd Hour", "Wednesday 4th Hour", "Wednesday 5th Hour", "Wednesday 6th Hour",
        "Thursday 1st Hour", "Thursday 2nd Hour", "Thursday 3rd Hour", "Thursday 4th Hour", "Thursday 5th Hour", "Thursday 6th Hour",
        "Friday 1st Hour", "Friday 2nd Hour", "Friday 3rd Hour", "Friday 4th Hour", "Friday 5th Hour", "Friday 6th Hour",
        "Saturday 1st Hour", "Saturday 2nd Hour", "Saturday 3rd Hour", "Saturday 4th Hour", "Saturday 5th Hour", "Saturday 6th Hour"
      ];
      // Add header row for CSV
      for (let day = 0; day < 6; day++) {
        for (let slot = 0; slot < 6; slot++) {
          // Get Rooms for this time slot
          const Rooms = RoomList[day][slot] || [];
          // Join Rooms with a semicolon if multiple Rooms
          rows.push([days[day*6+slot],Rooms.join(',')]);
        }
      }
  
      const csvContent = [
        ...rows.map((row) => row.join(",")),
      ].join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
  
      link.setAttribute("href", url);
      link.setAttribute("download", "roomData.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  const fetchConsolidatedData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const promise=axios.get(`${BACKEND_URL}/rooms/consolidated`, {
      headers: {
        Authorization:token,
      }
    })
    useEffect(() => {
      const fetchConsolidatedData = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const promise = axios.get(`${BACKEND_URL}/Rooms/consolidated`, {
          headers: {
            Authorization: token,
          }
        });

        toast.promise(
          promise,
          {
            loading: 'Fetching Room data...',
            success: (response) => {
              if (response.status === 200 && response.data.consolidatedTable) {
                console.log("consolidated data:", response.data.consolidatedTable);
                setRoomList(response.data.consolidatedTable);
                return 'Room data loaded successfully';
              }
              throw new Error('Failed to load Room data');
            },
            error: (error) => {
              console.error('Error fetching consolidated data:', error);
              return 'Failed to fetch Room data';
            }
          }
        );
      };

      fetchConsolidatedData();
    }, []);
  };
  fetchConsolidatedData();


  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 w-full h-screen overflow-y-scroll">
      <Button
        onClick={exportToCSV}
        className="bg-primary text-white font-bold float-right mr-5"
      >
        <CiExport />
        Export
      </Button>
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] font-inter text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/Rooms");
          }}
          className="flex text-base w-fit cursor-pointer space-x-2"
        >
          <h1>&#8592;</h1>
          <h1>Back</h1>
        </div>

      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex mt-12 items-center pl-4 w-full gap-8"
      >
        <div className="w-full flex flex-row justify-start gap-40">
          <Form
            {...formItemLayout}
            form={form}
            layout="vertical"
          >
            <label>
              <div className="flex items-center">
                <span>Availability of Rooms</span>
                <Tooltip title="Click on the slot to check Room status">
                  <IoIosInformationCircleOutline className="ml-2 w-4 h-4 text-[#636AE8FF]" />
                </Tooltip>
              </div>
            </label>
            <StatusTable
              buttonStatus={buttonStatus}
              setButtonStatus={setButtonStatus}
              setData={setData}
              elementList={RoomList}
            />
          </Form>
          <List
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
        
            size="small"
            header={<div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Free Rooms:</div>}
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default consolidated;
