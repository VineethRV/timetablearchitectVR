import React from "react";
import { Table, Button } from "antd";

// Define the type for the button status state
interface TimetableProps {
  buttonStatus: string[][]; // Array of arrays with "Free" or "Busy"
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

const Timetable: React.FC<TimetableProps> = ({ buttonStatus, setButtonStatus }) => {
  // Handle button click to toggle status
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    const updatedStatus = buttonStatus.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((status, cIdx) =>
            cIdx === colIndex ? (status === "Free" ? "Busy" : "Free") : status
          )
        : row
    );
    setButtonStatus(updatedStatus);
  };

  // Data source for the table
  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day: day,
    buttons: timeslots.map((_, colIndex) => (
      <Button
        key={colIndex}
        className={`w-20 h-8 m-1 text-sm font-semibold rounded-md ${
          buttonStatus[rowIndex][colIndex] === "Free"
            ? "text-[#636AE8FF] bg-[#F2F2FDFF]"
            : "text-[#F2F2FDFF] bg-[#636AE8FF]"
        }`}
        onClick={() => handleButtonClick(rowIndex, colIndex)}
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
      <div className="max-w-[600px] w-full">
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

export default Timetable;
