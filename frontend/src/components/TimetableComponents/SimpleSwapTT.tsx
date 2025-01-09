import React, { useState } from "react";
import { Table, Button } from "antd";
import { button } from "framer-motion/client";
// Define the type for the timetable props
interface TimetableProps {
  buttonStatus: string[][]; // Array of arrays with course names
  setButtonStatus: (status: string[][]) => void; // Function to update button status
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
const SimpleSwapTimetable: React.FC<TimetableProps> = ({ buttonStatus, setButtonStatus }) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  let score: number[][] = new Array(6).fill(0).map(() => 
    new Array(6).fill(0).map(() => Math.random() * 2- 1)
  );

  // Handle button click for swapping
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    if (!selectedSlot) {
      // Select the first slot
      setSelectedSlot({ rowIndex, colIndex });
    } else {
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
      setButtonStatus(updatedStatus);
      setSelectedSlot(null); // Reset the selected slot
    }
  };
  // Data source for the table
  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day: day,
    buttons: timeslots.map((_, colIndex) => (
      
      <Button
        key={colIndex}
        className={`w-20 h-8 m-1 text-xs font-semibold rounded-md overflow-hidden ${
          selectedSlot
        ? selectedSlot.rowIndex === rowIndex &&
          selectedSlot.colIndex === colIndex
          ? "border-2 border-[#FF5722] text-[#FF5722] bg-[#FFF7F0]"
          : "border text-[#19331f] bg-[#d4fddf] hover:bg-[#72ee91]"
        : "border text-[#636AE8] bg-[#F2F2FD] hover:bg-[#D9D9F3]"
        }`}
        onClick={() => handleButtonClick(rowIndex, colIndex)}
        disabled={
          (selectedSlot ? true : false) &&
          (score[rowIndex][colIndex] < 0 || buttonStatus[rowIndex][colIndex] !== "Free")
        }
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          borderColor: selectedSlot && score[rowIndex][colIndex] > 0 && buttonStatus[rowIndex][colIndex] == "Free" ? `rgb(0, ${255 * score[rowIndex][colIndex]}, 0)` : "",
          borderWidth: selectedSlot && score[rowIndex][colIndex] > 0 && buttonStatus[rowIndex][colIndex] == "Free" ? `${1 + 2*score[rowIndex][colIndex]}px` : "1px",
        }}
      >
        {buttonStatus[rowIndex][colIndex]}
      </Button>
    )),
  }));
  // Columns for the table
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
    <div className="flex justify-center p-5">
      <div className="max-w-[800px] w-full">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
        />
      </div>
    </div>
  );
};
export default SimpleSwapTimetable;