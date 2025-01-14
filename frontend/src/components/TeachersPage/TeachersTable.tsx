"use client";
import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  ConfigProvider,
  Input,
  Select,
  Table,
  Tooltip,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { Teacher } from "../../types/main";
import { statusCodes } from "../../types/statusCodes";
import { toast } from "sonner";
import { TbTrash } from "react-icons/tb";
import { DEPARTMENTS_OPTIONS } from "../../../info";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { colorCombos, getRandomColor } from "../../utils/main";


const deptColors: Record<string, string> = {};
let cnt = 0;

const TeachersTable = ({
  teachersData,
  setTeachersData,
}: {
  teachersData: Teacher[];
  setTeachersData: React.Dispatch<React.SetStateAction<Teacher[]>>;
}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState("Select a department");
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

  // Function to handle edit action
  const handleEditClick = (name: string, department: string) => {
    navigate(`/dashboard/teachers/edit/${encodeURIComponent(name)}/${encodeURIComponent(department)}`);
  };

  // Clear filters function
  function clearFilters() {
    setDepartmentFilter("Select a department");
    setSearchText(""); // Reset search text as well
  }

  // Row Selection Logic
  const rowSelection: TableProps<Teacher>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: Teacher[]) => {
      setSelectedTeachers(selectedRows);
    },
  };

  // Delete a single teacher
  function deleteSingleTeacher(teacher: Teacher) {
    const teachers = [teacher];
    const res = axios
      .delete(BACKEND_URL + "/teachers", {
        data: {
          teachers,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        switch (status) {
          case statusCodes.OK:
            setTeachersData((prevTeachers) =>
              prevTeachers.filter((t) => t.email !== teacher.email)
            );
            toast.success("Teacher deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the teacher",
    });
  }



  // Columns configuration for the table
  const columns: TableColumnsType<Teacher> = [
    {
      title: "Avatar",
      dataIndex: "name",
      render: (text: string) => (
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
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Initials",
      dataIndex: "initials",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (dept: string) => (
        <h1
          style={{
            backgroundColor: deptColors[dept],
            color: colorCombos.find((combo) => combo.backgroundColor === deptColors[dept])?.textColor,
          }}
          className="text-xs opacity-85 font-semibold w-fit px-2.5 py-0.5 rounded-xl"
        >
          {dept}
        </h1>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Tooltip title="Edit">
          <Button
            type="primary"
            onClick={() => handleEditClick(record.name, record.department)}
            shape="circle"
            icon={<MdEdit />}
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
            onClick={() => deleteSingleTeacher(record)}
            icon={<MdDelete />}
          />
        </Tooltip>
      ),
    },
  ];

  // Assign department colors for consistency
  teachersData?.forEach((teacher) => {
    if (teacher.department && !deptColors[teacher.department]) {
      deptColors[teacher.department] = colorCombos[cnt % colorCombos.length].backgroundColor;
      cnt++;
    }
  });

  // Memoizing the result of filteredTeachers
  const filteredTeachersData = useMemo(() => {
    let filtered = teachersData;
    if (departmentFilter !== "Select a department") {
      filtered = filtered.filter((t) => t.department === departmentFilter);
    }
    if (searchText) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return filtered;
  }, [departmentFilter, searchText, teachersData]);

  // Data with unique keys for table
  const dataWithKeys = filteredTeachersData?.map((teacher) => ({
    ...teacher,
    //@ts-ignore
    key: teacher.id, 
  }));

  // Handle search text change
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  function deleteTeachersHandler(teachers: Teacher[]) {
    if (selectedTeachers.length == 0) {
      toast.info("Select teachers to delete !!");
      return;
    }
    const res = axios
      .delete(BACKEND_URL + "/teachers", {
        data: { teachers },
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            setTeachersData((prevTeachers) =>
              prevTeachers.filter(
                (prevTeacher) =>
                  !teachers.some(
                    (teacher) => teacher.email === prevTeacher.email
                  )
              )
            );
            setSelectedTeachers([]);
            toast.success("Teachers deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting teachers ...",
    });
  }

  return (
    <div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="Teacher"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />

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
              value={departmentFilter}
              options={DEPARTMENTS_OPTIONS}
              onChange={(e) => setDepartmentFilter(e)}
            />
          </div>
        </ConfigProvider>

        <div className="flex space-x-2">
          <Button
            onClick={() => deleteTeachersHandler(selectedTeachers)}
            className="bg-red-500 text-white font-bold"
          >
            <TbTrash />
            Delete
          </Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </div>
      </div>

      <Table<Teacher>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TeachersTable;
