"use client";
import React from "react";
import { Button, Table, Tag, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";

interface CoreType {
  key: React.Key;
  batchset:string,
  name: string;
  teachers:string[];
  rooms: string[];
}

const data: CoreType[] = [
    { key: "1", batchset: "4CSA", name: "ADLD/OS/ADLD", teachers: ["Raj", "John"], rooms: ["R1", "R2"] },
    { key: "2", batchset: "4CSA", name: "OS/ADLD/OS",  teachers: ["Will", "Jai"], rooms: ["R3", "R4"] },
    { key: "3", batchset: "4CSB", name: "ADLD/OS/ADLD",  teachers: ["Jack", "Pooja"], rooms: ["R5", "R6"] },
    { key: "4", batchset: "4CSB", name: "OS/ADLD/OS",  teachers: ["Ben", "Harry"], rooms: ["R7", "R8"] },
    { key: "5", batchset: "4CSC", name: "OS/ADLD/OS",  teachers: ["Joe", "Smith"], rooms: ["R9", "R10"] },
    { key: "6", batchset: "4CSC", name: "ADLD/OS/ADLD",  teachers: ["Virat", "Ryan"], rooms: ["R11", "R12"] },
    { key: "7", batchset: "4CSD", name: "OS/ADLD/OS",  teachers: ["Rohit", "Jill"], rooms: ["R13", "R14"] },
    { key: "8", batchset: "4CSD", name: "ADLD/OS/ADLD",teachers: ["Mahi", "Sam"], rooms: ["R15", "R16"] }
];
const columns: TableColumnsType<CoreType> = [
    {
      title: "BatchSet",
      dataIndex: "batchset",
      render: (value, row, index) => {
        // Calculate row span
        const rowSpan = index === 0 || data[index - 1].batchset !== value
          ? data.filter((item) => item.batchset === value).length
          : 0;
        return {
          children: value,
          props: {
            rowSpan: rowSpan,
          },
        };
      },
    },
    {
      title: "Lab Name",
      dataIndex: "name",
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      render: (_, { rooms }) => (
        <>
          {rooms.map((tag) => {
            const color = 'blue'
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      render: (_, { rooms }) => (
        <>
          {rooms.map((tag) => {
            const color = 'purple'
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ) 
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
    batchset:"",name: record.name,
  }),
};

const LabTable: React.FC = () => {
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

export default LabTable;
