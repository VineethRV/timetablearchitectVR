import React, { useState } from "react";
import { Table, Button } from "antd";

// Define the type for the timetable props
interface TimetableProps {
  buttonStatus: string[][]; // Array of arrays with course names
  setButtonStatus: (status: string[][]) => void; // Function to update button status
  timetableScore: number[][]; // Array of arrays with scores for each slot
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

const SwapTimetable: React.FC<TimetableProps> = ({
  buttonStatus,
  setButtonStatus,
  timetableScore,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  const [swapping, setSwapping] = useState<{
    firstSlot: { rowIndex: number; colIndex: number } | null;
    secondSlot: { rowIndex: number; colIndex: number } | null;
  }>({ firstSlot: null, secondSlot: null });

  // Handle button click for swapping
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    if (timetableScore[rowIndex][colIndex] < 0) {
      return; // Block slot if score is less than 0
    }

    if (!selectedSlot) {
      // Select the first slot
      setSelectedSlot({ rowIndex, colIndex });
    } else {
      // Perform the swap
      const firstSlot = selectedSlot;
      const secondSlot = { rowIndex, colIndex };

      setSwapping({ firstSlot, secondSlot });

      const updatedStatus = buttonStatus.map((row, rIdx) =>
        row.map((course, cIdx) => {
          if (rIdx === firstSlot.rowIndex && cIdx === firstSlot.colIndex) {
            return buttonStatus[rowIndex][colIndex]; // Swap with the new selection
          }
          if (rIdx === rowIndex && cIdx === colIndex) {
            return buttonStatus[firstSlot.rowIndex][firstSlot.colIndex]; // Swap with the previously selected
          }
          return course;
        })
      );

      setTimeout(() => {
        setButtonStatus(updatedStatus);
        setSelectedSlot(null); // Reset the selected slot
        setSwapping({ firstSlot: null, secondSlot: null });
      }, 400); // Animation duration
    }
  };

  // Data source for the table
  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day: day,
    buttons: timeslots.map((_, colIndex) => {
      const score = timetableScore[rowIndex][colIndex];

      let buttonStyle = {
        backgroundColor: "#FFFFFF", // Default color (white)
        color: "#000000",
        borderColor: "#D9D9D9",
      };

      if (score > 90) {
        buttonStyle = {
          backgroundColor: "#003300", // Very dark green
          color: "#FFFFFF",
          borderColor: "#003300",
        };
      } else if (score > 60) {
        buttonStyle = {
          backgroundColor: "#006400", // Dark green
          color: "#FFFFFF",
          borderColor: "#006400",
        };
      } else if (score > 40) {
        buttonStyle = {
          backgroundColor: "#32CD32", // Medium green
          color: "#000000",
          borderColor: "#32CD32",
        };
      } else if (score > 20) {
        buttonStyle = {
          backgroundColor: "#90EE90", // Light green
          color: "#000000",
          borderColor: "#90EE90",
        };
      } else if (score > 0) {
        buttonStyle = {
          backgroundColor: "#D9FBD9", // Very light green
          color: "#000000",
          borderColor: "#D9FBD9",
        };
      } else if (score < 0) {
        buttonStyle = {
          backgroundColor: "#FF5722", // Red
          color: "#FFFFFF",
          borderColor: "#FF5722",
        };
      }

      const isSwapping =
        (swapping.firstSlot &&
          swapping.firstSlot.rowIndex === rowIndex &&
          swapping.firstSlot.colIndex === colIndex) ||
        (swapping.secondSlot &&
          swapping.secondSlot.rowIndex === rowIndex &&
          swapping.secondSlot.colIndex === colIndex);

      return (
        <Button
          key={colIndex}
          className={`w-20 h-8 m-1 text-xs font-semibold rounded-md overflow-hidden transform transition-all duration-300 ease-in-out ${
            selectedSlot?.rowIndex === rowIndex &&
            selectedSlot?.colIndex === colIndex
              ? "border-4 border-blue-500 scale-105 shadow-lg"
              : ""
          } ${
            isSwapping
              ? "animate-pulse bg-yellow-300 scale-110 shadow-md"
              : ""
          }`}
          onClick={() => handleButtonClick(rowIndex, colIndex)}
          style={{
            ...buttonStyle,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          disabled={score < 0} // Disable button if score is less than 0
        >
          {buttonStatus[rowIndex][colIndex]}
        </Button>
      );
    }),
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

export default SwapTimetable;
