"use client";
import React, { useMemo, useState } from "react";
import { Button, ConfigProvider, Input, Select, Table, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { statusCodes } from "../../types/statusCodes";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { CiExport, CiImport, CiSearch } from "react-icons/ci";
import { TbTrash } from "react-icons/tb";
import { colorCombos, DEPARTMENTS_OPTIONS } from "../../../info";

export interface CoreType {
  name: string;
  code: string;
  credits: number;
  department: string;
  hoursperweek: number;
  bfactor: number;
}

const deptColors: Record<string, string> = {};
let cnt = 0;

const CoreTable = ({
  CoreData,
  setCoreData,
}: {
  CoreData: CoreType[];
  setCoreData: React.Dispatch<React.SetStateAction<CoreType[]>>;
}) => {
  const navigate = useNavigate();
  const [selectedCore, setSelectedCore] = useState<CoreType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState("Select a department");
  const [hpw, setHpw] = useState(null);
  function clearFilters() {
    setDepartmentFilter("Select a department");
    setHpw(null)
    setSearchText(""); // Reset search text as well
  }

  const rowSelection: TableProps<CoreType>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: CoreType[]) => {
      setSelectedCore(selectedRows)
    }
  };

  function deleteSingleCore(core: CoreType) {
    const res = axios
      .delete(BACKEND_URL + "/courses", {
        data: {
          courseCode: core.code,
          semester: Number(localStorage.getItem("semester")),
          department: core.department
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        switch (status) {
          case statusCodes.OK:
            setCoreData((prevTeachers) =>
              prevTeachers.filter((t) => t.name !== core.name)
            );
            toast.success("Course deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the Course",
    });
  }

  CoreData?.forEach((core) => {
    if (core.department && !deptColors[core.department as string]) {
      deptColors[core.department as string] =
        colorCombos[cnt % colorCombos.length].backgroundColor;
      cnt++;
    }
  });

  const filteredCoreData = useMemo(() => {
    let filtered = CoreData;
    if (departmentFilter !== "Select a department") {
      filtered = filtered.filter((t) => t.department === departmentFilter);
    }
    if (hpw !== null) {
      console.log(hpw)
      filtered = filtered.filter((t) => (t.credits == hpw));
    }
    if (searchText) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return filtered;
  }, [departmentFilter,hpw, searchText,CoreData]);


  const handleEditClick = (name: string, department: string) => {
    navigate(
      `/dashboard/courses/core-courses/edit/${encodeURIComponent(
        name
      )}/${encodeURIComponent(department)}`
    );
  };

  const columns: TableColumnsType<CoreType> = [
    {
      title: "Course Name",
      dataIndex: "name",
    },
    {
      title: "Course code ",
      dataIndex: "code",
    },
    {
      title: "Hours per week",
      dataIndex: "credits",
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
      title: "",
      render: (record) => {
        return (
          <Tooltip title="Edit">
            <Button
              type="primary"
              onClick={() => handleEditClick(record.name, record.department)}
              shape="circle"
              icon={<MdEdit />}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "",
      render: (record) => {
        return (
          <Tooltip title="Delete">
            <Button
              className="bg-red-400 "
              type="primary"
              shape="circle"
              onClick={() => deleteSingleCore(record)}
              icon={<MdDelete />}
            />
          </Tooltip>
        );
      },
    },
  ];

  function deleteCoreHandler() {
    if (selectedCore.length == 0) {
      toast.info("Select Core to delete !!");
      return;
    }
    selectedCore.map((core)=>{

      const res = axios
      .delete(BACKEND_URL + "/courses", {
        data: {
          courseCode: core.code,
          semester: Number(localStorage.getItem("semester")),
          department: core.department
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const statusCode = res.status;
        console.log(res.data)
        switch (statusCode) {
          case statusCodes.OK:
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            return;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
            return;
        }
      });

    toast.promise(res, {
      loading: "Deleting Courses ...",
    });
    })
    setCoreData((Core) => {
      const newCore = Core.filter((t) => {
        for (let i = 0; i < selectedCore.length; i++) {
          if (selectedCore[i].name == t.name) return false;
        }
        return true;
      });
      return newCore;
    });
    setSelectedCore([]);
    toast.success("Courses deleted successfully");
  }

  const dataWithKeys = filteredCoreData.map((core) => ({
    ...core,
    //@ts-ignore
    key: core.id 
  }));
  const handleSearch = (value: string) => {
    setSearchText(value);
  };


  return (
    <div>
      <div className="flex space-x-3 justify-end py-1">
        <Button className="bg-[#F2F2FDFF] text-primary font-bold" disabled>
          <CiImport />
          Import
        </Button>
        <Button className="bg-primary text-white font-bold" disabled>
          <CiExport />
          Export
        </Button>
      </div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="Course"
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
<Select
  placeholder="Hours per week"
  className="min-w-[100px]"
  value={hpw}
  onChange={(e) => setHpw(e)}
  options={Array.from({ length: 10 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }))}
/>
          </div>
        </ConfigProvider>
        <div className="flex space-x-2">
          <Button
            onClick={deleteCoreHandler}
            className="bg-red-500 text-white font-bold"
          >
            <TbTrash />
            Delete
          </Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </div>
      </div>
      <Table<CoreType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CoreTable;
