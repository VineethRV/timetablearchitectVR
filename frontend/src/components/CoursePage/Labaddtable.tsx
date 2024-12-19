import React from "react";
import { Button, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";

interface DataType {
  key: string;
  Course: string;
  teachers: string[];
  rooms: string[];
}

interface LabAddTableProps {
  data: DataType[]; // Prop to pass the list of courses, teachers, and rooms
  onEditClick?: (record: DataType) => void; // Optional edit click handler
  onDeleteClick?: (record: DataType) => void; // Optional delete click handler
}

const LabAddTable: React.FC<LabAddTableProps> = ({
  data,
  onEditClick,
  onDeleteClick,
}) => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Course",
      dataIndex: "Course",
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      render: (_, { teachers }) => (
        <>
          {teachers[0].split(",").map((tag) => (
            <Tag color="blue" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      render: (_, { rooms }) => (
        <>
          {rooms.map((tag) => (
            <Tag color="purple" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Tooltip title="Edit">
          <Button
            type="primary"
            shape="circle"
            icon={<MdEdit />}
            onClick={() => onEditClick && onEditClick(record)}
          />
        </Tooltip>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Tooltip title="Delete">
          <Button
            className="bg-red-400"
            type="primary"
            shape="circle"
            icon={<MdDelete />}
            onClick={() => onDeleteClick && onDeleteClick(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Table<DataType> columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default LabAddTable;
