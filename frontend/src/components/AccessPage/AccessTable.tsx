"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ConfigProvider,
  Input,
  Select,
  Table,
  Tooltip,
} from "antd";
import type { TableColumnsType } from "antd";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { colorCombos, DEPARTMENTS_OPTIONS } from "../../../info";
import Loading from "../Loading/Loading";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { statusCodes } from "../../types/statusCodes";
import { toast } from "sonner";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const deptColors: Record<string, string> = {};

interface AccessType {
  key: React.Key;
  name: string;
  email: string;
  department: string;
  level_of_access: "viewer" | "admin" | "editor";
}

const AccessTable = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AccessType[]>([]);

  async function accessHandler(id: React.Key, access: Boolean) {
    axios
      .post(
        BACKEND_URL + "/admin/change_access",
        {
          access_id: id,
          access,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.data.status;
        if (status == statusCodes.OK) {
          setData((prevData) => prevData.filter((item) => item.key !== id));
        } else if (status == statusCodes.UNAUTHORIZED) {
          toast.error("Not allowed!!");
        } else if (status == statusCodes.INTERNAL_SERVER_ERROR) {
          toast.error("Server error!!");
        }
      });
  }

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
      render: ({ key }) => {
        return (
          <Tooltip title="Access">
            <Button
              onClick={() => accessHandler(key, true)}
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
      render: ({ key }) => {
        return (
          <Tooltip title="Revoke">
            <Button
              onClick={() => accessHandler(key, false)}
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

  data?.forEach((item, index) => {
    if (!deptColors[item.department]) {
      deptColors[item.department] =
        colorCombos[index % colorCombos.length].backgroundColor;
    }
  });

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/admin/get_access_requests", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        if (status == statusCodes.OK) {
          const formattedData = res.data.data.map((item: any) => ({
            key: item.id,
            name: item.user.name,
            email: item.user.email,
            department: item.department,
            level_of_access: item.level,
          }));
          setData(formattedData);
        } else {
          
        }
        
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="py-4">
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
              options={DEPARTMENTS_OPTIONS}
            />
          </div>
        </ConfigProvider>
        <Button>Clear filters</Button>
      </div>
      <Table<AccessType>
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </main>
  );
};

export default AccessTable;
