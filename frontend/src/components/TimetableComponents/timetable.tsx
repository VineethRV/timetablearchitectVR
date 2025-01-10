import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import { timeslots, weekdays } from "../../utils/main";

interface TimetableProps {
  buttonStatus: string[][];
  setButtonStatus: (status: string[][]) => void;
}

const Timetable: React.FC<TimetableProps> = ({ buttonStatus, setButtonStatus }) => {
  const [editingCell, setEditingCell] = useState<{ row: number, col: number } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const handleButtonClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setInputValue(buttonStatus[rowIndex][colIndex]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = (rowIndex: number, colIndex: number) => {
    const updatedStatus = buttonStatus.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((status, cIdx) =>
            cIdx === colIndex ? inputValue : status
          )
        : row
    );
    setButtonStatus(updatedStatus);
    setEditingCell(null);
  };

  const dataSource = weekdays.map((day, rowIndex) => ({
    key: rowIndex.toString(),
    day: day,
    buttons: timeslots.map((_, colIndex) => (
      editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
        <Input
          key={colIndex}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => handleInputBlur(rowIndex, colIndex)}
          autoFocus
        />
      ) : (
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
      )
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
