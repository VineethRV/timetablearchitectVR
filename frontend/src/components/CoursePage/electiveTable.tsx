"use client";
import React, { useState } from "react";
import { Button, ConfigProvider, Input, Table, Tag, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { statusCodes } from "../../types/statusCodes";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { Elective } from "../../types/main";

const ElectivesTable = ({
  ElectiveData,
  setElectivesData,
}: {
  ElectiveData: Elective[];
  setElectivesData: React.Dispatch<React.SetStateAction<Elective[]>>;
}) => {
  const navigate = useNavigate();

  const handleEditClick = (name: string, department: string) => {
    navigate(
      `/dashboard/electives/edit/${encodeURIComponent(
        name
      )}/${encodeURIComponent(department)}`
    );
  };

  const [selectedElectives, setSelectedElectives] = useState<Elective[]>([]);

  // Format Elective data to split values by ';' and display each in separate rows
  const formatElectiveData = (ElectiveData: Elective[]) => {
    return ElectiveData.flatMap((Elective) => {
      const names = Elective.name.split(";");
      const courses = Elective.courses?.split(";") || [];
      const rooms = Elective.rooms?.split(";") || [];
      const teachers = Elective.teachers?.split(";") || [];
      
      const maxLength = Math.max(courses.length, rooms.length, teachers.length);
      
      // Create rows for each batch, teacher, and room pairing
      return Array.from({ length: maxLength }, (_, index) => ({
        key: `${Elective.name}-${index}`,  // Unique key for each row
        name: index===0?Elective.name.trim():"",
        courses: courses[index]?.trim() || "",
        teachers: teachers[index]?.trim() || "",
        rooms: rooms[index]?.trim() || "",
      }));
    });
  };
  const formattedElectiveData = React.useMemo(() => formatElectiveData(ElectiveData), [ElectiveData]);
  // Row Selection logic by ant design
  console.log("ele",ElectiveData)
  const rowSelection: TableProps<Elective>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: Elective[]) => {
      setSelectedElectives(selectedRows);
    },
    getCheckboxProps: (record: Elective) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  // Function to delete a single Elective
  function deleteSingleElective(Elective: Elective) {
    const Electives = [Elective];
    const res = axios
      .delete(BACKEND_URL + "/electives", {
        data: {
          Electives,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        switch (status) {
          case statusCodes.OK:
            toast.success("Elective deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the Elective",
    });
  }

  // Columns configuration for the table
  const columns: TableColumnsType<Elective> = [
    {
      title: "BatchSet",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any, index: number) => {
        // Check if the current cell is empty and merge with the previous non-empty cell
        if (text === "") {
          for (let i = index - 1; i >= 0; i--) {
            if (formattedElectiveData[i].name !== "") {
              return {
                children: null, // Ensure the cell doesn't show anything
                props: {
                  rowSpan: 0, // Merge the current cell with the previous cell
                },
              };
            }
          }
        }
    
        // For non-empty cells, calculate the rowSpan
        let rowSpan = 1;
        for (let i = index + 1; i < formattedElectiveData.length; i++) {
          if (formattedElectiveData[i].name === "") {
            rowSpan++;
          } else {
            break;
          }
        }
    
        return {
          children: text, 
          props: {
            rowSpan, 
          },
        };
      },
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      key: "teachers",
      render: (_, { teachers }) => (
        <>
          {teachers?.split(",").map((tag) => (
            <Tag color="blue" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      key: "rooms",
      render: (_, { rooms }) => (
        <>
          {rooms?.split(",").map((tag) => (
            <Tag color="purple" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
   {
  title: "",
  render: (record) => {
    return (
        <Tooltip title="Edit">
          <Button
            type="primary"
            onClick={() => deleteSingleElective(record)}
            shape="circle"
            icon={<MdEdit />}
          />
        </Tooltip>
    );
    }
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
              onClick={() => deleteSingleElective(record)}
              icon={<MdDelete />}
            />
          </Tooltip>
        );
      },
    },
  ];

  // Function to handle deleting multiple Electives
  function deleteElectivesHandler(Electives: Elective[]) {
    if (selectedElectives.length == 0) {
      toast.info("Select Electives to delete !!");
      return;
    }
    const res = axios
      .delete(BACKEND_URL + "/Electives", {
        data: { Electives },
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            setSelectedElectives([]);
            toast.success("Electives deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting Electives ...",
    });
  }

  return (
    <div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="ElectiveSet"
        />
        <ConfigProvider
          theme={{
            components: {
              Select: {
                selectorBg: "#F3F4F6FF",
              },
            },
          }}
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => deleteElectivesHandler(selectedElectives)}
            className="bg-red-500 text-white font-bold"
          >
            <TbTrash />
            Delete
          </Button>
        </div>
      </div>

      <Table<Elective>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={formattedElectiveData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ElectivesTable;
