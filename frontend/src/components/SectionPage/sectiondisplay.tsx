import React from "react";
import { Button, Table, TableProps, Tag, Tooltip } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";


interface Section
{
    name: string;
  batch : number;
  courses: string[];
  teachers: string[];
  rooms: string[];
  electives: string|null;
  labs: string|null;
  defaultRoom: string|null;
  semester: number;
  orgId:number;
  timeTable:string;
}

const rowSelection: TableProps<Section>["rowSelection"] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: Section[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: Section) => ({
    disabled: record.name === "Disabled User",
    name: record.name,
  }),
};


const SectionTable = ({
  sectionData,
  setSectionData,
}: {
  sectionData: Section[];
  setSectionData: React.Dispatch<React.SetStateAction<Section[]>>;
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (courses:any) => (
        <>
          {courses.map((course:string, index:any) => (
            <Tag color="blue" key={index}>
              {course}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      key: "teachers",
      render: (teachers:any) => (
        <>
          {teachers.map((teacher:string, index:any) => (
            <Tag color="green" key={index}>
              {teacher}
            </Tag>
          ))}
        </>
      ),
    },
    {
        title: "",
        render: () => {
          return (
            <Tooltip title="Edit">
              <Button
                type="primary"
                shape="circle"
                icon={<MdEdit />}
              />
            </Tooltip>
          );
        },
      },
      {
        title: "",
        render: () => {
          return (
            <Tooltip title="Delete">
              <Button
               className="bg-red-400 "
                type="primary"
                shape="circle"
                icon={<MdDelete />}
              />
            </Tooltip>
          );
        },
      },
  ];

  return <Table columns={columns} dataSource={sectionData} rowKey="name" />;
};

export default SectionTable;
