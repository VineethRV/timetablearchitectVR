"use client";
import React from 'react';
import { Avatar, Button, ConfigProvider, Input, Select, Table, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { FaCheck } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import { DEPARTMENTS_OPTIONS } from '../../../info';

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
const colorCombos: Record<string, string>[] = [
    { textColor: "#FFFFFF", backgroundColor: "#000000" },
    { textColor: "#333333", backgroundColor: "#FFFBCC" },
    { textColor: "#1D3557", backgroundColor: "#A8DADC" },
    { textColor: "#F2F2F2", backgroundColor: "#00796B" },
    { textColor: "#FFFFFF", backgroundColor: "#283593" },
    { textColor: "#FFFFFF", backgroundColor: "#2C3E50" },
    { textColor: "#000000", backgroundColor: "#F2F2F2" },
    { textColor: "#F2F2F2", backgroundColor: "#424242" },
    { textColor: "#000000", backgroundColor: "#F4E04D" },
    { textColor: "#2F4858", backgroundColor: "#F8B400" },
  ];
  
const deptColors: Record<string, string> = {};

interface AccessType {
    key: React.Key,
    name: string,
    email: string,
    department: string,
    level_of_access: "viewer" | "admin" | "editor"
}



const dataWithKeys: AccessType[] = [
    {
      key: '1',
      name: 'John Brown',
      email: "john.brown@gmail.com",
      department: "Computer Science and Engineering",
      level_of_access: "viewer"
    },
    {
      key: '2',
      name: 'Sarah Johnson',
      email: "sarah.johnson@gmail.com",
      department: "Electrical Engineering",
      level_of_access: "editor"
    },
    {
      key: '3',
      name: 'Michael Williams',
      email: "michael.williams@gmail.com",
      department: "Mechanical Engineering",
      level_of_access: "admin"
    },
    {
      key: '4',
      name: 'Emily Davis',
      email: "emily.davis@gmail.com",
      department: "Civil Engineering",
      level_of_access: "viewer"
    },
    {
      key: '5',
      name: 'David Wilson',
      email: "david.wilson@gmail.com",
      department: "Computer Science and Engineering",
      level_of_access: "editor"
    },
    {
      key: '6',
      name: 'Jessica Martinez',
      email: "jessica.martinez@gmail.com",
      department: "Biotechnology",
      level_of_access: "viewer"
    },
    {
      key: '7',
      name: 'Daniel Anderson',
      email: "daniel.anderson@gmail.com",
      department: "Information Technology",
      level_of_access: "admin"
    },
    {
      key: '8',
      name: 'Sophia Taylor',
      email: "sophia.taylor@gmail.com",
      department: "Computer Science and Engineering",
      level_of_access: "editor"
    },
    {
      key: '9',
      name: 'James Thomas',
      email: "james.thomas@gmail.com",
      department: "Electrical Engineering",
      level_of_access: "viewer"
    },
    {
      key: '10',
      name: 'Olivia Harris',
      email: "olivia.harris@gmail.com",
      department: "Mechanical Engineering",
      level_of_access: "admin"
    }
  ];
  

let cnt = 0;

dataWithKeys?.forEach((_) => {
    if (!deptColors[_.department as string]) {
      deptColors[_.department as string] =
        colorCombos[cnt % colorCombos.length].backgroundColor;
      cnt++;
    }
  });

const columns: TableColumnsType<AccessType> = [
    {
      title: "Avatar",
      dataIndex: "name",
      render: (text: string) => {
        return (
          <Avatar
            className="text-xl"
            style={{
              backgroundColor: getRandomColor(),
              verticalAlign: "middle",
            }}
            size="large"
          >
            {text.slice(0, 1)}
          </Avatar>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (dept: string) => {
        return (
          <h1
            style={{
              backgroundColor: deptColors[dept],
              color: colorCombos.find(
                (combo) => combo.backgroundColor === deptColors[dept]
              )?.textColor,
            }}
            className="text-xs opacity-85 font-semibold w-fit px-2.5 py-0.5 rounded-xl"
          >
            {dept}
          </h1>
        );
    },
    },
    {
      title: "Level",
      dataIndex: "level_of_access",
      render: (level: string) => {
        return level.charAt(0).toUpperCase() + level.slice(1);
      },
    },
    {
    title: "",
    render: () => {
        return (
          <Tooltip title="Access">
            <Button
              type="primary"
              className="bg-green-500"
              shape="circle"
              icon={<FaCheck />}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "",
      render: () => {
        return (
          <Tooltip title="Revoke">
            <Button
              className="bg-red-400"
              type="primary"
              shape="circle"
              icon={<MdDelete />}
            />
          </Tooltip>
        );
      },
    },
  ];


const AccessTable = () => {
    return <main className='py-4'>
        <div className="flex space-x-8 justify-between py-6">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="Search"
        />

        {/* this config to set background color of the selectors | did as specified in antd docs */}
        <ConfigProvider
          theme={{
            components: {
              Select: {
                selectorBg: "#F3F4F6FF",
              },
            },
          }}
        >
          <div className="flex space-x-3">
            <Select
              className="w-[300px]"
              defaultValue="All Departments"
            //   value={departmentFilter}
              options={DEPARTMENTS_OPTIONS}
            //   onChange={(e) => setDepartmentFilter(e)}
            />
          </div>
        </ConfigProvider>  
          <Button>Clear filters</Button>
      </div>
        <Table<AccessType>
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{ pageSize: 5 }}
      />
    </main>
};

export default AccessTable;
