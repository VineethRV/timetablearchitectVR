"use client";
import React, { useState } from "react";
import { Button, ConfigProvider, Input, Select, Table, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { Course } from "../../types/main";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { statusCodes } from "../../types/statusCodes";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { CiExport, CiImport, CiSearch } from "react-icons/ci";
import { TbTrash } from "react-icons/tb";

interface CoreType {
  key: React.Key;
  name: string;
  code:string;
  credits: number;
  hoursperweek:number;
  bfactor:number;
}



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

const CoreTable= ({
  CoreData,
  setCoreData,
}: {
  CoreData: Course[];
  setCoreData: React.Dispatch<React.SetStateAction<Course[]>>;
}) => {
  const navigate = useNavigate();
  const [selectedCore, setSelectedCore] = useState<Course[]>([]);
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

function deleteCoreHandler() {
  if (selectedCore.length == 0) {
    toast.info("Select Core to delete !!");
    return;
  }
  const res = axios
    .delete(BACKEND_URL + "/courses", {
      data: {
        Core: selectedCore,
      },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      const statusCode = res.status;
      switch (statusCode) {
        case statusCodes.OK:
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
          toast.success("Core deleted successfully");
          break;
        case statusCodes.BAD_REQUEST:
          toast.error("Invalid request");
          break;
        case statusCodes.INTERNAL_SERVER_ERROR:
          toast.error("Server error");
      }
    });

  toast.promise(res, {
    loading: "Deleting Core ...",
  });
}
function clearFilters() {;
}

  return (
    <div>
   <div className="flex space-x-3 justify-end py-1">
        <Button className="bg-[#F2F2FDFF] text-primary font-bold">
          <CiImport />
          Import
        </Button>
        <Button className="bg-primary text-white font-bold">
          <CiExport />
          Export
        </Button>
      </div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="Course"
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
              defaultValue="Sort By"
              style={{ width: 120 }}
              options={[]}
            />
            <Select defaultValue="Number of credits" options={[]} />
            <Select defaultValue="Hours per week" options={[]} />
          </div>
        </ConfigProvider>
        <div className="flex space-x-2">
          <Button className="bg-red-500 text-white font-bold">
            <TbTrash />Delete
          </Button>
          <Button>Clear filters</Button>
        </div>
      </div>
      <Table<CoreType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={CoreData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CoreTable;
