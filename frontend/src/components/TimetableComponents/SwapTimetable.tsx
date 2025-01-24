import React, { useState } from "react";
import { Table, Button, Tooltip } from "antd";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import {  stringToTable } from "../../utils/main";

// Define the type for the timetable props
interface TimetableProps {
  buttonStatus: string[][];
  setButtonStatus: React.Dispatch<React.SetStateAction<string[][]>>;
  course: string[];
  teachers: string[][];
  rooms: string[][];
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timeslots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:30-12:30",
  "12:30-1:30",
  "2:30-3:30",
  "3:30-4:30",
];

const SwapTimetable: React.FC<TimetableProps> = ({
  buttonStatus,
  setButtonStatus,
  course,
  teachers,
  rooms,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [score, setScore] = useState<number[][]>(
    Array(6).fill(null).map(() => 
    Array(6).fill(null).map(() => (Math.random()*2-1))
  ));
  
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    console.log("button clicked");
    if (!selectedSlot) {
      console.log("inside first select");
      if(course.includes(buttonStatus[rowIndex][colIndex])) {
        console.log("inside click");
        if(colIndex%2){
          setSelectedSlot({ rowIndex, colIndex:colIndex-1});
        }
        else{
          setSelectedSlot({ rowIndex, colIndex: colIndex });
        }
        const selectedIndex = course.indexOf(buttonStatus[rowIndex][colIndex]);
        let teacher = teachers[selectedIndex];
        let room = rooms[selectedIndex];
        console.log("course", buttonStatus[rowIndex][colIndex]);
        console.log("teacher", teacher);
        console.log("room", room);
        const dummy = stringToTable("-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;-1,-1,-1,-1,-1,-1;").map(row => row.map(value => parseFloat(value)));
        setScore(dummy)
        console.log("Sending request to backend");
        toast.promise(
          axios.post(
            BACKEND_URL + "/recommendLab",
            {
              Lteachers: teacher,
              Lrooms: room,
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
              console.log("response", response);
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
    } else {
      console.log(buttonStatus[rowIndex][colIndex]);
      colIndex = colIndex%2 ? colIndex-1 : colIndex;
      const updatedStatus = buttonStatus.map((row, rIdx) =>
        row.map((course, cIdx) => {
          if (
            (rIdx === selectedSlot.rowIndex) &&
            (cIdx === selectedSlot.colIndex || cIdx === selectedSlot.colIndex+1)
          ) {
            return buttonStatus[rowIndex][colIndex]; // Swap with the new selection
          }
          if ((rIdx === rowIndex && (cIdx === colIndex || cIdx === colIndex+1))) {
            return buttonStatus[selectedSlot.rowIndex][selectedSlot.colIndex]; // Swap with the previously selected
          }
          return course;
        })
      );
      setButtonStatus(updatedStatus);
      setSelectedSlot(null);
    }
  };
  console.log("score: ",score)
  console.log("ButtonMatrix: ",buttonStatus)
  console.log("dataSource: ",score.map((row,rowIndex) => row.map((_,colIndex) => (score[rowIndex][(Math.floor(colIndex/2))*2] < 0))))
  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day: day,
    buttons: timeslots.map((_, colIndex) => (
      <Tooltip >
        <Button
          key={colIndex}
          className={`w-20 h-8 m-1 text-xs font-semibold rounded-md overflow-hidden ${
            selectedSlot
              ? selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex
                ? "border-2 border-[#FF5722] text-[#FF5722] bg-[#FFF7F0]"
                : "border text-[#19331f] bg-[#d4fddf] hover:bg-[#72ee91]"
              : "border text-[#636AE8] bg-[#F2F2FD] hover:bg-[#D9D9F3]"
          }`}
          onClick={() => handleButtonClick(rowIndex, colIndex)}
          disabled={
            (selectedSlot ? true : false) &&
            (score[rowIndex][(Math.floor(colIndex/2))*2] < 0 || (buttonStatus[rowIndex][colIndex] != "Free" && buttonStatus[rowIndex][colIndex] != "0" ))
          }
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            backgroundColor: selectedSlot?"":buttonStatus[rowIndex][colIndex] !== "Free" ? "rgb(99,106,232)" : "#F2F2FD",
            color: selectedSlot?"":buttonStatus[rowIndex][colIndex] !== "Free" ? "#F2F2FD" : "rgb(99,106,232)",
            borderColor: selectedSlot && score[rowIndex][(Math.floor(colIndex/2))*2] > 0 && (buttonStatus[rowIndex][colIndex] == "Free" || buttonStatus[rowIndex][colIndex] == "0" )? `rgb(0, ${255 * score[rowIndex][colIndex]}, 0)` : "",
            borderWidth: selectedSlot && score[rowIndex][(Math.floor(colIndex/2))*2] > 0 && (buttonStatus[rowIndex][colIndex] == "Free" || buttonStatus[rowIndex][colIndex] == "0") ? `${1 + 2*score[rowIndex][colIndex]}px` : "1px",
          }}
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

export default SwapTimetable;
