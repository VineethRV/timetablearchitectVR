import { Button, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";

interface DataType {
  key: string;
  courseSet: string;
  Course: string;
  teachers: string[];
  rooms: string[];
}

interface LabAddTableProps {
  data: DataType[];
  onEditClick?: (record: DataType) => void;
  onDeleteClick?: (record: DataType) => void;
}

const LabAddTable: React.FC<LabAddTableProps> = ({
  data,
  onEditClick,
  onDeleteClick,
}) => {
  // Helper function to calculate rowSpan
  const calculateRowSpan = (data: DataType[], index: number, key: keyof DataType) => {
    if (index === 0 || data[index][key] !== data[index - 1][key]) {
      let span = 1;
      for (let i = index + 1; i < data.length; i++) {
        if (data[i][key] === data[index][key]) {
          span++;
        } else {
          break;
        }
      }
      return span;
    }
    return 0;
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Course Set",
      dataIndex: "courseSet",
      render: (_, record, index) => {
        const rowSpan = calculateRowSpan(data, index, "courseSet");
        return {
          children: record.courseSet,
          props: { rowSpan },
        };
      },
    },
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
          {rooms[0].split(",").map((tag) => (
            <Tag color="purple" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "",
      render: (record, _, index) => {
        const rowSpan = calculateRowSpan(data, index, "courseSet");
        return {
          children: (
            <Tooltip title="Edit">
              <Button
                type="primary"
                shape="circle"
                icon={<MdEdit />}
                onClick={() => onEditClick && onEditClick(record)}
              />
            </Tooltip>
          ),
          props: { rowSpan },
        };
      },
    },
    {
      title: "",
      render: (record, _, index) => {
        const rowSpan = calculateRowSpan(data, index, "courseSet");
        return {
          children: (
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
          props: { rowSpan },
        };
      },
    },
  ];

  return (
    <div>
      <Table<DataType> columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default LabAddTable;
