// Updated React component
import React, { useState } from "react";
import { Table, Button } from "antd";

// Define the type for the timetable props
interface TimetableProps {
  buttonStatus: string[][];
  setButtonStatus: (status: string[][]) => void;
  timetableScore: number[][];
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

  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    if (timetableScore[rowIndex][colIndex] < 0) return;

    if (!selectedSlot) {
      setSelectedSlot({ rowIndex, colIndex });
    } else {
      const firstSlot = selectedSlot;
      const secondSlot = { rowIndex, colIndex };

      setSwapping({ firstSlot, secondSlot });

      const updatedStatus = buttonStatus.map((row, rIdx) =>
        row.map((course, cIdx) => {
          if (rIdx === firstSlot.rowIndex && cIdx === firstSlot.colIndex) {
            return buttonStatus[rowIndex][colIndex];
          }
          if (rIdx === rowIndex && cIdx === colIndex) {
            return buttonStatus[firstSlot.rowIndex][firstSlot.colIndex];
          }
          return course;
        })
      );

      setTimeout(() => {
        setButtonStatus(updatedStatus);
        setSelectedSlot(null);
        setSwapping({ firstSlot: null, secondSlot: null });
      }, 400);
    }
  };

  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day,
    buttons: timeslots.map((_, colIndex) => {
      const score = timetableScore[rowIndex][colIndex];

      let buttonStyle = {
        backgroundColor: "#FFFFFF",
        color: "#000000",
        borderColor: "#D9D9D9",
      };

      if (score > 90) {
        buttonStyle = {
          backgroundColor: "#004d00",
          color: "#FFFFFF",
          borderColor: "#004d00",
        };
      } else if (score > 60) {
        buttonStyle = {
          backgroundColor: "#228B22",
          color: "#FFFFFF",
          borderColor: "#228B22",
        };
      } else if (score > 40) {
        buttonStyle = {
          backgroundColor: "#32CD32",
          color: "#000000",
          borderColor: "#32CD32",
        };
      } else if (score > 20) {
        buttonStyle = {
          backgroundColor: "#00FA9A",
          color: "#000000",
          borderColor: "#00FA9A",
        };
      } else if (score > 0) {
        buttonStyle = {
          backgroundColor: "#E6FCE6",
          color: "#000000",
          borderColor: "#E6FCE6",
        };
      } else if (score < 0) {
        buttonStyle = {
          backgroundColor: "#FF5722",
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
          } ${isSwapping ? "animate-pulse bg-yellow-300 scale-110 shadow-md" : ""}`}
          onClick={() => handleButtonClick(rowIndex, colIndex)}
          style={{
            ...buttonStyle,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          disabled={score < 0}
        >
          {buttonStatus[rowIndex][colIndex]}
        </Button>
      );
    }),
  }));

  const columns = [
    {
      title: "Timeslots",
      dataIndex: "day",
      key: "day",
      render: (text: string) => <strong style={{ fontFamily: "Inter" }}>{text}</strong>,
    },
    ...timeslots.map((slot, index) => ({
      title: slot,
      dataIndex: `button${index}`,
      key: `button${index}`,
      render: (_: any, record: { buttons: React.ReactNode[] }) => (
        <span style={{ fontFamily: "Inter" }}>{record.buttons[index]}</span>
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
