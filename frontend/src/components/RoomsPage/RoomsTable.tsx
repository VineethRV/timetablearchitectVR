"use client";
import React, { useMemo, useState } from "react";
import { Button, ConfigProvider, Input, Select, Switch, Table, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { Room } from "@/app/types/main";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteRooms } from "@/lib/actions/room";
import { statusCodes } from "@/app/types/statusCodes";
import { TbTrash } from "react-icons/tb";
import { DEPARTMENTS_OPTIONS } from "@/info";
import { CiSearch } from "react-icons/ci";

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
let cnt = 0;


const RoomsTable = ({ roomsData, setRoomsData}: { roomsData: Room[], setRoomsData: React.Dispatch<React.SetStateAction<Room[]>> }) => {

  const router=useRouter();

  const handleEditClick = (name: string, department: string) => {
    router.push(`/dashboard/rooms/edit/${encodeURIComponent(name)}/${encodeURIComponent(department)}`);
  };

 const  handleDeleteClick=(Room:Room)=>{
    setSelectedRooms([Room])
    deleteRoomsHandler()
 }

  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [departmentFilter, setDepartmentFilter] = useState("Select a department");

  // Function to clear all fliters
  function clearFilters() {
    setDepartmentFilter("Select a department");
  }

const rowSelection: TableProps<Room>["rowSelection"] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: Room[]) => {
    setSelectedRooms(selectedRows)
  },
  getCheckboxProps: (record: Room) => ({
    disabled: record.name === "Disabled User",
    name: record.name,
  }),
};

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
            <Button type="primary"  onClick={() => handleEditClick(record.name, record.department)} shape="circle" icon={<MdEdit />} />
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
            onClick={()=>handleDeleteClick(record)}
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
    const res = deleteRooms(localStorage.getItem('token') || "", selectedRooms).then((res) => {
      const statusCode = res.status;
      switch (statusCode) {
        case statusCodes.OK:
          setRoomsData((rooms) => {
            const newRooms = rooms.filter((t) => {
              for (let i = 0; i < selectedRooms.length; i++) {
                if (selectedRooms[i].name == t.name) return false;
              }
              return true;
            })
            return newRooms
          })
          setSelectedRooms([])
          toast.success("Rooms deleted successfully");
          break;
        case statusCodes.BAD_REQUEST:
          toast.error("Invalid request");
          break;
        case statusCodes.INTERNAL_SERVER_ERROR:
          toast.error("Server error")
      }
    })

    toast.promise(res, {
      loading: "Deleting Rooms ..."
    })
  }

  roomsData?.forEach((room) => {
    if (!deptColors[room.department as string]) {
      deptColors[room.department as string] =
        colorCombos[cnt % colorCombos.length].backgroundColor;
      cnt++;
    }
  });

  const filteredRoomsData = useMemo(() => {
    if (departmentFilter == "Select a department") {
      return roomsData;
    }

    const new_Rooms = roomsData.filter((t) => t.department == departmentFilter)
    return new_Rooms;
  }, [departmentFilter,roomsData])

  const dataWithKeys = filteredRoomsData.map((room) => ({
    ...room,
    key: room.name
  }));

  return (
    <div>
    <div className="flex space-x-8 justify-between py-4">
      <Input
        className="w-fit"
        addonBefore={<CiSearch />}
        placeholder="ClassRoom"
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
          <Select
            className="w-[250px]"
            defaultValue="All Departments"
            value={departmentFilter}
            options={DEPARTMENTS_OPTIONS}
            onChange={(e) => setDepartmentFilter(e)}
          />
          <Select
            className="w-[70px]"
            defaultValue="Labs"
            options={[{label:"Yes",value:1},{label:"No",value:2}]}
          />
        </div>
      </ConfigProvider>
      <div className="flex space-x-2">
        <Button onClick={deleteRoomsHandler} className="bg-red-500 text-white font-bold">
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
