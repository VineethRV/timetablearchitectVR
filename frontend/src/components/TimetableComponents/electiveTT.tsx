import React from "react";
import { Table, Button } from "antd";
import { timeslots, weekdays } from "../../utils/main";

// Define the type for the button status state
interface EleTimetableProps {
  buttonStatus: string[][]; // Array of arrays with "Free" or "Busy"
  setButtonStatus: (status: string[][]) => void;
  courseName:string;
  score: number[][]
  max:number;
}

const EleTimetable: React.FC<EleTimetableProps> = ({ buttonStatus, setButtonStatus,courseName,score,max }) => {
  // Handle button click to toggle status
  
  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    console.log(score)
    const updatedStatus = buttonStatus.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((status, cIdx) =>
            cIdx === colIndex ? (status==courseName?`${score[rowIndex][colIndex]}`:(score[rowIndex][colIndex] > 0 ? courseName: status)) : status
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
        className={`w-20 h-8 m-1 text-sm font-semibold rounded-md `}
        onClick={() => handleButtonClick(rowIndex, colIndex)}
        style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
           backgroundColor: buttonStatus[rowIndex][colIndex]==courseName?"#636AE8FF":(score[rowIndex][colIndex] > 0? `rgb(0, ${255 * (score[rowIndex][colIndex])/max}, 0)` : "rgb(220,220,220)"),
           color: buttonStatus[rowIndex][colIndex]==courseName?"white":"black",
          }}
      >
        {(buttonStatus[rowIndex][colIndex]==courseName?courseName:score[rowIndex][colIndex]>0?"Available":"Unavailable")}
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

export default EleTimetable;