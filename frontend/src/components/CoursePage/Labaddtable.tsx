import { Button, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface BatchFields {
  key: string;
  courseSet: string;
  course: string;
  teachers: string[];
  rooms: string[];
}

interface LabAddTableProps {
  data: BatchFields[];
  batchsize: number;
  onEditClick?: (record: BatchFields[]) => void;
}

const LabAddTable: React.FC<LabAddTableProps> = ({
  data,
  batchsize,
  onEditClick
}) => {
  // Helper function to calculate rowSpan
  const [ldata, setData] = useState(data)

  useEffect(()=>{
    setData(data)
  },[data])

  const handleDelete = (record: BatchFields) => {
      setData((prevData) =>
        prevData.filter(
          (item) =>
            !(
              parseInt(item.key) >= parseInt(record.key) &&
              parseInt(item.key) < parseInt(record.key) + batchsize
            )
        )
      )
};

  const calculateRowSpan = (data: BatchFields[], index: number, key: keyof BatchFields) => {
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

  const columns: TableProps<BatchFields>["columns"] = [
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
      dataIndex: "course",
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      render: (_, { teachers }) => (
        <>
          {teachers.map((teacher,tag) => (
            <Tag color="blue" key={tag}>
              {teacher.toUpperCase()}
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
                onClick={() => {
                  const currentKey = parseInt(record.key); 
                  const recordsToEdit = ldata.filter(
                    (item) => parseInt(item.key) >= currentKey && parseInt(item.key) < currentKey + batchsize
                  );
                  onEditClick && onEditClick(recordsToEdit); 
                }}
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
                onClick={() => {handleDelete(record)}}
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
      <Table<BatchFields> columns={columns} dataSource={ldata} pagination={false} />
    </div>
  );
};

export default LabAddTable;
