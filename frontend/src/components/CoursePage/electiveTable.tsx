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

interface Ele
{
  key: string;name: string; courses: string; rooms: string; teachers: string;
}

const ElectivesTable = ({
  ElectiveData,
  setElectivesData,
}: {
  ElectiveData: Elective[];
  setElectivesData: React.Dispatch<React.SetStateAction<Elective[]>>;
}) => {
  const navigate = useNavigate();

  // const handleEditClick = (name: string, department: string) => {
  //   navigate(
  //     `/dashboard/electives/edit/${encodeURIComponent(
  //       name
  //     )}/${encodeURIComponent(department)}`
  //   );
  // };

  const [selectedElectives, setSelectedElectives] = useState<Ele[]>([]);

  const formatElectiveData = (ElectiveData: Elective[]): Ele[] => {
    return ElectiveData.map((Elective) => {
      const names = Elective.name.split(";");
      const courses = Elective.courses?.split(";") || [];
      const rooms = Elective.rooms?.split(";") || [];
      const teachers = Elective.teachers?.split(";") || [];
  
      const maxLength = Math.max(names.length, courses.length, rooms.length, teachers.length);
  
      return Array.from({ length: maxLength }, (_, index) => ({
        key: `${Elective.name}`, 
        name: index===0?Elective.name.trim():"",
        courses: courses[index]?.trim() || "",
        rooms: rooms[index]?.trim() || "",
        teachers: teachers[index]?.trim() || "",
      }));
    }).flat(); 
  };
  
  const formattedElectiveData = React.useMemo(() => formatElectiveData(ElectiveData), [ElectiveData]);
  console.log(formattedElectiveData)
  const rowSelection: TableProps<Ele>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: Ele[]) => {
      setSelectedElectives(selectedRows);
    }
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
  const columns: TableColumnsType<Ele> = [
    {
      title: "BatchSet",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: any, index: number) => {
        if (record.name === "") {
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
          console.log("f",formattedElectiveData[i])
          if (formattedElectiveData[i].name === "") {
            console.log(2)
            rowSpan++;
          } else {
            break;
          }
        }
    
        return {
          children: record.name, 
          props: {
            rowSpan, 
          },
        };
      },
    },
    {title: "Courses",
      dataIndex:"courses"
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
      render: (text:any,_: any, index: number) => {
        if (text.name !== "" || index === 0) {
          let rowSpan = 1;
          for (let i = index + 1; i < formattedElectiveData.length; i++) {
            if (formattedElectiveData[i].name === "") {
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
              //onClick={() => handleEditClick(record.name,record.department)}
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
           for (let i = index + 1; i < formattedElectiveData.length; i++) {
             if (formattedElectiveData[i].name === "") {
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
                     onClick={() => deleteSingleElective(record)}
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

  // Function to handle deleting multiple Electives
  function deleteElectivesHandler(Electives: Ele[]) {
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

      <Table<Ele>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={formattedElectiveData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ElectivesTable;
