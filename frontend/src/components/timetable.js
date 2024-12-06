import React from "react";
import { Table, Button } from "antd";

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

const Timetable = ({ buttonStatus, setButtonStatus }) => {

  const handleButtonClick = (rowIndex, colIndex) => {
    const updatedStatus = [...buttonStatus];
    updatedStatus[rowIndex][colIndex] =
      updatedStatus[rowIndex][colIndex] === "Free" ? "Busy" : "Free";
    setButtonStatus(updatedStatus);
  };

  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex,
    day: day,
    buttons: timeslots.map((_, colIndex) => (
      <Button
        key={colIndex}
        className={`w-20 h-8 m-1 text-sm font-semibold rounded-md ${
          buttonStatus[rowIndex][colIndex] === "Busy"
            ? "text-[#F2F2FDFF] bg-[#636AE8FF]"
            : "text-[#636AE8FF] bg-[#F2F2FDFF]"
        }`}
        onClick={() => handleButtonClick(rowIndex, colIndex)}
      >
        {buttonStatus[rowIndex][colIndex]}
      </Button>
    )),
  }));

  const columns = [
    {
      title: "Timeslots",
      dataIndex: "day",
      key: "day",
      render: (text) => (
        <strong className="text-normal" style={{ fontFamily: "Inter" }}>
          {text}
        </strong>
      ),
    },
    ...timeslots.map((slot, index) => ({
      title: slot,
      dataIndex: `button${index}`,
      key: `button${index}`,
      render: (_, record) => (
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
