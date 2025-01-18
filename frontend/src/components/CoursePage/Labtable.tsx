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

interface labs{
    key: string;
    name: string;
    batches: string;
    teachers: string;
    rooms: string;
    department: string | null;
}

const LabsTable = ({
  labData,
  setLabsData,
}: {
  labData: Lab[];
  setLabsData: React.Dispatch<React.SetStateAction<Lab[]>>;
}) => {
  const navigate = useNavigate();
  const [_searchText, _setSearchText] = useState('');
  const handleEditClick = (name: string, department: string) => {
    navigate(
      `/dashboard/courses/labs/edit/${encodeURIComponent(
        name
      )}/${encodeURIComponent(department)}`
    );
  };

  const [selectedLabs, setSelectedLabs] = useState<labs[]>([]);

  // Format lab data to split values by ';' and display each in separate rows
  const formatLabData = (labData: Lab[]) => {
    return labData.flatMap((lab) => {
      const _names = lab.name.split(";");
      const batches = lab.batches?.split(";") || [];
      const rooms = lab.rooms?.split(";") || [];
      const teachers = lab.teachers?.split(";") || [];
      
      const maxLength = Math.max(batches.length, rooms.length, teachers.length);
      
      // Create rows for each batch, teacher, and room pairing
      return Array.from({ length: maxLength }, (_, index) => ({
        key: `${lab.name}`,  // Unique key for each row
        name: index===0?lab.name.trim():"",
        batches: batches[index]?.trim() || "",
        teachers: teachers[index]?.trim() || "",
        rooms: rooms[index]?.trim() || "",
        department:lab.department
      }));
    });
  };
  const formattedLabData = React.useMemo(() => formatLabData(labData), [labData]);
  // Row Selection logic by ant design
  const rowSelection: TableProps<labs>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: labs[]) => {
      setSelectedLabs(selectedRows);
    },
  };

  // Function to delete a single lab
  function deleteSingleLab(Lab: labs) {
    console.log(Lab)
    const Labs = [Lab];
    console.log(Labs)
    const res = axios
      .delete(BACKEND_URL + "/labs", {
        data: {
          labs:Labs,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;
        console.log(res.data)
        switch (status) {
          case statusCodes.OK:
            setLabsData((labs) => {
              const newRooms = labs.filter((t) => {
                for (let i = 0; i < selectedLabs.length; i++) {
                  if (selectedLabs[i].name == t.name) return false;
                }
                return true;
              });
              return newRooms;
            });
            setSelectedLabs([]);
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
  const columns: TableColumnsType<labs> = [
    {
      title: "BatchSet",
      dataIndex: "name",
      key: "name",
      render: (text: string, _: any, index: number) => {
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
      title: "Courses",
      dataIndex: "batches",
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
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
    render: (text:any,record: any, index: number) => {
      if (text.name !== "" || index === 0) {
        let rowSpan = 1;
        for (let i = index + 1; i < formattedLabData.length; i++) {
          if (formattedLabData[i].name === "") {
            rowSpan++;
          } else {
            break;
          }
        }
        return {
          children: (
            <div className="flex space-x-2">
              <Tooltip title="Edit">
          <Button
            type="primary"
            onClick={() => handleEditClick(record.name,record.department)}
            shape="circle"
            icon={<MdEdit />}
          />
        </Tooltip>
            </div>
          ),
          props: {
            rowSpan,
          },
        };
      } else {
        return {
          children: null,
          props: {
            rowSpan: 0, // Merge this row with the previous one
          },
        };
      }
    },
  },
  {
    title: "",
    render: (text:any,record: any, index: number) => {
      if (text.name !== "" || index === 0) {
        let rowSpan = 1;
        for (let i = index + 1; i < formattedLabData.length; i++) {
          if (formattedLabData[i].name === "") {
            rowSpan++;
          } else {
            break;
          }
        }
        return {
          children: (
            <div className="flex space-x-2">
              <Tooltip title="Delete">
                <Button
                  className="bg-red-400"
                  type="primary"
                  shape="circle"
                  onClick={() => deleteSingleLab(record)}
                  icon={<MdDelete />}
                />
              </Tooltip>
            </div>
          ),
          props: {
            rowSpan,
          },
        };
      } else {
        return {
          children: null,
          props: {
            rowSpan: 0, // Merge this row with the previous one
          },
        };
      }
    },
  }
  ];

  // Function to handle deleting multiple labs
  function deleteLabsHandler(Labs: labs[]) {
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

      <Table<labs>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={formattedLabData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default LabsTable;
