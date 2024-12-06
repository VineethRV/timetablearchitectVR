"use client";
import React from "react";
import { Button, Table, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";

interface CoreType {
  key: React.Key;
  name: string;
  coursecode:string;
  credits: number;
  hoursperweek:number;
  bfactor:number;
}

const data: CoreType[] = [
  { key: "1", name: "Data Structures", coursecode: "CS201", credits: 4, hoursperweek: 3, bfactor: 1.5 },
  { key: "2", name: "Algorithms", coursecode: "CS202", credits: 4, hoursperweek: 3, bfactor: 1.5 },
  { key: "3", name: "Operating Systems", coursecode: "CS301", credits: 4, hoursperweek: 4, bfactor: 1.6 },
  { key: "4", name: "Computer Networks", coursecode: "CS302", credits: 4, hoursperweek: 3, bfactor: 1.4 },
  { key: "5", name: "Database Management Systems", coursecode: "CS303", credits: 4, hoursperweek: 3, bfactor: 1.5 },
  { key: "6", name: "Compiler Design", coursecode: "CS304", credits: 4, hoursperweek: 3, bfactor: 1.6 },
  { key: "7", name: "Artificial Intelligence", coursecode: "CS401", credits: 3, hoursperweek: 3, bfactor: 1.7 },
  { key: "8", name: "Machine Learning", coursecode: "CS402", credits: 3, hoursperweek: 4, bfactor: 1.8 },
  { key: "9", name: "Software Engineering", coursecode: "CS403", credits: 3, hoursperweek: 3, bfactor: 1.4 },
  { key: "10", name: "Cloud Computing", coursecode: "CS404", credits: 3, hoursperweek: 3, bfactor: 1.6 },
  { key: "11", name: "Cybersecurity", coursecode: "CS405", credits: 3, hoursperweek: 3, bfactor: 1.5 },
  { key: "12", name: "Big Data Analytics", coursecode: "CS406", credits: 3, hoursperweek: 4, bfactor: 1.7 },
  { key: "13", name: "Distributed Systems", coursecode: "CS407", credits: 4, hoursperweek: 4, bfactor: 1.6 },
  { key: "14", name: "Computer Graphics", coursecode: "CS408", credits: 3, hoursperweek: 3, bfactor: 1.4 },
  { key: "15", name: "Human-Computer Interaction", coursecode: "CS409", credits: 3, hoursperweek: 3, bfactor: 1.3 },
  { key: "16", name: "Internet of Things", coursecode: "CS410", credits: 3, hoursperweek: 3, bfactor: 1.5 },
  { key: "17", name: "Blockchain Technology", coursecode: "CS411", credits: 3, hoursperweek: 3, bfactor: 1.7 },
  { key: "18", name: "Parallel Computing", coursecode: "CS412", credits: 4, hoursperweek: 4, bfactor: 1.8 },
  { key: "19", name: "Natural Language Processing", coursecode: "CS413", credits: 3, hoursperweek: 4, bfactor: 1.6 },
  { key: "20", name: "Robotics", coursecode: "CS414", credits: 3, hoursperweek: 3, bfactor: 1.5 },
];

const columns: TableColumnsType<CoreType> = [
    {
        title: "Course Name",
        dataIndex: "name",
      },
      {
        title: "Course code ",
        dataIndex: "coursecode",
      },
      {
        title: "Number of Credits ",
        dataIndex: "credits",
      },
      {
        title: "Hours per week ",
        dataIndex: "hoursperweek",
      },
      {
        title: "Difficulty Rating ",
        dataIndex: "bfactor",
      },
  {
    title: "",
    render: () => {
      return (
        <Tooltip title="Edit">
          <Button type="primary" shape="circle" icon={<MdEdit />} />
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

const rowSelection: TableProps<CoreType>["rowSelection"] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: CoreType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: CoreType) => ({
    disabled: record.name === "Disabled User",
    name: record.name,
  }),
};

const RoomsTable: React.FC = () => {
  return (
    <div>
      <Table<CoreType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RoomsTable;
