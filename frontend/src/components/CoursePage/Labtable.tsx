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
import { Lab } from "../../types/main";

const LabsTable = ({
  labData,
  setLabsData,
}: {
  labData: Lab[];
  setLabsData: React.Dispatch<React.SetStateAction<Lab[]>>;
}) => {
  const navigate = useNavigate();

  const handleEditClick = (name: string, department: string) => {
    navigate(
      `/dashboard/labs/edit/${encodeURIComponent(
        name
      )}/${encodeURIComponent(department)}`
    );
  };

  const [selectedLabs, setSelectedLabs] = useState<Lab[]>([]);

  // Format lab data to split values by ';' and display each in separate rows
  const formatLabData = (labData: Lab[]) => {
    return labData.flatMap((lab) => {
      const names = lab.name.split(";");
      const batches = lab.batches?.split(";") || [];
      const rooms = lab.rooms?.split(";") || [];
      const teachers = lab.teachers?.split(";") || [];
      
      const maxLength = Math.max(batches.length, rooms.length, teachers.length);
      
      // Create rows for each batch, teacher, and room pairing
      return Array.from({ length: maxLength }, (_, index) => ({
        key: `${lab.name}-${index}`,  // Unique key for each row
        name: index===0?lab.name.trim():"",
        batches: batches[index]?.trim() || "",
        teachers: teachers[index]?.trim() || "",
        rooms: rooms[index]?.trim() || "",
      }));
    });
  };
  const formattedLabData = React.useMemo(() => formatLabData(labData), [labData]);
  // Row Selection logic by ant design
  const rowSelection: TableProps<Lab>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: Lab[]) => {
      setSelectedLabs(selectedRows);
    },
    getCheckboxProps: (record: Lab) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  // Function to delete a single lab
  function deleteSingleLab(Lab: Lab) {
    const Labs = [Lab];
    const res = axios
      .delete(BACKEND_URL + "/labs", {
        data: {
          Labs,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        switch (status) {
          case statusCodes.OK:
            toast.success("Lab deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the Lab",
    });
  }

  // Columns configuration for the table
  const columns: TableColumnsType<Lab> = [
    {
      title: "BatchSet",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any, index: number) => {
        // Check if the current cell is empty and merge with the previous non-empty cell
        if (text === "") {
          for (let i = index - 1; i >= 0; i--) {
            if (formattedLabData[i].name !== "") {
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
        for (let i = index + 1; i < formattedLabData.length; i++) {
          if (formattedLabData[i].name === "") {
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
            onClick={() => deleteSingleLab(record)}
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
              onClick={() => deleteSingleLab(record)}
              icon={<MdDelete />}
            />
          </Tooltip>
        );
      },
    },
  ];

  // Function to handle deleting multiple labs
  function deleteLabsHandler(Labs: Lab[]) {
    if (selectedLabs.length == 0) {
      toast.info("Select Labs to delete !!");
      return;
    }
    const res = axios
      .delete(BACKEND_URL + "/labs", {
        data: { Labs },
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            setSelectedLabs([]);
            toast.success("Labs deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting Labs ...",
    });
  }

  return (
    <div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="LabSet"
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
            onClick={() => deleteLabsHandler(selectedLabs)}
            className="bg-red-500 text-white font-bold"
          >
            <TbTrash />
            Delete
          </Button>
        </div>
      </div>

      <Table<Lab>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={formattedLabData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default LabsTable;
