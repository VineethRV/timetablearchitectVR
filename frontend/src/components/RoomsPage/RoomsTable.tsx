"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  Select,
  Switch,
  Table,
  Tooltip,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { Room } from "../../types/main";
import { toast } from "sonner";
import { TbTrash } from "react-icons/tb";
import { DEPARTMENTS_OPTIONS } from "../../../info";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { statusCodes } from "../../types/statusCodes";
import { colorCombos } from "../../utils/main";
const deptColors: Record<string, string> = {};
let cnt = 0;

const RoomsTable = ({
  roomsData,
  setRoomsData,
}: {
  roomsData: Room[];
  setRoomsData: React.Dispatch<React.SetStateAction<Room[]>>;
}) => {
  const navigate = useNavigate();
   const [searchText, setSearchText] = useState('');
  const [isLab, setIsLab] = useState("Labs");
  const handleEditClick = (name: string, department: string) => {
    navigate(
      `/dashboard/rooms/edit/${encodeURIComponent(name)}/${encodeURIComponent(
        department
      )}`
    );
  };

  function deleteSingleRoom(room: Room) {
    const rooms = [room];
    const res = axios
      .delete(BACKEND_URL + "/rooms", {
        data: {
          rooms,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        switch (status) {
          case statusCodes.OK:
            setRoomsData((prevRooms) =>
              prevRooms.filter(
                (t) => t.name !== room.name || t.department !== room.department
              )
            );
            toast.success("Room deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the room",
    });
  }

  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState(
    "Select a department"
  );

  // Function to clear all fliters
  function clearFilters() {
    setDepartmentFilter("Select a department");
    setIsLab("Labs");
  }

  const rowSelection: TableProps<Room>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: Room[]) => {
      setSelectedRooms(selectedRows);
    },
    getCheckboxProps: (record: Room) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  roomsData?.forEach((room) => {
    if (room.department && !deptColors[room.department as string]) {
      deptColors[room.department as string] =
        colorCombos[cnt % colorCombos.length].backgroundColor;
      cnt++;
    }
  });

  const columns: TableColumnsType<Room> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Lab",
      dataIndex: "lab",
      render: (data) => {
        return <Switch value={data} disabled />;
      },
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
              className="bg-red-400"
              type="primary"
              shape="circle"
              onClick={() => deleteSingleRoom(record)}
              icon={<MdDelete />}
            />
          </Tooltip>
        );
      },
    },
  ];

  function deleteRoomsHandler() {
    if (selectedRooms.length == 0) {
      toast.info("Select Rooms to delete !!");
      return;
    }
    const res = axios
      .delete(BACKEND_URL + "/rooms", {
        data: {
          rooms: selectedRooms,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            setRoomsData((rooms) => {
              const newRooms = rooms.filter((t) => {
                for (let i = 0; i < selectedRooms.length; i++) {
                  if (selectedRooms[i].name == t.name) return false;
                }
                return true;
              });
              return newRooms;
            });
            setSelectedRooms([]);
            toast.success("Rooms deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting Rooms ...",
    });
  }

  const filteredRoomsData = useMemo(() => {
      let filtered = roomsData;
      if (departmentFilter !== "Select a department") {
        filtered = filtered.filter((t) => t.department === departmentFilter);
      }
      if (isLab !== "Labs") {
        filtered = filtered.filter((t) => (isLab==="Yes"?t.lab == true:t.lab == false));
      }
      if (searchText) {
        filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
      }
      return filtered;
    }, [departmentFilter,isLab, searchText, roomsData]);
  
  const dataWithKeys = filteredRoomsData.map((room) => ({
    ...room,
    // @ts-ignore 
    key: room.id,
  }));

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="ClassRoom"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
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
              className="w-[250px]"
              defaultValue="All Departments"
              value={departmentFilter}
              options={DEPARTMENTS_OPTIONS}
              onChange={(e) => setDepartmentFilter(e)}
            />
            <Select
              className="w-[100px]"
              value={isLab}
              onChange={(e) => setIsLab(e)}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
            />
          </div>
        </ConfigProvider>
        <div className="flex space-x-2">
          <Button
            onClick={deleteRoomsHandler}
            className="bg-red-500 text-white font-bold"
          >
            <TbTrash />
            Delete
          </Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </div>
      </div>

      <Table<Room>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RoomsTable;
