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
  // const router= useRouter();
  const navigate = useNavigate();

  const handleEditClick = (name: string, department: string) => {
    navigate(
      `/dashboard/Labs/edit/${encodeURIComponent(
        name
      )}/${encodeURIComponent(department)}`
    );
  };

  const [selectedLabs, setSelectedLabs] = useState<Lab[]>([]);


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



const columns: TableColumnsType<Lab> = [
    {
      title: "name",
      dataIndex: "name",
      render: (value, row,index) => {
        // Calculate row span
        const rowSpan = index === 0 || labData[index - 1].name !== value
          ? labData.filter((item: { name: any; }) => item.name === value).length
          : 0;
        return {
          children: value,
          props: {
            rowSpan: rowSpan,
          },
        };
      },
    },
    {
      title: "Lab Name",
      dataIndex: "name",
    },
    {
      title: "Labs",
      dataIndex: "Labs",
      render: (_, { rooms }) => (
        <>
          {rooms?.split(',').map((tag) => {
            const color = 'blue'
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      render: (_, { rooms }) => (
        <>
          {rooms?.split(",").map((tag:any) => {
            const color = 'purple'
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ) 
    },
    {
      title: "",
      render: (record) => {
        return (
          <Tooltip title="Edit">
            <Button type="primary" 
            onClick={() => deleteSingleLab(record)}
            shape="circle" icon={<MdEdit />} />
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
              onClick={() => deleteSingleLab(record)}
              icon={<MdDelete />}
            />
          </Tooltip>
        );
      },
    },
  ];
// function handling deleting the Labs logic
function deleteLabsHandler(Labs: Lab[]) {
  if (selectedLabs.length == 0) {
    toast.info("Select Labs to delete !!");
    return;
  }
  const res = axios
    .delete(BACKEND_URL + "/Labs", {
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
        </ConfigProvider>
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
        dataSource={labData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default LabsTable;
