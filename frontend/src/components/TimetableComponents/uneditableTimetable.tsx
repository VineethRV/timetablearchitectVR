import React from "react";
import { Table, Button } from "antd";
import { timeslots, weekdays } from "../../utils/main";

// Define the type for the button status state
interface UneditableTimeTableProps {
  buttonStatus: string[][]; // Array of arrays with "Free" or "Busy"
  setButtonStatus: (status: string[][]) => void; 
  editable: Boolean
}

const UneditableTimeTable: React.FC<UneditableTimeTableProps> = ({ buttonStatus, setButtonStatus,editable }) => {
  // Handle button click to toggle status
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    if(!editable)
    {
      return;
    }
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

export default UneditableTimeTable;