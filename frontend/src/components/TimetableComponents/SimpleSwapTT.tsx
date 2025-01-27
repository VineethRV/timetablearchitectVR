import React, { useState } from "react";
import { Table, Button, Tooltip } from "antd";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { convertTableToString, stringToTable } from "../../utils/main";
import { toast } from "sonner";
// Define the type for the timetable props
interface TimetableProps {
  buttonStatus: string[][]; // Array of arrays with course names
  setButtonStatus: (status: string[][]) => void; // Function to update button status
  courses:string[];
  teachers:string[];
  rooms: string[]; // Array of courses, teachers, and rooms
  setRoomTT: (status: string) => void; 
  roomTT: string;
  timetable: string[][];
  setTimetable:(status: string[][]) => void;
}
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeslots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:30-12:30",
  "12:30-1:30",
  "2:30-3:30",
  "3:30-4:30",
];

const SimpleSwapTimetable: React.FC<TimetableProps> = ({ buttonStatus, setButtonStatus,courses,teachers,rooms,setRoomTT,roomTT,timetable,setTimetable }) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [score, setScore] = useState<number[][]>(new Array(6).fill(0).map(() => new Array(6).fill(0).map(() => 0)));
  console.log(buttonStatus,courses,teachers,rooms,roomTT,timetable)
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    console.log("button clicked");
    if (!selectedSlot) {
      console.log("inside first select");
      // Select the first slot
      if (courses.includes(timetable[rowIndex][colIndex])) {
        console.log("inside click");
        setSelectedSlot({ rowIndex, colIndex });
        const selectedIndex = courses.indexOf(timetable[rowIndex][colIndex]);
        let teacher = teachers[selectedIndex];
        let room = stringToTable(roomTT)[rowIndex][colIndex];
        console.log("course", buttonStatus[rowIndex][colIndex]);
        console.log("teacher", teacher);
        console.log("room", room);
        const dummy = stringToTable("-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;").map(row => row.map(value => parseFloat(value)));
        setScore(dummy)
        //get score
        toast.promise(
          axios.post(
            BACKEND_URL + "/recommendCourse",
            {
              teacher: teacher,
              room: room == "0" ? null : room,
              blocks: convertTableToString(buttonStatus),
            },
            {
              headers: {
                authorization: localStorage.getItem("token"),
              },
            }
          ),
          {
            loading: "Finding optimal slots...",
            success: (response) => {
              console.log("response", response.data.timetable);
              if (response.status === 200) {
                const newScore = stringToTable(response.data.timetable).map(row => row.map(value => parseFloat(value)));
                console.log("Course recommendation received", newScore);
                setScore(newScore);
                return "Optimal slots found!";
                    } else {
                console.error("Failed to get course recommendation");
                return "Failed to get course recommendation";
                    }
            },
            error: (error) => {
              console.error("Error:", error.response?.data || error.message);
              return "Failed to get course recommendation";
            },
          }
        );
      }
    }
    else {
      // Perform the swap
      const updatedStatus = buttonStatus.map((row, rIdx) =>
        row.map((course, cIdx) => {
          if (
            rIdx === selectedSlot.rowIndex &&
            cIdx === selectedSlot.colIndex
          ) {
            return buttonStatus[rowIndex][colIndex]; // Swap with the new selection
          }
          if (rIdx === rowIndex && cIdx === colIndex) {
            return buttonStatus[selectedSlot.rowIndex][selectedSlot.colIndex]; // Swap with the previously selected
          }
          return course;
        })
      );
      const updatedTimetable = timetable.map((row, rIdx) =>
        row.map((course, cIdx) => {
          if (
            rIdx === selectedSlot.rowIndex &&
            cIdx === selectedSlot.colIndex
          ) {
            return timetable[rowIndex][colIndex]; // Swap with the new selection
          }
          if (rIdx === rowIndex && cIdx === colIndex) {
            return timetable[selectedSlot.rowIndex][selectedSlot.colIndex]; // Swap with the previously selected
          }
          return course;
        })
      );
      let table=stringToTable(roomTT).map((row, rIdx) =>
        row.map((course, cIdx) => {
          if (
            rIdx === selectedSlot.rowIndex &&
            cIdx === selectedSlot.colIndex
          ) {
            return stringToTable(roomTT)[rowIndex][colIndex]; // Swap with the new selection
          }
          if (rIdx === rowIndex && cIdx === colIndex) {
            return stringToTable(roomTT)[selectedSlot.rowIndex][selectedSlot.colIndex]; // Swap with the previously selected
          }
          return course;
        })
      );
      setRoomTT(convertTableToString(table));
      setTimetable(updatedTimetable);
      setButtonStatus(updatedStatus);
      setSelectedSlot(null); // Reset the selected slot
    }
  };

  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day: day,
    buttons: timeslots.map((_, colIndex) => (
      <Tooltip title={stringToTable(roomTT)[rowIndex][colIndex]=="Free"?"":stringToTable(roomTT)[rowIndex][colIndex]+(teachers[courses.indexOf(timetable[rowIndex][colIndex])]?", "+teachers[courses.indexOf(timetable[rowIndex][colIndex])]:"")}>
        <Button
          key={colIndex}
          className={`w-20 h-8 m-1 text-xs font-semibold rounded-md overflow-hidden ${
            selectedSlot
              ? selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex
                ? "border-2 border-[#FF5722] text-[#FF5722] bg-[#FFF7F0]"
                : "border text-[#19331f] bg-[#d4fddf] hover:bg-[#72ee91]"
              : "border text-[#636AE8] hover:bg-[#D9D9F3]"
          }`}
          onClick={() => handleButtonClick(rowIndex, colIndex)}
        
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            backgroundColor: selectedSlot?"":buttonStatus[rowIndex][colIndex] !== "Free" ? "rgb(99,106,232)" : "#F2F2FD",
            color: selectedSlot?"":buttonStatus[rowIndex][colIndex] !== "Free" ? "#F2F2FD" : "rgb(99,106,232)",
            borderColor: selectedSlot && score[rowIndex][colIndex] > 0 && buttonStatus[rowIndex][colIndex] === "Free" ? `rgb(0, ${255 * score[rowIndex][colIndex]}, 0)` : "",
            borderWidth: selectedSlot && score[rowIndex][colIndex] > 0 && buttonStatus[rowIndex][colIndex] === "Free" ? `${1 + 2 * score[rowIndex][colIndex]}px` : "1px",
          }}
          disabled={
            (selectedSlot ? true : false) &&
            (score[rowIndex][colIndex] < 0 || buttonStatus[rowIndex][colIndex] !== "Free")
          }
        >
          {buttonStatus[rowIndex][colIndex]}
      </Button>
    </Tooltip>
    )),
  }));
  const columns = [
    {
      title: "Timeslots",
      dataIndex: "day",
      key: "day",
      render: (text: string) => (
        <strong className="text-normal" style={{ fontFamily: "Inter" }}>
          {text}
        </strong>
      ),
    },
    ...timeslots.map((slot, index) => ({
      title: slot,
      dataIndex: `button${index}`,
      key: `button${index}`,
      render: (_: any, record: { buttons: React.ReactNode[] }) => (
        <span className="text-normal" style={{ fontFamily: "Inter" }}>
          {record.buttons[index]}
        </span>
      ),
    })),
  ];

  return (
    <div className="flex justify-center p-4">
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default SimpleSwapTimetable;